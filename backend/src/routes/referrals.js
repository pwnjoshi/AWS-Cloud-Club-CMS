import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// GET /api/referrals/my — student's referral stats
router.get('/my', authenticate, async (req, res, next) => {
  try {
    const referrals = await prisma.referral.findMany({
      where: { referrerId: req.user.id },
      include: { referredUser: { select: { name: true, avatar: true, createdAt: true } } },
      orderBy: { createdAt: 'desc' }
    });

    const stats = {
      total: referrals.length,
      credited: referrals.filter(r => r.status === 'CREDITED').length,
      pending: referrals.filter(r => r.status === 'PENDING').length,
    };

    res.json({ referralCode: req.user.referralCode, referrals, stats });
  } catch (err) {
    next(err);
  }
});

export default router;
