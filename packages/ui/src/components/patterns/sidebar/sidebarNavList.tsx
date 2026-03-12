import clsx from "clsx";
import type React from "react";
import type { SidebarSectionProps } from "@/components/patterns/sidebar/types";

export const SidebarNavList: React.FC<SidebarSectionProps> = ({
  children,
  className,
}) => (
  <nav className={clsx("flex-1 px-4 py-6 space-y-2", className)}>
    {children}
  </nav>
);
