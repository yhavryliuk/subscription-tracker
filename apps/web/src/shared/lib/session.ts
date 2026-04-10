/**
 * Server-side session helpers: encrypt/decrypt access tokens for
 * the `accessSession` httpOnly cookie used by Server Components.
 *
 * Uses AES-256-GCM (via jose EncryptJWT) with a key derived from SESSION_SECRET.
 * The JWE payload is the raw access token string.
 *
 * Environment variables:
 *   SESSION_SECRET — any string ≥ 32 chars (derivation via HMAC-SHA-256)
 */

import "server-only";
import { createHmac } from "crypto";
import { cookies } from "next/headers";
import { EncryptJWT, jwtDecrypt } from "jose";

export const SESSION_COOKIE_NAME = "accessSession";
/** 7 days — cookie outlives the access token; JWE expiry is the real TTL check */
export const SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

function getKey(): Uint8Array {
  const secret =
    process.env.SESSION_SECRET ?? "change-me-session-secret-min-32-chars-long!";
  // Derive 32 bytes (256 bits) from the secret deterministically
  return new Uint8Array(
    createHmac("sha256", "accessSession").update(secret).digest(),
  );
}

/**
 * Encrypt the raw JWT access token into a JWE string for cookie storage.
 * @param accessToken  Raw JWT string from the API Authorization header
 * @param ttlSeconds   Token lifetime in seconds (mirrors API JWT TTL)
 */
export async function encryptSession(
  accessToken: string,
  ttlSeconds: number = 60 * 15,
): Promise<string> {
  return new EncryptJWT({ token: accessToken })
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + ttlSeconds)
    .encrypt(getKey());
}

/**
 * Read and decrypt the `accessSession` httpOnly cookie.
 * Returns the raw access token, or null if missing / expired / tampered.
 * Use this in Server Components and Route Handlers instead of reading
 * the cookie and calling decryptSession() separately.
 */
export async function getSessionToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const encrypted = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!encrypted) return null;
  return decryptSession(encrypted);
}

/**
 * Decrypt the `accessSession` JWE cookie and return the raw access token.
 * Returns null if the token is missing, tampered, or expired.
 */
export async function decryptSession(
  encrypted: string,
): Promise<string | null> {
  try {
    const { payload } = await jwtDecrypt(encrypted, getKey());
    return (payload.token as string) ?? null;
  } catch {
    return null;
  }
}
