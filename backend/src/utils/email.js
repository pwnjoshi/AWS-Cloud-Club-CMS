import { Resend } from 'resend';

let resend = null;

function getResend() {
  if (!resend && process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

/**
 * Send a single email.
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML body
 */
export async function sendEmail(to, subject, html) {
  const client = getResend();
  if (!client) {
    console.warn('[EMAIL] Resend not configured (set RESEND_API_KEY). Email skipped.');
    return { skipped: true };
  }

  const from = process.env.EMAIL_FROM || 'AWS SBG GEU <noreply@awsclubgeu.in>';

  const { data, error } = await client.emails.send({ from, to, subject, html });
  if (error) throw new Error(error.message);
  return data;
}

/**
 * Send bulk emails (Resend batch API, max 100 per call).
 * @param {Array<{to: string, subject: string, html: string}>} emails
 */
export async function sendBulkEmails(emails) {
  const client = getResend();
  if (!client) {
    console.warn('[EMAIL] Resend not configured. Bulk email skipped.');
    return { skipped: true, count: emails.length };
  }

  const from = process.env.EMAIL_FROM || 'AWS SBG GEU <noreply@awsclubgeu.in>';
  const batches = [];

  // Resend batch limit is 100
  for (let i = 0; i < emails.length; i += 100) {
    const batch = emails.slice(i, i + 100).map(e => ({ from, to: e.to, subject: e.subject, html: e.html }));
    batches.push(batch);
  }

  let sent = 0;
  for (const batch of batches) {
    const { data, error } = await client.batch.send(batch);
    if (error) console.error('[EMAIL] Batch error:', error.message);
    else sent += batch.length;
  }

  return { sent, total: emails.length };
}
