import clsx from "clsx";
import type React from "react";
import { useEffect, useTransition } from "react";
import { AppearsOpacity } from "@/components/atoms/appears-opacity";
import { isBrowser } from "@/utils/isBrowser";

export type AccountHeaderProps = {
  userName?: string;
  handleOpenMenu: () => void;
};

export const AccountHeader: React.FC<AccountHeaderProps> = ({
  userName,
  handleOpenMenu,
}) => {
  return (
    <header className="h-16 bg-white border-b flex items-center px-4 gap-4 border-b-gray-300">
      <button
        type="button"
        className="md:hidden"
        onClick={handleOpenMenu}
        aria-label="Open menu"
      >
        {/* TODO: add lucid react package and remove testing div */}
        <div className="inline-block w-6 h-6 rounded-full bg-red-400">
          open menu
        </div>
      </button>

      <div className="text-gray-500">
        <div className="font-semibold text-lg">Dashboard</div>
      </div>

      <AppearsOpacity>
        <div className="ml-auto text-sm text-gray-500">{userName}</div>
      </AppearsOpacity>
    </header>
  );
};
