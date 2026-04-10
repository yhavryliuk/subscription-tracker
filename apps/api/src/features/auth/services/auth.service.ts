import * as bcrypt from 'bcryptjs';
import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@app/features/users';
import { User } from '@prisma/client';
import { JwtPayload } from '@app/features/auth/types';
import { type ConfigType } from '@nestjs/config';
import { JWT_CONFIG } from '@app/config';
import { PrismaService } from '@app/prisma';
import { GqlContext } from '@app/graphql';
import { LoginInput, RegisterInput } from '@app/features/auth/dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(JWT_CONFIG.KEY)
    private jwtConfig: ConfigType<typeof JWT_CONFIG>,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  private createAccessToken(payload: JwtPayload) {
    return this.jwtService.signAsync(payload);
  }

  private async updateRefreshToken(payload: JwtPayload) {
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.jwtConfig.refreshSecret,
      expiresIn: '7d', // TODO: replace from config
    });

    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

    await this.prisma.session.update({
      where: { id: payload.sessionId },
      data: { refreshTokenHash },
    });

    return refreshToken;
  }

  private async generateTokens(payload: JwtPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.createAccessToken(payload),
      this.updateRefreshToken(payload),
    ]);

    return { accessToken, refreshToken };
  }

  private async getRefreshTokenPayload(
    refreshToken: string,
  ): Promise<JwtPayload> {
    return this.jwtService.verifyAsync<JwtPayload>(refreshToken);
  }

  async login(
    input: LoginInput,
    meta: {
      userAgent?: string;
      ip?: string;
    },
  ) {
    const user = await this.validateLoginCredentials(
      input.email,
      input.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const session = await this.prisma.session.create({
      data: {
        userId: user.id,
        refreshTokenHash: 'temp',
        ...meta,
      },
    });

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      sessionId: session.id,
    };

    return this.generateTokens(payload);
  }

  async refreshTokens(refreshToken: string) {
    const {
      sub: userId,
      email,
      sessionId,
    } = await this.getRefreshTokenPayload(refreshToken);

    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session || (session.revokedAt && session.revokedAt <= new Date())) {
      throw new UnauthorizedException();
    }

    const isValid = await bcrypt.compare(
      refreshToken,
      session.refreshTokenHash,
    );

    if (!isValid) throw new UnauthorizedException();

    return this.generateTokens({
      sub: userId,
      email: email,
      sessionId: session.id,
    });
  }

  async logout(sessionId: string) {
    await this.prisma.session.update({
      where: { id: sessionId },
      data: { revokedAt: new Date() },
    });
  }

  /**
   * Revokes a session identified by its refresh token.
   * Used for logout flows where no access token is available.
   * Silently ignores invalid / expired tokens.
   */
  async revokeRefreshToken(refreshToken: string): Promise<void> {
    try {
      const { sessionId } = await this.getRefreshTokenPayload(refreshToken);
      await this.logout(sessionId);
    } catch {
      // Token invalid or already expired — nothing to revoke
    }
  }

  async logoutAll(userId: string) {
    await this.prisma.session.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  private async validateLoginCredentials(
    email: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) return null;

    return user;
  }

  async register(input: RegisterInput, ctx: GqlContext) {
    const existing = await this.usersService.findByEmail(input.email);
    if (existing) {
      throw new ConflictException('User already exists');
    }

    const passwordHash = await this.usersService.hashPassword(input.password);

    const user = await this.usersService.create({
      email: input.email,
      name: input.name,
      passwordHash,
    });

    const session = await this.prisma.session.create({
      data: {
        userId: user.id,
        refreshTokenHash: 'temp',
        userAgent: ctx.req.headers['user-agent'],
        ip: ctx.req.ip,
      },
    });

    const { accessToken, refreshToken } = await this.generateTokens({
      sub: user.id,
      email: user.email,
      sessionId: session.id,
    });

    return { user, session, accessToken, refreshToken };
  }
}
