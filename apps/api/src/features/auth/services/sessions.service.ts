import * as bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { SessionGQL } from '@app/features/auth/model';

@Injectable()
export class SessionsService {
  constructor(private prisma: PrismaService) {}

  async findUserSessions(
    userId: string,
    currentRefreshToken?: string,
  ): Promise<SessionGQL[]> {
    const sessions = await this.prisma.session.findMany({
      where: {
        userId,
        revokedAt: null,
      },
      orderBy: {
        lastUsedAt: 'desc',
      },
    });

    let currentSessionId: string | null = null;

    if (currentRefreshToken) {
      for (const session of sessions) {
        const match = await bcrypt.compare(
          currentRefreshToken,
          session.refreshTokenHash,
        );
        if (match) {
          currentSessionId = session.id;
          break;
        }
      }
    }

    return sessions.map((s) => ({
      ...s,
      isCurrent: s.id === currentSessionId,
    }));
  }

  async revokeSession(sessionId: string) {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) return false;

    await this.prisma.session.update({
      where: { id: sessionId },
      data: { revokedAt: new Date() },
    });

    return true;
  }
}
