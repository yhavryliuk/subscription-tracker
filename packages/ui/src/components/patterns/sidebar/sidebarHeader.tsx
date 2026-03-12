import clsx from "clsx";
import type React from "react";
import type { SidebarSectionProps } from "./types";

export const SidebarHeader: React.FC<SidebarSectionProps> = ({
  children,
  className,
}) => (
  <div
    className={clsx(
      "h-16 flex items-center px-6 text-xl font-semibold border-b border-gray-800",
      className,
    )}
  >
    {children}
  </div>
);
