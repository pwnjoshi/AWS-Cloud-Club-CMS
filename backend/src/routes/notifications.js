import { Router } from 'express';
import webpush from 'web-push';
import prisma from '../lib/prisma.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { logAudit } from '../utils/audit.js';

const router = Router();

// Configure web-push with VAPID keys
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:awscloudclubgeu@gmail.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

// GET /api/notifications/vapid-key — public key for client
router.get('/vapid-key', (req, res) => {
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY || '' });
});

// POST /api/notifications/subscribe — save push subscription
router.post('/subscribe', authenticate, async (req, res, next) => {
  try {
    const { endpoint, keys } = req.body;
    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return res.status(400).json({ error: 'Invalid subscription object' });
    }

    await prisma.pushSubscription.upsert({
      where: { endpoint },
      update: { p256dh: keys.p256dh, auth: keys.auth, userId: req.user.id },
      create: { userId: req.user.id, endpoint, p256dh: keys.p256dh, auth: keys.auth }
    });

    res.json({ message: 'Subscribed to notifications' });
  } catch (err) { next(err); }
});

// POST /api/notifications/send — admin sends push notification to all
router.post('/send', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { title, body, url } = req.body;
    if (!title || !body) return res.status(400).json({ error: 'Title and body are required' });

    const subs = await prisma.pushSubscription.findMany();
    const payload = JSON.stringify({ title, body, url: url || '/' });

    let sent = 0;
    let failed = 0;

    for (const sub of subs) {
      try {
        await webpush.sendNotification({ endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } }, payload);
        sent++;
      } catch (err) {
        failed++;
        // Remove invalid subscriptions
        if (err.statusCode === 410 || err.statusCode === 404) {
          await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {});
        }
      }
    }

    await logAudit(req.user.id, 'PUSH_NOTIFICATION', { details: { title, sent, failed } });
    res.json({ sent, failed, total: subs.length });
  } catch (err) { next(err); }
});

export default router;
