import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { SubscriptionService } from './subscriptions.service';
import { SubscriptionGQL } from './subscription.model';
import { CreateSubscriptionInput } from './dto/create-subscription.input';
import { SubscriptionConnection } from './dto/subscription-connection.model';
import { PaginationInput } from './dto/pagination.input';
import { SubscriptionFilterInput } from './dto/subscription-filter.input';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { GqlAuthGuard } from '@app/features/auth/guards';
import type { GqlUser } from '@app/features/auth/types';

@Resolver(() => SubscriptionGQL)
export class SubscriptionResolver {
  constructor(private readonly service: SubscriptionService) {}

  @Query(() => SubscriptionConnection)
  subscriptions(
    @Args('pagination', { nullable: true })
    pagination?: PaginationInput,

    @Args('filter', { nullable: true })
    filter?: SubscriptionFilterInput,
  ) {
    return this.service.findMany(
      pagination ?? { limit: 10, offset: 0 },
      filter,
    );
  }

  @Query(() => [SubscriptionGQL])
  subscriptionsByUser(@Args('userId') userId: string) {
    return this.service.getByUser(userId);
  }

  @Query(() => [SubscriptionGQL])
  @UseGuards(GqlAuthGuard)
  async mySubscriptions(@CurrentUser() user: GqlUser) {
    return this.service.findAllByUser(user.id);
  }

  @Mutation(() => SubscriptionGQL)
  @UseGuards(GqlAuthGuard)
  async addSubscription(
    @Args('input') input: CreateSubscriptionInput,
    @CurrentUser() user: GqlUser,
  ) {
    return this.service.create(input, user.id);
  }
}
