"use client";

import { useCallback } from "react";
import { NavItem } from "./NavItem";
import { getIsMobileSidebarOpened } from "@/features/account/model/account.selectors";
import {
  setIsMobileSidebarOpened,
} from "@/features/account/model/account.slice";
import { Sidebar, SidebarOverlay, useDeviceDimensions } from "@repo/ui";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/store-hooks";

const SidebarContent = () => {
  return (
    <>
      <div className="h-16 flex items-center px-6 text-xl font-semibold border-b border-gray-800">
        Account Panel
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        <NavItem href="/account/dashboard">Dashboard</NavItem>
        <NavItem href="/account/sessions">My Sessions</NavItem>
        <NavItem href="/account/settings">Settings</NavItem>
      </nav>

      <div className="px-6 py-4 border-t border-gray-800 text-sm text-gray-400">
        © 2026
      </div>
    </>
  );
};

export const NavSidebar = () => {
  const isOpen = useAppSelector(getIsMobileSidebarOpened);
  const dispatch = useAppDispatch();

  const handleClose = useCallback(() => {
    dispatch(setIsMobileSidebarOpened(false));
  }, [dispatch]);

  const { isMobile } = useDeviceDimensions();
   if (isMobile) {
     if (!isOpen)
       return null;

    return (
      <div className="fixed inset-0 z-40 md:hidden">
        <SidebarOverlay className="bg-black/50" onClose={handleClose} />

        <Sidebar className="relative z-50 w-64 h-full bg-gray-900 text-white">
          <SidebarContent />
        </Sidebar>
      </div>
    );
  }

  return (
    <Sidebar className="hidden md:flex w-64 bg-gray-900 text-white">
      <SidebarContent />
    </Sidebar>
  );
};
