"use client";

import { pushBreadcrumb, removeLastBreadcrumb } from "@/lib/utils";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const HISTORY_KEY = "breadcrumbHistory";

const getNormalizedUrl = (pathname: string, searchParams: URLSearchParams) => {
  const allowedParams = ["id", "name", "plan", "organizationId", "moduleId"]; // add only those you care about
  const filteredParams = new URLSearchParams();

  for (const key of allowedParams) {
    const value = searchParams.get(key);
    if (value) filteredParams.set(key, value);
  }

  return `${pathname}?${filteredParams.toString()}`;
};

const BreadcrumbTracker = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fullUrl = getNormalizedUrl(pathname, searchParams);
    const label = getLabelFromRoute(pathname, searchParams);

    // Load session history
    let history: string[] = JSON.parse(
      sessionStorage.getItem(HISTORY_KEY) || "[]"
    );
    const last = history[history.length - 1];

    if (!last) {
      // First load
      if (label !== "Page") {
        pushBreadcrumb(label, fullUrl);
      }
      history.push(fullUrl);
      sessionStorage.setItem(HISTORY_KEY, JSON.stringify(history));
      return;
    }

    if (fullUrl === last) return; // Same as before, skip

    const existingIndex = history.indexOf(fullUrl);

    if (existingIndex > -1) {
      // User went back to a previous page
      removeLastBreadcrumb();
      history = history.slice(0, existingIndex + 1);
    } else {
      if (label !== "Page") {
        pushBreadcrumb(label, fullUrl);
      }
      history.push(fullUrl);
    }

    // Save updated history
    sessionStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [pathname, searchParams]);

  return null;
};

const getLabelFromRoute = (
  pathname: string,
  params: URLSearchParams
): string => {
  if (pathname === "/eAuditNext/engagement")
    return params.get("name") || "Engagement";
  if (pathname === "/eAuditNext/engagements")
    return params.get("plan") || "Engagements";
  if (pathname === "/eAuditNext") return "eAuditNext";
  if (pathname === "/preferences") return "Preferences";
  return "Page";
};

export default BreadcrumbTracker;
