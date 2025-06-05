import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatLabel(text?: string): string {
  // Step 1: Insert space before uppercase letters (except the first char)
  const spaced = text?.replace(/([a-z])([A-Z])/g, "$1 $2");

  // Step 2: Fix common typo 'Requiered' → 'Required'
  const fixed = spaced?.replace(/Requiered/g, "Required");

  // Step 3: Capitalize each word (optional)
  const capitalized = fixed ?? ""
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  return capitalized;
}