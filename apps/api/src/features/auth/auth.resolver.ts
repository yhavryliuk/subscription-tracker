import { randomUUID } from 'crypto';
import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { type GqlContext } from '@app/graphql';
import { UsersService, UserGQL } from '@app/features/users';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { AuthService, SessionsService } from './services';
import type { GqlUser, JwtPayload } from './types';
import { CurrentUser } from './current-user.decorator';
import { CsrfGuard } from './guards';
import { SessionGQL } from '@app/features/auth/model';
import { LoginInput, RegisterInput } from '@app/features/auth/dto';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly sessionsService: SessionsService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * User login mutation
   * Rate limited: 5 attempts per minute per IP
   */
  @Throttle({ auth: { limit: 5, ttl: 60000 } })
  @Mutation(() => Boolean)
  async login(@Args('input') input: LoginInput, @Context() ctx: GqlContext) {
    const { accessToken, refreshToken } = await this.authService.login(input, {
      userAgent: ctx.req.headers['user-agent'],
      ip: ctx.req.ip,
    });

    // refreshToken httpOnly cookie
    ctx.res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/graphql',
    });

    const csrfToken = randomUUID();
    ctx.res.cookie("csrfToken", csrfToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    ctx.res.setHeader('Authorization', `Bearer ${accessToken}`);
    ctx.res.setHeader('Access-Control-Expose-Headers', 'Authorization');

    return true;
  }

  @UseGuards(CsrfGuard)
  @Mutation(() => Boolean)
  async refresh(@Context() ctx: GqlContext) {
    const cookies = ctx.req.cookies as {
      refreshToken?: string;
    };
    const refreshToken = cookies.refreshToken;
    if (!refreshToken) throw new UnauthorizedException();

    const { accessToken, refreshToken: newRefresh } =
      await this.authService.refreshTokens(refreshToken);

    ctx.res.cookie('refreshToken', newRefresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/graphql',
    });

    ctx.res.setHeader('Authorization', `Bearer ${accessToken}`);
    ctx.res.setHeader('Access-Control-Expose-Headers', 'Authorization');
    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard, CsrfGuard)
  async logout(@CurrentUser() user: GqlUser, @Context() ctx: GqlContext) {
    await this.authService.logout(user.sessionId);

    ctx.res.clearCookie('refreshToken', { path: '/graphql' });
    return true;
  }

  /**
   * User registration mutation
   * Rate limited: 5 attempts per minute per IP
   */
  @Throttle({ auth: { limit: 5, ttl: 60000 } })
  @Mutation(() => Boolean)
  async register(
    @Args('input') input: RegisterInput,
    @Context() ctx: GqlContext,
  ) {
    const { accessToken, refreshToken } = await this.authService.register(
      input,
      ctx,
    );

    // refreshToken httpOnly cookie
    ctx.res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/graphql',
    });

    const csrfToken = randomUUID();
    ctx.res.cookie("csrfToken", csrfToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    ctx.res.setHeader('Authorization', `Bearer ${accessToken}`);
    ctx.res.setHeader('Access-Control-Expose-Headers', 'Authorization');
    return true;
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [SessionGQL])
  async mySessions(
    @Context() ctx: GqlContext,
    @CurrentUser() user: JwtPayload,
  ) {
    const refreshToken = (ctx.req.cookies as { refreshToken?: string })
      ?.refreshToken;

    return this.sessionsService.findUserSessions(user.sub, refreshToken);
  }

  @Query(() => UserGQL)
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUser() user: GqlUser) {
    return this.usersService.findById(user.id);
  }

  @Mutation(() => Boolean)
  async revokeSession(@Args('sessionId') sessionId: string) {
    return this.sessionsService.revokeSession(sessionId);
  }
}
