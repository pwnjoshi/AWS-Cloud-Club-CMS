import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { paginate } from '../utils/helpers.js';
import { logAudit } from '../utils/audit.js';

const router = Router();

// GET /api/events — list events (public for members)
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { skip, take, page, limit } = paginate(req.query);
    const where = { isActive: true };

    if (req.query.upcoming === 'true') {
      where.date = { gte: new Date() };
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        orderBy: { date: 'desc' },
        skip,
        take,
        include: { _count: { select: { attendances: true } } }
      }),
      prisma.event.count({ where })
    ]);

    res.json({ events, total, page, limit });
  } catch (err) {
    next(err);
  }
});

// GET /api/events/:id
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
      include: {
        _count: { select: { attendances: true } },
        createdBy: { select: { id: true, name: true } }
      }
    });
    if (!event) return res.status(404).json({ error: 'Event not found' });

    // Check if current user attended
    const attendance = await prisma.attendance.findUnique({
      where: { userId_eventId: { userId: req.user.id, eventId: event.id } }
    });

    res.json({ event, attended: !!attendance });
  } catch (err) {
    next(err);
  }
});

// POST /api/events — create event (admin)
router.post('/', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { title, description, date, endDate, location, image, registrationLink, maxAttendees, pointsReward } = req.body;

    if (!title || !date || !location) {
      return res.status(400).json({ error: 'Title, date, and location are required' });
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        endDate: endDate ? new Date(endDate) : null,
        location,
        image,
        registrationLink,
        maxAttendees: maxAttendees || null,
        pointsReward: pointsReward || 50,
        createdById: req.user.id
      }
    });

    await logAudit(req.user.id, 'EVENT_CREATE', { targetType: 'EVENT', targetId: event.id, details: { title } });

    res.status(201).json({ event });
  } catch (err) {
    next(err);
  }
});

// PUT /api/events/:id — update event (admin)
router.put('/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { title, description, date, endDate, location, image, registrationLink, maxAttendees, pointsReward, isActive } = req.body;
    const data = {};

    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (date !== undefined) data.date = new Date(date);
    if (endDate !== undefined) data.endDate = endDate ? new Date(endDate) : null;
    if (location !== undefined) data.location = location;
    if (image !== undefined) data.image = image;
    if (registrationLink !== undefined) data.registrationLink = registrationLink;
    if (maxAttendees !== undefined) data.maxAttendees = maxAttendees;
    if (pointsReward !== undefined) data.pointsReward = pointsReward;
    if (isActive !== undefined) data.isActive = isActive;

    const event = await prisma.event.update({ where: { id: req.params.id }, data });

    await logAudit(req.user.id, 'EVENT_UPDATE', { targetType: 'EVENT', targetId: event.id });

    res.json({ event });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/events/:id — soft delete (admin)
router.delete('/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    await prisma.event.update({ where: { id: req.params.id }, data: { isActive: false } });
    await logAudit(req.user.id, 'EVENT_DELETE', { targetType: 'EVENT', targetId: req.params.id });
    res.json({ message: 'Event deactivated' });
  } catch (err) {
    next(err);
  }
});

export default router;
