import app from './src/app.js';
import connectDB from './src/config/db.js';
import config from './src/config/env.js';
import logger from './src/utils/logger.js';
import { createServer } from 'http';
import { Server as SocketIO } from 'socket.io';
import initializeSocket from './src/socket/index.js';

const httpServer = createServer(app);

// ── Socket.IO ───────────────────────────────────
const io = new SocketIO(httpServer, {
  cors: {
    origin: config.platform.frontendUrl,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  pingTimeout: 60000,
});

// Make io accessible in controllers via req.app
app.set('io', io);

// Initialize socket handlers
initializeSocket(io);

// ── Start Server ────────────────────────────────
const startServer = async () => {
  try {
    await connectDB();

    httpServer.listen(config.port, () => {
      logger.info(`
╔══════════════════════════════════════════╗
║     ClearNest API Server Started         ║
║──────────────────────────────────────────║
║  Environment : ${config.env.padEnd(24)}║
║  Port        : ${String(config.port).padEnd(24)}║
║  API         : http://localhost:${config.port}/api/v1  ║
║  WebSocket   : ws://localhost:${config.port}          ║
╚══════════════════════════════════════════╝
      `);
    });
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
};

// ── Graceful Shutdown ───────────────────────────
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  httpServer.close(() => {
    logger.info('Server closed.');
    process.exit(0);
  });
});

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  httpServer.close(() => process.exit(1));
});

startServer();
