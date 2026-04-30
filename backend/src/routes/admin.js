import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { paginate } from '../utils/helpers.js';
import { logAudit } from '../utils/audit.js';

const router = Router();

// GET /api/admin/dashboard — admin dashboard stats
router.get('/dashboard', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const [totalUsers, activeUsers, totalEvents, totalAttendances, totalCertificates, totalPoints] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.event.count({ where: { isActive: true } }),
      prisma.attendance.count(),
      prisma.certificate.count({ where: { revokedAt: null } }),
      prisma.pointTransaction.aggregate({ _sum: { points: true } })
    ]);

    // Recent signups (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentSignups = await prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } });

    res.json({
      stats: {
        totalUsers,
        activeUsers,
        recentSignups,
        totalEvents,
        totalAttendances,
        totalCertificates,
        totalPointsIssued: totalPoints._sum.points || 0
      }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/users — list all users
router.get('/users', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { skip, take, page, limit } = paginate(req.query);
    const where = {};

    if (req.query.search) {
      where.OR = [
        { name: { contains: req.query.search } },
        { email: { contains: req.query.search } }
      ];
    }
    if (req.query.role) where.role = req.query.role;
    if (req.query.active === 'true') where.isActive = true;
    if (req.query.active === 'false') where.isActive = false;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true, email: true, name: true, role: true, avatar: true, isActive: true, createdAt: true, referralCode: true,
          _count: { select: { attendances: true, certificates: true, pointTransactions: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take
      }),
      prisma.user.count({ where })
    ]);

    res.json({ users, total, page, limit });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/users/:id — get user detail
router.get('/users/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true, email: true, name: true, role: true, avatar: true, bio: true,
        isActive: true, referralCode: true, createdAt: true,
        _count: { select: { attendances: true, certificates: true } }
      }
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    const pointsBalance = await prisma.pointTransaction.aggregate({
      where: { userId: user.id },
      _sum: { points: true }
    });

    res.json({ user, pointsBalance: pointsBalance._sum.points || 0 });
  } catch (err) {
    next(err);
  }
});

// PUT /api/admin/users/:id — update user (role, active status, etc.)
router.put('/users/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { role, isActive, name, email } = req.body;
    const data = {};

    if (role !== undefined) data.role = role;
    if (isActive !== undefined) data.isActive = isActive;
    if (name !== undefined) data.name = name;
    if (email !== undefined) data.email = email;

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data,
      select: { id: true, email: true, name: true, role: true, isActive: true }
    });

    await logAudit(req.user.id, 'USER_UPDATE', { targetType: 'USER', targetId: user.id, details: data });

    res.json({ user });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/admin/users/:id — deactivate user
router.delete('/users/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    // Prevent self-deletion
    if (req.params.id === req.user.id) {
      return res.status(400).json({ error: 'Cannot deactivate your own account' });
    }

    await prisma.user.update({ where: { id: req.params.id }, data: { isActive: false } });
    await logAudit(req.user.id, 'USER_DEACTIVATE', { targetType: 'USER', targetId: req.params.id });

    res.json({ message: 'User deactivated' });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/audit — view audit log
router.get('/audit', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { skip, take, page, limit } = paginate(req.query);

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        include: { actor: { select: { name: true, email: true } } }
      }),
      prisma.auditLog.count()
    ]);

    res.json({ logs, total, page, limit });
  } catch (err) {
    next(err);
  }
});

export default router;
