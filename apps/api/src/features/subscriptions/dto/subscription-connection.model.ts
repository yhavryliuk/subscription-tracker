import { ObjectType, Field, Int } from '@nestjs/graphql';
import { SubscriptionGQL } from '../subscription.model';

@ObjectType()
export class SubscriptionConnection {
  @Field(() => [SubscriptionGQL])
  items: SubscriptionGQL[];

  @Field(() => Int)
  total: number;
}
