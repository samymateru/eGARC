"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const HISTORY_KEY = "breadcrumbHistory";

const getNormalizedUrl = (pathname: string, searchParams: URLSearchParams) => {
  const allowedParams = ["id", "name", "plan", "organizationId", "moduleId"];
  const filteredParams = new URLSearchParams();

  for (const key of allowedParams) {
    const value = searchParams.get(key);
    if (value) filteredParams.set(key, value);
  }

  return `${pathname}?${filteredParams.toString()}`;
};

const Tracker = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname === "/") return;
    const fullUrl = getNormalizedUrl(pathname, searchParams);
    const raw = sessionStorage.getItem(HISTORY_KEY);
    const history: string[] = raw ? JSON.parse(raw) : [];

    // Remove any entries with the same path (to avoid duplicates)
    const cleanedHistory = history.filter(
      (url) => url.split("?")[0] !== pathname
    );

    // Add the current URL
    cleanedHistory.push(fullUrl);

    // Save the updated history
    sessionStorage.setItem(HISTORY_KEY, JSON.stringify(cleanedHistory));
  }, [pathname, searchParams]);

  return null;
};

export default Tracker;
