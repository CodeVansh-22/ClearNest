import mongoose from 'mongoose';
import config from './env.js';
import logger from '../utils/logger.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongo.uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}`);

    mongoose.connection.on('error', (err) => {
      logger.error(`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting reconnection...');
    });

    return conn;
  } catch (err) {
    logger.error(`MongoDB connection failed: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
