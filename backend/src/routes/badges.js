import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { logAudit } from '../utils/audit.js';
import { checkAndAwardBadges } from '../utils/badges.js';

const router = Router();

// GET /api/badges — list all badges
router.get('/', authenticate, async (req, res, next) => {
  try {
    const badges = await prisma.badge.findMany({ orderBy: [{ category: 'asc' }, { createdAt: 'asc' }] });
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

// POST /api/badges/award — admin manually awards a badge to a user
router.post('/award', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { userId, badgeId } = req.body;
    if (!userId || !badgeId) return res.status(400).json({ error: 'userId and badgeId required' });

    const badge = await prisma.badge.findUnique({ where: { id: badgeId } });
    if (!badge) return res.status(404).json({ error: 'Badge not found' });

    const existing = await prisma.userBadge.findUnique({ where: { userId_badgeId: { userId, badgeId } } });
    if (existing) return res.status(409).json({ error: 'User already has this badge' });

    await prisma.userBadge.create({ data: { userId, badgeId } });

    if (badge.pointsReward > 0) {
      await prisma.pointTransaction.create({
        data: { userId, type: 'MANUAL', points: badge.pointsReward, sourceId: badge.id, sourceType: 'BADGE', verifiedById: req.user.id, reason: `Badge awarded: ${badge.name}` }
      });
    }

    await logAudit(req.user.id, 'BADGE_AWARD', { targetType: 'USER', targetId: userId, details: { badge: badge.name } });
    res.status(201).json({ message: `Badge "${badge.name}" awarded` });
  } catch (err) { next(err); }
});

// POST /api/badges — admin creates a custom badge
router.post('/', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { slug, name, description, icon, image, category, criteria, pointsReward } = req.body;
    if (!name) return res.status(400).json({ error: 'Badge name is required' });

    const badgeSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const existing = await prisma.badge.findUnique({ where: { slug: badgeSlug } });
    if (existing) return res.status(409).json({ error: 'Badge with this slug already exists' });

    const badge = await prisma.badge.create({
      data: {
        slug: badgeSlug,
        name,
        description: description || '',
        icon: icon || '🏅',
        image: image || null,
        category: category || 'ACHIEVEMENT',
        criteria: criteria || JSON.stringify({ type: 'manual' }),
        pointsReward: pointsReward || 0,
      }
    });

    await logAudit(req.user.id, 'BADGE_CREATE', { targetType: 'BADGE', targetId: badge.id, details: { name } });
    res.status(201).json({ badge });
  } catch (err) { next(err); }
});

// PUT /api/badges/:id — admin updates a badge
router.put('/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { name, description, icon, image, category, criteria, pointsReward } = req.body;
    const data = {};
    if (name !== undefined) data.name = name;
    if (description !== undefined) data.description = description;
    if (icon !== undefined) data.icon = icon;
    if (image !== undefined) data.image = image;
    if (category !== undefined) data.category = category;
    if (criteria !== undefined) data.criteria = typeof criteria === 'string' ? criteria : JSON.stringify(criteria);
    if (pointsReward !== undefined) data.pointsReward = pointsReward;

    const badge = await prisma.badge.update({ where: { id: req.params.id }, data });
    res.json({ badge });
  } catch (err) { next(err); }
});

// DELETE /api/badges/:id — admin deletes a badge
router.delete('/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    await prisma.userBadge.deleteMany({ where: { badgeId: req.params.id } });
    await prisma.badge.delete({ where: { id: req.params.id } });
    await logAudit(req.user.id, 'BADGE_DELETE', { targetType: 'BADGE', targetId: req.params.id });
    res.json({ message: 'Badge deleted' });
  } catch (err) { next(err); }
});

export default router;
