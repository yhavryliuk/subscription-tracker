import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { JWT_CONFIG } from '@app/config';
import type { JwtPayload } from './types';

const jwtConfigMock = {
  accessSecret: 'access-secret',
  refreshSecret: 'refresh-secret',
  accessTtlSec: 900,
  refreshTtlSec: 604800,
};

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: JWT_CONFIG.KEY, useValue: jwtConfigMock },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  describe('validate', () => {
    it('maps JWT payload to GqlUser', async () => {
      const payload: JwtPayload = {
        sub: 'user-1',
        email: 'test@example.com',
        sessionId: 'session-1',
      };

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        id: 'user-1',
        email: 'test@example.com',
        sessionId: 'session-1',
      });
    });
  });
});
