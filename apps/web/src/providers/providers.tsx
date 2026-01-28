import { PropsWithChildren } from "react";
import StoreProvider from "@/providers/store-provider";
import QueryClientProviderRoot from "@/providers/query-client-provider";
import { StoreInitializer } from "@/providers/StoreInitializer";

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <>
      <StoreProvider>
        <StoreInitializer />
        <QueryClientProviderRoot>
          {children}
        </QueryClientProviderRoot>
      </StoreProvider>
    </>
  );
};
