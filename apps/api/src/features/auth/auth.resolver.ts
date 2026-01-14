import { randomUUID } from 'crypto';
import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { type GqlContext } from '@app/graphql';
import { UsersService, UserGQL } from '@app/features/users';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { AuthService, SessionsService } from './services';
import type { GqlUser, JwtPayload } from './types';
import { CurrentUser } from './current-user.decorator';
import { CsrfGuard } from './guards';
import { SessionGQL } from '@app/features/auth/model';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly sessionsService: SessionsService,
    private readonly usersService: UsersService,
  ) {}

  @Mutation(() => Boolean)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
    @Context() ctx: GqlContext,
  ) {
    const { accessToken, refreshToken } = await this.authService.login(
      email,
      password,
      ctx,
    );

    // refreshToken httpOnly cookie
    ctx.res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/graphql',
    });

    ctx.res.setHeader('Authorization', `Bearer ${accessToken}`);

    const csrfToken = randomUUID();
    ctx.res.cookie('csrfToken', csrfToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

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
    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard, CsrfGuard)
  async logout(@CurrentUser() user: GqlUser, @Context() ctx: GqlContext) {
    await this.authService.logout(user.sessionId);

    ctx.res.clearCookie('refreshToken', { path: '/graphql' });
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
