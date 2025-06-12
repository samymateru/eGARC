import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Search } from "./types";

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

export const saveSearchToLocalStorage = (search: Search) => {

  const stored = localStorage.getItem("search");

  let searchArray: Search[] = [];
  try {
    if (stored) {
      searchArray = JSON.parse(stored);
      if (!Array.isArray(searchArray)) {
        searchArray = [];
      }
    }
  } catch {
    searchArray = [];
  }
  const isDuplicate = searchArray.some(item => item.value === search.value);

  if (!isDuplicate) {
    searchArray.push(search);
    localStorage.setItem("search", JSON.stringify(searchArray));
  }
}

export const deleteSearchFromLocalStorage = (valueToRemove: string) => {
  const stored = localStorage.getItem("search");

  let searchArray: Search[] = [];
  try {
    if (stored) {
      searchArray = JSON.parse(stored);
      if (!Array.isArray(searchArray)) {
        searchArray = [];
      }
    }
  } catch {
    searchArray = [];
  }

  const updatedArray = searchArray.filter(item => item.value !== valueToRemove);

  localStorage.setItem("search", JSON.stringify(updatedArray));
};
