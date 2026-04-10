import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  encryptSession,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_MAX_AGE,
} from "@/shared/lib/session";

const API_URL =
  process.env.API_INTERNAL_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:3000/graphql";

/**
 * GET /api/auth/refresh-session?returnTo=/account/dashboard
 *
 * Server-side refresh flow triggered by Server Components when their
 * `accessSession` cookie is missing or expired.
 *
 * Flow:
 *  1. Read `refreshToken` + `csrfToken` from the browser's incoming cookies
 *  2. Forward them to the backend `refresh` mutation (server-to-server)
 *  3. Capture the new access token from the `Authorization` response header
 *  4. Forward the backend's new `refreshToken` Set-Cookie to the browser
 *  5. Write a fresh `accessSession` cookie with the encrypted access token
 *  6. Redirect to `returnTo`
 *
 * Note: This requires the backend's `refreshToken` cookie to have `path: '/'`
 * so that the browser forwards it on requests to Next.js (not just /graphql).
 */
export async function GET(request: NextRequest) {
  const returnTo =
    new URL(request.url).searchParams.get("returnTo") ?? "/account/dashboard";

  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;
  const csrfToken = cookieStore.get("csrfToken")?.value;

  // No refresh token → send to sign-in
  if (!refreshToken || !csrfToken) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  let backendRes: Response;
  try {
    backendRes = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refreshToken=${refreshToken}; csrfToken=${csrfToken}`,
        "x-csrf-token": csrfToken,
      },
      body: JSON.stringify({ query: "mutation { refresh }" }),
    });
  } catch {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (!backendRes.ok) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const json = (await backendRes.json()) as {
    data?: { refresh?: boolean };
    errors?: unknown[];
  };

  if (!json.data?.refresh) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const newAccessToken =
    backendRes.headers.get("Authorization")?.replace("Bearer ", "") ?? null;

  if (!newAccessToken) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const encrypted = await encryptSession(newAccessToken, 60 * 15);

  const response = NextResponse.redirect(new URL(returnTo, request.url));

  // Write the fresh session cookie
  response.cookies.set(SESSION_COOKIE_NAME, encrypted, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_COOKIE_MAX_AGE,
  });

  // Forward the backend's new refreshToken Set-Cookie to the browser so token
  // rotation stays consistent (old refreshToken is now invalid on the backend)
  const backendSetCookie = backendRes.headers.get("set-cookie");
  if (backendSetCookie) {
    response.headers.append("Set-Cookie", backendSetCookie);
  }

  return response;
}
