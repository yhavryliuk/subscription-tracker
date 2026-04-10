import type { PropsWithChildren } from "react";
import type { ThemeMode } from "@/shared/theme/theme";
import QueryClientProviderRoot from "@/providers/query-client-provider";
import { StoreInitializer } from "@/providers/StoreInitializer";
import StoreProvider from "@/providers/store-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { AuthInitializer } from "@/features/auth/ui/AuthInitializer";

type ProvidersProps = PropsWithChildren<{
  initialThemeMode: ThemeMode;
}>;

export const Providers = ({ children, initialThemeMode }: ProvidersProps) => {
  return (
    <ThemeProvider initialThemeMode={initialThemeMode}>
      <StoreProvider>
        <StoreInitializer />
        <AuthInitializer />
        <QueryClientProviderRoot>{children}</QueryClientProviderRoot>
      </StoreProvider>
    </ThemeProvider>
  );
};
