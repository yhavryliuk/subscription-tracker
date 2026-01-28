"use client";

import { PropsWithChildren } from "react";
import { Header } from "./Header";
import { NavSidebar } from "@/features/account/components/nav/NavSidebar";

export function AccountLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <NavSidebar />

      <div className="flex flex-col flex-1">
        <Header />

        <main className="flex-1 p-6 overflow-y-auto text-gray-500">{children}</main>
      </div>
    </div>
  );
}
