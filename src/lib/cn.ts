import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn — compose Tailwind class names safely.
 * Merges conditional classes (clsx) and de-duplicates conflicting Tailwind
 * utilities (tailwind-merge). Used across all components per the components spec.
 *
 * NOTE: requires `clsx` + `tailwind-merge` (installed in CH-01's dep step).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
