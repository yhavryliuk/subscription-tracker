export type JwtPayload = {
  exp?: number;
  iat?: number;
  sub?: string;
  [key: string]: any;
};

export function decodeJwt<T extends JwtPayload = JwtPayload>(
  token: string,
): T | null {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );

    return JSON.parse(json);
  } catch {
    return null;
  }
}
