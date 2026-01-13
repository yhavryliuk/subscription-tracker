import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GqlContext } from '@app/graphql';

@Injectable()
export class CsrfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context).getContext<GqlContext>();

    const csrfHeader = ctx.req.headers['x-csrf-token'];
    const csrfCookie = (
      ctx.req.cookies as {
        csrfToken?: string;
      }
    )['csrfToken'];

    if (!csrfHeader || !csrfCookie) {
      throw new ForbiddenException('CSRF token missing');
    }

    if (csrfHeader !== csrfCookie) {
      throw new ForbiddenException('Invalid CSRF token');
    }

    return true;
  }
}
