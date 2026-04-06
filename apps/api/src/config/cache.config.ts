import { registerAs } from '@nestjs/config';

export type CacheConfig = {
  redisUrl?: string;
  ttlMs: number;
  namespace: string;
  keyPrefix: string;
  connectionTimeoutMs: number;
};

export default registerAs<CacheConfig>('cache', () => ({
  redisUrl: process.env.REDIS_URL,
  ttlMs: parseInt(process.env.CACHE_TTL_MS || '60000', 10),
  namespace: process.env.CACHE_NAMESPACE || 'api-cache',
  keyPrefix: process.env.CACHE_KEY_PREFIX || 'st',
  connectionTimeoutMs: parseInt(
    process.env.REDIS_CONNECTION_TIMEOUT_MS || '2000',
    10,
  ),
}));
