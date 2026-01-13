import { ExtractJwt, Strategy } from 'passport-jwt';
import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload, GqlUser } from './types';
import { JWT_CONFIG } from '@app/config';
import type { ConfigType } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy<any, GqlUser>(Strategy) {
  constructor(
    @Inject(JWT_CONFIG.KEY)
    jwtConfig: ConfigType<typeof JWT_CONFIG>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.accessSecret,
    });
  }

  async validate(payload: JwtPayload): Promise<GqlUser> {
    return Promise.resolve({
      id: payload.sub,
      email: payload.email,
      sessionId: payload.sessionId,
    });
  }
}
