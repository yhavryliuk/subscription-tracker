import { registerAs } from '@nestjs/config';

export type ThrottlerConfig = {
  short: {
    ttl: number;
    limit: number;
  };
  long: {
    ttl: number;
    limit: number;
  };
  auth: {
    ttl: number;
    limit: number;
  };
};

export default registerAs<ThrottlerConfig>('throttler', () => ({
  short: {
    ttl: parseInt(process.env.RATE_LIMIT_SHORT_TTL || '1000'),
    limit: parseInt(process.env.RATE_LIMIT_SHORT_LIMIT || '20'),
  },
  long: {
    ttl: parseInt(process.env.RATE_LIMIT_LONG_TTL || '60000'),
    limit: parseInt(process.env.RATE_LIMIT_LONG_LIMIT || '300'),
  },
  auth: {
    ttl: parseInt(process.env.RATE_LIMIT_AUTH_TTL || '60000'),
    limit: parseInt(process.env.RATE_LIMIT_AUTH_LIMIT || '5'),
  },
}));
