export const THEME_STORAGE_KEY = "THEME_MODE";
export const THEME_COOKIE_KEY = "theme-mode";
export const THEME_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export const themeModes = ["system", "light", "dark", "colorful"] as const;

export type ThemeMode = (typeof themeModes)[number];
export type ResolvedTheme = Exclude<ThemeMode, "system">;

export const isThemeMode = (
  value: string | null | undefined,
): value is ThemeMode => {
  return value !== undefined && themeModes.includes(value as ThemeMode);
};

export const resolveTheme = (
  mode: ThemeMode,
  prefersDark: boolean,
): ResolvedTheme => {
  if (mode === "system") {
    return prefersDark ? "dark" : "light";
  }

  return mode;
};

export const getServerResolvedTheme = (mode: ThemeMode): ResolvedTheme => {
  // Server cannot reliably detect OS color scheme, so system defaults to light
  // and is corrected by the pre-hydration script on the client.
  return mode === "system" ? "light" : mode;
};
