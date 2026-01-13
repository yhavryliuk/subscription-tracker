import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '@app/features/users';
import { JwtStrategy } from './jwt.strategy';
import { AuthService, SessionsService } from './services';
import { AuthResolver } from './auth.resolver';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JWT_CONFIG, JwtConfig } from '@app/config';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ConfigModule.forFeature(JWT_CONFIG),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const jwtConfig = config.get<JwtConfig>('jwt')!;
        return {
          secret: jwtConfig.accessSecret,
          signOptions: {
            expiresIn: jwtConfig.accessTtlSec,
          },
        };
      },
    }),
  ],
  providers: [AuthService, SessionsService, JwtStrategy, AuthResolver],
  exports: [AuthService],
})
export class AuthModule {}
