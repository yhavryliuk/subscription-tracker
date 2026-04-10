"use client";

import type { PropsWithChildren } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ResolvedTheme, ThemeMode } from "@/shared/theme/theme";
import {
  THEME_COOKIE_KEY,
  THEME_COOKIE_MAX_AGE_SECONDS,
  THEME_STORAGE_KEY,
  isThemeMode,
  resolveTheme,
} from "@/shared/theme/theme";

type ThemeContextValue = {
  themeMode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setThemeMode: (nextMode: ThemeMode) => void;
};

type ThemeProviderProps = PropsWithChildren<{
  initialThemeMode: ThemeMode;
}>;

const ThemeContext = createContext<ThemeContextValue | null>(null);

const applyThemeToDocument = (mode: ThemeMode) => {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const resolvedTheme = resolveTheme(mode, mediaQuery.matches);
  const root = document.documentElement;

  root.dataset.themeMode = mode;
  root.dataset.theme = resolvedTheme;
  root.classList.toggle("dark", resolvedTheme === "dark");
  root.style.colorScheme = resolvedTheme === "dark" ? "dark" : "light";

  return resolvedTheme;
};

const persistThemeMode = (mode: ThemeMode) => {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    // Ignore storage failures in private mode.
  }

  document.cookie = `${THEME_COOKIE_KEY}=${mode}; path=/; max-age=${THEME_COOKIE_MAX_AGE_SECONDS}; samesite=lax`;
};

const readInitialMode = (fallbackMode: ThemeMode): ThemeMode => {
  const modeFromDataset = document.documentElement.dataset.themeMode;
  if (isThemeMode(modeFromDataset)) {
    return modeFromDataset;
  }

  try {
    const modeFromStorage = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (isThemeMode(modeFromStorage)) {
      return modeFromStorage;
    }
  } catch {
    // Ignore storage failures in private mode.
  }

  return fallbackMode;
};

export const ThemeProvider = ({
  children,
  initialThemeMode,
}: ThemeProviderProps) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(initialThemeMode);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");

  useEffect(() => {
    const initialMode = readInitialMode(initialThemeMode);
    setThemeModeState(initialMode);
    const nextResolvedTheme = applyThemeToDocument(initialMode);
    setResolvedTheme(nextResolvedTheme);
    persistThemeMode(initialMode);
  }, [initialThemeMode]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const nextResolvedTheme = applyThemeToDocument(themeMode);
    setResolvedTheme(nextResolvedTheme);
    persistThemeMode(themeMode);

    if (themeMode !== "system") {
      return;
    }

    const handleThemeChange = () => {
      const updatedResolvedTheme = applyThemeToDocument(themeMode);
      setResolvedTheme(updatedResolvedTheme);
    };

    mediaQuery.addEventListener("change", handleThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleThemeChange);
    };
  }, [themeMode]);

  const setThemeMode = useCallback((nextMode: ThemeMode) => {
    setThemeModeState(nextMode);
  }, []);

  const value = useMemo(
    () => ({ themeMode, resolvedTheme, setThemeMode }),
    [themeMode, resolvedTheme, setThemeMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
};
