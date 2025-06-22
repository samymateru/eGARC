"use client";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
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
  CirclePlus,
  Edit,
  Ellipsis,
  Eye,
  Trash2,
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
import { PlanSchema } from "@/lib/types";
import Link from "next/link";
import SearchInput from "../shared/search-input";
import MultiStatusFilter from "../shared/multi-status-filter";
import { PlanningForm } from "../forms/create-audit-plan-form";
import { useSearchParams } from "next/navigation";

type AnnualAuditPlanningValues = z.infer<typeof PlanSchema>;

const columns: ColumnDef<AnnualAuditPlanningValues>[] = [
  {
    id: "reference",
    header: () => <Label className="font-helvetica-table-14">Reference</Label>,
    accessorKey: "reference",
    cell: ({ row }) => (
      <Link
        href={{
          pathname: "/eAuditNext/engagements",
          query: { id: row.original.id, plan: row.original.name },
        }}
        className="ml-2 font-helvetica-table-13 text-blue-700 cursor-pointer hover:underline w-full text-center">
        {row?.original?.reference}
      </Link>
    ),
  },
  {
    id: "name",
    header: () => <Label className="font-helvetica-table-14">Name</Label>,
    accessorKey: "name",
    cell: ({ row }) => (
      <Label className="ml-2 font-helvetica-table-13 truncate">
        {row.original.name}
      </Label>
    ),
  },
  {
    id: "year",
    header: () => <Label className="font-helvetica-table-14">Year</Label>,
    cell: ({ row }) => (
      <Label className="ml-2 font-helvetica-table-13 truncate">
        {row.original.year}
      </Label>
    ),
    accessorKey: "year",
  },
  {
    id: "status",
    header: () => <Label className="font-helvetica-table-14">Status</Label>,
    cell: ({ row }) => (
      <Label className="ml-2 font-helvetica-table-13 truncate">
        {row.original.status}
      </Label>
    ),
    accessorKey: "status",
  },
  {
    id: "start",
    header: () => <Label className="font-helvetica-table-14">Start</Label>,
    accessorKey: "start",
    cell: ({ row }) => {
      const formatted = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(row.getValue("start")));
      return (
        <Label className="ml-2 font-helvetica-table-13 truncate">
          {formatted}
        </Label>
      );
    },
  },
  {
    id: "end",
    header: () => <Label className="font-helvetica-table-14">End</Label>,
    accessorKey: "end",
    cell: ({ row }) => {
      const formatted = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(row.getValue("end")));
      return (
        <Label className="ml-2 font-helvetica-table-13 truncate">
          {formatted}
        </Label>
      );
    },
  },
  {
    id: "attachment",
    header: () => <Label className="font-helvetica-table-14">Attachment</Label>,
    accessorKey: "attachment",
    cell: ({ row }) => (
      <a
        href={row.getValue("attachment")}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline font-helvetica-table-13">
        View Attachment
      </a>
    ),
  },
  {
    id: "actions",
    header: () => (
      <Label className="font-helvetica-table-14 flex justify-center">
        Actions
      </Label>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center items-center w-full h-full">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              className="flex justify-center items-center p-1 w-[30px] h-[30px] hover:bg-blue-400 bg-neutral-200 text-black"
              variant="ghost">
              <Ellipsis />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[250px] px-1 py-2 bg-neutral-200">
            <div className="flex flex-col gap-1">
              <Link
                href={{
                  pathname: "/eAuditNext/engagements",
                  query: { id: row.original.id, plan: row.original.name },
                }}
                className="w-full rounded-md px-4 flex items-center justify-start gap-2 h-[30px] font-helvetica-13 hover:bg-blue-400">
                <Eye size={16} strokeWidth={2} />
                View
              </Link>
              <PlanningForm
                data={{
                  name: row.original.name,
                  year: row.original.year,
                  start: new Date(row.original.start),
                  end: new Date(row.original.end),
                }}
                endpoint="annual_plans"
                title="Edit Plan"
                mode="update"
                company_module_id={row.original.id}>
                <Button
                  variant="ghost"
                  className="w-full rounded-md px-4 flex items-center justify-start gap-2 h-[30px] font-helvetica-13 hover:bg-blue-400">
                  <Edit size={16} strokeWidth={2} />
                  Edit
                </Button>
              </PlanningForm>
              <Button
                variant="ghost"
                className="w-full rounded-md px-4 flex items-center justify-start gap-2 h-[30px] font-helvetica-13 hover:bg-blue-400">
                <Trash2 className="text-red-800" size={16} strokeWidth={2} />
                Delete
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    ),
    maxSize: 70,
    size: 100,
  },
];

interface AnnualAuditPlanningTableProps {
  data: AnnualAuditPlanningValues[];
}

export default function AnnualAuditPlanningTable({
  data,
}: AnnualAuditPlanningTableProps) {
  const params = useSearchParams();
  const [sorting, setSorting] = useState<SortingState>([]);

  const [columnOrder, setColumnOrder] = useState<string[]>(
    columns.map((column) => column.id as string)
  );

  const [searchName, setSearchName] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [tableData, setTableData] = useState<AnnualAuditPlanningValues[]>([]);

  const statusOptions = useMemo(() => {
    return Array.from(new Set(data.map((item) => String(item.status))));
  }, [data]);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 9,
  });

  useEffect(() => {
    const filtered = data.filter((row) => {
      const matchesName = row.name
        .toLowerCase()
        .includes(searchName.toLowerCase());

      const matchesStatus =
        selectedStatuses.length === 0 ||
        selectedStatuses.includes(row.status ?? "");

      return matchesName && matchesStatus;
    });
    setTableData(filtered);
  }, [data, searchName, selectedStatuses]);

  const table = useReactTable({
    data: tableData,
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
    <div className="">
      <div className="flex justify-between items-center  py-3 px-2">
        <section className="flex items-center gap-3">
          <SearchInput
            placeholder="Plan name"
            value={searchName}
            onChange={setSearchName}
          />
          <MultiStatusFilter
            options={statusOptions}
            value={selectedStatuses}
            onChange={setSelectedStatuses}
          />
        </section>
        <section className="flex-1 flex items-center justify-end pr-2">
          <PlanningForm
            data={{
              name: "",
              year: "",
            }}
            endpoint="annual_plans"
            title="Audit Plan"
            mode="create"
            company_module_id={params.get("id") ?? undefined}>
            <Button className="bg-black text-white flex items-center gap-2 h-[30px] w-[130px] justify-start font-helvetica-13">
              <CirclePlus size={16} strokeWidth={3} />
              Plan
            </Button>
          </PlanningForm>
        </section>
      </div>
      <Table
        className="table-fixed mx-auto"
        style={{
          width: Math.max(table.getCenterTotalSize(), window.innerWidth - 320),
        }}>
        <TableHeader className="border-r border-r-neutral-500">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-muted/50">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className="relative h-10 border- border-x border-x-neutral-500 select-none last:[&>.cursor-col-resize]:opacity-0 border-l border-l-neutral-800 border-y border-y-neutral-500 text-black"
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
        <TableBody className="border-r border-r-neutral-500">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="truncate border-l border-l-neutral-500">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-black font-helvetica-table-13">
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
}
