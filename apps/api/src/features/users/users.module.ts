import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { PrismaModule } from '@app/prisma';
import { SubscriptionsModule } from '@app/features/subscriptions';

@Module({
  imports: [PrismaModule, SubscriptionsModule],
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}
