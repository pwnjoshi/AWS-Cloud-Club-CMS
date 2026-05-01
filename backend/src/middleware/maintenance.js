import prisma from '../lib/prisma.js';

let cachedStatus = null;
let cacheTime = 0;
const CACHE_TTL = 10000;

async function isMaintenanceMode() {
  if (Date.now() - cacheTime < CACHE_TTL && cachedStatus !== null) return cachedStatus;
  try {
    const setting = await prisma.appSetting.findUnique({ where: { key: 'maintenance_mode' } });
    cachedStatus = setting?.value === 'true';
    cacheTime = Date.now();
    return cachedStatus;
  } catch {
    return false;
  }
}

export function clearMaintenanceCache() {
  cachedStatus = null;
  cacheTime = 0;
}

export async function maintenanceGuard(req, res, next) {
  // Always allow these paths
  const allowedPaths = ['/api/health', '/api/auth/', '/api/notifications/vapid-key', '/api/certificates/verify'];
  if (allowedPaths.some(p => req.path.startsWith(p))) return next();
  if (req.path.startsWith('/api/admin')) return next();

  const maintenance = await isMaintenanceMode();
  if (!maintenance) return next();

  // Maintenance is on — check if user is admin
  if (req._jwtUserId) {
    try {
      const user = await prisma.user.findUnique({ where: { id: req._jwtUserId }, select: { role: true } });
      if (user?.role === 'ADMIN') return next();
    } catch {}
  }

  res.status(503).json({ error: 'Portal is under maintenance. Please try again later.', maintenance: true });
}
