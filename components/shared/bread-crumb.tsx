"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

interface Crumb {
  url: string;
  label: string;
}

const buildBreadcrumbs = (
  pathname: string,
  searchParams: URLSearchParams
): Crumb[] => {
  const breadcrumbs: Crumb[] = [];

  // ✅ Always start with /eAuditNext (no params)
  breadcrumbs.push({
    url: `/eAuditNext`,
    label: "eAuditNext",
  });

  // ✅ /preferences
  if (pathname === "/eAuditNext/preferences") {
    breadcrumbs.push({
      url: `/eAuditNext/preferences`,
      label: "Preferences",
    });
  }

  // ✅ /engagements (with plan and id)
  if (pathname === "/eAuditNext/engagements") {
    const query = new URLSearchParams();
    const plan = searchParams.get("plan");
    const id = searchParams.get("id");

    if (plan) query.set("plan", plan);
    if (id) query.set("id", id);

    breadcrumbs.push({
      url: `/eAuditNext/engagements${
        query.toString() ? `?${query.toString()}` : ""
      }`,
      label: plan || "Engagements",
    });
  }

  // ✅ /engagement (with name, plan, id)
  if (pathname === "/eAuditNext/engagement") {
    const plan = searchParams.get("plan");
    const name = searchParams.get("name");
    const id = searchParams.get("id");

    // Optional: parent breadcrumb to /engagements if plan exists
    if (plan) {
      const engagementsQuery = new URLSearchParams();
      engagementsQuery.set("plan", plan);

      breadcrumbs.push({
        url: `/eAuditNext/engagements?${engagementsQuery.toString()}`,
        label: plan,
      });
    }

    const engagementQuery = new URLSearchParams();
    if (id) engagementQuery.set("id", id);
    if (name) engagementQuery.set("name", name);
    if (plan) engagementQuery.set("plan", plan); // include plan for backward nav

    breadcrumbs.push({
      url: `/eAuditNext/engagement?${engagementQuery.toString()}`,
      label: name || "Engagement",
    });
  }

  return breadcrumbs;
};

const Breadcrumbs = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [breadcrumbs, setBreadcrumbs] = useState<Crumb[]>([]);

  useEffect(() => {
    const crumbs = buildBreadcrumbs(pathname, searchParams);
    setBreadcrumbs(crumbs);
  }, [pathname, searchParams]);

  return (
    <nav aria-label="breadcrumb" className="breadcrumbs">
      {breadcrumbs.map((crumb, idx) => (
        <span key={crumb.url}>
          <Link href={crumb.url}>{crumb.label}</Link>
          {idx < breadcrumbs.length - 1 && <span> &gt; </span>}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
