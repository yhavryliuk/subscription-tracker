export const themeModes = ["system", "light", "dark", "colorful"] as const;

export type ThemeMode = (typeof themeModes)[number];
export type ResolvedTheme = Exclude<ThemeMode, "system">;

export const isThemeMode = (
  value: string | null | undefined,
): value is ThemeMode => {
  return themeModes.includes(value as ThemeMode);
};
