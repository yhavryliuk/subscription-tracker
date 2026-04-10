import type { PropsWithChildren } from "react";
import { AccountLayout as AccountLayoutComponent } from "@/features/account/components/accountLayout";
import { AuthGuard } from "@/features/auth/ui/AuthGuard";

export default async function AccountLayout({ children }: PropsWithChildren) {
  return (
    <AccountLayoutComponent>
      <AuthGuard>{children}</AuthGuard>
    </AccountLayoutComponent>
  );
}
