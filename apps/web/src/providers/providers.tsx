import type { PropsWithChildren } from "react";
import QueryClientProviderRoot from "@/providers/query-client-provider";
import { StoreInitializer } from "@/providers/StoreInitializer";
import StoreProvider from "@/providers/store-provider";

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <StoreProvider>
      <StoreInitializer />
      <QueryClientProviderRoot>{children}</QueryClientProviderRoot>
    </StoreProvider>
  );
};
