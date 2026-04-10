import type { AccountHeaderProps } from "@repo/ui";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { getUsername } from "@/features/account/model/account.selectors";
import { setIsMobileSidebarOpened } from "@/features/account/model/account.slice";
import { useTheme } from "@/providers/theme-provider";
import { useAppDispatch } from "@/shared/hooks/store-hooks";

export const useAccountHeader = (): AccountHeaderProps => {
  const dispatch = useAppDispatch();
  const { themeMode, setThemeMode } = useTheme();

  const handleOpenMenu = useCallback(() => {
    dispatch(setIsMobileSidebarOpened(true));
  }, [dispatch]);

  const userName = useSelector(getUsername);

  return {
    handleOpenMenu,
    onThemeModeChange: setThemeMode,
    themeMode,
    userName,
  };
};
