import { clsx } from "clsx";
import Link from "next/link";
import type { ReactNode } from "react";

interface NavLinkProps {
  children: ReactNode;
  href: string;
  className?: string;
  variant?: "default" | "primary";
}

export const NavLink = ({
  children,
  href,
  className,
  variant = "default",
}: NavLinkProps) => {
  return (
    <Link
      className={clsx(
        "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200",
        variant === "primary"
          ? "bg-emerald-600 text-white hover:bg-emerald-500"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
        className,
      )}
      href={href}
    >
      {children}
    </Link>
  );
};
