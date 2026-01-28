"use client";

import { Menu } from "lucide-react";
import { useCallback } from "react";
import { setIsMobileSidebarOpened } from "@/features/account/model/account.slice";
import { useSelector } from "react-redux";
import { getUserShortInfo } from "@/features/account/model/account.selectors";
import { useAppDispatch } from "@/shared/hooks/store-hooks";

export function Header() {
  const dispatch = useAppDispatch();

  const handleOpenMobileSidebar = useCallback(() => {
    dispatch(setIsMobileSidebarOpened(true));
  }, [dispatch]);

  const user = useSelector(getUserShortInfo);

  return (
    <header className="h-16 bg-white border-b flex items-center px-4 gap-4 border-b-gray-300">
      <button
        className="md:hidden"
        onClick={handleOpenMobileSidebar}
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      <div className="text-gray-500">
        <div className="font-semibold text-lg">Dashboard</div>
      </div>

      <div className="ml-auto text-sm text-gray-500">{user?.email ?? 'user@example.com'}</div>
    </header>
  );
}
