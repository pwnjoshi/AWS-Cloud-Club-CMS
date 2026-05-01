import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { logAudit } from '../utils/audit.js';

const router = Router();

// GET /api/suggestions/my — student's own suggestions
router.get('/my', authenticate, async (req, res, next) => {
  try {
    const suggestions = await prisma.eventSuggestion.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ suggestions });
  } catch (err) { next(err); }
});

// POST /api/suggestions — student submits a suggestion
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) return res.status(400).json({ error: 'Title and description are required' });

    const suggestion = await prisma.eventSuggestion.create({
      data: { userId: req.user.id, title, description }
    });
    res.status(201).json({ suggestion });
  } catch (err) { next(err); }
});

// GET /api/suggestions/pending — admin views pending suggestions
router.get('/pending', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const suggestions = await prisma.eventSuggestion.findMany({
      where: { status: 'PENDING' },
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'asc' }
    });
    res.json({ suggestions });
  } catch (err) { next(err); }
});

// PUT /api/suggestions/:id/review — admin approves/rejects
router.put('/:id/review', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { status, adminNote, pointsAwarded } = req.body;
    if (!['APPROVED', 'REJECTED'].includes(status)) return res.status(400).json({ error: 'Status must be APPROVED or REJECTED' });

    const suggestion = await prisma.eventSuggestion.findUnique({ where: { id: req.params.id } });
    if (!suggestion) return res.status(404).json({ error: 'Suggestion not found' });

    const points = status === 'APPROVED' ? (pointsAwarded || 25) : 0;

    const updated = await prisma.eventSuggestion.update({
      where: { id: req.params.id },
      data: { status, adminNote, pointsAwarded: points, reviewedById: req.user.id, reviewedAt: new Date() }
    });

    if (status === 'APPROVED' && points > 0) {
      await prisma.pointTransaction.create({
        data: { userId: suggestion.userId, type: 'MANUAL', points, sourceId: suggestion.id, sourceType: 'SUGGESTION', verifiedById: req.user.id, reason: `Event suggestion approved: ${suggestion.title}` }
      });
    }

    await logAudit(req.user.id, 'SUGGESTION_REVIEW', { targetType: 'SUGGESTION', targetId: suggestion.id, details: { status, points } });
    res.json({ suggestion: updated });
  } catch (err) { next(err); }
});

export default router;
