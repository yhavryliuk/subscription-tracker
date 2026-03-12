"use client";

import clsx from "clsx";
import type React from "react";
import type { PropsWithChildren } from "react";
import { SidebarOverlay } from "@/components/patterns/sidebar/sidebarOverlay";
import { SidebarWrapper } from "@/components/patterns/sidebar/sidebarWrapper";
import { useDeviceDimensions } from "@/hooks/useDeviceDimensions";
import { SidebarFooter } from "./sidebarFooter";
import { SidebarHeader } from "./sidebarHeader";
import { SidebarNavItem } from "./sidebarNavItem";
import { SidebarNavList } from "./sidebarNavList";

export type SidebarProps = PropsWithChildren<{
  /**
   * An optional CSS class name that can be applied to mobile wrapper.
   * This allows customization of styles through external or scoped CSS.
   */
  className?: string;
  isOpen: boolean;
  onClose: () => void;
  header?: React.ReactElement<typeof SidebarHeader>;
  footer?: React.ReactElement<typeof SidebarFooter>;
}>;

type SidebarComponent = React.FC<SidebarProps> & {
  Header: typeof SidebarHeader;
  Nav: typeof SidebarNavList;
  Footer: typeof SidebarFooter;
  NavItem: typeof SidebarNavItem;
};

export const Sidebar: SidebarComponent = ({
  children,
  isOpen,
  onClose,
  className,
  header,
  footer,
}: SidebarProps) => {
  const { isMobile } = useDeviceDimensions();

  if (isMobile && !isOpen) {
    // skip all render operations
    return null;
  }

  const sidebarComposition = (
    <SidebarWrapper isSmallScreenMode={isMobile}>
      {header}
      {children}
      {footer}
    </SidebarWrapper>
  );

  if (isMobile) {
    return (
      <div className={clsx("fixed inset-0 z-40", className)}>
        <SidebarOverlay onClose={onClose} closeOnEscape={true} />
        {sidebarComposition}
      </div>
    );
  }

  return <>{sidebarComposition}</>;
};

Sidebar.Header = SidebarHeader;
Sidebar.Nav = SidebarNavList;
Sidebar.Footer = SidebarFooter;
Sidebar.NavItem = SidebarNavItem;
