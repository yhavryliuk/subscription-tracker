import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
  Context,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UserGQL } from './user.model';
import { CreateUserInput } from './dto/create-user.input';
import { SubscriptionService } from '../subscriptions/subscriptions.service';
import { SubscriptionGQL } from '../subscriptions/subscription.model';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@app/features/auth/guards';
import type { GqlContext } from '@app/graphql';

@Resolver(() => UserGQL)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly subscriptionsService: SubscriptionService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [UserGQL])
  async users(@Context() ctx: GqlContext) {
    //console.log('ctx.req.cookies', ctx.req.cookies, ctx.req.headers['authorization']);
    return this.usersService.findAll();
  }

  @Query(() => UserGQL, { nullable: true })
  async user(@Args('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Mutation(() => UserGQL)
  async createUser(@Args('input') { password, ...restInput }: CreateUserInput) {
    return this.usersService.create({
      ...restInput,
      passwordHash: await this.usersService.hashPassword(password),
    });
  }

  @ResolveField(() => [SubscriptionGQL])
  subscriptions(@Parent() user: UserGQL) {
    return this.subscriptionsService.getByUser(user.id);
  }
}
