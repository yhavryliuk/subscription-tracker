/**
 * Browser-only in-memory token storage.
 *
 * Intentionally NOT stored in localStorage or cookies:
 * - XSS cannot read this value via `localStorage.getItem` or `document.cookie`
 * - Cleared automatically on tab/browser close (no persistent leakage)
 * - Restored transparently on page reload via the refresh flow (AuthInitializer)
 */

let _token: string | null = null;

/** JWT payload subset we care about */
interface JwtPayload {
  exp?: number;
}

function decodePayload(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64)) as JwtPayload;
  } catch {
    return null;
  }
}

export const tokenManager = {
  get(): string | null {
    return _token;
  },

  set(token: string | null): void {
    _token = token;
  },

  /**
   * Returns true when the token is expired or will expire within the next 2 seconds.
   * 2s buffer is small enough to work with the 5s debug TTL and large enough
   * to prevent last-millisecond expiry races in production.
   */
  isExpired(token: string): boolean {
    const payload = decodePayload(token);
    if (!payload?.exp) return true;
    return Date.now() >= payload.exp * 1000 - 2_000;
  },
};
