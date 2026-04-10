/**
 * Server-side GraphQL fetcher for use in Next.js Server Components.
 *
 * Reads the encrypted `accessSession` httpOnly cookie (written by our Route Handlers),
 * decrypts the access token with jose, and makes a direct server-to-API request.
 *
 * If the token is missing or expired, it redirects the user through
 * /api/auth/refresh-session which renews the token and then returns here.
 *
 * No shared module-level state — every call is fully isolated per request,
 * safe to use in multi-user concurrent environments.
 */

import "server-only";
import { redirect } from "next/navigation";
import { getSessionToken } from "@/shared/lib/session";

type AnyDocument = { toString(): string } | string;

const API_INTERNAL_URL =
  process.env.API_INTERNAL_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:3000/graphql";

/**
 * Execute a typed GraphQL operation from a Server Component.
 *
 * Example:
 *   const data = await serverFetch<MySessionsQuery>(MySessionsDocument)
 */
export async function serverFetch<TData, TVariables = Record<string, never>>(
  document: AnyDocument,
  variables?: TVariables,
  returnTo?: string,
): Promise<TData> {
  const accessToken = await getSessionToken();

  // Token missing or expired → route through the refresh handler
  if (!accessToken) {
    const target = returnTo ?? "/account/dashboard";
    redirect(
      `/api/auth/refresh-session?returnTo=${encodeURIComponent(target)}`,
    );
  }

  const res = await fetch(API_INTERNAL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ query: document.toString(), variables }),
    // Disable Next.js data cache for auth-gated requests
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Server GraphQL request failed: HTTP ${res.status}`);
  }

  const json = (await res.json()) as {
    data: TData;
    errors?: { message: string }[];
  };

  if (json.errors?.length) {
    throw new Error(json.errors[0].message);
  }

  return json.data;
}
