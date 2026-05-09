import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';
import config from '../config/env.js';

/**
 * Global error handling middleware.
 * Catches all errors thrown/passed via next(err).
 * Returns consistent JSON error responses.
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.stack = err.stack;

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error = ApiError.badRequest(`Invalid ${err.path}: ${err.value}`);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = ApiError.conflict(`Duplicate value for field '${field}'. Please use another value.`);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    error = ApiError.badRequest(messages[0] || 'Validation failed', messages);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = ApiError.unauthorized('Invalid token.');
  }
  if (err.name === 'TokenExpiredError') {
    error = ApiError.unauthorized('Token expired.');
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  // Log server errors
  if (statusCode >= 500) {
    logger.error(`${statusCode} - ${message}`, {
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      stack: error.stack,
    });
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: error.errors || [],
    ...(config.env === 'development' && { stack: error.stack }),
  });
};

export default errorHandler;
