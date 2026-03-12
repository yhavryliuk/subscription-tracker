"use client";

import { AccountHeader, type AccountHeaderProps } from "@repo/ui";
import { useAccountHeader } from "@/features/account/components/header/useAccountHeader";
import { withState } from "@/shared/withState";

export const Header = withState<AccountHeaderProps>(
  useAccountHeader,
  AccountHeader,
);
