import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import prisma from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.js';
import { generateReferralCode } from '../utils/helpers.js';
import { validateEmail, validatePassword, sanitize } from '../utils/validation.js';

const router = Router();

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

function userSelect() {
  return { id: true, email: true, name: true, role: true, avatar: true, referralCode: true };
}

async function isRegistrationDisabled() {
  try {
    const setting = await prisma.appSetting.findUnique({ where: { key: 'registration_disabled' } });
    return setting?.value === 'true';
  } catch { return false; }
}

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    if (await isRegistrationDisabled()) {
      return res.status(403).json({ error: 'Registration is currently closed. Contact admin for access.' });
    }

    const { email, password, name, referralCode } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    const emailCheck = validateEmail(email);
    if (!emailCheck.valid) return res.status(400).json({ error: emailCheck.error });

    const pwCheck = validatePassword(password);
    if (!pwCheck.valid) return res.status(400).json({ error: pwCheck.error });

    const cleanName = sanitize(name);
    if (!cleanName || cleanName.length < 2) return res.status(400).json({ error: 'Name must be at least 2 characters' });

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    // Handle referral — block self-referral
    let referredById = null;
    if (referralCode) {
      const referrer = await prisma.user.findUnique({ where: { referralCode: referralCode.toUpperCase() } });
      if (referrer && referrer.email !== email.toLowerCase()) {
        referredById = referrer.id;
      }
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const userReferralCode = generateReferralCode();

    const user = await prisma.user.create({
      data: { email: email.toLowerCase(), passwordHash, name: cleanName, referralCode: userReferralCode, referredById },
      select: userSelect()
    });

    if (referredById) {
      await prisma.referral.create({ data: { referrerId: referredById, referredUserId: user.id, status: 'PENDING' } });
    }

    res.status(201).json({ user, token: signToken(user.id) });
  } catch (err) { next(err); }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user || !user.isActive) return res.status(401).json({ error: 'Invalid credentials' });

    // If user signed up with Google and has no password
    if (!user.passwordHash) {
      return res.status(401).json({ error: 'This account uses Google Sign-In. Please use the Google button.' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    res.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role, avatar: user.avatar, referralCode: user.referralCode },
      token: signToken(user.id),
      mustResetPassword: user.mustResetPassword
    });
  } catch (err) { next(err); }
});

// POST /api/auth/google — Google OAuth sign-in/sign-up
router.post('/google', async (req, res, next) => {
  try {
    const { credential, referralCode } = req.body;
    if (!credential) return res.status(400).json({ error: 'Google credential is required' });

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({ error: 'Google Sign-In is not configured' });
    }

    // Verify the Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Validate email domain
    const emailCheck = validateEmail(email);
    if (!emailCheck.valid) return res.status(400).json({ error: emailCheck.error });

    // Check if user exists by googleId or email
    let user = await prisma.user.findFirst({
      where: { OR: [{ googleId }, { email: email.toLowerCase() }] }
    });

    if (user) {
      // Existing user — update googleId if not set
      if (!user.googleId) {
        await prisma.user.update({ where: { id: user.id }, data: { googleId, avatar: user.avatar || picture } });
      }
      if (!user.isActive) return res.status(401).json({ error: 'Account deactivated' });
    } else {
      // New user — check if registration is open
      if (await isRegistrationDisabled()) {
        return res.status(403).json({ error: 'Registration is currently closed. Contact admin for access.' });
      }

      let referredById = null;
      if (referralCode) {
        const referrer = await prisma.user.findUnique({ where: { referralCode: referralCode.toUpperCase() } });
        if (referrer && referrer.email !== email.toLowerCase()) {
          referredById = referrer.id;
        }
      }

      const userReferralCode = generateReferralCode();
      user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          passwordHash: '', // No password for Google users
          name: name || email.split('@')[0],
          avatar: picture,
          googleId,
          referralCode: userReferralCode,
          referredById,
        }
      });

      if (referredById) {
        await prisma.referral.create({ data: { referrerId: referredById, referredUserId: user.id, status: 'PENDING' } });
      }
    }

    res.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role, avatar: user.avatar, referralCode: user.referralCode },
      token: signToken(user.id)
    });
  } catch (err) {
    if (err.message?.includes('Token used too late') || err.message?.includes('Invalid token')) {
      return res.status(401).json({ error: 'Invalid or expired Google token. Please try again.' });
    }
    next(err);
  }
});

// POST /api/auth/reset-password — authenticated user resets their own password
router.post('/reset-password', authenticate, async (req, res, next) => {
  try {
    const { newPassword } = req.body;
    const pwCheck = validatePassword(newPassword);
    if (!pwCheck.valid) return res.status(400).json({ error: pwCheck.error });

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: req.user.id },
      data: { passwordHash, mustResetPassword: false }
    });

    res.json({ message: 'Password updated successfully' });
  } catch (err) { next(err); }
});

// GET /api/auth/me
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, name: true, role: true, avatar: true, bio: true, referralCode: true, createdAt: true, googleId: true, mustResetPassword: true }
    });
    res.json({ user });
  } catch (err) { next(err); }
});

// GET /api/auth/google-client-id — public, for frontend
router.get('/google-client-id', (req, res) => {
  res.json({ clientId: process.env.GOOGLE_CLIENT_ID || '' });
});

// GET /api/auth/registration-status — public, for frontend
router.get('/registration-status', async (req, res) => {
  const disabled = await isRegistrationDisabled();
  res.json({ registrationOpen: !disabled });
});

export default router;
