import clsx from "clsx";
import type React from "react";
import type { SidebarSectionProps } from "@/components/patterns/sidebar/types";

export const SidebarFooter: React.FC<SidebarSectionProps> = ({
  children,
  className,
}) => (
  <div
    className={clsx(
      "px-6 py-4 border-t border-gray-800 text-sm text-gray-400",
      className,
    )}
  >
    {children}
  </div>
);
