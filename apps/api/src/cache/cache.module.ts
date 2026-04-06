import { CacheModule, CacheModuleOptions } from '@nestjs/cache-manager';
import { Global, Logger, Module } from '@nestjs/common';
import { createKeyv } from '@keyv/redis';
import type { Keyv } from 'keyv';
import { AppConfigModule, CACHE_CONFIG, type CacheConfig } from '@app/config';
import { AppCacheService } from './cache.service';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [AppConfigModule],
      inject: [CACHE_CONFIG.KEY],
      useFactory: (config: CacheConfig): CacheModuleOptions => {
        const logger = new Logger('CacheModule');
        const defaultOptions: CacheModuleOptions = {
          ttl: config.ttlMs,
        };

        if (!config.redisUrl) {
          logger.warn(
            'REDIS_URL is not set. Cache manager will use in-memory storage.',
          );
          return defaultOptions;
        }

        const redisStore = createKeyv(config.redisUrl, {
          namespace: config.namespace,
          connectionTimeout: config.connectionTimeoutMs,
          throwOnConnectError: false,
          throwOnErrors: false,
        }) as Keyv<unknown>;

        redisStore.on('error', (error: unknown) => {
          logger.error(
            `Redis cache store error: ${
              error instanceof Error ? error.message : String(error)
            }`,
          );
        });

        return {
          ...defaultOptions,
          stores: [redisStore],
        };
      },
    }),
  ],
  providers: [AppCacheService],
  exports: [CacheModule, AppCacheService],
})
export class AppCacheModule {}
