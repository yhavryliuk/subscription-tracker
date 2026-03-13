import type React from "react";
import "../globals.css";
import { HeaderNav } from "@/features/landing/ui/header-nav";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header>
        <HeaderNav />
      </header>
      <main>{children}</main>
    </>
  );
}
