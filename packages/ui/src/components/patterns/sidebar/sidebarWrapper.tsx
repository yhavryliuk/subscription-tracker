import { cva } from "class-variance-authority";
import type React from "react";
import type { PropsWithChildren } from "react";
import { cn } from "@/utils/cn";

const sidebarWrapperVariants = cva(
  "flex flex-col bg-sidebar-bg text-sidebar-text",
  {
    variants: {
      variant: {
        desktop: "hidden md:flex w-64",
        smallScreen: "relative z-50 w-64 h-full",
      },
    },
    defaultVariants: {
      variant: "desktop",
    },
  },
);

export type SidebarWrapperProps = PropsWithChildren<{
  isSmallScreenMode?: boolean;
}>;

export const SidebarWrapper: React.FC<SidebarWrapperProps> = ({
  children,
  isSmallScreenMode,
  ...props
}) => {
  return (
    <aside
      className={cn(
        sidebarWrapperVariants({
          variant: isSmallScreenMode ? "smallScreen" : "desktop",
        }),
      )}
      {...props}
    >
      {children}
    </aside>
  );
};
