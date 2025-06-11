"use client";

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
  CircleCheck,
  Ellipsis,
  Info,
  Pencil,
  SendHorizonal,
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
import { TasksSchema } from "@/lib/types";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { ResolveTaskForm } from "../forms/resolve-task-form";
import { TaskDecisionForm } from "../forms/task-decision-form";

enum Status {
  PENDING = "Pending",
  ONGOING = "Ongoing",
  CLOSED = "Closed",
}
type TasksValues = z.infer<typeof TasksSchema>;

interface TasksTableProps {
  data: TasksValues[];
}

export const TasksTable = ({ data }: TasksTableProps) => {
  const params = useSearchParams();
  const columns: ColumnDef<TasksValues>[] = [
    {
      id: "reference",
      header: () => <Label className="font-table">Reference</Label>,
      accessorKey: "reference",
      cell: ({ row }) => (
        <Link
          replace
          href={row?.original?.href ?? "#"}
          className="ml-2 font-table truncate text-balance overflow-hidden">
          {row.original.reference}
        </Link>
      ),
    },
    {
      id: "title",
      header: () => <Label className="font-table">Title</Label>,
      cell: ({ row }) => (
        <Label className="ml-2 font-table truncate overflow-hidden">
          {row.original.title}
        </Label>
      ),
      accessorKey: "title",
      size: 300,
    },
    {
      id: "status",
      header: () => <Label className="font-table">Status</Label>,
      accessorKey: "status",
      cell: ({ row }) => (
        <Label className="ml-2 font-table truncate overflow-hidden">
          {row.original.status}
        </Label>
      ),
    },
    {
      id: "decision",
      header: () => <Label className="font-table">Decision</Label>,
      accessorKey: "decision",
      cell: ({ row }) => {
        if (row.original.decision !== null) {
          return (
            <Label className="ml-2 font-table truncate overflow-hidden">
              {row.original.decision}
            </Label>
          );
        } else {
          return (
            <Label className="ml-2 font-table truncate overflow-hidden">
              N/A
            </Label>
          );
        }
      },
    },
    {
      id: "issuer_name",
      header: () => <Label className="font-table">Issuer Name</Label>,
      cell: ({ row }) => (
        <Label className="ml-2 font-table truncate overflow-hidden">
          {row.original.raised_by.name !== null
            ? row.original.raised_by.name
            : "N/A"}
        </Label>
      ),
      accessorKey: "raised_by",
    },
    {
      id: "issuer_email",
      header: () => <Label className="font-table">Issuer Email</Label>,
      cell: ({ row }) => (
        <Label className="ml-2 font-table truncate overflow-hidden">
          {row.original.raised_by?.email !== null
            ? row.original.raised_by?.email
            : "N/A"}
        </Label>
      ),
      accessorKey: "raised_by",
    },
    {
      id: "issued_on",
      header: () => <Label className="font-table">Date Raised</Label>,
      cell: ({ row }) => {
        if (row.original.raised_by !== null) {
          const formatted = new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }).format(new Date(row?.original?.raised_by?.date_issued ?? ""));
          return (
            <Label className="ml-2 font-table truncate overflow-hidden">
              {formatted}
            </Label>
          );
        } else {
          <Label className="ml-2 font-table truncate overflow-hidden">
            N/A
          </Label>;
        }
      },
      accessorKey: "raised_by",
    },
    {
      id: "resolver_name",
      header: () => <Label className="font-table">Resolver Name</Label>,
      cell: ({ row }) => {
        if (row.original.resolved_by !== null) {
          return (
            <Label className="ml-2 font-table truncate overflow-hidden">
              {row.original.resolved_by?.name}
            </Label>
          );
        } else {
          return (
            <Label className="ml-2 font-table truncate overflow-hidden">
              N/A
            </Label>
          );
        }
      },
      accessorKey: "resolved_by",
    },

    {
      id: "resolver_email",
      header: () => <Label className="font-table">Resolver Email</Label>,
      cell: ({ row }) => {
        if (row.original.resolved_by !== null) {
          return (
            <Label className="ml-2 font-table truncate overflow-hidden">
              {row.original.resolved_by?.email}
            </Label>
          );
        } else {
          return (
            <Label className="ml-2 font-table truncate overflow-hidden">
              N/A
            </Label>
          );
        }
      },
      accessorKey: "resolved_by",
    },
    {
      id: "resolved_on",
      header: () => <Label className="font-table">Date Resolved</Label>,
      cell: ({ row }) => {
        if (row.original.resolved_by !== null) {
          const formatted = new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }).format(new Date(row.original.resolved_by.date_issued ?? ""));
          return (
            <Label className="ml-2 font-table truncate overflow-hidden">
              {formatted}
            </Label>
          );
        } else {
          return (
            <Label className="ml-2 font-table truncate overflow-hidden">
              N/A
            </Label>
          );
        }
      },
      accessorKey: "resolved_by",
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
                  <Link
                    className="h-[32px] hover:bg-neutral-800 flex items-center gap-2 justify-start px-4 py-2 rounded-md"
                    replace
                    href={`/eAuditNext/engagement?id=${
                      row.original.engagement
                    }&action=${row.original.id}&name=${params.get(
                      "name"
                    )}&stage=Tasks`}>
                    <Info size={16} strokeWidth={3} />
                    Details
                  </Link>
                  {row.original.status === Status.PENDING ? (
                    <ResolveTaskForm
                      title="Resolve Task"
                      id={row.original.id}
                      endpoint="task/resolve">
                      <Button
                        variant="ghost"
                        className="w-full dark:hover:bg-neutral-800 rounded-md px-4 flex items-center justify-start gap-2 h-8 font-table">
                        <SendHorizonal size={16} strokeWidth={3} />
                        Resolve
                      </Button>
                    </ResolveTaskForm>
                  ) : null}
                  {row.original.status === Status.ONGOING ? (
                    <TaskDecisionForm
                      title="Task Decision"
                      id={row.original.id}
                      endpoint="task/resolve/decision">
                      <Button
                        variant="ghost"
                        className="w-full dark:hover:bg-neutral-800 rounded-md px-4 flex items-center justify-start gap-2 h-8 font-table">
                        <CircleCheck size={16} strokeWidth={3} />
                        Decision
                      </Button>
                    </TaskDecisionForm>
                  ) : null}
                  {row.original.status === Status.PENDING ? (
                    <Button
                      variant="ghost"
                      className="w-full dark:hover:bg-neutral-800 rounded-md px-4 flex items-center justify-start gap-2 h-8 font-table">
                      <Pencil size={16} strokeWidth={3} />
                      Edit
                    </Button>
                  ) : null}

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

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnOrder, setColumnOrder] = useState<string[]>(
    columns.map((column) => column.id as string)
  );

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
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
