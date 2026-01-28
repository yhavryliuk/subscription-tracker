import { PropsWithChildren } from "react";
import { AccountLayout as AccountLayoutComponent } from "@/features/account/components/AccountLayout";

export default function AccountLayout({ children }: PropsWithChildren) {
  return <AccountLayoutComponent>{children}</AccountLayoutComponent>;
}
