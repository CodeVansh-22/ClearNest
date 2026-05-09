import jwt from 'jsonwebtoken';
import config from '../config/env.js';
import logger from '../utils/logger.js';
import { SOCKET_EVENTS } from '../utils/constants.js';

const initializeSocket = (io) => {
  // Auth middleware for socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }

    try {
      const decoded = jwt.verify(token, config.jwt.accessSecret);
      socket.userId = decoded.userId;
      socket.userRole = decoded.role;
      socket.societyId = decoded.societyId;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.userId} (${socket.userRole})`);

    // Auto-join rooms
    if (socket.societyId) {
      socket.join(`society:${socket.societyId}`);
    }
    socket.join(`user:${socket.userId}`);

    // ── Chat ──────────────────────────────────
    socket.on(SOCKET_EVENTS.CHAT_MESSAGE, (data) => {
      io.to(`society:${socket.societyId}`).emit(SOCKET_EVENTS.CHAT_MESSAGE, {
        ...data,
        senderId: socket.userId,
        timestamp: new Date(),
      });
    });

    socket.on(SOCKET_EVENTS.CHAT_TYPING, (data) => {
      socket.to(`society:${socket.societyId}`).emit(SOCKET_EVENTS.CHAT_TYPING, {
        userId: socket.userId,
        isTyping: data.isTyping,
      });
    });

    // ── Emergency SOS ─────────────────────────
    socket.on(SOCKET_EVENTS.EMERGENCY_SOS, (data) => {
      // Broadcast to entire society
      io.to(`society:${socket.societyId}`).emit(SOCKET_EVENTS.EMERGENCY_SOS, {
        ...data,
        userId: socket.userId,
        timestamp: new Date(),
      });
      logger.warn(`EMERGENCY SOS from user ${socket.userId} in society ${socket.societyId}`);
    });

    // ── Visitor ───────────────────────────────
    socket.on(SOCKET_EVENTS.VISITOR_APPROVED, (data) => {
      io.to(`security:${socket.societyId}`).emit(SOCKET_EVENTS.VISITOR_APPROVED, data);
    });

    socket.on(SOCKET_EVENTS.VISITOR_REJECTED, (data) => {
      io.to(`security:${socket.societyId}`).emit(SOCKET_EVENTS.VISITOR_REJECTED, data);
    });

    // ── Disconnect ────────────────────────────
    socket.on('disconnect', (reason) => {
      logger.debug(`Socket disconnected: ${socket.userId} (${reason})`);
    });
  });

  logger.info('Socket.IO initialized');
};

export default initializeSocket;
