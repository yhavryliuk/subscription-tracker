import { Menu } from "lucide-react";
import type React from "react";
import {
  ThemeSwitcher,
  type ThemeSwitcherProps,
} from "@/components/atoms/theme-switcher/theme-switcher";
import type { ThemeMode } from "@/theme/types";

export type AccountHeaderProps = {
  userName?: string;
  handleOpenMenu: () => void;
  themeMode: ThemeMode;
  onThemeModeChange: ThemeSwitcherProps["onValueChange"];
};

export const AccountHeader: React.FC<AccountHeaderProps> = ({
  userName,
  handleOpenMenu,
  themeMode,
  onThemeModeChange,
}) => {
  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur flex items-center px-4 gap-4">
      <button
        type="button"
        className="md:hidden inline-flex items-center justify-center rounded-md border border-border p-2 hover:bg-muted"
        onClick={handleOpenMenu}
        aria-label="Open menu"
      >
        <Menu className="size-4" />
      </button>

      <div className="text-foreground">
        <div className="font-semibold text-lg tracking-tight">Dashboard</div>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <ThemeSwitcher value={themeMode} onValueChange={onThemeModeChange} />
        <div className="text-sm text-muted-foreground">{userName}</div>
      </div>
    </header>
  );
};
