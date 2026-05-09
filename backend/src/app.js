import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import config from './config/env.js';
import v1Routes from './routes/v1/index.js';
import errorHandler from './middleware/error.middleware.js';
import ApiError from './utils/ApiError.js';
import logger from './utils/logger.js';

const app = express();

// ── Security ────────────────────────────────────
app.use(helmet());

// ── CORS ────────────────────────────────────────
app.use(cors({
  origin: [config.platform.frontendUrl, 'http://127.0.0.1:5173', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Body Parsing ────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ── Sanitization ────────────────────────────────
app.use(mongoSanitize());

// ── Logging ─────────────────────────────────────
if (config.env === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    stream: { write: (msg) => logger.http(msg.trim()) },
  }));
}

// ── Rate Limiting ───────────────────────────────
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: { success: false, message: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// ── API Routes ──────────────────────────────────
app.use('/api/v1', v1Routes);

// Also mount at /api/ for backward compatibility with existing frontend
app.use('/api', v1Routes);

// ── 404 Handler ─────────────────────────────────
app.all('*', (req, res, next) => {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
});

// ── Global Error Handler ────────────────────────
app.use(errorHandler);

export default app;
