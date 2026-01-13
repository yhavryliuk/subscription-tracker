import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { GqlUser } from './types';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): GqlUser => {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext<{ req: { user: GqlUser } }>().req;
    return req.user;
  },
);
