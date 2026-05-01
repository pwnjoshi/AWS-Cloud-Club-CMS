import { Router } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { paginate, generateReferralCode } from '../utils/helpers.js';
import { logAudit } from '../utils/audit.js';
import { sendEmail, sendBulkEmails } from '../utils/email.js';
import { clearMaintenanceCache } from '../middleware/maintenance.js';
import { validateEmail, sanitize } from '../utils/validation.js';

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

// ═══════════════════════════════════════════════════════════
// Search users (for member select dropdowns) — MUST be before /users/:id
// ═══════════════════════════════════════════════════════════
router.get('/users/search', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const q = req.query.q || '';
    if (q.length < 2) return res.json({ users: [] });

    const users = await prisma.user.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: q } },
          { email: { contains: q } }
        ]
      },
      select: { id: true, name: true, email: true, avatar: true },
      take: 20,
      orderBy: { name: 'asc' }
    });
    res.json({ users });
  } catch (err) { next(err); }
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

// PUT /api/admin/users/:id — update user (role, active status, name, email, password)
router.put('/users/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { role, isActive, name, email, password } = req.body;
    const data = {};

    if (role !== undefined) data.role = role;
    if (isActive !== undefined) data.isActive = isActive;
    if (name !== undefined) data.name = sanitize(name);
    if (email !== undefined) {
      const emailCheck = validateEmail(email);
      if (!emailCheck.valid) return res.status(400).json({ error: emailCheck.error });
      const existing = await prisma.user.findFirst({ where: { email: email.toLowerCase(), NOT: { id: req.params.id } } });
      if (existing) return res.status(409).json({ error: 'Email already in use by another user' });
      data.email = email.toLowerCase();
    }
    if (password !== undefined && password.length > 0) {
      if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });
      data.passwordHash = await bcrypt.hash(password, 12);
    }

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data,
      select: { id: true, email: true, name: true, role: true, isActive: true }
    });

    // Don't log the password hash in audit
    const auditDetails = { ...data };
    if (auditDetails.passwordHash) auditDetails.passwordHash = '[RESET]';
    await logAudit(req.user.id, 'USER_UPDATE', { targetType: 'USER', targetId: user.id, details: auditDetails });

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

    const emailCheck = validateEmail(email);
    if (!emailCheck.valid) return res.status(400).json({ error: emailCheck.error });

    const cleanName = sanitize(name);

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const pw = password || 'SBG@2026';
    const passwordHash = await bcrypt.hash(pw, 12);
    const referralCode = generateReferralCode();
    const needsReset = !password; // If admin didn't set a custom password, force reset

    const user = await prisma.user.create({
      data: { email: email.toLowerCase(), passwordHash, name: cleanName, role: role || 'MEMBER', referralCode, mustResetPassword: needsReset },
      select: { id: true, email: true, name: true, role: true }
    });

    try {
      await sendEmail(email, 'Welcome to AWS Student Builder Group GEU — Set Up Your Account', `
        <h2>Welcome, ${name}!</h2>
        <p>Your account on the AWS Student Builder Group GEU portal has been created.</p>
        <p><strong>Login:</strong> <a href="${process.env.PORTAL_URL || 'http://localhost:5174'}/login">Portal Login</a></p>
        <p><strong>Email:</strong> ${email}<br><strong>Default Password:</strong> ${pw}</p>
        <p>${needsReset ? 'You will be asked to set a new password on your first login.' : ''}</p>
        <p>You can also use <strong>Continue with Google</strong> if your email is a Google account.</p>
      `);
    } catch (emailErr) {
      console.warn('[EMAIL] Failed to send welcome email:', emailErr.message);
    }

    await logAudit(req.user.id, 'USER_CREATE', { targetType: 'USER', targetId: user.id, details: { name, email } });

    res.status(201).json({ user, generatedPassword: pw, mustResetPassword: needsReset });
  } catch (err) { next(err); }
});

// ═══════════════════════════════════════════════════════════
// POST /api/admin/users/bulk — bulk create users from array
// ═══════════════════════════════════════════════════════════
router.post('/users/bulk', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { users, defaultPassword } = req.body; // [{ name, email }]
    if (!Array.isArray(users) || users.length === 0) return res.status(400).json({ error: 'Users array is required' });
    if (users.length > 200) return res.status(400).json({ error: 'Max 200 users per batch' });

    const pw = defaultPassword || 'SBG@2026';
    const passwordHash = await bcrypt.hash(pw, 12);

    const results = { created: 0, skipped: 0, errors: [], defaultPassword: pw };
    const welcomeEmails = [];

    for (const u of users) {
      if (!u.name || !u.email) { results.errors.push(`Missing name/email`); results.skipped++; continue; }

      const emailCheck = validateEmail(u.email);
      if (!emailCheck.valid) { results.errors.push(`${u.email}: ${emailCheck.error}`); results.skipped++; continue; }

      const existing = await prisma.user.findUnique({ where: { email: u.email.toLowerCase() } });
      if (existing) { results.skipped++; continue; }

      const referralCode = generateReferralCode();

      await prisma.user.create({
        data: { email: u.email.toLowerCase(), passwordHash, name: sanitize(u.name), role: 'MEMBER', referralCode, mustResetPassword: true }
      });

      welcomeEmails.push({
        to: u.email,
        subject: 'Welcome to AWS Student Builder Group GEU — Set Up Your Account',
        html: `<h2>Welcome, ${u.name}!</h2>
          <p>Your account on the AWS Student Builder Group GEU portal has been created.</p>
          <p><strong>Login:</strong> <a href="${process.env.PORTAL_URL || 'http://localhost:5174'}/login">Portal Login</a></p>
          <p><strong>Email:</strong> ${u.email}<br><strong>Default Password:</strong> ${pw}</p>
          <p>You will be asked to set a new password on your first login.</p>
          <p>You can also skip the password and use <strong>Continue with Google</strong> if your email is a Google account.</p>
          <br><p>— AWS Student Builder Group GEU</p>`
      });

      results.created++;
    }

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

// ═══════════════════════════════════════════════════════════
// Maintenance Mode
// ═══════════════════════════════════════════════════════════
router.get('/maintenance', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const setting = await prisma.appSetting.findUnique({ where: { key: 'maintenance_mode' } });
    res.json({ enabled: setting?.value === 'true' });
  } catch (err) { next(err); }
});

router.post('/maintenance', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { enabled } = req.body;
    await prisma.appSetting.upsert({
      where: { key: 'maintenance_mode' },
      update: { value: enabled ? 'true' : 'false' },
      create: { key: 'maintenance_mode', value: enabled ? 'true' : 'false' }
    });
    clearMaintenanceCache();
    await logAudit(req.user.id, 'MAINTENANCE_TOGGLE', { details: { enabled } });
    res.json({ enabled, message: enabled ? 'Maintenance mode ON — portal locked for members' : 'Maintenance mode OFF — portal open' });
  } catch (err) { next(err); }
});

// ═══════════════════════════════════════════════════════════
// Registration Toggle
// ═══════════════════════════════════════════════════════════
router.get('/registration', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const setting = await prisma.appSetting.findUnique({ where: { key: 'registration_disabled' } });
    res.json({ disabled: setting?.value === 'true' });
  } catch (err) { next(err); }
});

router.post('/registration', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { disabled } = req.body;
    await prisma.appSetting.upsert({
      where: { key: 'registration_disabled' },
      update: { value: disabled ? 'true' : 'false' },
      create: { key: 'registration_disabled', value: disabled ? 'true' : 'false' }
    });
    await logAudit(req.user.id, 'REGISTRATION_TOGGLE', { details: { disabled } });
    res.json({ disabled, message: disabled ? 'Registration CLOSED — only existing users can login' : 'Registration OPEN' });
  } catch (err) { next(err); }
});

export default router;
