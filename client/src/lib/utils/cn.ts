// lib/utils/cn.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines Tailwind classes and resolves conflicts.
 * Use this instead of string templates for cleaner className logic.
 */
export default function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}
