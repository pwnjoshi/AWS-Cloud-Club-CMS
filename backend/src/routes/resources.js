import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { paginate } from '../utils/helpers.js';
import { logAudit } from '../utils/audit.js';

const router = Router();

// GET /api/resources — list resources
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { skip, take, page, limit } = paginate(req.query);
    const where = { isActive: true };

    if (req.query.category) {
      where.category = req.query.category;
    }

    const [resources, total] = await Promise.all([
      prisma.resource.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        include: { createdBy: { select: { name: true } } }
      }),
      prisma.resource.count({ where })
    ]);

    // Check which resources the user has completed
    const completions = await prisma.resourceCompletion.findMany({
      where: { userId: req.user.id, resourceId: { in: resources.map(r => r.id) } },
      select: { resourceId: true }
    });
    const completedIds = new Set(completions.map(c => c.resourceId));

    const enriched = resources.map(r => ({ ...r, completed: completedIds.has(r.id) }));

    res.json({ resources: enriched, total, page, limit });
  } catch (err) {
    next(err);
  }
});

// POST /api/resources/:id/complete — student marks resource as completed
router.post('/:id/complete', authenticate, async (req, res, next) => {
  try {
    const resourceId = req.params.id;

    // Check if already completed (server-side dedup)
    const existing = await prisma.resourceCompletion.findUnique({
      where: { userId_resourceId: { userId: req.user.id, resourceId } }
    });
    if (existing) {
      return res.status(409).json({ error: 'Resource already completed' });
    }

    const resource = await prisma.resource.findUnique({ where: { id: resourceId } });
    if (!resource || !resource.isActive) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    await prisma.resourceCompletion.create({
      data: { userId: req.user.id, resourceId }
    });

    // Award points if applicable
    if (resource.pointsReward > 0) {
      await prisma.pointTransaction.create({
        data: {
          userId: req.user.id,
          type: 'RESOURCE',
          points: resource.pointsReward,
          sourceId: resourceId,
          sourceType: 'RESOURCE',
          reason: `Completed: ${resource.title}`
        }
      });
    }

    res.json({ message: 'Resource completed', pointsAwarded: resource.pointsReward });
  } catch (err) {
    next(err);
  }
});

// POST /api/resources — admin creates a resource
router.post('/', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { title, description, url, category, fileUrl, pointsReward } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const resource = await prisma.resource.create({
      data: {
        title,
        description,
        url,
        category: category || 'General',
        fileUrl,
        pointsReward: pointsReward || 0,
        createdById: req.user.id
      }
    });

    await logAudit(req.user.id, 'RESOURCE_CREATE', { targetType: 'RESOURCE', targetId: resource.id });

    res.status(201).json({ resource });
  } catch (err) {
    next(err);
  }
});

// PUT /api/resources/:id — admin updates a resource
router.put('/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { title, description, url, category, fileUrl, pointsReward, isActive } = req.body;
    const data = {};

    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (url !== undefined) data.url = url;
    if (category !== undefined) data.category = category;
    if (fileUrl !== undefined) data.fileUrl = fileUrl;
    if (pointsReward !== undefined) data.pointsReward = pointsReward;
    if (isActive !== undefined) data.isActive = isActive;

    const resource = await prisma.resource.update({ where: { id: req.params.id }, data });

    res.json({ resource });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/resources/:id — admin soft-deletes
router.delete('/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    await prisma.resource.update({ where: { id: req.params.id }, data: { isActive: false } });
    await logAudit(req.user.id, 'RESOURCE_DELETE', { targetType: 'RESOURCE', targetId: req.params.id });
    res.json({ message: 'Resource deactivated' });
  } catch (err) {
    next(err);
  }
});

export default router;
