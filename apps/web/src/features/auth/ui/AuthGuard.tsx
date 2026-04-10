"use client";

import { useEffect, type PropsWithChildren } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/shared/hooks/store-hooks";

/**
 * Client-side auth gate for account pages.
 *
 * Wraps only the page content — the surrounding layout shell (sidebar, header)
 * is already rendered server-side and visible immediately. This component:
 * - Shows a content-area skeleton while the silent refresh runs
 * - Redirects to /sign-in if the session is invalid
 * - Renders children once the session is confirmed
 */
export function AuthGuard({ children }: PropsWithChildren) {
  const router = useRouter();
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const isInitialized = useAppSelector((s) => s.auth.isInitialized);

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace("/sign-in");
    }
  }, [isInitialized, isAuthenticated, router]);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-full min-h-64">
        <span className="text-sm text-gray-400">Auth Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
