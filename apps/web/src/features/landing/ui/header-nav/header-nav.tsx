"use client";

import { ThemeSwitcher } from "@repo/ui";
import type { JSX } from "react";
import { NavLogo } from "@/features/landing/ui/header-nav/nav-logo";
import { useTheme } from "@/providers/theme-provider";
import { NavLink } from "./nav-link";

export const HeaderNav = (): JSX.Element => {
  const { themeMode, setThemeMode } = useTheme();

  return (
    <nav className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/65">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
        <NavLogo />
        <div className="ml-auto hidden items-center gap-1 text-sm font-medium md:flex">
          <a
            className="rounded-full px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            href="#features"
          >
            Features
          </a>
          <a
            className="rounded-full px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            href="#workflow"
          >
            Workflow
          </a>
          <a
            className="rounded-full px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            href="#pricing"
          >
            Pricing
          </a>
        </div>
        <div className="ml-auto flex items-center gap-2 md:ml-3">
          <ThemeSwitcher
            value={themeMode}
            onValueChange={setThemeMode}
            className="min-w-28"
          />
          <NavLink href="/sign-in">Sign In</NavLink>
          <NavLink href="/sign-up" variant="primary">
            Start Free
          </NavLink>
        </div>
      </div>
    </nav>
  );
};
