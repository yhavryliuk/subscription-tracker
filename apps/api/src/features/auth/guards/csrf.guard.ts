import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GqlContext } from '@app/graphql';
import { CSRF_HEADERS_KEY } from '@libs/constants/headers-keys';
import { CSRF_TOKEN } from '@libs/constants/cookies-keys';

@Injectable()
export class CsrfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context).getContext<GqlContext>();

    const csrfHeader = ctx.req.headers[CSRF_HEADERS_KEY];
    const csrfCookie = (
      ctx.req.cookies as {
        [CSRF_TOKEN]?: string;
      }
    )[CSRF_TOKEN];

    if (!csrfHeader || !csrfCookie) {
      throw new ForbiddenException('CSRF token missing');
    }

    if (csrfHeader !== csrfCookie) {
      throw new ForbiddenException('Invalid CSRF token');
    }

    return true;
  }
}
