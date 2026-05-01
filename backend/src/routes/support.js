import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { logAudit } from '../utils/audit.js';
import { paginate } from '../utils/helpers.js';

const router = Router();

// GET /api/support/my — student's own tickets
router.get('/my', authenticate, async (req, res, next) => {
  try {
    const tickets = await prisma.supportTicket.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ tickets });
  } catch (err) { next(err); }
});

// POST /api/support — student creates a ticket
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { subject, message, category } = req.body;
    if (!subject || !message) return res.status(400).json({ error: 'Subject and message are required' });

    const ticket = await prisma.supportTicket.create({
      data: { userId: req.user.id, subject, message, category: category || 'general' }
    });
    res.status(201).json({ ticket });
  } catch (err) { next(err); }
});

// GET /api/support/all — admin views all tickets
router.get('/all', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { skip, take, page, limit } = paginate(req.query);
    const where = {};
    if (req.query.status) where.status = req.query.status;

    const [tickets, total] = await Promise.all([
      prisma.supportTicket.findMany({
        where, orderBy: { createdAt: 'desc' }, skip, take,
        include: { user: { select: { id: true, name: true, email: true } } }
      }),
      prisma.supportTicket.count({ where })
    ]);
    res.json({ tickets, total, page, limit });
  } catch (err) { next(err); }
});

// PUT /api/support/:id/reply — admin replies to a ticket
router.put('/:id/reply', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { adminReply, status } = req.body;
    if (!adminReply) return res.status(400).json({ error: 'Reply is required' });

    const ticket = await prisma.supportTicket.update({
      where: { id: req.params.id },
      data: { adminReply, status: status || 'RESOLVED', repliedById: req.user.id, repliedAt: new Date() }
    });
    await logAudit(req.user.id, 'TICKET_REPLY', { targetType: 'TICKET', targetId: ticket.id });
    res.json({ ticket });
  } catch (err) { next(err); }
});

export default router;
