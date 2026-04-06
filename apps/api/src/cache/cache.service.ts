import { createHash } from 'crypto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import type { Cache } from 'cache-manager';
import { CACHE_CONFIG, type CacheConfig } from '@app/config';

type GraphqlCacheKeyInput = {
  type: string;
  field: string;
  args?: unknown;
  userId?: string;
};

@Injectable()
export class AppCacheService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    @Inject(CACHE_CONFIG.KEY) private readonly config: CacheConfig,
  ) {}

  async get<T>(key: string): Promise<T | null> {
    const value = await this.cache.get<T>(key);
    return value ?? null;
  }

  async set<T>(key: string, value: T, ttlMs?: number): Promise<void> {
    await this.cache.set(key, value, ttlMs);
  }

  async delete(key: string): Promise<void> {
    await this.cache.del(key);
  }

  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttlMs?: number,
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const freshValue = await factory();
    await this.set(key, freshValue, ttlMs);
    return freshValue;
  }

  buildKey(...parts: Array<string | number>): string {
    return [this.config.keyPrefix, ...parts.map(String)].join(':');
  }

  buildGraphqlKey(input: GraphqlCacheKeyInput): string {
    const scope = input.userId ? `u:${input.userId}` : 'public';
    const payload = AppCacheService.stableStringify(input.args ?? {});
    const hash = createHash('sha1').update(payload).digest('hex');

    return this.buildKey('gql', input.type, input.field, scope, hash);
  }

  private static stableStringify(value: unknown): string {
    if (value === null || typeof value !== 'object') {
      return JSON.stringify(value);
    }

    if (Array.isArray(value)) {
      return `[${value.map((item) => this.stableStringify(item)).join(',')}]`;
    }

    const objectValue = value as Record<string, unknown>;
    const keys = Object.keys(objectValue).sort();
    const body = keys
      .map(
        (key) =>
          `${JSON.stringify(key)}:${this.stableStringify(objectValue[key])}`,
      )
      .join(',');
    return `{${body}}`;
  }
}
