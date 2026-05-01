import { Router } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { paginate, generateReferralCode } from '../utils/helpers.js';
import { logAudit } from '../utils/audit.js';
import { sendEmail, sendBulkEmails } from '../utils/email.js';

const router = Router();

// GET /api/admin/dashboard — admin dashboard stats
router.get('/dashboard', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const [totalUsers, activeUsers, totalEvents, totalAttendances, totalCertificates, totalPoints, totalBadges, totalBlogs, totalResources] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.event.count({ where: { isActive: true } }),
      prisma.attendance.count(),
      prisma.certificate.count({ where: { revokedAt: null } }),
      prisma.pointTransaction.aggregate({ _sum: { points: true } }),
      prisma.userBadge.count(),
      prisma.blogSubmission.count({ where: { status: 'APPROVED' } }),
      prisma.resource.count({ where: { isActive: true } }),
    ]);

    // Recent signups (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentSignups = await prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } });

    // Signups per day (last 7 days)
    const signupsByDay = [];
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date(); dayStart.setDate(dayStart.getDate() - i); dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart); dayEnd.setDate(dayEnd.getDate() + 1);
      const count = await prisma.user.count({ where: { createdAt: { gte: dayStart, lt: dayEnd } } });
      signupsByDay.push({ date: dayStart.toISOString().slice(0, 10), count });
    }

    // Attendance per event (last 10 events)
    const recentEvents = await prisma.event.findMany({
      orderBy: { date: 'desc' }, take: 10,
      select: { id: true, title: true, date: true, _count: { select: { attendances: true } } }
    });

    // Top 5 users by points
    const topUsers = await prisma.pointTransaction.groupBy({
      by: ['userId'], _sum: { points: true }, orderBy: { _sum: { points: 'desc' } }, take: 5
    });
    const topUserIds = topUsers.map(t => t.userId);
    const topUserDetails = await prisma.user.findMany({ where: { id: { in: topUserIds } }, select: { id: true, name: true } });
    const topUserMap = Object.fromEntries(topUserDetails.map(u => [u.id, u.name]));

    // Active users (attended event in last 30 days)
    const activeInLast30 = await prisma.attendance.groupBy({
      by: ['userId'], where: { createdAt: { gte: thirtyDaysAgo } }
    });

    res.json({
      stats: {
        totalUsers, activeUsers, recentSignups, totalEvents, totalAttendances,
        totalCertificates, totalPointsIssued: totalPoints._sum.points || 0,
        totalBadgesEarned: totalBadges, totalBlogsApproved: totalBlogs, totalResources,
        activeInLast30Days: activeInLast30.length,
      },
      charts: {
        signupsByDay,
        attendanceByEvent: recentEvents.map(e => ({ title: e.title, date: e.date, attendees: e._count.attendances })),
        topUsers: topUsers.map(t => ({ name: topUserMap[t.userId] || 'Unknown', points: t._sum.points || 0 })),
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

// ═══════════════════════════════════════════════════════════
// POST /api/admin/users/create — admin creates a single user
// ═══════════════════════════════════════════════════════════
router.post('/users/create', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const pw = password || Math.random().toString(36).slice(-10);
    const passwordHash = await bcrypt.hash(pw, 12);
    const referralCode = generateReferralCode();

    const user = await prisma.user.create({
      data: { email: email.toLowerCase(), passwordHash, name, role: role || 'MEMBER', referralCode },
      select: { id: true, email: true, name: true, role: true }
    });

    // Send welcome email with credentials
    try {
      await sendEmail(email, 'Welcome to AWS Student Builder Group GEU', `
        <h2>Welcome, ${name}!</h2>
        <p>Your account has been created on the AWS SBG GEU Member Portal.</p>
        <p><strong>Email:</strong> ${email}<br><strong>Password:</strong> ${pw}</p>
        <p>Please change your password after first login.</p>
      `);
    } catch (emailErr) {
      console.warn('[EMAIL] Failed to send welcome email:', emailErr.message);
    }

    await logAudit(req.user.id, 'USER_CREATE', { targetType: 'USER', targetId: user.id, details: { name, email } });

    res.status(201).json({ user, generatedPassword: password ? undefined : pw });
  } catch (err) { next(err); }
});

// ═══════════════════════════════════════════════════════════
// POST /api/admin/users/bulk — bulk create users from array
// ═══════════════════════════════════════════════════════════
router.post('/users/bulk', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { users } = req.body; // [{ name, email }]
    if (!Array.isArray(users) || users.length === 0) return res.status(400).json({ error: 'Users array is required' });
    if (users.length > 200) return res.status(400).json({ error: 'Max 200 users per batch' });

    const results = { created: 0, skipped: 0, errors: [] };
    const welcomeEmails = [];

    for (const u of users) {
      if (!u.name || !u.email) { results.errors.push(`Missing name/email: ${JSON.stringify(u)}`); results.skipped++; continue; }

      const existing = await prisma.user.findUnique({ where: { email: u.email.toLowerCase() } });
      if (existing) { results.skipped++; continue; }

      const pw = Math.random().toString(36).slice(-10);
      const passwordHash = await bcrypt.hash(pw, 12);
      const referralCode = generateReferralCode();

      await prisma.user.create({
        data: { email: u.email.toLowerCase(), passwordHash, name: u.name, role: 'MEMBER', referralCode }
      });

      welcomeEmails.push({
        to: u.email,
        subject: 'Welcome to AWS Student Builder Group GEU',
        html: `<h2>Welcome, ${u.name}!</h2><p>Your portal account has been created.</p><p><strong>Email:</strong> ${u.email}<br><strong>Password:</strong> ${pw}</p><p>Please change your password after first login.</p>`
      });

      results.created++;
    }

    // Send welcome emails in bulk
    if (welcomeEmails.length > 0) {
      try { await sendBulkEmails(welcomeEmails); } catch (e) { console.warn('[EMAIL] Bulk send error:', e.message); }
    }

    await logAudit(req.user.id, 'USER_BULK_CREATE', { details: { created: results.created, skipped: results.skipped } });

    res.status(201).json(results);
  } catch (err) { next(err); }
});

// ═══════════════════════════════════════════════════════════
// POST /api/admin/email/send — send email to members
// ═══════════════════════════════════════════════════════════
router.post('/email/send', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { subject, html, filter } = req.body;
    if (!subject || !html) return res.status(400).json({ error: 'Subject and HTML body are required' });

    // Build user filter
    const where = { isActive: true };
    if (filter === 'admins') where.role = 'ADMIN';

    const users = await prisma.user.findMany({ where, select: { email: true, name: true } });
    if (users.length === 0) return res.json({ sent: 0, message: 'No matching users' });

    const emails = users.map(u => ({
      to: u.email,
      subject,
      html: html.replace(/\{\{name\}\}/g, u.name)
    }));

    const result = await sendBulkEmails(emails);

    await logAudit(req.user.id, 'BULK_EMAIL', { details: { subject, recipientCount: users.length } });

    res.json({ ...result, recipientCount: users.length });
  } catch (err) { next(err); }
});

export default router;
