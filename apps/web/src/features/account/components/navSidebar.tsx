"use client";

import { Sidebar } from "@repo/ui";
import { useCallback } from "react";
import { getIsMobileSidebarOpened } from "@/features/account/model/account.selectors";
import { setIsMobileSidebarOpened } from "@/features/account/model/account.slice";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/store-hooks";

export const NavSidebar = () => {
  const isOpen = useAppSelector(getIsMobileSidebarOpened);
  const dispatch = useAppDispatch();

  const handleClose = useCallback(() => {
    dispatch(setIsMobileSidebarOpened(false));
  }, [dispatch]);

  return (
    <Sidebar
      isOpen={isOpen}
      onClose={handleClose}
      header={<Sidebar.Header>Account Panel</Sidebar.Header>}
      footer={<Sidebar.Footer>© 2026</Sidebar.Footer>}
    >
      <Sidebar.Nav>
        <Sidebar.NavItem href="/account/dashboard">Dashboard</Sidebar.NavItem>
        <Sidebar.NavItem href="/account/sessions">My Sessions</Sidebar.NavItem>
      </Sidebar.Nav>
    </Sidebar>
  );
};
