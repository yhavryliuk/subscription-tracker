import { registerAs } from '@nestjs/config';

export type JwtConfig = {
  accessSecret: string;
  refreshSecret: string;
  accessTtlSec: number;
  refreshTtlSec: number;
};

export default registerAs<JwtConfig>('jwt', () => ({
  accessSecret: process.env.JWT_ACCESS_SECRET!,
  refreshSecret: process.env.JWT_REFRESH_SECRET!,
  accessTtlSec: 900,
  refreshTtlSec: 604800,
}));
