"use client";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  Ellipsis,
  Pencil,
  Trash,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePagination } from "@/hooks/use-pagination";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { RiskControlSchema } from "@/lib/types";
import { RiskControlForm } from "../forms/risk-control-form";

type PRCMValues = z.infer<typeof RiskControlSchema>;

const columns: ColumnDef<PRCMValues>[] = [
  {
    id: "risk",
    header: () => <Label className="font-table">Risk</Label>,
    cell: ({ row }) => (
      <Label className="ml-2 font-table truncate text-balance">
        {row.original.risk}
      </Label>
    ),
    accessorKey: "risk",
  },
  {
    id: "risk_rating",
    header: () => <Label className="font-table">Risk Rating</Label>,
    cell: ({ row }) => (
      <Label className="ml-2 font-table truncate text-balance">
        {row.original.risk_rating}
      </Label>
    ),
    accessorKey: "risk_rating",
  },
  {
    id: "control",
    header: () => <Label className="font-table">Control</Label>,
    cell: ({ row }) => (
      <Label className="ml-2 font-table truncate text-balance">
        {row.original.control}
      </Label>
    ),
    accessorKey: "control",
  },
  {
    id: "control_type",
    header: () => <Label className="font-table">Control Type</Label>,
    cell: ({ row }) => (
      <Label className="ml-2 font-table truncate text-balance">
        {row.original.control_type}
      </Label>
    ),
    accessorKey: "control_type",
  },
  {
    id: "control_objective",
    header: () => <Label className="font-table">Control Objective</Label>,
    cell: ({ row }) => (
      <Label className="ml-2 font-table truncate text-balance">
        {row.original.control_objective}
      </Label>
    ),
    accessorKey: "control_objective",
  },
  {
    id: "actions",
    header: () => <Label className="font-table">More</Label>,
    cell: ({ row }) => {
      return (
        <div className="flex justify-center items-center w-full h-full">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="flex justify-center items-center p-1 w-[30px] h-[30px]"
                variant="ghost">
                <Ellipsis />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[250px] px-1 py-2 dark:bg-black">
              <div className="flex flex-col divide-y">
                <RiskControlForm
                  data={{
                    risk: row.original.risk,
                    risk_rating: row.original.risk_rating,
                    control: row.original.control,
                    control_objective: row.original.control_objective,
                    control_type: row.original.control_type,
                  }}
                  mode="update"
                  title="Edit Risk Control"
                  id={row.original.id ?? null}
                  endpoint="engagements/sub_program/risk_control">
                  <Button
                    variant="ghost"
                    className="w-full flex justify-start gap-2 items-center h-[30px]">
                    <Pencil size={16} strokeWidth={3} />
                    Edit
                  </Button>
                </RiskControlForm>
                <Button
                  variant="ghost"
                  className="w-full dark:hover:bg-neutral-800 rounded-md px-4 flex items-center justify-start gap-2 h-8 font-table">
                  <Trash size={16} strokeWidth={3} className="text-red-800" />
                  Delete
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      );
    },
  },
];

interface RiskControlTableProps {
  data: PRCMValues[];
}

export const RiskControlTable = ({ data }: RiskControlTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnOrder, setColumnOrder] = useState<string[]>(
    columns.map((column) => column.id as string)
  );

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const table = useReactTable({
    data,
    columns,
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    state: {
      sorting,
      pagination,
      columnOrder,
    },
    onColumnOrderChange: setColumnOrder,
    enableSortingRemoval: false,
  });

  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage: table.getState().pagination.pageIndex + 1,
    totalPages: table.getPageCount(),
    paginationItemsToDisplay: 5,
  });

  return (
    <div className="w-full">
      <Table
        className="table-fixed"
        style={{
          width: Math.max(table.getCenterTotalSize(), window.innerWidth - 320),
        }}>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-muted/50">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className="relative h-10 border-t select-none last:[&>.cursor-col-resize]:opacity-0"
                    aria-sort={
                      header.column.getIsSorted() === "asc"
                        ? "ascending"
                        : header.column.getIsSorted() === "desc"
                        ? "descending"
                        : "none"
                    }
                    {...{
                      colSpan: header.colSpan,
                      style: {
                        width: header.getSize(),
                      },
                    }}>
                    {header.isPlaceholder ? null : (
                      <div
                        className={cn(
                          header.column.getCanSort() &&
                            "flex h-full cursor-pointer items-center justify-between gap-2 select-none"
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                        onKeyDown={(e) => {
                          // Enhanced keyboard handling for sorting
                          if (
                            header.column.getCanSort() &&
                            (e.key === "Enter" || e.key === " ")
                          ) {
                            e.preventDefault();
                            header.column.getToggleSortingHandler()?.(e);
                          }
                        }}
                        tabIndex={header.column.getCanSort() ? 0 : undefined}>
                        <span className="truncate">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </span>
                        {{
                          asc: (
                            <ChevronUpIcon
                              className="shrink-0 opacity-60"
                              size={16}
                              aria-hidden="true"
                            />
                          ),
                          desc: (
                            <ChevronDownIcon
                              className="shrink-0 opacity-60"
                              size={16}
                              aria-hidden="true"
                            />
                          ),
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                    {header.column.getCanResize() && (
                      <div
                        {...{
                          onDoubleClick: () => header.column.resetSize(),
                          onMouseDown: header.getResizeHandler(),
                          onTouchStart: header.getResizeHandler(),
                          className:
                            "absolute top-0 h-full w-4 cursor-col-resize user-select-none touch-none -right-2 z-10 flex justify-center before:absolute before:w-px before:inset-y-0 before:bg-border before:translate-x-px",
                        }}
                      />
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="truncate">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div>
        <Pagination>
          <PaginationContent>
            {/* Previous page button */}
            <PaginationItem>
              <Button
                size="icon"
                variant="outline"
                className="disabled:pointer-events-none disabled:opacity-50"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                aria-label="Go to previous page">
                <ChevronLeftIcon size={16} aria-hidden="true" />
              </Button>
            </PaginationItem>

            {/* Left ellipsis (...) */}
            {showLeftEllipsis && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {/* Page number buttons */}
            {pages.map((page) => {
              const isActive =
                page === table.getState().pagination.pageIndex + 1;
              return (
                <PaginationItem key={page}>
                  <Button
                    size="icon"
                    variant={`${isActive ? "outline" : "ghost"}`}
                    onClick={() => table.setPageIndex(page - 1)}
                    aria-current={isActive ? "page" : undefined}>
                    {page}
                  </Button>
                </PaginationItem>
              );
            })}

            {/* Right ellipsis (...) */}
            {showRightEllipsis && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {/* Next page button */}
            <PaginationItem>
              <Button
                size="icon"
                variant="outline"
                className="disabled:pointer-events-none disabled:opacity-50"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                aria-label="Go to next page">
                <ChevronRightIcon size={16} aria-hidden="true" />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};
