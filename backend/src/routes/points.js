import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { logAudit } from '../utils/audit.js';

const router = Router();

// GET /api/points/my — student's own points balance + history
router.get('/my', authenticate, async (req, res, next) => {
  try {
    const [transactions, aggregate] = await Promise.all([
      prisma.pointTransaction.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: 'desc' },
        take: 50
      }),
      prisma.pointTransaction.aggregate({
        where: { userId: req.user.id },
        _sum: { points: true }
      })
    ]);

    res.json({
      balance: aggregate._sum.points || 0,
      transactions
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/points/user/:userId — admin views a user's points
router.get('/user/:userId', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const [transactions, aggregate] = await Promise.all([
      prisma.pointTransaction.findMany({
        where: { userId: req.params.userId },
        orderBy: { createdAt: 'desc' },
        include: { verifiedBy: { select: { name: true } } }
      }),
      prisma.pointTransaction.aggregate({
        where: { userId: req.params.userId },
        _sum: { points: true }
      })
    ]);

    res.json({
      userId: req.params.userId,
      balance: aggregate._sum.points || 0,
      transactions
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/points/adjust — admin manually adjusts points
router.post('/adjust', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { userId, points, reason, type } = req.body;

    if (!userId || points === undefined || !reason) {
      return res.status(400).json({ error: 'User ID, points, and reason are required' });
    }

    const transaction = await prisma.pointTransaction.create({
      data: {
        userId,
        type: type || (points > 0 ? 'MANUAL' : 'REVOKE'),
        points: parseInt(points),
        verifiedById: req.user.id,
        reason
      }
    });

    await logAudit(req.user.id, 'POINTS_ADJUST', {
      targetType: 'USER',
      targetId: userId,
      details: { points, reason }
    });

    res.status(201).json({ transaction });
  } catch (err) {
    next(err);
  }
});

export default router;
