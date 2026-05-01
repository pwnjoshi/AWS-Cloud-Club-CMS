import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { generateVerifyCode } from '../utils/helpers.js';
import { logAudit } from '../utils/audit.js';
import { checkAndAwardBadges } from '../utils/badges.js';
import QRCode from 'qrcode';

const router = Router();

const VERIFY_BASE_URL = process.env.PORTAL_URL || 'http://localhost:5174';

// GET /api/certificates/my — student's own certificates
router.get('/my', authenticate, async (req, res, next) => {
  try {
    const certificates = await prisma.certificate.findMany({
      where: { userId: req.user.id, revokedAt: null },
      orderBy: { issuedAt: 'desc' }
    });

    // Generate QR for each cert
    const enriched = await Promise.all(certificates.map(async (cert) => {
      const verifyUrl = `${VERIFY_BASE_URL}/verify/${cert.verifyCode}`;
      const qrCode = await QRCode.toDataURL(verifyUrl, { width: 200, margin: 1, color: { dark: '#FFFFFF', light: '#00000000' } });
      return { ...cert, verifyUrl, qrCode };
    }));

    res.json({ certificates: enriched });
  } catch (err) { next(err); }
});

// GET /api/certificates/verify/:code — public verification
router.get('/verify/:code', async (req, res, next) => {
  try {
    const cert = await prisma.certificate.findUnique({
      where: { verifyCode: req.params.code },
      include: { user: { select: { name: true, avatar: true } } }
    });

    if (!cert) return res.status(404).json({ valid: false, error: 'Certificate not found' });

    if (cert.revokedAt) return res.json({ valid: false, error: 'Certificate has been revoked', revokedAt: cert.revokedAt });

    const verifyUrl = `${VERIFY_BASE_URL}/verify/${cert.verifyCode}`;
    const qrCode = await QRCode.toDataURL(verifyUrl, { width: 200, margin: 1, color: { dark: '#000000', light: '#FFFFFF' } });

    res.json({
      valid: true,
      certificate: {
        title: cert.title,
        description: cert.description,
        type: cert.type,
        issuedAt: cert.issuedAt,
        recipientName: cert.user.name,
        verifyCode: cert.verifyCode,
        verifyUrl,
        qrCode,
      }
    });
  } catch (err) { next(err); }
});

// POST /api/certificates — admin issues a single certificate
router.post('/', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { userId, title, description, type, pointsAwarded } = req.body;
    if (!userId || !title) return res.status(400).json({ error: 'User ID and title are required' });

    const verifyCode = generateVerifyCode();
    const points = pointsAwarded || 0;

    const cert = await prisma.certificate.create({
      data: { userId, title, description, type: type || 'PARTICIPATION', verifyCode, isVerified: true, verifiedById: req.user.id, pointsAwarded: points }
    });

    if (points > 0) {
      await prisma.pointTransaction.create({
        data: { userId, type: 'CERTIFICATION', points, sourceId: cert.id, sourceType: 'CERTIFICATE', verifiedById: req.user.id, reason: `Certificate: ${title}` }
      });
    }

    await checkAndAwardBadges(userId);
    await logAudit(req.user.id, 'CERT_ISSUE', { targetType: 'CERTIFICATE', targetId: cert.id, details: { userId, title, points } });

    res.status(201).json({ certificate: cert });
  } catch (err) { next(err); }
});

// POST /api/certificates/event/:eventId — bulk issue to all attendees of an event
router.post('/event/:eventId', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { title, description, type, pointsAwarded } = req.body;
    if (!title) return res.status(400).json({ error: 'Certificate title is required' });

    const eventId = req.params.eventId;
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) return res.status(404).json({ error: 'Event not found' });

    // Get all attendees
    const attendances = await prisma.attendance.findMany({
      where: { eventId },
      select: { userId: true }
    });

    if (attendances.length === 0) return res.status(400).json({ error: 'No attendees for this event' });

    const points = pointsAwarded || 0;
    let issued = 0;
    let skipped = 0;

    for (const att of attendances) {
      // Skip if user already has a cert with same title for this event
      const existing = await prisma.certificate.findFirst({
        where: { userId: att.userId, title, revokedAt: null }
      });
      if (existing) { skipped++; continue; }

      const verifyCode = generateVerifyCode();
      const cert = await prisma.certificate.create({
        data: { userId: att.userId, title, description, type: type || 'PARTICIPATION', verifyCode, isVerified: true, verifiedById: req.user.id, pointsAwarded: points }
      });

      if (points > 0) {
        await prisma.pointTransaction.create({
          data: { userId: att.userId, type: 'CERTIFICATION', points, sourceId: cert.id, sourceType: 'CERTIFICATE', verifiedById: req.user.id, reason: `Certificate: ${title}` }
        });
      }

      await checkAndAwardBadges(att.userId);
      issued++;
    }

    await logAudit(req.user.id, 'CERT_BULK_EVENT', { targetType: 'EVENT', targetId: eventId, details: { title, issued, skipped, points } });

    res.status(201).json({ message: `Certificates issued to ${issued} attendees (${skipped} skipped)`, issued, skipped });
  } catch (err) { next(err); }
});

// POST /api/certificates/bulk — bulk issue to specific users
router.post('/bulk', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { userIds, title, description, type, pointsAwarded } = req.body;
    if (!userIds?.length || !title) return res.status(400).json({ error: 'User IDs array and title are required' });

    const points = pointsAwarded || 0;
    const results = [];

    for (const userId of userIds) {
      const verifyCode = generateVerifyCode();
      const cert = await prisma.certificate.create({
        data: { userId, title, description, type: type || 'PARTICIPATION', verifyCode, isVerified: true, verifiedById: req.user.id, pointsAwarded: points }
      });

      if (points > 0) {
        await prisma.pointTransaction.create({
          data: { userId, type: 'CERTIFICATION', points, sourceId: cert.id, sourceType: 'CERTIFICATE', verifiedById: req.user.id, reason: `Certificate: ${title}` }
        });
      }

      await checkAndAwardBadges(userId);
      results.push(cert);
    }

    await logAudit(req.user.id, 'CERT_BULK_ISSUE', { details: { title, count: userIds.length, points } });
    res.status(201).json({ certificates: results, count: results.length });
  } catch (err) { next(err); }
});

// DELETE /api/certificates/:id — admin revokes
router.delete('/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const cert = await prisma.certificate.update({ where: { id: req.params.id }, data: { revokedAt: new Date() } });

    if (cert.pointsAwarded > 0) {
      await prisma.pointTransaction.create({
        data: { userId: cert.userId, type: 'REVOKE', points: -cert.pointsAwarded, sourceId: cert.id, sourceType: 'CERTIFICATE', verifiedById: req.user.id, reason: `Certificate revoked: ${cert.title}` }
      });
    }

    await logAudit(req.user.id, 'CERT_REVOKE', { targetType: 'CERTIFICATE', targetId: cert.id });
    res.json({ message: 'Certificate revoked' });
  } catch (err) { next(err); }
});

export default router;
