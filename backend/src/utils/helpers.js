import crypto from 'crypto';

/**
 * Generate an 8-character uppercase alphanumeric society code.
 */
export const generateSocietyCode = () => {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
};

/**
 * Generate a 6-digit numeric OTP.
 */
export const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

/**
 * Generate a QR token for visitor passes.
 */
export const generateQRToken = () => {
  return `VIS-${crypto.randomBytes(8).toString('hex').toUpperCase()}-${Date.now()}`;
};

/**
 * Calculate late fee for overdue maintenance.
 * @param {number} amount - Original bill amount
 * @param {number} daysOverdue - Days past due date
 * @param {number} ratePercent - Monthly late fee rate (default 2%)
 */
export const calculateLateFee = (amount, daysOverdue, ratePercent = 2) => {
  if (daysOverdue <= 0) return 0;
  const dailyRate = ratePercent / 30 / 100;
  return Math.round(amount * dailyRate * daysOverdue);
};

/**
 * Strip sensitive fields from user objects before sending to client.
 */
export const sanitizeUser = (user) => {
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.password;
  delete obj.refreshTokens;
  delete obj.__v;
  return obj;
};

/**
 * Paginate helper for Mongoose queries.
 */
export const paginate = (query, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  return query.skip(skip).limit(limit);
};
