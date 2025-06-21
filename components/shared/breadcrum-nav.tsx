"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { FileText, Folder, Home, Package } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const icons = [
  <Package key={"eadit"} size={16} />,
  <Folder key={"plans"} size={16} />,
  <FileText key={"engagements"} size={16} />,
];

const pages: { [key: string]: string } = {
  dashboard: "Dashboard",
  audit_plan: "Audit Plans",
  follow_up: "Follow Up",
  report: "Report",
};

export const BreadCrumbNavbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [page, setPage] = useState<string | null>("dashboard");
  const [breadcrumbs, setBreadcrumbs] = useState<
    { label: string; href: string }[]
  >([]);

  const loadBreadcrumbs = () => {
    const stored = localStorage.getItem("breadcrumbs");
    if (stored) {
      setBreadcrumbs(JSON.parse(stored));
    } else {
      setBreadcrumbs([]);
    }
  };

  useEffect(() => {
    // Initial load
    loadBreadcrumbs();

    // Listen for breadcrumb changes
    const handleChange = () => loadBreadcrumbs();

    window.addEventListener("breadcrumbChange", handleChange);
    return () => {
      window.removeEventListener("breadcrumbChange", handleChange);
    };
  }, [params, pathname]);

  useEffect(() => {
    if (pathname === "/eAuditNext") {
      setPage(params.get("action"));
    }
  }, [params, pathname]);
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="font-helvetica-13">
          <BreadcrumbLink
            className="font-helvetica-13 text-black flex items-center gap-1 cursor-pointer"
            href="/">
            <Home size={16} strokeWidth={2} className="mb-1" />
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {breadcrumbs.map((crumb, index: number) => (
          <>
            <BreadcrumbItem className="font-helvetica-13" key={index}>
              <BreadcrumbLink
                onClick={() => router.replace(crumb.href)}
                className="font-helvetica-13 text-black flex items-center gap-1 cursor-pointer">
                {icons[index]}
                {crumb.label}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        ))}
        <BreadcrumbItem>
          <BreadcrumbPage className="font-helvetica-13">
            {pathname === "/eAuditNext" ? (page ? pages[page] : "") : ""}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};
