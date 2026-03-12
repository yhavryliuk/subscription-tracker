import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";
import { cn } from "@/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded px-4 py-2 transition-colors",
  {
    variants: {
      variant: {
        primary: "bg-app-bg text-app-text border border-app-text",
        accent: "bg-blue-500 text-white",
      },
    },
    defaultVariants: { variant: "primary" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = ({ className, variant, ...props }: ButtonProps) => (
  <button className={cn(buttonVariants({ variant, className }))} {...props} />
);
