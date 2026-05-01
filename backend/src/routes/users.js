import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// GET /api/users/profile — get own full profile
router.get('/profile', authenticate, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true, email: true, name: true, role: true, avatar: true, bio: true,
        referralCode: true, createdAt: true,
        _count: { select: { attendances: true, certificates: true } }
      }
    });

    // Compute points balance
    const result = await prisma.pointTransaction.aggregate({
      where: { userId: req.user.id },
      _sum: { points: true }
    });

    res.json({ user, pointsBalance: result._sum.points || 0 });
  } catch (err) {
    next(err);
  }
});

// PUT /api/users/profile — update own profile
router.put('/profile', authenticate, async (req, res, next) => {
  try {
    const { name, bio, avatar } = req.body;
    const data = {};
    if (name !== undefined) data.name = name;
    if (bio !== undefined) data.bio = bio;
    if (avatar !== undefined) data.avatar = avatar;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data,
      select: { id: true, email: true, name: true, avatar: true, bio: true, role: true }
    });

    res.json({ user });
  } catch (err) {
    next(err);
  }
});

// GET /api/users/leaderboard — public leaderboard
router.get('/leaderboard', async (req, res, next) => {
  try {
    const transactions = await prisma.pointTransaction.groupBy({
      by: ['userId'],
      _sum: { points: true },
      orderBy: { _sum: { points: 'desc' } },
      take: 50
    });

    const userIds = transactions.map(t => t.userId);
    const users = await prisma.user.findMany({
      where: { id: { in: userIds }, isActive: true },
      select: { id: true, name: true, avatar: true }
    });

    const userMap = Object.fromEntries(users.map(u => [u.id, u]));

    const leaderboard = transactions
      .filter(t => userMap[t.userId])
      .map((t, i) => ({
        rank: i + 1,
        userId: t.userId,
        name: userMap[t.userId].name,
        avatar: userMap[t.userId].avatar,
        points: t._sum.points || 0
      }));

    res.json({ leaderboard });
  } catch (err) {
    next(err);
  }
});

export default router;
