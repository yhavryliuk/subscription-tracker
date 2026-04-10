# Authentication Flow

This document describes the full auth lifecycle: login, silent refresh, server-side data fetching, and logout.

## Architecture Overview

```
Browser                          Next.js (BFF)                    NestJS API
───────                          ─────────────                    ──────────
Client Components                Route Handlers                   GraphQL
TanStack Query                   Server Components
Redux auth slice                 graphql-server.ts
graphql-client.ts
tokenManager (in-memory)
```

**Key principle:** The NestJS API owns authentication. Next.js acts as a minimal BFF only for auth lifecycle (cookie management). All GraphQL data queries go directly browser → API.

## Cookies

| Cookie | Set by | Readable by | Purpose |
|--------|--------|-------------|---------|
| `refreshToken` | NestJS API (`Set-Cookie`) | Browser only (httpOnly) | Long-lived token to obtain new access tokens |
| `csrfToken` | NestJS API (`Set-Cookie`) | JS readable | CSRF protection — sent as `x-csrf-token` header |
| `accessSession` | Next.js Route Handler | Next.js server only (httpOnly) | JWE-encrypted access token for Server Components |

## Flow 1: Login

```
1. User submits sign-in form
2. Browser → POST /graphql { mutation login(input) }
3. API validates credentials, creates Session in DB
4. API response:
   - Set-Cookie: refreshToken (httpOnly, path: /)
   - Set-Cookie: csrfToken (readable)
   - Authorization: Bearer <accessToken> header
5. graphql-client.ts captures accessToken from Authorization header
6. tokenManager.set(accessToken)           ← in-memory, survives navigation
7. dispatch(setAccessToken(token))          ← Redux: isAuthenticated = true
8. POST /api/auth/session { token }         ← write accessSession cookie for SSR
9. router.push('/account/dashboard')
```

## Flow 2: Page Reload (Silent Refresh)

On every page load the `AuthInitializer` client component bootstraps auth state:

```
1. AuthInitializer mounts (useEffect, runs once via useRef guard)
2. refreshAccessToken() called
   a. isRefreshBudgetExceeded()? → if 20+ calls in last 60s → return null
   b. POST /graphql { mutation refresh }
      - browser auto-sends httpOnly refreshToken cookie
      - sends csrfToken as x-csrf-token header
   c. API validates refreshToken against DB session hash
   d. API rotates refreshToken (new Set-Cookie), returns new accessToken
   e. Authorization: Bearer <newAccessToken> captured
3a. Token received:
    - tokenManager.set(token)
    - dispatch(setAccessToken(token))       ← isAuthenticated = true
    - POST /api/auth/session { token }      ← update SSR cookie
3b. Token null (expired session / budget exceeded):
    - forceLogout():
        → POST /graphql { mutation logoutSession }  ← revokes session in DB, clears refreshToken cookie
        → DELETE /api/auth/session                  ← clears accessSession cookie
    - dispatch(setInitialized())            ← isAuthenticated = false → redirect /sign-in
```

## Flow 3: Authenticated Client Request

```
fetcher() in graphql-client.ts:

1. tokenManager.get() → check if token is expired (2s buffer)
2. If expired → await refreshAccessToken()
3. POST /graphql with Authorization: Bearer <token>
4. If response includes new Authorization header (login/register) → update tokenManager
```

## Flow 4: Server Component Data Fetch

Server Components cannot access browser memory, so they use the `accessSession` httpOnly cookie:

```
1. Server Component calls serverFetch<MyQuery>(document)
2. graphql-server.ts reads accessSession cookie
3. decryptSession(encrypted) → JWE decrypt via jose → accessToken
4a. Token valid:
    - fetch(API_INTERNAL_URL) with Authorization: Bearer <token>
    - return typed data
4b. Token missing or expired:
    - redirect /api/auth/refresh-session?returnTo=<current-path>
    - Route Handler: reads refreshToken + csrfToken cookies
    - Server-to-server POST /graphql { mutation refresh }
    - Writes new accessSession cookie + forwards new refreshToken cookie
    - redirect back to returnTo
```

`accessSession` is written in two places:
- After login (`signInForm.tsx` → `POST /api/auth/session`)
- After client-side refresh (`updateSessionCookie()` in `graphql-client.ts`)

## Flow 5: Logout

```
1. mutation { logout } with Authorization header + csrfToken
2. API: marks session as revokedAt in DB, clears refreshToken cookie
3. DELETE /api/auth/session → clears accessSession cookie
4. tokenManager.set('')
5. dispatch(logout()) → isAuthenticated = false → redirect /sign-in
```

## Route Guards

**Client-side** (`src/app/account/layout.tsx`):
- Waits for `isInitialized` (AuthInitializer finishes)
- If `!isAuthenticated` → `router.replace('/sign-in')`

**Server-side** (`src/app/(auth)/layout.tsx`):
- Reads `refreshToken` cookie
- If present → `redirect('/account/dashboard')` (already logged in)

## Rate Limiting

| Layer | Limit | Behavior on exceed |
|-------|-------|-------------------|
| Client-side (`isRefreshBudgetExceeded`) | 20 calls / 60s per tab | Returns null → `forceLogout()` |
| API `short` throttle | 20 req/s | HTTP 429 |
| API `long` throttle | 300 req/min | HTTP 429 |
| API `auth` throttle | 5 attempts/min | Only on `login` / `register` via `@Throttle({ auth: {...} })` |

## Key Files

| File | Role |
|------|------|
| `src/shared/api/graphql-client.ts` | Client fetcher, refresh, forceLogout |
| `src/shared/api/graphql-server.ts` | Server Component fetcher |
| `src/shared/lib/token-manager.ts` | In-memory access token store |
| `src/shared/lib/session.ts` | JWE encrypt/decrypt for accessSession cookie |
| `src/app/api/auth/session/route.ts` | POST/DELETE accessSession cookie |
| `src/app/api/auth/refresh-session/route.ts` | SSR refresh via server-to-server call |
| `src/features/auth/ui/AuthInitializer.tsx` | Client bootstrap on page load |
| `src/features/auth/model/auth.slice.ts` | Redux: accessToken, isAuthenticated, isInitialized |
