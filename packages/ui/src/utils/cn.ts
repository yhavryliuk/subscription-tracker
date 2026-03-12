import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes with clsx and tailwind-merge.
 * clsx provides objects and conditions: { 'opacity-50': disabled }
 * twMerge removes conflicts Tailwind (example: 'px-2 px-4' -> 'px-4')
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
