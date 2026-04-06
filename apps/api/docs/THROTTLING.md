# Throttling Configuration

Rate limiting is configured in NestJS GraphQL API to prevent abuse.

## Architecture for GraphQL

A **custom guard** (`GqlThrottlerGuard`) is implemented to work correctly with GraphQL:

- **Authenticated users** — rate limited by `userID` (softer limits)
- **Unauthenticated requests** — rate limited by IP address (stricter limits)

This prevents DDoS attacks while not blocking legitimate users making many requests.

## Configured Limits

| Name | TTL | Limit | Usage |
|------|-----|-------|-------|
| `short` | 1 sec | 20 requests | General GraphQL queries |
| `long` | 1 min | 300 requests | General requests per minute |
| `auth` | 1 min | 5 attempts | Login/Register (per IP) |

## Usage

### Global Throttling (Default)
All resolvers automatically have rate limiting via `GqlThrottlerGuard`.

### Specific Limits on Resolvers

```typescript
import { Throttle, SkipThrottle } from '@nestjs/throttler';

@Resolver()
export class AuthResolver {
  // Stricter limit for login (5 attempts per minute per IP)
  @Throttle({ auth: { limit: 5, ttl: 60000 } })
  @Mutation()
  login(@Args('input') input: LoginInput) {
    // ...
  }

  // Skip throttling for public queries
  @SkipThrottle()
  @Query()
  getPublicData() {
    // ...
  }

  // Custom limit for specific resolver
  @Throttle({ long: { limit: 50, ttl: 60000 } })
  @Query()
  getExpensiveQuery() {
    // ...
  }
}
```

## How It Works

### GqlThrottlerGuard — Extract Context from GraphQL

```typescript
export class GqlThrottlerGuard extends ThrottlerGuard {
  getRequestResponse(context: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(context);
    return gqlContext.getContext(); // { req, res }
  }

  protected async getTracker(req: Request): Promise<string> {
    // For authenticated users: user ID
    if ((req as any).user?.id) {
      return `user:${(req as any).user.id}`;
    }
    // For anonymous requests: IP address
    return req.ip || 'unknown';
  }
}
```

## Example Error Response When Limit Exceeded

```json
{
  "errors": [
    {
      "message": "ThrottlerException: Too Many Requests",
      "extensions": {
        "code": "THROTTLED"
      }
    }
  ]
}
```

## Configuration Files

- **Guard**: `src/graphql/gql-throttler.guard.ts`
- **Config Factory**: `src/config/throttler-config.ts` (uses `registerAs()` pattern)
- **Service**: `src/config/throttler.service.ts` (implements `ThrottlerOptionsFactory`)
- **Module**: `src/config/config.module.ts` (registers config via `load: [throttlerConfigFactory]`)
- **App Setup**: `src/app.module.ts` (registered in `APP_GUARD` via `forRootAsync()`)

## Configuration Pattern

Configuration uses NestJS `registerAs()` pattern which provides type-safe access to environment variables:

```typescript
// throttler-config.ts
export default registerAs<ThrottlerConfig>('throttler', () => ({
  short: {
    ttl: parseInt(process.env.RATE_LIMIT_SHORT_TTL || '1000'),
    limit: parseInt(process.env.RATE_LIMIT_SHORT_LIMIT || '20'),
  },
  // ...
}));

// throttler.service.ts
export class ThrottlerConfigService implements ThrottlerOptionsFactory {
  constructor(@Inject(throttlerConfig.KEY) private config: ThrottlerConfig) {}

  createThrottlerOptions(): ThrottlerModuleOptions {
    return [
      { name: 'short', ttl: this.config.short.ttl, limit: this.config.short.limit },
      // ...
    ];
  }
}
```

## Tracker Key Strategy

The `GqlThrottlerGuard` generates unique tracker keys in format: `tracker:throttlerName`

This allows each throttler instance to maintain independent rate limit counters:

```typescript
protected getKey(
  context: ExecutionContext,
  limit: number,
  tracker: string,
  throttlerInstanceName?: string,
): string {
  return `${tracker}:${throttlerInstanceName || 'default'}`;
}
```

Examples:
- Authenticated user: `user:123abc:short`, `user:123abc:long`, `user:123abc:auth`
- Anonymous request: `192.168.1.1:short`, `192.168.1.1:long`, `192.168.1.1:auth`

```env
# Short window: 1 second
RATE_LIMIT_SHORT_TTL=1000
RATE_LIMIT_SHORT_LIMIT=20

# Long window: 1 minute
RATE_LIMIT_LONG_TTL=60000
RATE_LIMIT_LONG_LIMIT=300

# Auth protection: 1 minute per IP
RATE_LIMIT_AUTH_TTL=60000
RATE_LIMIT_AUTH_LIMIT=5
```

All values are optional with defaults shown above.

## Tuning for Load

1. **Increase limits for authenticated users**: `RATE_LIMIT_LONG_LIMIT=600` in `.env`
2. **Reduce TTL for IP blocking**: `RATE_LIMIT_AUTH_TTL=30000` (30 sec instead of 60 sec)
3. **Exclude expensive operations**: Use `@SkipThrottle()` for heavy queries
