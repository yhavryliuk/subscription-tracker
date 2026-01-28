import { PropsWithChildren } from "react";

export const MainContent = ({ children }: PropsWithChildren) => {
  return <main className="flex-1 p-6 overflow-y-auto">{children}</main>;
}
