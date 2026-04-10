import type { PropsWithChildren } from "react";
import QueryClientProviderRoot from "@/providers/query-client-provider";
import { StoreInitializer } from "@/providers/StoreInitializer";
import StoreProvider from "@/providers/store-provider";
import { AuthInitializer } from "@/features/auth/ui/AuthInitializer";

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <StoreProvider>
      <StoreInitializer />
      <AuthInitializer />
      <QueryClientProviderRoot>{children}</QueryClientProviderRoot>
    </StoreProvider>
  );
};
