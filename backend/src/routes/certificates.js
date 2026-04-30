import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { generateVerifyCode } from '../utils/helpers.js';
import { logAudit } from '../utils/audit.js';

const router = Router();

// GET /api/certificates/my — student's own certificates
router.get('/my', authenticate, async (req, res, next) => {
  try {
    const certificates = await prisma.certificate.findMany({
      where: { userId: req.user.id, revokedAt: null },
      orderBy: { issuedAt: 'desc' }
    });
    res.json({ certificates });
  } catch (err) {
    next(err);
  }
});

// GET /api/certificates/verify/:code — public verification
router.get('/verify/:code', async (req, res, next) => {
  try {
    const cert = await prisma.certificate.findUnique({
      where: { verifyCode: req.params.code },
      include: { user: { select: { name: true, avatar: true } } }
    });

    if (!cert) {
      return res.status(404).json({ valid: false, error: 'Certificate not found' });
    }

    if (cert.revokedAt) {
      return res.json({ valid: false, error: 'Certificate has been revoked', revokedAt: cert.revokedAt });
    }

    res.json({
      valid: true,
      certificate: {
        title: cert.title,
        description: cert.description,
        type: cert.type,
        issuedAt: cert.issuedAt,
        recipientName: cert.user.name,
        verifyCode: cert.verifyCode
      }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/certificates — admin issues a certificate
router.post('/', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { userId, title, description, type, pointsAwarded } = req.body;

    if (!userId || !title) {
      return res.status(400).json({ error: 'User ID and title are required' });
    }

    const verifyCode = generateVerifyCode();
    const points = pointsAwarded || 0;

    const cert = await prisma.certificate.create({
      data: {
        userId,
        title,
        description,
        type: type || 'PARTICIPATION',
        verifyCode,
        isVerified: true,
        verifiedById: req.user.id,
        pointsAwarded: points
      }
    });

    // Award points if applicable
    if (points > 0) {
      await prisma.pointTransaction.create({
        data: {
          userId,
          type: 'CERTIFICATION',
          points,
          sourceId: cert.id,
          sourceType: 'CERTIFICATE',
          verifiedById: req.user.id,
          reason: `Certificate: ${title}`
        }
      });
    }

    await logAudit(req.user.id, 'CERT_ISSUE', { targetType: 'CERTIFICATE', targetId: cert.id, details: { userId, title, points } });

    res.status(201).json({ certificate: cert });
  } catch (err) {
    next(err);
  }
});

// POST /api/certificates/bulk — admin issues certificates in bulk
router.post('/bulk', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { userIds, title, description, type, pointsAwarded } = req.body;

    if (!userIds?.length || !title) {
      return res.status(400).json({ error: 'User IDs array and title are required' });
    }

    const points = pointsAwarded || 0;
    const results = [];

    for (const userId of userIds) {
      const verifyCode = generateVerifyCode();
      const cert = await prisma.certificate.create({
        data: {
          userId,
          title,
          description,
          type: type || 'PARTICIPATION',
          verifyCode,
          isVerified: true,
          verifiedById: req.user.id,
          pointsAwarded: points
        }
      });

      if (points > 0) {
        await prisma.pointTransaction.create({
          data: {
            userId,
            type: 'CERTIFICATION',
            points,
            sourceId: cert.id,
            sourceType: 'CERTIFICATE',
            verifiedById: req.user.id,
            reason: `Certificate: ${title}`
          }
        });
      }

      results.push(cert);
    }

    await logAudit(req.user.id, 'CERT_BULK_ISSUE', { details: { title, count: userIds.length, points } });

    res.status(201).json({ certificates: results, count: results.length });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/certificates/:id — admin revokes a certificate
router.delete('/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const cert = await prisma.certificate.update({
      where: { id: req.params.id },
      data: { revokedAt: new Date() }
    });

    // Revoke associated points
    if (cert.pointsAwarded > 0) {
      await prisma.pointTransaction.create({
        data: {
          userId: cert.userId,
          type: 'REVOKE',
          points: -cert.pointsAwarded,
          sourceId: cert.id,
          sourceType: 'CERTIFICATE',
          verifiedById: req.user.id,
          reason: `Certificate revoked: ${cert.title}`
        }
      });
    }

    await logAudit(req.user.id, 'CERT_REVOKE', { targetType: 'CERTIFICATE', targetId: cert.id });

    res.json({ message: 'Certificate revoked' });
  } catch (err) {
    next(err);
  }
});

export default router;
