import clsx from "clsx";
import type React from "react";
import type { PropsWithChildren } from "react";
import { useEffect, useTransition } from "react";
import { isBrowser } from "@/utils/isBrowser";

export type AppearsOpacityProps = PropsWithChildren<{
  mode?: "onmount" | "hidden" | "visible";
}>;

export const AppearsOpacity: React.FC<AppearsOpacityProps> = ({
  children,
  mode = "onmount",
}) => {
  const [t, tc] = useTransition();
  useEffect(() => {
    tc(() => {});
  }, []);

  const show = mode === "visible" || (mode === "onmount" && !t && isBrowser());

  return (
    <div
      className={clsx(
        "transition-opacity duration-1000",
        show ? "opacity-100" : "opacity-0",
      )}
    >
      {children}
    </div>
  );
};
