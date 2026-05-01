import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const BACKUP_DIR = path.join(process.cwd(), 'backups');

/**
 * Create a SQLite database backup (dev only).
 * For PostgreSQL, use pg_dump or your hosting provider's backup feature.
 */
export function createBackup() {
  const dbUrl = process.env.DATABASE_URL || '';

  if (!dbUrl.startsWith('file:')) {
    console.log('[BACKUP] PostgreSQL detected — use your hosting provider backup (Render, Railway, Supabase all have automatic backups).');
    return null;
  }

  const dbPath = dbUrl.replace('file:', '').replace('./', path.join(process.cwd(), 'prisma/'));

  if (!fs.existsSync(dbPath)) {
    console.warn('[BACKUP] Database file not found:', dbPath);
    return null;
  }

  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(BACKUP_DIR, `backup-${timestamp}.db`);

  fs.copyFileSync(dbPath, backupPath);
  console.log(`[BACKUP] Created: ${backupPath}`);

  // Keep only last 10 backups
  const backups = fs.readdirSync(BACKUP_DIR)
    .filter(f => f.startsWith('backup-') && f.endsWith('.db'))
    .sort()
    .reverse();

  for (const old of backups.slice(10)) {
    fs.unlinkSync(path.join(BACKUP_DIR, old));
  }

  return backupPath;
}
