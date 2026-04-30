import crypto from 'crypto';

// Generate a unique referral code (8 chars, uppercase alphanumeric)
export function generateReferralCode() {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
}

// Generate a 6-digit OTP
export function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

// Generate a certificate verification code
export function generateVerifyCode() {
  return 'CERT-' + crypto.randomBytes(6).toString('hex').toUpperCase();
}

// Paginate helper
export function paginate(query) {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
  const skip = (page - 1) * limit;
  return { skip, take: limit, page, limit };
}
