import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { logAudit } from '../utils/audit.js';

const router = Router();

// GET /api/rewards — list available rewards
router.get('/', authenticate, async (req, res, next) => {
  try {
    const rewards = await prisma.reward.findMany({
      where: { isActive: true },
      orderBy: { pointsCost: 'asc' }
    });
    res.json({ rewards });
  } catch (err) {
    next(err);
  }
});

// POST /api/rewards/redeem — student redeems a reward
router.post('/redeem', authenticate, async (req, res, next) => {
  try {
    const { rewardId } = req.body;

    const reward = await prisma.reward.findUnique({ where: { id: rewardId } });
    if (!reward || !reward.isActive) {
      return res.status(404).json({ error: 'Reward not found' });
    }

    // Check stock
    if (reward.stock !== -1 && reward.stock <= 0) {
      return res.status(400).json({ error: 'Reward out of stock' });
    }

    // Check user balance
    const balance = await prisma.pointTransaction.aggregate({
      where: { userId: req.user.id },
      _sum: { points: true }
    });
    const currentBalance = balance._sum.points || 0;

    if (currentBalance < reward.pointsCost) {
      return res.status(400).json({ error: 'Insufficient points', required: reward.pointsCost, current: currentBalance });
    }

    // Create redemption and debit points atomically
    const [redemption] = await prisma.$transaction([
      prisma.redemption.create({
        data: { userId: req.user.id, rewardId, pointsSpent: reward.pointsCost }
      }),
      prisma.pointTransaction.create({
        data: {
          userId: req.user.id,
          type: 'REVOKE',
          points: -reward.pointsCost,
          sourceId: rewardId,
          sourceType: 'REDEMPTION',
          reason: `Redeemed: ${reward.title}`
        }
      }),
      // Decrement stock if not unlimited
      ...(reward.stock !== -1 ? [
        prisma.reward.update({ where: { id: rewardId }, data: { stock: { decrement: 1 } } })
      ] : [])
    ]);

    res.status(201).json({ redemption, message: 'Reward redeemed successfully' });
  } catch (err) {
    next(err);
  }
});

// GET /api/rewards/my — student's redemption history
router.get('/my', authenticate, async (req, res, next) => {
  try {
    const redemptions = await prisma.redemption.findMany({
      where: { userId: req.user.id },
      include: { reward: { select: { title: true, image: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ redemptions });
  } catch (err) {
    next(err);
  }
});

// ─── Admin Routes ────────────────────────────────────────

// GET /api/rewards/all — admin sees ALL rewards including disabled
router.get('/all', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const rewards = await prisma.reward.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ rewards });
  } catch (err) { next(err); }
});

// POST /api/rewards — admin creates a reward
router.post('/', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { title, description, pointsCost, stock, image } = req.body;

    if (!title || !pointsCost) {
      return res.status(400).json({ error: 'Title and points cost are required' });
    }

    const reward = await prisma.reward.create({
      data: { title, description, pointsCost, stock: stock ?? -1, image }
    });

    res.status(201).json({ reward });
  } catch (err) {
    next(err);
  }
});

// PUT /api/rewards/:id — admin updates
router.put('/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { title, description, pointsCost, stock, image, isActive } = req.body;
    const data = {};
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (pointsCost !== undefined) data.pointsCost = pointsCost;
    if (stock !== undefined) data.stock = stock;
    if (image !== undefined) data.image = image;
    if (isActive !== undefined) data.isActive = isActive;

    const reward = await prisma.reward.update({ where: { id: req.params.id }, data });
    res.json({ reward });
  } catch (err) {
    next(err);
  }
});

// GET /api/rewards/redemptions — admin views all redemptions
router.get('/redemptions/all', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const redemptions = await prisma.redemption.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        reward: { select: { title: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ redemptions });
  } catch (err) {
    next(err);
  }
});

// PUT /api/rewards/redemptions/:id — admin updates redemption status
router.put('/redemptions/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['PENDING', 'FULFILLED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const redemption = await prisma.redemption.update({
      where: { id: req.params.id },
      data: { status }
    });

    // If rejected, refund points
    if (status === 'REJECTED') {
      await prisma.pointTransaction.create({
        data: {
          userId: redemption.userId,
          type: 'MANUAL',
          points: redemption.pointsSpent,
          sourceId: redemption.id,
          sourceType: 'REDEMPTION',
          verifiedById: req.user.id,
          reason: 'Redemption rejected — points refunded'
        }
      });
    }

    await logAudit(req.user.id, 'REDEMPTION_UPDATE', { targetType: 'REDEMPTION', targetId: redemption.id, details: { status } });

    res.json({ redemption });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/rewards/:id — admin permanently deletes a reward
router.delete('/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    // Check if reward has any redemptions
    const redemptions = await prisma.redemption.count({ where: { rewardId: req.params.id } });
    if (redemptions > 0) {
      // Soft delete — just disable it
      await prisma.reward.update({ where: { id: req.params.id }, data: { isActive: false } });
      return res.json({ message: 'Reward has redemptions — disabled instead of deleted' });
    }
    await prisma.reward.delete({ where: { id: req.params.id } });
    await logAudit(req.user.id, 'REWARD_DELETE', { targetType: 'REWARD', targetId: req.params.id });
    res.json({ message: 'Reward deleted' });
  } catch (err) { next(err); }
});

export default router;
