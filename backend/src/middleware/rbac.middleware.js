import ApiError from '../utils/ApiError.js';

/**
 * Role-Based Access Control Middleware.
 * Usage: authorize('SUPER_ADMIN', 'SOCIETY_ADMIN')
 * 
 * Must be used AFTER authenticate middleware.
 */
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw ApiError.unauthorized('Authentication required.');
    }

    if (!allowedRoles.includes(req.userRole)) {
      throw ApiError.forbidden(
        `Role '${req.userRole}' does not have permission to access this resource.`
      );
    }

    next();
  };
};

/**
 * Society membership check — ensures user belongs to the society
 * they're trying to access. Super Admin bypasses this check.
 */
export const requireSocietyAccess = (req, res, next) => {
  if (req.userRole === 'SUPER_ADMIN') return next();

  const targetSocietyId = req.params.societyId || req.body.societyId || req.societyId;

  if (!targetSocietyId) {
    throw ApiError.badRequest('Society context is required.');
  }

  if (req.societyId !== targetSocietyId.toString()) {
    throw ApiError.forbidden('You do not have access to this society.');
  }

  next();
};

/**
 * Self-or-admin check — user can access their own resources,
 * or admins can access any user's resources.
 */
export const selfOrAdmin = (req, res, next) => {
  const targetUserId = req.params.userId;
  const isAdmin = ['SUPER_ADMIN', 'SOCIETY_ADMIN'].includes(req.userRole);
  const isSelf = req.userId === targetUserId;

  if (!isSelf && !isAdmin) {
    throw ApiError.forbidden('You can only access your own resources.');
  }

  next();
};
