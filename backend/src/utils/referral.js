import prisma from '../lib/prisma.js';

const MAX_REFERRAL_CREDITS_PER_DAY = 5;
const MAX_REFERRAL_CREDITS_TOTAL = 50;
const REFERRAL_POINTS = 30;

/**
 * Credit referral points if this is the user's first attendance
 * and they were referred by someone.
 * 
 * Anti-spoof checks:
 * 1. User must have exactly 1 attendance (this is their first event)
 * 2. Referral record must exist and be PENDING
 * 3. Referrer hasn't exceeded daily referral credit cap
 * 4. Referrer hasn't exceeded total referral credit cap
 * 5. Referred user account must be at least 1 hour old (prevents rapid fake signups)
 */
export async function creditReferralIfEligible(userId) {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user?.referredById) return;

    // Check this is their first attendance
    const attendanceCount = await prisma.attendance.count({ where: { userId } });
    if (attendanceCount !== 1) return;

    // Account must be at least 1 hour old
    const accountAge = Date.now() - new Date(user.createdAt).getTime();
    if (accountAge < 60 * 60 * 1000) return;

    // Find the pending referral
    const referral = await prisma.referral.findFirst({
      where: { referrerId: user.referredById, referredUserId: userId, status: 'PENDING' }
    });
    if (!referral) return;

    // Check referrer's daily credit count
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const dailyCredits = await prisma.pointTransaction.count({
      where: {
        userId: user.referredById,
        type: 'REFERRAL',
        createdAt: { gte: startOfDay }
      }
    });
    if (dailyCredits >= MAX_REFERRAL_CREDITS_PER_DAY) {
      // Silently skip — don't reject the referral, just don't credit yet
      return;
    }

    // Check referrer's total referral credits
    const totalCredits = await prisma.referral.count({
      where: { referrerId: user.referredById, status: 'CREDITED' }
    });
    if (totalCredits >= MAX_REFERRAL_CREDITS_TOTAL) {
      await prisma.referral.update({ where: { id: referral.id }, data: { status: 'REJECTED' } });
      return;
    }

    // All checks passed — credit the referrer
    await prisma.referral.update({
      where: { id: referral.id },
      data: { status: 'CREDITED', creditedAt: new Date() }
    });

    await prisma.pointTransaction.create({
      data: {
        userId: user.referredById,
        type: 'REFERRAL',
        points: REFERRAL_POINTS,
        sourceId: referral.id,
        sourceType: 'REFERRAL',
        reason: `Referral: ${user.name} attended first event`
      }
    });
  } catch (err) {
    // Log but don't fail the attendance
    console.error('[REFERRAL] Credit error:', err.message);
  }
}
