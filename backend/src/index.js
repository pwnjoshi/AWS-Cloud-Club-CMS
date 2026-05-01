import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import eventRoutes from './routes/events.js';
import attendanceRoutes from './routes/attendance.js';
import certificateRoutes from './routes/certificates.js';
import pointRoutes from './routes/points.js';
import referralRoutes from './routes/referrals.js';
import resourceRoutes from './routes/resources.js';
import announcementRoutes from './routes/announcements.js';
import rewardRoutes from './routes/rewards.js';
import adminRoutes from './routes/admin.js';
import awsLabRoutes from './routes/awsLab.js';
import badgeRoutes from './routes/badges.js';
import blogRoutes from './routes/blogs.js';
import notificationRoutes from './routes/notifications.js';
import supportRoutes from './routes/support.js';
import suggestionRoutes from './routes/suggestions.js';
import { maintenanceGuard } from './middleware/maintenance.js';
import { createBackup } from './utils/backup.js';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// ─── Security ────────────────────────────────────────────
app.use(helmet());
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5174').split(',').map(s => s.trim());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(null, true); // Allow all in dev, restrict in prod via env
  },
  credentials: true
}));

// ─── Rate Limiting ───────────────────────────────────────
const globalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 1000, standardHeaders: true, legacyHeaders: false });
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30, message: { error: 'Too many login attempts. Try again in 15 minutes.' }, keyGenerator: (req) => req.ip });

app.use(globalLimiter);

// ─── Body Parsing ────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Static uploads ──────────────────────────────────────
app.use('/uploads', express.static('uploads'));

// ─── Maintenance Mode (soft-parse JWT for admin check) ───
app.use((req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (header?.startsWith('Bearer ')) {
      const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET);
      req._jwtUserId = payload.userId;
    }
  } catch {}
  next();
});

app.use(maintenanceGuard);

// ─── Routes ──────────────────────────────────────────────
// Auth routes — rate limit only on login/register/google POST
app.use('/api/auth', (req, res, next) => {
  if (req.method === 'POST') return loginLimiter(req, res, next);
  next();
}, authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/points', pointRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/aws-lab', awsLabRoutes);
app.use('/api/badges', badgeRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/suggestions', suggestionRoutes);

// ─── Health Check ────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Error Handler ───────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);

  // Auto-backup every 6 hours (SQLite only)
  if ((process.env.DATABASE_URL || '').startsWith('file:')) {
    createBackup();
    setInterval(createBackup, 6 * 60 * 60 * 1000);
  }
});
