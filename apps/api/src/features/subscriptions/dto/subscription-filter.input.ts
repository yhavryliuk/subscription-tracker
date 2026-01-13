import { InputType, Field } from '@nestjs/graphql';
import { Period, Status } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

@InputType()
export class SubscriptionFilterInput {
  @Field(() => Status, { nullable: true })
  @IsEnum(Status)
  @IsOptional()
  status?: Status;

  @Field(() => Period, { nullable: true })
  @IsEnum(Period)
  @IsOptional()
  period?: Period;
}
