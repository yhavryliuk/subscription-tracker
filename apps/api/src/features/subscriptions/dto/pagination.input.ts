import { InputType, Field, Int } from '@nestjs/graphql';
import { Min, Max } from 'class-validator';

@InputType()
export class PaginationInput {
  @Field(() => Int, { defaultValue: 10 })
  @Min(1)
  @Max(50)
  limit: number = 10;

  @Field(() => Int, { defaultValue: 0 })
  @Min(0)
  offset: number = 0;
}
