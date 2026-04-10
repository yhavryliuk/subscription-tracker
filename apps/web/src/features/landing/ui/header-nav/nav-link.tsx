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
          ? "bg-primary text-primary-foreground hover:opacity-90"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        className,
      )}
      href={href}
    >
      {children}
    </Link>
  );
};
