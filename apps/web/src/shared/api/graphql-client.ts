/**
 * Client-side (browser) GraphQL fetcher for TanStack Query.
 *
 * Security properties:
 * - Access token kept in module-level variable (not localStorage / sessionStorage)
 * - refreshToken is httpOnly — only sent by the browser automatically to the API
 * - CSRF protection: reads the readable `csrfToken` cookie and sends it as
 *   `x-csrf-token` header on every refresh call (matches backend CsrfGuard)
 * - Concurrent refresh deduplication: a single in-flight promise prevents
 *   multiple simultaneous refresh mutations racing against each other
 *
 * Codegen integration:
 *   The `fetcher` export is used by @graphql-codegen/typescript-react-query.
 *   Queries:   queryFn = fetcher(doc, vars)         (curried → () => Promise<T>)
 *   Mutations: mutationFn = (v) => fetcher(doc, v)() (invoked immediately)
 */

import "client-only";
import { tokenManager } from "@/shared/lib/token-manager";

// The v6 typescript-react-query codegen plugin emits documents as plain strings.
// Accepting { toString(): string } keeps us compatible with both plain strings
// and any future typed document objects (TypedDocumentNode, TypedDocumentString).
type AnyDocument = { toString(): string } | string;

const GQL_ENDPOINT =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/graphql";

// ── CSRF ─────────────────────────────────────────────────────────────────────

function getCsrfToken(): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith("csrfToken="));
  return match?.split("=")[1];
}

// ── Refresh ───────────────────────────────────────────────────────────────────

let refreshPromise: Promise<string | null> | null = null;

// ── Client-side refresh rate limiting ────────────────────────────────────────

// Tracks call timestamps in sessionStorage so the budget persists across
// page reloads within the same browser tab session.
const REFRESH_BUDGET = 20;
const REFRESH_WINDOW_MS = 60_000;
const REFRESH_TS_KEY = "__refresh_ts";

function isRefreshBudgetExceeded(): boolean {
  const now = Date.now();
  let timestamps: number[] = [];
  try {
    timestamps = JSON.parse(sessionStorage.getItem(REFRESH_TS_KEY) ?? "[]") as number[];
  } catch {
    return false; // sessionStorage unavailable — allow the call
  }
  timestamps = timestamps.filter((t) => t > now - REFRESH_WINDOW_MS);
  if (timestamps.length >= REFRESH_BUDGET) {
    sessionStorage.setItem(REFRESH_TS_KEY, JSON.stringify(timestamps));
    return true;
  }
  sessionStorage.setItem(REFRESH_TS_KEY, JSON.stringify([...timestamps, now]));
  return false;
}

/**
 * Revokes the current session on the backend (no access token required) and
 * clears both auth cookies so the sign-in page can render without looping.
 * Uses Promise.allSettled — safe to call even when the network is unreliable.
 */
export async function forceLogout(): Promise<void> {
  const csrfToken = getCsrfToken();
  tokenManager.set("");
  await Promise.allSettled([
    fetch(GQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(csrfToken ? { "x-csrf-token": csrfToken } : {}),
      },
      credentials: "include",
      body: JSON.stringify({ query: "mutation { logoutSession }" }),
    }),
    fetch("/api/auth/session", { method: "DELETE" }),
  ]);
}

/**
 * Silently refreshes the access token using the httpOnly refreshToken cookie.
 * Returns the new token on success, or null if the session is invalid / expired
 * or the client-side rate limit (20 calls/min) is reached.
 */
export async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    if (isRefreshBudgetExceeded()) return null;

    const csrfToken = getCsrfToken();
    const res = await fetch(GQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(csrfToken ? { "x-csrf-token": csrfToken } : {}),
      },
      credentials: "include",
      body: JSON.stringify({ query: "mutation { refresh }" }),
    });

    if (!res.ok) return null;

    const json = (await res.json()) as {
      data?: { refresh?: boolean };
      errors?: { message: string }[];
    };

    if (!json.data?.refresh) return null;

    const token =
      res.headers.get("Authorization")?.replace("Bearer ", "") ?? null;
    if (token) {
      tokenManager.set(token);
      void updateSessionCookie(token);
    }
    return token;
  })().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}

/** POST the new access token to our Next.js Route Handler to set the httpOnly cookie */
async function updateSessionCookie(token: string): Promise<void> {
  try {
    await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
  } catch {
    // Non-critical: SSR will route through /api/auth/refresh-session if stale
  }
}

// ── Fetcher ───────────────────────────────────────────────────────────────────

/**
 * Curried GraphQL fetcher compatible with @graphql-codegen/typescript-react-query.
 *
 * Usage:
 *   queryFn:   fetcher<TData, TVars>(document, variables)
 *   mutations: fetcher<TData, TVars>(document, variables)()
 */
export const fetcher = <TData, TVariables>(
  document: AnyDocument,
  variables?: TVariables,
) =>
  async (): Promise<TData> => {
    // Preventively refresh if token is about to expire
    const current = tokenManager.get();
    if (current !== null && tokenManager.isExpired(current)) {
      await refreshAccessToken();
    }

    const token = tokenManager.get();

    const res = await fetch(GQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
      body: JSON.stringify({ query: document.toString(), variables }),
    });

    // Capture a new access token if the response includes one (login / register)
    const incomingToken =
      res.headers.get("Authorization")?.replace("Bearer ", "") ?? null;
    if (incomingToken && incomingToken !== token) {
      tokenManager.set(incomingToken);
    }

    if (!res.ok) {
      throw new Error(`GraphQL request failed: HTTP ${res.status}`);
    }

    const json = (await res.json()) as {
      data: TData;
      errors?: { message: string }[];
    };

    if (json.errors?.length) {
      throw new Error(json.errors[0].message);
    }

    return json.data;
  };
