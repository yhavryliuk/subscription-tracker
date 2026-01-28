import { join } from 'path';
import { Request, Response } from 'express';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PrismaModule } from '@app/prisma';
import { AppConfigModule } from '@app/config';
import { UsersModule } from '@app/features/users';
import { GqlContext } from '@app/graphql';
import { SubscriptionsModule } from '@app/features/subscriptions';
import { AuthModule } from '@app/features/auth';

@Module({
  imports: [
    AppConfigModule,
    PrismaModule,
    AuthModule,
    UsersModule,
    SubscriptionsModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      graphiql: process.env.NODE_ENV !== 'production',
      /*autoSchemaFile: join(
        __dirname,
        '../../../../packages/graphql-schema/schema.gql',
      ),*/
      autoSchemaFile: join(
        process.cwd(),
        '../../packages/graphql-schema/schema.gql',
      ),
      sortSchema: true,
      context: ({ req, res }: { req: Request; res: Response }): GqlContext => ({
        req,
        res,
      }),
    }),
  ],
  controllers: [],
})
export class AppModule {}
