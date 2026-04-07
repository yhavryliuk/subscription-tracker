import { Test, TestingModule } from '@nestjs/testing';

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

import * as bcrypt from 'bcryptjs';
const mockBcrypt = jest.mocked(bcrypt);
import { SessionsService } from './sessions.service';
import { PrismaService } from '@app/prisma';
import type { Session } from '@prisma/client';

const makeSession = (overrides: Partial<Session> = {}): Session => ({
  id: 'session-1',
  userId: 'user-1',
  refreshTokenHash: 'hash',
  userAgent: 'jest',
  ip: '127.0.0.1',
  device: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  lastUsedAt: new Date(),
  revokedAt: null,
  ...overrides,
});

describe('SessionsService', () => {
  let service: SessionsService;
  let prisma: {
    session: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      session: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<SessionsService>(SessionsService);
  });

  describe('findUserSessions', () => {
    it('returns sessions without marking current when no refresh token provided', async () => {
      const sessions = [makeSession({ id: 'session-1' }), makeSession({ id: 'session-2' })];
      prisma.session.findMany.mockResolvedValue(sessions);

      const result = await service.findUserSessions('user-1');

      expect(result).toHaveLength(2);
      expect(result.every((s) => s.isCurrent === false)).toBe(true);
      expect(prisma.session.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 'user-1', revokedAt: null },
        }),
      );
    });

    it('marks the matching session as current', async () => {
      const session1 = makeSession({ id: 'session-1', refreshTokenHash: 'hash-1' });
      const session2 = makeSession({ id: 'session-2', refreshTokenHash: 'hash-2' });
      prisma.session.findMany.mockResolvedValue([session1, session2]);

      mockBcrypt.compare
        .mockResolvedValueOnce(false as never) // session-1 no match
        .mockResolvedValueOnce(true as never);  // session-2 match

      const result = await service.findUserSessions('user-1', 'my-refresh-token');

      const current = result.find((s) => s.isCurrent);
      expect(current?.id).toBe('session-2');
      const nonCurrent = result.find((s) => s.id === 'session-1');
      expect(nonCurrent?.isCurrent).toBe(false);
    });
  });

  describe('revokeSession', () => {
    it('revokes existing session and returns true', async () => {
      const session = makeSession();
      prisma.session.findUnique.mockResolvedValue(session);
      prisma.session.update.mockResolvedValue({ ...session, revokedAt: new Date() });

      const result = await service.revokeSession('session-1');

      expect(result).toBe(true);
      expect(prisma.session.update).toHaveBeenCalledWith({
        where: { id: 'session-1' },
        data: { revokedAt: expect.any(Date) },
      });
    });

    it('returns false when session not found', async () => {
      prisma.session.findUnique.mockResolvedValue(null);

      const result = await service.revokeSession('non-existent');

      expect(result).toBe(false);
      expect(prisma.session.update).not.toHaveBeenCalled();
    });
  });
});
