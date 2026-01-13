import { Module } from '@nestjs/common';
import { PrismaModule } from '@app/prisma';
import { SubscriptionService } from './subscriptions.service';
import { SubscriptionResolver } from './subscriptions.resolver';

@Module({
  imports: [PrismaModule],
  providers: [SubscriptionService, SubscriptionResolver],
  exports: [SubscriptionService],
})
export class SubscriptionsModule {}
