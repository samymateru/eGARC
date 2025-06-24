import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { QueryParams, Search } from "./types";
import { ErrorHandler } from "@/components/shared/error-handler";
import { showToast } from "@/components/shared/toast";

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


export const ErrorMessage = (error: unknown) => {
    if (
      typeof error === "object" &&
      error !== null &&
      "body" in error &&
      "status" in error
    ) {
      const err = error as { status: number; body?: { detail?: string } };
      ErrorHandler({
        status: err.status,
        body: { detail: err.body?.detail },
      });
    } else {
      showToast("Service Down", "error");
    }
}

export const pushBreadcrumb = (label: string, href: string) => {
  if (typeof window === 'undefined') return;

  let existing: { label: string; href: string }[] = JSON.parse(
    localStorage.getItem('breadcrumbs') || '[]'
  );

  // ✅ Prevent adding duplicate label+href
  const alreadyExists = existing.some(
    (b) => b.label === label && b.href === href
  );
  if (alreadyExists) return;

  existing = existing.filter((b) => b.label !== label); // optional if you want to remove same-label entries
  existing.push({ label, href });

  localStorage.setItem('breadcrumbs', JSON.stringify(existing));
  window.dispatchEvent(new Event('breadcrumbChange'))
};


export const removeBreadcrumbByLabel = (label: string) => {
  if (typeof window === 'undefined') return;

  const existing: {label?: string, href?: string}[] = JSON.parse(localStorage.getItem('breadcrumbs') || '[]');

  const filtered = existing.filter((b) => b.label !== label);

  localStorage.setItem('breadcrumbs', JSON.stringify(filtered));
  window.dispatchEvent(new Event('breadcrumbChange'));
};

export const removeLastBreadcrumb = (labelsToRemove: string[]) => {
  if (typeof window === 'undefined') return;

  const breadcrumbs: { label: string; url: string }[] = JSON.parse(
    localStorage.getItem('breadcrumbs') || '[]'
  );

  const updated = breadcrumbs.filter(
    (b) => !labelsToRemove.includes(b.label)
  );

  localStorage.setItem('breadcrumbs', JSON.stringify(updated));

  // Optional: Notify UI
  window.dispatchEvent(new Event('breadcrumbChange'));

};

export function capitalizeWords(input: string): string {
  return input
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function parseQueryParams(query: string): QueryParams {
  const params = new URLSearchParams(query);
  return {
    id: params.get("id"),
    action: params.get("action"),
    name: params.get("name"),
  };
}