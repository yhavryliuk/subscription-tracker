"use client";

import { cva } from "class-variance-authority";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
import type { PropsWithChildren } from "react";
import { cn } from "@/utils/cn";

const sidebarNavItemVariants = cva("block rounded-lg px-4 py-2 transition", {
  variants: {
    variant: {
      default: "text-sidebar-text hover:bg-sidebar-text hover:text-sidebar-bg",
      active: "bg-sidebar-text text-sidebar-bg",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface ISidebarNavItemProps {
  href: string;
}

export const SidebarNavItem: React.FC<
  PropsWithChildren<ISidebarNavItemProps>
> = ({ href, children }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        sidebarNavItemVariants({
          variant: isActive ? "active" : "default",
        }),
      )}
    >
      {children}
    </Link>
  );
};
