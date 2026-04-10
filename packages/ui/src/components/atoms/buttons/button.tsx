import { Loader2 } from "lucide-react";
import type React from "react";
import {
  Button as ButtonPrimitive,
  buttonVariants,
} from "@/components/ui/button";

export interface ButtonProps extends React.ComponentProps<typeof ButtonPrimitive> {
  isLoading?: boolean;
  loadingLabel?: string;
}

export const Button = ({
  children,
  isLoading = false,
  loadingLabel,
  disabled,
  ...props
}: ButtonProps) => {
  return (
    <ButtonPrimitive
      aria-busy={isLoading || undefined}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="animate-spin" data-icon="inline-start" />
          {loadingLabel ?? children}
        </>
      ) : (
        children
      )}
    </ButtonPrimitive>
  );
};

export type ButtonVariant = NonNullable<
  React.ComponentProps<typeof ButtonPrimitive>["variant"]
>;
export type ButtonSize = NonNullable<
  React.ComponentProps<typeof ButtonPrimitive>["size"]
>;

export { buttonVariants };
