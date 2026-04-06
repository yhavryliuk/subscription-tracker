import { Injectable, Inject } from '@nestjs/common';
import {
  ThrottlerModuleOptions,
  ThrottlerOptionsFactory,
} from '@nestjs/throttler';
import throttlerConfig, { type ThrottlerConfig } from './throttler-config';

/**
 * Throttler configuration service implementing ThrottlerOptionsFactory
 * Provides rate limiting configuration from environment variables
 *
 * Environment variables:
 * - RATE_LIMIT_SHORT_TTL (default: 1000 ms)
 * - RATE_LIMIT_SHORT_LIMIT (default: 20 requests)
 * - RATE_LIMIT_LONG_TTL (default: 60000 ms)
 * - RATE_LIMIT_LONG_LIMIT (default: 300 requests)
 * - RATE_LIMIT_AUTH_TTL (default: 60000 ms)
 * - RATE_LIMIT_AUTH_LIMIT (default: 5 attempts)
 *
 * Strategy:
 * - Authenticated users: tracked by user ID (softer limits)
 * - Unauthenticated: tracked by IP address (stricter limits)
 */
@Injectable()
export class ThrottlerConfigService implements ThrottlerOptionsFactory {
  constructor(
    @Inject(throttlerConfig.KEY) private config: ThrottlerConfig,
  ) {}

  createThrottlerOptions(): ThrottlerModuleOptions {
    return [
      {
        name: 'short',
        ttl: this.config.short.ttl,
        limit: this.config.short.limit,
      },
      {
        name: 'long',
        ttl: this.config.long.ttl,
        limit: this.config.long.limit,
      },
      {
        name: 'auth',
        ttl: this.config.auth.ttl,
        limit: this.config.auth.limit,
      },
    ];
  }
}
