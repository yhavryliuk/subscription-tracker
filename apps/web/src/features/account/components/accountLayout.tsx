"use client";

import { type PropsWithChildren, useEffect, useState } from "react";
import { Header } from "./header";
import { NavSidebar } from "./navSidebar";

export function AccountLayout({ children }: PropsWithChildren) {
  // TODO: remove (test)
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
  }, [isDark]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <NavSidebar />

      <div className="flex flex-col flex-1">
        <Header />
        <button
          className="text-red-500"
          type="button"
          onClick={() => setIsDark(!isDark)}
        >
          IsDark: {isDark ? "YES" : "NO"}
        </button>
        <main className="flex-1 p-6 overflow-y-auto text-gray-500">
          {children}
        </main>
      </div>
    </div>
  );
}
