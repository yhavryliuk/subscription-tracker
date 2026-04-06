import { Injectable } from '@nestjs/common';
import { AppCacheService } from '@app/cache';
import { PrismaService } from '@app/prisma';
import { Subscription } from '@prisma/client';
import { PaginationInput } from './dto/pagination.input';
import { SubscriptionFilterInput } from './dto/subscription-filter.input';
import { CreateSubscriptionInput } from './dto/create-subscription.input';

@Injectable()
export class SubscriptionService {
  private static readonly QUERY_CACHE_TTL_MS = 30_000;
  private static readonly VERSION_TTL_MS = 86_400_000;

  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: AppCacheService,
  ) {}

  async findMany(
    pagination: PaginationInput,
    filter?: SubscriptionFilterInput,
  ) {
    const globalVersion = await this.getVersion('all');
    const cacheKey = this.cache.buildGraphqlKey({
      type: 'Query',
      field: 'subscriptions',
      args: { pagination, filter, version: globalVersion },
    });

    return this.cache.getOrSet(
      cacheKey,
      async () => {
        const where = {
          ...(filter?.status && { status: filter.status }),
          ...(filter?.period && { period: filter.period }),
        };

        const [items, total] = await this.prisma.$transaction([
          this.prisma.subscription.findMany({
            where,
            skip: pagination.offset,
            take: pagination.limit,
            orderBy: { createdAt: 'desc' },
          }),
          this.prisma.subscription.count({ where }),
        ]);

        return { items, total };
      },
      SubscriptionService.QUERY_CACHE_TTL_MS,
    );
  }

  async getByUser(userId: string) {
    const userVersion = await this.getVersion(`user:${userId}`);
    const cacheKey = this.cache.buildGraphqlKey({
      type: 'Query',
      field: 'subscriptionsByUser',
      userId,
      args: { userId, version: userVersion },
    });

    return this.cache.getOrSet(
      cacheKey,
      () =>
        this.prisma.subscription.findMany({
          where: { userId },
        }),
      SubscriptionService.QUERY_CACHE_TTL_MS,
    );
  }

  async create(
    input: CreateSubscriptionInput,
    userId: string,
  ): Promise<Subscription> {
    const created = await this.prisma.subscription.create({
      data: {
        ...input,
        user: { connect: { id: userId } },
      },
    });

    await this.invalidateSubscriptionsCache(userId);
    return created;
  }

  async findAllByUser(userId: string) {
    const userVersion = await this.getVersion(`user:${userId}`);
    const cacheKey = this.cache.buildGraphqlKey({
      type: 'Query',
      field: 'mySubscriptions',
      userId,
      args: { userId, version: userVersion },
    });

    return this.cache.getOrSet(
      cacheKey,
      () =>
        this.prisma.subscription.findMany({
          where: { userId },
        }),
      SubscriptionService.QUERY_CACHE_TTL_MS,
    );
  }

  private async invalidateSubscriptionsCache(userId: string): Promise<void> {
    const currentVersion = Date.now();
    await Promise.all([
      this.cache.set(
        this.buildVersionKey('all'),
        currentVersion,
        SubscriptionService.VERSION_TTL_MS,
      ),
      this.cache.set(
        this.buildVersionKey(`user:${userId}`),
        currentVersion,
        SubscriptionService.VERSION_TTL_MS,
      ),
    ]);
  }

  private async getVersion(scope: string): Promise<number> {
    const version = await this.cache.get<number>(this.buildVersionKey(scope));
    return version ?? 0;
  }

  private buildVersionKey(scope: string): string {
    return this.cache.buildKey('version', 'subscriptions', scope);
  }
}
