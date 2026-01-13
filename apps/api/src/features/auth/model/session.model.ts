import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SessionGQL {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  userId: string;

  @Field(() => String, { nullable: true })
  userAgent: string | null;

  @Field(() => String, { nullable: true })
  ip: string | null;

  @Field(() => String, { nullable: true })
  device: string | null;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => Date)
  lastUsedAt: Date;

  @Field(() => Date, { nullable: true })
  revokedAt: Date | null;

  @Field(() => Boolean)
  isCurrent: boolean;
}
