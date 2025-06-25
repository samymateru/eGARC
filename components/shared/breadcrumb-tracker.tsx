"use client";

import { pushBreadcrumb, removeBreadcrumbByLabel } from "@/lib/utils";
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
  const params = useSearchParams();

  useEffect(() => {
    const fullUrl = getNormalizedUrl(pathname, searchParams);
    const label = getLabelFromRoute(pathname, searchParams);

    // Load session history
    const history: string[] = JSON.parse(
      sessionStorage.getItem(HISTORY_KEY) || "[]"
    );

    const last = history[history.length - 1];

    const existingIndex = history.indexOf(fullUrl);

    if (fullUrl === "/?" || fullUrl === "/") {
      sessionStorage.setItem(HISTORY_KEY, JSON.stringify([]));
      localStorage.setItem("breadcrumbs", JSON.stringify([]));
      return;
    }

    if (existingIndex === -1) {
      if (label !== "Page") {
        pushBreadcrumb(label, fullUrl);
      }
      history.push(fullUrl);
      sessionStorage.setItem(HISTORY_KEY, JSON.stringify(history));
      return;
    } else {
      // starting here
      if (pathname === "/eAuditNext/engagements") {
        const data = history.filter((url) => {
          if (url.includes("/eAuditNext/engagement?id")) {
            removeBreadcrumbByLabel(url);
            console.log("engagement present, removing:", url);
            return false;
          }
          if (url.includes("/preferences?organization")) {
            removeBreadcrumbByLabel(url);
            console.log("preferences present, removing:", url);
            return false;
          }
          return true;
        });
        sessionStorage.setItem(HISTORY_KEY, JSON.stringify(data));
        return;
      }

      // starting here
      if (pathname === "/eAuditNext/engagement") {
        const data = history.filter((url) => {
          if (url.includes("/preferences?organization")) {
            removeBreadcrumbByLabel(url);
            console.log("preferences present, removing:", url);
            return false;
          }
          return true;
        });
        sessionStorage.setItem(HISTORY_KEY, JSON.stringify(data));
        return;
      }

      // starting here
      if (pathname === "/eAuditNext") {
        const data = history.filter((url) => {
          if (url.includes("/eAuditNext/engagement?id")) {
            removeBreadcrumbByLabel(url);
            console.log("engagement present, removing:", url);
            return false;
          }
          if (url.includes("/preferences?organization")) {
            removeBreadcrumbByLabel(url);
            console.log("preferences present, removing:", url);
            return false;
          }
          if (url.includes("/eAuditNext/engagements?id")) {
            removeBreadcrumbByLabel(url);
            console.log("annual engagements present, removing:", url);
            return false;
          }
          return true;
        });
        sessionStorage.setItem(HISTORY_KEY, JSON.stringify(data));
        return;
      }
    }

    if (!last) {
      // First load
      if (label !== "Page") {
        pushBreadcrumb(label, fullUrl);
      }
      history.push(fullUrl);
      sessionStorage.setItem(HISTORY_KEY, JSON.stringify(history));
      return;
    }

    if (fullUrl === last) return;
  }, [pathname, searchParams, params]);

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
