import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UserGQL } from './user.model';
import { CreateUserInput } from './dto/create-user.input';
import { SubscriptionService } from '../subscriptions/subscriptions.service';
import { SubscriptionGQL } from '../subscriptions/subscription.model';

@Resolver(() => UserGQL)
export class UsersResolver {
  constructor(
    private readonly service: UsersService,
    private readonly subscriptionsService: SubscriptionService,
  ) {}

  @Query(() => [UserGQL])
  async users() {
    return this.service.findAll();
  }

  @Query(() => UserGQL, { nullable: true })
  async user(@Args('id') id: string) {
    return this.service.findOne(id);
  }

  @Mutation(() => UserGQL)
  createUser(@Args('input') input: CreateUserInput) {
    return this.service.create(input.email, input.name);
  }

  @ResolveField(() => [SubscriptionGQL])
  subscriptions(@Parent() user: UserGQL) {
    return this.subscriptionsService.getByUser(user.id);
  }
}
