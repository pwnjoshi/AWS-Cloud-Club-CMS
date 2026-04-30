import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { paginate } from '../utils/helpers.js';

const router = Router();

// GET /api/announcements — list announcements
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { skip, take, page, limit } = paginate(req.query);

    const [announcements, total] = await Promise.all([
      prisma.announcement.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        include: { createdBy: { select: { name: true } } }
      }),
      prisma.announcement.count()
    ]);

    res.json({ announcements, total, page, limit });
  } catch (err) {
    next(err);
  }
});

// POST /api/announcements — admin creates announcement
router.post('/', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { title, body, priority } = req.body;

    if (!title || !body) {
      return res.status(400).json({ error: 'Title and body are required' });
    }

    const announcement = await prisma.announcement.create({
      data: { title, body, priority: priority || 'NORMAL', createdById: req.user.id }
    });

    res.status(201).json({ announcement });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/announcements/:id — admin deletes
router.delete('/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    await prisma.announcement.delete({ where: { id: req.params.id } });
    res.json({ message: 'Announcement deleted' });
  } catch (err) {
    next(err);
  }
});

export default router;
