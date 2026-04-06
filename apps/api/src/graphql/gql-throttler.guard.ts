import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Request } from 'express';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ExecutionContext } from '@nestjs/common';

/**
 * Custom throttler guard for GraphQL API
 * Handles rate limiting for both authenticated and anonymous requests
 */
@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
  /**
   * Extract request and response from GraphQL context
   */
  getRequestResponse(context: ExecutionContext): {
    req: Request;
    res: any;
  } {
    const gqlContext = GqlExecutionContext.create(context);
    const { req, res } = gqlContext.getContext();
    return { req, res };
  }

  /**
   * Get tracker key for rate limiting
   * Uses user ID for authenticated requests, IP for anonymous
   */
  protected async getTracker(req: Request): Promise<string> {
    // Use userId if user is authenticated
    if ((req as any).user?.id) {
      return `user:${(req as any).user.id}`;
    }
    // Otherwise use IP address for anonymous requests
    return req.ip || 'unknown';
  }

  /**
   * Generate unique key for throttler instance
   */
  protected getKey(
    context: ExecutionContext,
    limit: number,
    tracker: string,
    throttlerInstanceName?: string,
  ): string {
    // Add throttler name to key for different configurations
    return `${tracker}:${throttlerInstanceName || 'default'}`;
  }
}
