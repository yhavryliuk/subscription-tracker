import type { ThemeMode } from "@/shared/theme/theme";
import {
  THEME_COOKIE_KEY,
  THEME_COOKIE_MAX_AGE_SECONDS,
  THEME_STORAGE_KEY,
} from "@/shared/theme/theme";

type ThemeInitScriptProps = {
  initialThemeMode: ThemeMode;
};

const buildThemeInitScript = (initialThemeMode: ThemeMode) => {
  const storageKey = JSON.stringify(THEME_STORAGE_KEY);
  const cookieKey = JSON.stringify(THEME_COOKIE_KEY);
  const fallbackMode = JSON.stringify(initialThemeMode);
  const maxAge = THEME_COOKIE_MAX_AGE_SECONDS;

  return `(() => {
  const storageKey = ${storageKey};
  const cookieKey = ${cookieKey};
  const fallbackMode = ${fallbackMode};
  const validModes = new Set(["system", "light", "dark", "colorful"]);

  const readStoredMode = () => {
    try {
      const value = window.localStorage.getItem(storageKey);
      return value && validModes.has(value) ? value : null;
    } catch {
      return null;
    }
  };

  const resolveTheme = (mode, prefersDark) => {
    if (mode === "system") {
      return prefersDark ? "dark" : "light";
    }

    return mode;
  };

  const mode = readStoredMode() ?? fallbackMode;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const resolvedTheme = resolveTheme(mode, prefersDark);
  const root = document.documentElement;

  root.dataset.themeMode = mode;
  root.dataset.theme = resolvedTheme;
  root.classList.toggle("dark", resolvedTheme === "dark");
  root.style.colorScheme = resolvedTheme === "dark" ? "dark" : "light";

  try {
    window.localStorage.setItem(storageKey, mode);
  } catch {
    // Ignore storage failures in private mode.
  }

  document.cookie = cookieKey + "=" + mode + "; path=/; max-age=${maxAge}; samesite=lax";
})();`;
};

export const ThemeInitScript = ({ initialThemeMode }: ThemeInitScriptProps) => {
  return (
    // biome-ignore lint/security/noDangerouslySetInnerHtml: required to set theme before hydration and prevent initial flash.
    <script
      dangerouslySetInnerHTML={{
        __html: buildThemeInitScript(initialThemeMode),
      }}
    />
  );
};
