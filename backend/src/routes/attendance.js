import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { generateOTP } from '../utils/helpers.js';
import { logAudit } from '../utils/audit.js';
import { creditReferralIfEligible } from '../utils/referral.js';
import { checkAndAwardBadges } from '../utils/badges.js';
import { isEventActive } from '../utils/eventGuard.js';
import QRCode from 'qrcode';

const router = Router();

// ─── Haversine distance (meters) ─────────────────────────
function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371000; // Earth radius in meters
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─── Rotate code if expired ──────────────────────────────
async function getActiveCode(session) {
  if (new Date() < new Date(session.codeExpiresAt)) {
    return session;
  }
  // Code expired — rotate
  const newCode = generateOTP();
  const newExpiry = new Date(Date.now() + session.rotationSeconds * 1000);
  return prisma.checkinSession.update({
    where: { id: session.id },
    data: { currentCode: newCode, codeExpiresAt: newExpiry }
  });
}

// ═══════════════════════════════════════════════════════════
// ADMIN: Start a check-in session for an event
// ═══════════════════════════════════════════════════════════
router.post('/session/start', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { eventId, rotationSeconds, geoRequired, venueLat, venueLng, geoRadiusMeters } = req.body;

    if (!eventId) return res.status(400).json({ error: 'Event ID is required' });

    if (geoRequired && (venueLat == null || venueLng == null)) {
      return res.status(400).json({ error: 'Venue coordinates are required when geo is enabled' });
    }

    const rotation = Math.max(10, Math.min(300, rotationSeconds || 30));
    const code = generateOTP();
    const codeExpiresAt = new Date(Date.now() + rotation * 1000);

    const session = await prisma.checkinSession.upsert({
      where: { eventId },
      update: {
        isActive: true,
        rotationSeconds: rotation,
        geoRequired: geoRequired || false,
        venueLat: venueLat ?? null,
        venueLng: venueLng ?? null,
        geoRadiusMeters: geoRadiusMeters || 200,
        currentCode: code,
        codeExpiresAt,
      },
      create: {
        eventId,
        isActive: true,
        rotationSeconds: rotation,
        geoRequired: geoRequired || false,
        venueLat: venueLat ?? null,
        venueLng: venueLng ?? null,
        geoRadiusMeters: geoRadiusMeters || 200,
        currentCode: code,
        codeExpiresAt,
        createdById: req.user.id,
      }
    });

    await logAudit(req.user.id, 'CHECKIN_SESSION_START', {
      targetType: 'EVENT', targetId: eventId,
      details: { rotationSeconds: rotation, geoRequired: session.geoRequired }
    });

    res.json({
      session: {
        id: session.id,
        eventId: session.eventId,
        isActive: session.isActive,
        rotationSeconds: session.rotationSeconds,
        geoRequired: session.geoRequired,
        geoRadiusMeters: session.geoRadiusMeters,
        currentCode: session.currentCode,
        codeExpiresAt: session.codeExpiresAt,
      }
    });
  } catch (err) {
    next(err);
  }
});

// ═══════════════════════════════════════════════════════════
// ADMIN: Stop a check-in session
// ═══════════════════════════════════════════════════════════
router.post('/session/stop', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { eventId } = req.body;
    await prisma.checkinSession.update({
      where: { eventId },
      data: { isActive: false }
    });
    await logAudit(req.user.id, 'CHECKIN_SESSION_STOP', { targetType: 'EVENT', targetId: eventId });
    res.json({ message: 'Check-in session stopped' });
  } catch (err) {
    next(err);
  }
});

// ═══════════════════════════════════════════════════════════
// ADMIN: Get current code (auto-rotates if expired)
// ═══════════════════════════════════════════════════════════
router.get('/session/:eventId/code', authenticate, requireAdmin, async (req, res, next) => {
  try {
    let session = await prisma.checkinSession.findUnique({ where: { eventId: req.params.eventId } });
    if (!session || !session.isActive) {
      return res.status(404).json({ error: 'No active check-in session' });
    }

    session = await getActiveCode(session);

    // Generate QR code containing the check-in payload
    const qrPayload = JSON.stringify({ eventId: req.params.eventId, code: session.currentCode });
    const qrDataUrl = await QRCode.toDataURL(qrPayload, { width: 300, margin: 2, color: { dark: '#FFFFFF', light: '#00000000' } });

    res.json({
      code: session.currentCode,
      expiresAt: session.codeExpiresAt,
      rotationSeconds: session.rotationSeconds,
      geoRequired: session.geoRequired,
      isActive: session.isActive,
      qrCode: qrDataUrl,
    });
  } catch (err) {
    next(err);
  }
});

// ═══════════════════════════════════════════════════════════
// ADMIN: Get session config
// ═══════════════════════════════════════════════════════════
router.get('/session/:eventId', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const session = await prisma.checkinSession.findUnique({ where: { eventId: req.params.eventId } });
    res.json({ session: session || null });
  } catch (err) {
    next(err);
  }
});

// ═══════════════════════════════════════════════════════════
// STUDENT: Check-in with rotating OTP (+ optional geo)
// ═══════════════════════════════════════════════════════════
router.post('/checkin', authenticate, async (req, res, next) => {
  try {
    const { eventId, code, latitude, longitude } = req.body;

    if (!eventId || !code) {
      return res.status(400).json({ error: 'Event ID and code are required' });
    }

    // Block check-in for past events
    const active = await isEventActive(eventId);
    if (!active) {
      return res.status(400).json({ error: 'This event has ended. Check-in is no longer available.' });
    }

    // Find active check-in session
    let session = await prisma.checkinSession.findUnique({ where: { eventId } });

    if (session && session.isActive) {
      // ── Rotating OTP flow ──
      session = await getActiveCode(session);

      if (code.toString() !== session.currentCode) {
        return res.status(400).json({ error: 'Invalid or expired code. The code rotates — try the latest one.' });
      }

      // Geo check
      if (session.geoRequired) {
        if (latitude == null || longitude == null) {
          return res.status(400).json({ error: 'Location is required for this event. Please enable location access.' });
        }
        const distance = haversineDistance(session.venueLat, session.venueLng, latitude, longitude);
        if (distance > session.geoRadiusMeters) {
          return res.status(403).json({
            error: `You appear to be ${Math.round(distance)}m from the venue. You must be within ${session.geoRadiusMeters}m to check in.`,
            distance: Math.round(distance),
            maxRadius: session.geoRadiusMeters
          });
        }
      }
    } else {
      // ── Legacy OTP flow (fallback for old-style single OTPs) ──
      const otp = await prisma.eventOTP.findFirst({
        where: { eventId, code: code.toString(), expiresAt: { gte: new Date() } }
      });
      if (!otp) {
        return res.status(400).json({ error: 'Invalid or expired check-in code' });
      }
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
      data: { userId: req.user.id, eventId, method: session?.geoRequired ? 'OTP+GEO' : 'OTP' }
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
      await creditReferralIfEligible(req.user.id);
      await checkAndAwardBadges(req.user.id);
    }

    res.status(201).json({ attendance, message: 'Checked in successfully' });
  } catch (err) {
    next(err);
  }
});

// ═══════════════════════════════════════════════════════════
// STUDENT: Check if event has active check-in + geo requirement
// ═══════════════════════════════════════════════════════════
router.get('/checkin-status/:eventId', authenticate, async (req, res, next) => {
  try {
    const session = await prisma.checkinSession.findUnique({ where: { eventId: req.params.eventId } });
    const attended = await prisma.attendance.findUnique({
      where: { userId_eventId: { userId: req.user.id, eventId: req.params.eventId } }
    });
    const eventActive = await isEventActive(req.params.eventId);

    res.json({
      checkinActive: session?.isActive || false,
      geoRequired: session?.geoRequired || false,
      geoRadiusMeters: session?.geoRadiusMeters || 200,
      attended: !!attended,
      eventActive,
    });
  } catch (err) {
    next(err);
  }
});

// ═══════════════════════════════════════════════════════════
// ADMIN: Manual attendance (unchanged)
// ═══════════════════════════════════════════════════════════
router.post('/manual', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { userId, eventId } = req.body;
    if (!userId || !eventId) return res.status(400).json({ error: 'User ID and Event ID are required' });

    const existing = await prisma.attendance.findUnique({ where: { userId_eventId: { userId, eventId } } });
    if (existing) return res.status(409).json({ error: 'User already marked for this event' });

    const attendance = await prisma.attendance.create({
      data: { userId, eventId, method: 'MANUAL', markedById: req.user.id }
    });

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (event) {
      await prisma.pointTransaction.create({
        data: {
          userId, type: 'ATTENDANCE', points: event.pointsReward,
          sourceId: eventId, sourceType: 'EVENT', verifiedById: req.user.id,
          reason: `Attended: ${event.title} (manual)`
        }
      });
    }

    await logAudit(req.user.id, 'ATTENDANCE_MANUAL', { targetType: 'USER', targetId: userId, details: { eventId } });
    await creditReferralIfEligible(userId);

    res.status(201).json({ attendance });
  } catch (err) {
    next(err);
  }
});

// ═══════════════════════════════════════════════════════════
// Legacy: Admin generates single OTP (kept for backward compat)
// ═══════════════════════════════════════════════════════════
router.post('/otp', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { eventId, expiresInMinutes } = req.body;
    if (!eventId) return res.status(400).json({ error: 'Event ID is required' });

    const code = generateOTP();
    const expiresAt = new Date(Date.now() + (expiresInMinutes || 10) * 60 * 1000);
    const otp = await prisma.eventOTP.create({ data: { eventId, code, expiresAt, createdById: req.user.id } });

    res.status(201).json({ otp: { code: otp.code, expiresAt: otp.expiresAt } });
  } catch (err) {
    next(err);
  }
});

// GET /api/attendance/my
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

// GET /api/attendance/event/:eventId — admin
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
