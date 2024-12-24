import Redis from 'ioredis';
import { AppError } from '../lib/appError';
import logger from './logger';

const redisPort: number | undefined= process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : undefined;
if (!redisPort)
  throw new AppError(
    "Internal server error",
    500,
    "Redis port env var not found",
    false
  );

const redisHost: string | undefined = process.env.REDIS_HOST;
if (!redisHost)
  throw new AppError(
    "Internal server error",
    500,
    "Redis host env var not found",
    false
  );

const redis = new Redis({
  host: redisHost,
  port: redisPort,
});

// event listeners for connection success and failure
redis.on('connect', () => {
  logger.info(`Redis connected successfully to ${redisHost}:${redisPort}`);
});

redis.on('error', (err) => {
  logger.fatal(`Redis connection failed: ${err.message}`);
});

export default redis;