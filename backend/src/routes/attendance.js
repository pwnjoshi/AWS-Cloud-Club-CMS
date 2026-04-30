import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { generateOTP } from '../utils/helpers.js';
import { logAudit } from '../utils/audit.js';

const router = Router();

// POST /api/attendance/checkin — student checks in with OTP
router.post('/checkin', authenticate, async (req, res, next) => {
  try {
    const { eventId, code } = req.body;

    if (!eventId || !code) {
      return res.status(400).json({ error: 'Event ID and OTP code are required' });
    }

    // Verify OTP exists, is for this event, and hasn't expired
    const otp = await prisma.eventOTP.findFirst({
      where: {
        eventId,
        code: code.toString(),
        expiresAt: { gte: new Date() }
      }
    });

    if (!otp) {
      return res.status(400).json({ error: 'Invalid or expired check-in code' });
    }

    // Check if already attended
    const existing = await prisma.attendance.findUnique({
      where: { userId_eventId: { userId: req.user.id, eventId } }
    });

    if (existing) {
      return res.status(409).json({ error: 'Already checked in for this event' });
    }

    // Mark attendance
    const attendance = await prisma.attendance.create({
      data: { userId: req.user.id, eventId, method: 'OTP' }
    });

    // Award points
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (event) {
      await prisma.pointTransaction.create({
        data: {
          userId: req.user.id,
          type: 'ATTENDANCE',
          points: event.pointsReward,
          sourceId: eventId,
          sourceType: 'EVENT',
          reason: `Attended: ${event.title}`
        }
      });

      // Check if this is user's first attendance — credit referral if applicable
      const user = await prisma.user.findUnique({ where: { id: req.user.id } });
      if (user?.referredById) {
        const attendanceCount = await prisma.attendance.count({ where: { userId: req.user.id } });
        if (attendanceCount === 1) {
          // First event — credit the referrer
          const referral = await prisma.referral.findFirst({
            where: { referrerId: user.referredById, referredUserId: req.user.id, status: 'PENDING' }
          });
          if (referral) {
            await prisma.referral.update({ where: { id: referral.id }, data: { status: 'CREDITED', creditedAt: new Date() } });
            await prisma.pointTransaction.create({
              data: {
                userId: user.referredById,
                type: 'REFERRAL',
                points: 30,
                sourceId: referral.id,
                sourceType: 'REFERRAL',
                reason: `Referral: ${user.name} attended first event`
              }
            });
          }
        }
      }
    }

    res.status(201).json({ attendance, message: 'Checked in successfully' });
  } catch (err) {
    next(err);
  }
});

// POST /api/attendance/manual — admin marks attendance manually
router.post('/manual', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { userId, eventId } = req.body;

    if (!userId || !eventId) {
      return res.status(400).json({ error: 'User ID and Event ID are required' });
    }

    const existing = await prisma.attendance.findUnique({
      where: { userId_eventId: { userId, eventId } }
    });
    if (existing) {
      return res.status(409).json({ error: 'User already marked for this event' });
    }

    const attendance = await prisma.attendance.create({
      data: { userId, eventId, method: 'MANUAL', markedById: req.user.id }
    });

    // Award points
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (event) {
      await prisma.pointTransaction.create({
        data: {
          userId,
          type: 'ATTENDANCE',
          points: event.pointsReward,
          sourceId: eventId,
          sourceType: 'EVENT',
          verifiedById: req.user.id,
          reason: `Attended: ${event.title} (manual)`
        }
      });
    }

    await logAudit(req.user.id, 'ATTENDANCE_MANUAL', { targetType: 'USER', targetId: userId, details: { eventId } });

    res.status(201).json({ attendance });
  } catch (err) {
    next(err);
  }
});

// POST /api/attendance/otp — admin generates OTP for an event
router.post('/otp', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { eventId, expiresInMinutes } = req.body;

    if (!eventId) {
      return res.status(400).json({ error: 'Event ID is required' });
    }

    const code = generateOTP();
    const expiresAt = new Date(Date.now() + (expiresInMinutes || 10) * 60 * 1000);

    const otp = await prisma.eventOTP.create({
      data: { eventId, code, expiresAt, createdById: req.user.id }
    });

    res.status(201).json({ otp: { code: otp.code, expiresAt: otp.expiresAt } });
  } catch (err) {
    next(err);
  }
});

// GET /api/attendance/my — student's own attendance history
router.get('/my', authenticate, async (req, res, next) => {
  try {
    const attendances = await prisma.attendance.findMany({
      where: { userId: req.user.id },
      include: { event: { select: { id: true, title: true, date: true, location: true, image: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ attendances });
  } catch (err) {
    next(err);
  }
});

// GET /api/attendance/event/:eventId — admin: list attendees for an event
router.get('/event/:eventId', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const attendances = await prisma.attendance.findMany({
      where: { eventId: req.params.eventId },
      include: { user: { select: { id: true, name: true, email: true, avatar: true } } },
      orderBy: { createdAt: 'asc' }
    });
    res.json({ attendances });
  } catch (err) {
    next(err);
  }
});

export default router;
