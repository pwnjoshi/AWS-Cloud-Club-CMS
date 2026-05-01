import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { logAudit } from '../utils/audit.js';
import { checkAndAwardBadges } from '../utils/badges.js';

const router = Router();

const BLOG_POINTS = 50;

// GET /api/blogs — list approved blogs (public feed)
router.get('/', authenticate, async (req, res, next) => {
  try {
    const blogs = await prisma.blogSubmission.findMany({
      where: { status: 'APPROVED' },
      include: { user: { select: { id: true, name: true, avatar: true } } },
      orderBy: { reviewedAt: 'desc' },
      take: 50
    });
    res.json({ blogs });
  } catch (err) { next(err); }
});

// GET /api/blogs/my — user's own submissions
router.get('/my', authenticate, async (req, res, next) => {
  try {
    const blogs = await prisma.blogSubmission.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ blogs });
  } catch (err) { next(err); }
});

// POST /api/blogs — submit a blog for review
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { title, url, platform } = req.body;
    if (!title || !url) return res.status(400).json({ error: 'Title and URL are required' });

    // Prevent duplicate URL submissions
    const existing = await prisma.blogSubmission.findFirst({ where: { url, userId: req.user.id } });
    if (existing) return res.status(409).json({ error: 'You already submitted this URL' });

    const blog = await prisma.blogSubmission.create({
      data: { userId: req.user.id, title, url, platform: platform || 'other' }
    });

    res.status(201).json({ blog, message: 'Blog submitted for review' });
  } catch (err) { next(err); }
});

// GET /api/blogs/pending — admin: list pending submissions
router.get('/pending', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const blogs = await prisma.blogSubmission.findMany({
      where: { status: 'PENDING' },
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'asc' }
    });
    res.json({ blogs });
  } catch (err) { next(err); }
});

// PUT /api/blogs/:id/review — admin approves or rejects
router.put('/:id/review', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { status, reviewNote, pointsAwarded } = req.body;
    if (!['APPROVED', 'REJECTED'].includes(status)) return res.status(400).json({ error: 'Status must be APPROVED or REJECTED' });

    const blog = await prisma.blogSubmission.findUnique({ where: { id: req.params.id } });
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    if (blog.status !== 'PENDING') return res.status(400).json({ error: 'Blog already reviewed' });

    const points = status === 'APPROVED' ? (pointsAwarded || BLOG_POINTS) : 0;

    const updated = await prisma.blogSubmission.update({
      where: { id: req.params.id },
      data: { status, reviewedById: req.user.id, reviewNote, pointsAwarded: points, reviewedAt: new Date() }
    });

    if (status === 'APPROVED' && points > 0) {
      await prisma.pointTransaction.create({
        data: { userId: blog.userId, type: 'MANUAL', points, sourceId: blog.id, sourceType: 'BLOG', verifiedById: req.user.id, reason: `Blog approved: ${blog.title}` }
      });
    }

    // Check badges after approval
    if (status === 'APPROVED') {
      await checkAndAwardBadges(blog.userId);
    }

    await logAudit(req.user.id, 'BLOG_REVIEW', { targetType: 'BLOG', targetId: blog.id, details: { status, points } });

    res.json({ blog: updated });
  } catch (err) { next(err); }
});

export default router;
