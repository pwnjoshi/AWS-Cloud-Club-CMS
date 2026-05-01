import prisma from '../lib/prisma.js';

// Badge definitions — these get seeded into the DB
export const BADGE_DEFINITIONS = [
  { slug: 'first-event', name: 'First Event', description: 'Attended your first event', icon: '🎯', category: 'EVENT', criteria: JSON.stringify({ type: 'attendance_count', threshold: 1 }), pointsReward: 10 },
  { slug: 'regular-builder', name: 'Regular Builder', description: 'Attended 5 events', icon: '🔥', category: 'EVENT', criteria: JSON.stringify({ type: 'attendance_count', threshold: 5 }), pointsReward: 25 },
  { slug: 'power-builder', name: 'Power Builder', description: 'Attended 10 events', icon: '⚡', category: 'EVENT', criteria: JSON.stringify({ type: 'attendance_count', threshold: 10 }), pointsReward: 50 },
  { slug: 'event-veteran', name: 'Event Veteran', description: 'Attended 25 events', icon: '🎖️', category: 'EVENT', criteria: JSON.stringify({ type: 'attendance_count', threshold: 25 }), pointsReward: 100 },
  { slug: 'blog-writer', name: 'Blog Writer', description: 'Published an approved blog post', icon: '📝', category: 'COMMUNITY', criteria: JSON.stringify({ type: 'blog_approved', threshold: 1 }), pointsReward: 30 },
  { slug: 'prolific-writer', name: 'Prolific Writer', description: 'Published 5 approved blog posts', icon: '✍️', category: 'COMMUNITY', criteria: JSON.stringify({ type: 'blog_approved', threshold: 5 }), pointsReward: 50 },
  { slug: 'top-contributor', name: 'Top Contributor', description: 'Reached 500 points', icon: '🌟', category: 'ACHIEVEMENT', criteria: JSON.stringify({ type: 'points_total', threshold: 500 }), pointsReward: 0 },
  { slug: 'point-master', name: 'Point Master', description: 'Reached 2000 points', icon: '💎', category: 'ACHIEVEMENT', criteria: JSON.stringify({ type: 'points_total', threshold: 2000 }), pointsReward: 0 },
  { slug: 'referral-starter', name: 'Referral Starter', description: '3 successful referrals', icon: '🤝', category: 'COMMUNITY', criteria: JSON.stringify({ type: 'referral_count', threshold: 3 }), pointsReward: 20 },
  { slug: 'referral-champion', name: 'Referral Champion', description: '10 successful referrals', icon: '🚀', category: 'COMMUNITY', criteria: JSON.stringify({ type: 'referral_count', threshold: 10 }), pointsReward: 50 },
  { slug: 'certified', name: 'AWS Certified', description: 'Earned an AWS certification', icon: '🎓', category: 'CERTIFICATION', criteria: JSON.stringify({ type: 'cert_type', value: 'AWS_CERT' }), pointsReward: 0 },
  { slug: 'hackathon-winner', name: 'Hackathon Winner', description: 'Won a hackathon', icon: '🏆', category: 'ACHIEVEMENT', criteria: JSON.stringify({ type: 'manual' }), pointsReward: 0 },
  { slug: 'early-adopter', name: 'Early Adopter', description: 'One of the first 50 members', icon: '🌱', category: 'COMMUNITY', criteria: JSON.stringify({ type: 'manual' }), pointsReward: 15 },
  { slug: 'speaker', name: 'Speaker', description: 'Gave a talk or presentation', icon: '🎤', category: 'COMMUNITY', criteria: JSON.stringify({ type: 'manual' }), pointsReward: 0 },
  { slug: 'open-source', name: 'Open Source Contributor', description: 'Contributed to an open source project', icon: '🔓', category: 'ACHIEVEMENT', criteria: JSON.stringify({ type: 'manual' }), pointsReward: 0 },
];

/**
 * Check and award all eligible badges for a user.
 * Safe to call multiple times — won't double-award (DB unique constraint).
 */
export async function checkAndAwardBadges(userId) {
  try {
    const badges = await prisma.badge.findMany();
    const existing = await prisma.userBadge.findMany({ where: { userId }, select: { badgeId: true } });
    const earnedIds = new Set(existing.map(e => e.badgeId));

    for (const badge of badges) {
      if (earnedIds.has(badge.id)) continue;

      const criteria = badge.criteria ? JSON.parse(badge.criteria) : null;
      if (!criteria || criteria.type === 'manual') continue;

      let earned = false;

      if (criteria.type === 'attendance_count') {
        const count = await prisma.attendance.count({ where: { userId } });
        earned = count >= criteria.threshold;
      } else if (criteria.type === 'blog_approved') {
        const count = await prisma.blogSubmission.count({ where: { userId, status: 'APPROVED' } });
        earned = count >= criteria.threshold;
      } else if (criteria.type === 'points_total') {
        const agg = await prisma.pointTransaction.aggregate({ where: { userId }, _sum: { points: true } });
        earned = (agg._sum.points || 0) >= criteria.threshold;
      } else if (criteria.type === 'referral_count') {
        const count = await prisma.referral.count({ where: { referrerId: userId, status: 'CREDITED' } });
        earned = count >= criteria.threshold;
      } else if (criteria.type === 'cert_type') {
        const count = await prisma.certificate.count({ where: { userId, type: criteria.value, revokedAt: null } });
        earned = count > 0;
      }

      if (earned) {
        await prisma.userBadge.create({ data: { userId, badgeId: badge.id } }).catch(() => {});
        // Award points if badge has a reward
        if (badge.pointsReward > 0) {
          await prisma.pointTransaction.create({
            data: {
              userId, type: 'MANUAL', points: badge.pointsReward,
              sourceId: badge.id, sourceType: 'BADGE',
              reason: `Badge earned: ${badge.name}`
            }
          });
        }
      }
    }
  } catch (err) {
    console.error('[BADGES] Check error:', err.message);
  }
}
