import React, { JSX } from "react";
import { NavLink } from "./nav-link";
import { NavLogo } from "@/features/landing/ui/header-nav/nav-logo";

export const HeaderNav = (): JSX.Element => {

  return (
    <nav className="flex px-5 bg-amber-500 dark:bg-gray-800">
      <NavLogo />
      <div className="flex ml-auto gap-4">
        <NavLink href="/sign-in">Sign In</NavLink>
        <NavLink href="/sign-up">Sign Up</NavLink>
      </div>
    </nav>
  );
}