import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  decryptSession,
  encryptSession,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_MAX_AGE,
} from "@/shared/lib/session";

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_COOKIE_MAX_AGE,
};

/**
 * POST /api/auth/session
 * Body: { token: string }
 *
 * Encrypts the access token and stores it in the `accessSession` httpOnly cookie.
 * Called by the browser after login or a client-side refresh.
 */
export async function POST(request: Request) {
  const body = (await request.json()) as { token?: unknown };
  const token = body?.token;

  if (typeof token !== "string" || !token) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  // Encrypt for 15 minutes — matches typical production access token TTL.
  // The JWE expiry is the real gate; the cookie maxAge just controls browser retention.
  const encrypted = await encryptSession(token, 60 * 15);

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, encrypted, COOKIE_OPTS);
  return response;
}

/**
 * DELETE /api/auth/session
 *
 * Clears the `accessSession` cookie on logout.
 */
export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(SESSION_COOKIE_NAME);
  return response;
}

/**
 * GET /api/auth/session
 *
 * Returns whether the current session cookie decrypts to a valid token.
 * Used by client components to check SSR session state without exposing the token.
 */
export async function GET() {
  const cookieStore = await cookies();
  const encrypted = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!encrypted) return NextResponse.json({ authenticated: false });

  const token = await decryptSession(encrypted);
  return NextResponse.json({ authenticated: !!token });
}
