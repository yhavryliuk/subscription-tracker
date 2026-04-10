"use client";

import { type PropsWithChildren } from "react";
import { Header } from "./header";
import { NavSidebar } from "./navSidebar";

export function AccountLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <NavSidebar />

      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto text-muted-foreground">
          {children}
        </main>
      </div>
    </div>
  );
}
