import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './services/auth.service';
import { SessionsService } from './services/sessions.service';
import { UsersService } from '@app/features/users';
import type { GqlContext } from '@app/graphql';

const mockUser = {
  id: 'user-1',
  email: 'test@example.com',
  name: 'Test',
  sessionId: 'session-1',
};

const makeMockCtx = (overrides: Record<string, any> = {}): GqlContext =>
  ({
    req: {
      headers: { 'user-agent': 'jest', 'x-csrf-token': 'csrf-token' },
      cookies: { refreshToken: 'old-refresh', csrfToken: 'csrf-token' },
      ip: '127.0.0.1',
      ...overrides.req,
    },
    res: {
      cookie: jest.fn(),
      clearCookie: jest.fn(),
      setHeader: jest.fn(),
      ...overrides.res,
    },
    ...overrides,
  }) as unknown as GqlContext;

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  let authService: jest.Mocked<AuthService>;
  let sessionsService: jest.Mocked<SessionsService>;
  let usersService: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            register: jest.fn(),
            logout: jest.fn(),
            refreshTokens: jest.fn(),
          },
        },
        {
          provide: SessionsService,
          useValue: {
            findUserSessions: jest.fn(),
            revokeSession: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
    authService = module.get(AuthService);
    sessionsService = module.get(SessionsService);
    usersService = module.get(UsersService);
  });

  describe('login', () => {
    it('sets cookies and returns true on success', async () => {
      authService.login.mockResolvedValue({
        accessToken: 'access',
        refreshToken: 'refresh',
      });
      const ctx = makeMockCtx();

      const result = await resolver.login(
        { email: 'test@example.com', password: 'password123' },
        ctx,
      );

      expect(result).toBe(true);
      expect(ctx.res.cookie).toHaveBeenCalledWith(
        'refreshToken',
        'refresh',
        expect.objectContaining({ httpOnly: true }),
      );
      expect(ctx.res.setHeader).toHaveBeenCalledWith(
        'Authorization',
        'Bearer access',
      );
    });
  });

  describe('register', () => {
    it('sets cookies and returns true on success', async () => {
      authService.register.mockResolvedValue({
        user: mockUser as any,
        session: {} as any,
        accessToken: 'access',
        refreshToken: 'refresh',
      });
      const ctx = makeMockCtx();

      const result = await resolver.register(
        { email: 'test@example.com', password: 'password123', name: 'Test' },
        ctx,
      );

      expect(result).toBe(true);
      expect(ctx.res.cookie).toHaveBeenCalledWith(
        'refreshToken',
        'refresh',
        expect.objectContaining({ httpOnly: true }),
      );
      expect(ctx.res.setHeader).toHaveBeenCalledWith(
        'Authorization',
        'Bearer access',
      );
    });
  });

  describe('refresh', () => {
    it('returns true and updates cookies on success', async () => {
      authService.refreshTokens.mockResolvedValue({
        accessToken: 'new-access',
        refreshToken: 'new-refresh',
      });
      const ctx = makeMockCtx();

      const result = await resolver.refresh(ctx);

      expect(result).toBe(true);
      expect(authService.refreshTokens).toHaveBeenCalledWith('old-refresh');
      expect(ctx.res.cookie).toHaveBeenCalledWith(
        'refreshToken',
        'new-refresh',
        expect.objectContaining({ httpOnly: true }),
      );
    });

    it('throws UnauthorizedException when refresh token cookie is missing', async () => {
      const ctx = makeMockCtx({ req: { cookies: {} } });

      await expect(resolver.refresh(ctx)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('calls logout and clears cookie', async () => {
      authService.logout.mockResolvedValue(undefined);
      const ctx = makeMockCtx();

      const result = await resolver.logout(mockUser as any, ctx);

      expect(result).toBe(true);
      expect(authService.logout).toHaveBeenCalledWith('session-1');
      expect(ctx.res.clearCookie).toHaveBeenCalledWith('refreshToken', {
        path: '/graphql',
      });
    });
  });

  describe('me', () => {
    it('returns user from usersService', async () => {
      usersService.findById.mockResolvedValue(mockUser as any);

      const result = await resolver.me(mockUser as any);

      expect(result).toEqual(mockUser);
      expect(usersService.findById).toHaveBeenCalledWith(mockUser.id);
    });
  });

  describe('mySessions', () => {
    it('returns sessions for current user', async () => {
      const sessions = [{ id: 'session-1', isCurrent: true }];
      sessionsService.findUserSessions.mockResolvedValue(sessions as any);
      const ctx = makeMockCtx();

      const result = await resolver.mySessions(ctx, {
        sub: 'user-1',
        email: 'test@example.com',
        sessionId: 'session-1',
      });

      expect(result).toEqual(sessions);
      expect(sessionsService.findUserSessions).toHaveBeenCalledWith(
        'user-1',
        'old-refresh',
      );
    });
  });

  describe('revokeSession', () => {
    it('delegates to sessions service', async () => {
      sessionsService.revokeSession.mockResolvedValue(true);

      const result = await resolver.revokeSession('session-1');

      expect(result).toBe(true);
      expect(sessionsService.revokeSession).toHaveBeenCalledWith('session-1');
    });
  });
});
