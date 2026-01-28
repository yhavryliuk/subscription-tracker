let accessToken: string | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string) {
  accessToken = token;
}

export function isAccessTokenExpired(accessToken: string): boolean {
  if (!accessToken) return true;

  try {
    // JWT decode
    const [, payload] = accessToken.split(".");
    const decoded = JSON.parse(atob(payload));
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp <= now;
  } catch {
    // If parse failed - recognize like outdated
    return true;
  }
}
