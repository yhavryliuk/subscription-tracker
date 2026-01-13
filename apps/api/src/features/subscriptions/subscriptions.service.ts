import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { Subscription } from '@prisma/client';
import { PaginationInput } from './dto/pagination.input';
import { SubscriptionFilterInput } from './dto/subscription-filter.input';
import { CreateSubscriptionInput } from './dto/create-subscription.input';

@Injectable()
export class SubscriptionService {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(
    pagination: PaginationInput,
    filter?: SubscriptionFilterInput,
  ) {
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
  }

  async getByUser(userId: string) {
    return this.prisma.subscription.findMany({
      where: { userId },
    });
  }

  async create(
    input: CreateSubscriptionInput,
    userId: string,
  ): Promise<Subscription> {
    return this.prisma.subscription.create({
      data: {
        ...input,
        user: { connect: { id: userId } }, // привязываем к текущему пользователю
      },
    });
  }

  async findAllByUser(userId: string) {
    return this.prisma.subscription.findMany({
      where: { userId },
    });
  }
}
