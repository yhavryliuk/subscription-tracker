import {
  ObjectType,
  Field,
  ID,
  Float,
  registerEnumType,
} from '@nestjs/graphql';
import { Period, Status } from '@prisma/client';

registerEnumType(Period, { name: 'Period' });
registerEnumType(Status, { name: 'Status' });

@ObjectType()
export class SubscriptionGQL {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => Float)
  amount: number;

  @Field(() => Period)
  period: Period;

  @Field(() => Status)
  status: Status;

  @Field(() => ID)
  userId: string;
}
