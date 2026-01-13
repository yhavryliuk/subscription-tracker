import { ObjectType, Field, ID } from '@nestjs/graphql';
import { SubscriptionGQL } from '../subscriptions/subscription.model';

@ObjectType()
export class UserGQL {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field(() => [SubscriptionGQL])
  subscriptions: SubscriptionGQL[];
}
