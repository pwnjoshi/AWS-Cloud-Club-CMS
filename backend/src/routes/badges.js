import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { logAudit } from '../utils/audit.js';

const router = Router();

// GET /api/badges — list all badges
router.get('/', authenticate, async (req, res, next) => {
  try {
    const badges = await prisma.badge.findMany({ orderBy: { category: 'asc' } });
    res.json({ badges });
  } catch (err) { next(err); }
});

// GET /api/badges/my — user's earned badges
router.get('/my', authenticate, async (req, res, next) => {
  try {
    const userBadges = await prisma.userBadge.findMany({
      where: { userId: req.user.id },
      include: { badge: true },
      orderBy: { earnedAt: 'desc' }
    });
    res.json({ badges: userBadges });
  } catch (err) { next(err); }
});

// GET /api/badges/user/:userId — admin views user's badges
router.get('/user/:userId', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const userBadges = await prisma.userBadge.findMany({
      where: { userId: req.params.userId },
      include: { badge: true },
      orderBy: { earnedAt: 'desc' }
    });
    res.json({ badges: userBadges });
  } catch (err) { next(err); }
});

// POST /api/badges/award — admin manually awards a badge
router.post('/award', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { userId, badgeSlug } = req.body;
    if (!userId || !badgeSlug) return res.status(400).json({ error: 'userId and badgeSlug required' });

    const badge = await prisma.badge.findUnique({ where: { slug: badgeSlug } });
    if (!badge) return res.status(404).json({ error: 'Badge not found' });

    const existing = await prisma.userBadge.findUnique({ where: { userId_badgeId: { userId, badgeId: badge.id } } });
    if (existing) return res.status(409).json({ error: 'User already has this badge' });

    await prisma.userBadge.create({ data: { userId, badgeId: badge.id } });

    if (badge.pointsReward > 0) {
      await prisma.pointTransaction.create({
        data: { userId, type: 'MANUAL', points: badge.pointsReward, sourceId: badge.id, sourceType: 'BADGE', verifiedById: req.user.id, reason: `Badge awarded: ${badge.name}` }
      });
    }

    await logAudit(req.user.id, 'BADGE_AWARD', { targetType: 'USER', targetId: userId, details: { badge: badge.name } });
    res.status(201).json({ message: `Badge "${badge.name}" awarded` });
  } catch (err) { next(err); }
});

export default router;
