// Allowed email domains — blocks temp/disposable emails
const ALLOWED_DOMAINS = [
  // Google
  'gmail.com',
  // Microsoft / Outlook
  'outlook.com', 'hotmail.com', 'live.com', 'msn.com', 'outlook.in',
  // GEU / GEHU
  'geu.ac.in', 'gehu.ac.in',
  // Yahoo
  'yahoo.com', 'yahoo.in', 'yahoo.co.in',
  // Apple
  'icloud.com', 'me.com',
  // ProtonMail
  'protonmail.com', 'proton.me',
  // Indian providers
  'rediffmail.com',
];

/**
 * Validate email format and domain.
 * Returns { valid: boolean, error?: string }
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email is required' };
  }

  const trimmed = email.trim().toLowerCase();

  // Basic format check
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: 'Invalid email format' };
  }

  // Domain check
  const domain = trimmed.split('@')[1];
  if (!ALLOWED_DOMAINS.includes(domain)) {
    return { valid: false, error: `Email domain "${domain}" is not allowed. Use Gmail, Outlook, Yahoo, or your GEU email.` };
  }

  return { valid: true };
}

/**
 * Sanitize string input — strip HTML tags and trim.
 */
export function sanitize(str) {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/<[^>]*>/g, '').trim();
}

/**
 * Validate password strength.
 */
export function validatePassword(password) {
  if (!password || password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters' };
  }
  if (password.length > 128) {
    return { valid: false, error: 'Password too long' };
  }
  return { valid: true };
}
