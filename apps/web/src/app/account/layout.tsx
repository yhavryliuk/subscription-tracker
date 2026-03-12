import type { PropsWithChildren } from "react";
import { AccountLayout as AccountLayoutComponent } from "@/features/account/components/accountLayout";

export default function AccountLayout({ children }: PropsWithChildren) {
  return <AccountLayoutComponent>{children}</AccountLayoutComponent>;
}
