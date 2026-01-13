import { InputType, Field, Float } from '@nestjs/graphql';
import { Period, Status } from '@prisma/client';

@InputType()
export class CreateSubscriptionInput {
  @Field()
  name: string;

  @Field(() => Float)
  amount: number;

  @Field(() => Period)
  period: Period;

  @Field(() => Status)
  status: Status;
}
