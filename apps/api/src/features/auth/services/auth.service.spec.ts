import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '@app/features/users';
import { PrismaService } from '@app/prisma';
import { JWT_CONFIG } from '@app/config';
import type { User, Session } from '@prisma/client';

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

import * as bcrypt from 'bcryptjs';
const mockBcrypt = jest.mocked(bcrypt);

const jwtConfigMock = {
  accessSecret: 'access-secret',
  refreshSecret: 'refresh-secret',
  accessTtlSec: 900,
  refreshTtlSec: 604800,
};

const mockUser: User = {
  id: 'user-1',
  email: 'test@example.com',
  name: 'Test User',
  passwordHash: 'hashed-password',
};

const mockSession: Session = {
  id: 'session-1',
  userId: 'user-1',
  refreshTokenHash: 'hashed-refresh-token',
  userAgent: 'jest',
  ip: '127.0.0.1',
  device: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  lastUsedAt: new Date(),
  revokedAt: null,
};

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: jest.Mocked<JwtService>;
  let usersService: jest.Mocked<UsersService>;
  let prisma: {
    session: {
      create: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
      updateMany: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      session: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JWT_CONFIG.KEY,
          useValue: jwtConfigMock,
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
            verifyAsync: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
            hashPassword: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get(JwtService);
    usersService = module.get(UsersService);
  });

  describe('login', () => {
    it('returns tokens on valid credentials', async () => {
      mockBcrypt.compare.mockResolvedValue(true as never);
      mockBcrypt.hash.mockResolvedValue('hashed-rt' as never);

      usersService.findByEmail.mockResolvedValue(mockUser);
      prisma.session.create.mockResolvedValue(mockSession);
      prisma.session.update.mockResolvedValue({
        ...mockSession,
        refreshTokenHash: 'hashed-rt',
      });

      jwtService.signAsync
        .mockResolvedValueOnce('access-token')
        .mockResolvedValueOnce('refresh-token');

      const result = await service.login(
        { email: 'test@example.com', password: 'password123' },
        { userAgent: 'jest', ip: '127.0.0.1' },
      );

      expect(result.accessToken).toBe('access-token');
      expect(result.refreshToken).toBe('refresh-token');
      expect(prisma.session.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ userId: mockUser.id }) }),
      );
    });

    it('throws UnauthorizedException on invalid password', async () => {
      mockBcrypt.compare.mockResolvedValue(false as never);
      usersService.findByEmail.mockResolvedValue(mockUser);

      await expect(
        service.login({ email: 'test@example.com', password: 'wrong' }, {}),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when user not found', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      await expect(
        service.login({ email: 'no@example.com', password: 'password123' }, {}),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    const mockCtx = {
      req: { headers: { 'user-agent': 'jest' }, ip: '127.0.0.1' },
    } as any;

    it('creates user and returns tokens', async () => {
      mockBcrypt.hash.mockResolvedValue('hashed-rt' as never);

      usersService.findByEmail.mockResolvedValue(null);
      usersService.hashPassword.mockResolvedValue('hashed-pw');
      usersService.create.mockResolvedValue(mockUser);
      prisma.session.create.mockResolvedValue(mockSession);
      prisma.session.update.mockResolvedValue({
        ...mockSession,
        refreshTokenHash: 'hashed-rt',
      });

      jwtService.signAsync
        .mockResolvedValueOnce('access-token')
        .mockResolvedValueOnce('refresh-token');

      const result = await service.register(
        { email: 'test@example.com', password: 'password123', name: 'Test' },
        mockCtx,
      );

      expect(result.user).toEqual(mockUser);
      expect(result.accessToken).toBe('access-token');
      expect(result.refreshToken).toBe('refresh-token');
      expect(usersService.create).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'test@example.com' }),
      );
    });

    it('throws ConflictException when user already exists', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);

      await expect(
        service.register(
          { email: 'test@example.com', password: 'password123', name: 'Test' },
          mockCtx,
        ),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('refreshTokens', () => {
    it('returns new tokens on valid refresh token', async () => {
      mockBcrypt.compare.mockResolvedValue(true as never);
      mockBcrypt.hash.mockResolvedValue('new-hash' as never);

      jwtService.verifyAsync.mockResolvedValue({
        sub: 'user-1',
        email: 'test@example.com',
        sessionId: 'session-1',
      });
      prisma.session.findUnique.mockResolvedValue(mockSession);
      prisma.session.update.mockResolvedValue({
        ...mockSession,
        refreshTokenHash: 'new-hash',
      });

      jwtService.signAsync
        .mockResolvedValueOnce('new-access')
        .mockResolvedValueOnce('new-refresh');

      const result = await service.refreshTokens('old-refresh-token');

      expect(result.accessToken).toBe('new-access');
      expect(result.refreshToken).toBe('new-refresh');
    });

    it('throws UnauthorizedException when session not found', async () => {
      jwtService.verifyAsync.mockResolvedValue({
        sub: 'user-1',
        email: 'test@example.com',
        sessionId: 'session-1',
      });
      prisma.session.findUnique.mockResolvedValue(null);

      await expect(service.refreshTokens('token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('throws UnauthorizedException when session is revoked', async () => {
      jwtService.verifyAsync.mockResolvedValue({
        sub: 'user-1',
        email: 'test@example.com',
        sessionId: 'session-1',
      });
      prisma.session.findUnique.mockResolvedValue({
        ...mockSession,
        revokedAt: new Date(Date.now() - 1000),
      });

      await expect(service.refreshTokens('token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('throws UnauthorizedException when refresh token hash does not match', async () => {
      mockBcrypt.compare.mockResolvedValue(false as never);

      jwtService.verifyAsync.mockResolvedValue({
        sub: 'user-1',
        email: 'test@example.com',
        sessionId: 'session-1',
      });
      prisma.session.findUnique.mockResolvedValue(mockSession);

      await expect(service.refreshTokens('wrong-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('logout', () => {
    it('revokes session', async () => {
      prisma.session.update.mockResolvedValue({ ...mockSession, revokedAt: new Date() });

      await service.logout('session-1');

      expect(prisma.session.update).toHaveBeenCalledWith({
        where: { id: 'session-1' },
        data: { revokedAt: expect.any(Date) },
      });
    });
  });

  describe('logoutAll', () => {
    it('revokes all active sessions for user', async () => {
      prisma.session.updateMany.mockResolvedValue({ count: 2 });

      await service.logoutAll('user-1');

      expect(prisma.session.updateMany).toHaveBeenCalledWith({
        where: { userId: 'user-1', revokedAt: null },
        data: { revokedAt: expect.any(Date) },
      });
    });
  });
});
