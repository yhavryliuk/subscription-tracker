import type { JSX } from "react";
import { NavLogo } from "@/features/landing/ui/header-nav/nav-logo";
import { NavLink } from "./nav-link";

export const HeaderNav = (): JSX.Element => {
  return (
    <nav className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
        <NavLogo />
        <div className="ml-auto hidden items-center gap-1 text-sm font-medium md:flex">
          <a
            className="rounded-full px-3 py-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            href="#features"
          >
            Features
          </a>
          <a
            className="rounded-full px-3 py-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            href="#workflow"
          >
            Workflow
          </a>
          <a
            className="rounded-full px-3 py-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            href="#pricing"
          >
            Pricing
          </a>
        </div>
        <div className="ml-auto flex items-center gap-2 md:ml-3">
          <NavLink href="/sign-in">Sign In</NavLink>
          <NavLink href="/sign-up" variant="primary">
            Start Free
          </NavLink>
        </div>
      </div>
    </nav>
  );
};
