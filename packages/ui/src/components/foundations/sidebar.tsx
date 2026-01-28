"use client";

import type { ReactNode } from "react";

type SidebarProps = {
  children: ReactNode;
  className?: string;
};

type SidebarOverlayProps = {
  onClose?: () => void;
  className?: string;
};

const joinClassName = (base: string, className?: string) => {
  return className ? `${base} ${className}` : base;
};

export function Sidebar({ children, className }: SidebarProps) {
  return (
    <aside className={joinClassName("flex flex-col", className)}>
      {children}
    </aside>
  );
}

export function SidebarOverlay({ onClose, className }: SidebarOverlayProps) {
  return (
    <div
      className={joinClassName("absolute inset-0", className)}
      onClick={onClose}
    />
  );
}
