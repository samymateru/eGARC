import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import { Button } from "../ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Label } from "../ui/label";

interface PaginatorProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageIndex: number) => void;
  canPreviousPage: boolean;
  canNextPage: boolean;
  pages: number[];
  showLeftEllipsis: boolean;
  showRightEllipsis: boolean;
}

export const Paginator = ({
  currentPage,
  totalPages,
  onPageChange,
  canPreviousPage,
  canNextPage,
  pages,
  showLeftEllipsis,
  showRightEllipsis,
}: PaginatorProps) => {
  return (
    <div className="grow pt-1 flex items-center justify-center">
      <Pagination>
        <PaginationContent>
          {/* Previous Button */}
          <PaginationItem>
            <Button
              size="icon"
              onClick={() => onPageChange(currentPage - 2)}
              disabled={!canPreviousPage}
              aria-label="Go to previous page">
              <ChevronLeftIcon size={16} aria-hidden="true" />
            </Button>
          </PaginationItem>

          {/* Left Ellipsis */}
          {showLeftEllipsis && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {/* Page Buttons */}
          {pages.map((page) => {
            const isActive = page === currentPage;
            return (
              <PaginationItem key={page}>
                <Button
                  className={`bg-black text-white ${
                    isActive ? "bg-blue-700" : "bg-black"
                  }`}
                  size="icon"
                  onClick={() => onPageChange(page - 1)}
                  aria-current={isActive ? "page" : undefined}>
                  {page}
                </Button>
              </PaginationItem>
            );
          })}

          {/* Right Ellipsis */}
          {showRightEllipsis && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {/* Next Button */}
          <PaginationItem>
            <Button
              size="icon"
              onClick={() => onPageChange(currentPage)}
              disabled={!canNextPage}
              aria-label="Go to next page">
              <ChevronRightIcon size={16} aria-hidden="true" />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <section className="flex items-center gap-2 pr-2">
        <Label className="font-helvetica-13 text-nowrap">Total pages:</Label>
        <Label className="font-helvetica-13">{totalPages}</Label>
      </section>
    </div>
  );
};
