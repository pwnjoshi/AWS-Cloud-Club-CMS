import prisma from '../lib/prisma.js';

/**
 * Log an admin action to the audit trail.
 * @param {string} actorId - The admin user ID
 * @param {string} action - Action type (e.g. USER_DELETE, POINTS_ADJUST)
 * @param {object} opts - { targetType, targetId, details }
 */
export async function logAudit(actorId, action, opts = {}) {
  await prisma.auditLog.create({
    data: {
      actorId,
      action,
      targetType: opts.targetType || null,
      targetId: opts.targetId || null,
      details: opts.details ? JSON.stringify(opts.details) : null,
    }
  });
}
