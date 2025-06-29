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
import { cn, parseQueryParams } from "@/lib/utils";
import {
  AlertTriangle,
  ChevronDownIcon,
  ChevronUpIcon,
  Edit,
  Ellipsis,
  EllipsisVertical,
  Pencil,
  Trash,
  User,
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
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { PRCMSchema, QueryParams } from "@/lib/types";
import { SummaryAuditProgramForm } from "../forms/summary-audit-program-form";
import { PRCMForm } from "../forms/prcm-form";
import Link from "next/link";
import { Paginator } from "../shared/paginator";

type PRCMValues = z.infer<typeof PRCMSchema>;

const columns: ColumnDef<PRCMValues>[] = [
  {
    id: "reference",
    header: () => (
      <Label className="font-helvetica-table-14">
        <User
          size={15}
          strokeWidth={2}
          className="inline-block mb-1 mr-[3px]"
        />
        Reference
      </Label>
    ),
    accessorKey: "summary_audit_program",
    cell: ({ row }) => {
      if (typeof window !== undefined) {
        const params: QueryParams = parseQueryParams(window.location.search);
        return (
          <Link
            replace
            href={
              row.original.reference
                ? `/eAuditNext/engagement/?id=${params.id}&action=${row.original.summary_audit_program}&name=${params.name}`
                : "#"
            }
            className="ml-2 font-helvetica-table-13 text-blue-700 hover:underline  truncate">
            {row.original.reference ? row.original.reference : "N/A"}
          </Link>
        );
      } else {
        return <div></div>;
      }
    },
  },
  {
    id: "process",
    header: () => (
      <Label className="font-helvetica-table-14">
        <User
          size={15}
          strokeWidth={2}
          className="inline-block mb-1 mr-[3px]"
        />
        Process
      </Label>
    ),
    accessorKey: "process",
    cell: ({ row }) => (
      <Label className="ml-2 font-helvetica-input-13 truncate">
        {row.original.process}
      </Label>
    ),
  },
  {
    id: "risk",
    header: () => (
      <Label className="font-helvetica-table-14">
        <User
          size={15}
          strokeWidth={2}
          className="inline-block mb-1 mr-[3px]"
        />
        Risk
      </Label>
    ),
    cell: ({ row }) => (
      <Label className="ml-2 font-helvetica-input-13 truncate">
        {row.original.risk}
      </Label>
    ),
    accessorKey: "risk",
  },
  {
    id: "risk_rating",
    header: () => (
      <Label className="font-helvetica-table-14">Risk Rating</Label>
    ),
    cell: ({ row }) => {
      const rating: { [key: string]: string } = {
        "Low Risk": "bg-green-700",
        "Medium Risk": "bg-yellow-400",
        "High Risk": "bg-amber-700",
        "Very High Risk": "bg-red-700",
      };
      return (
        <section className="flex items-center">
          <div
            className={`w-3 h-3  ${
              rating[row.original.risk_rating]
            } rounded-full`}
          />

          <Label className="ml-2 font-helvetica-table-13 truncate">
            {row.original.risk_rating}
          </Label>
        </section>
      );
    },
    accessorKey: "risk_rating",
  },
  {
    id: "control",
    header: () => (
      <Label className="font-helvetica-table-14">
        <User
          size={15}
          strokeWidth={2}
          className="inline-block mb-1 mr-[3px]"
        />
        Control
      </Label>
    ),
    cell: ({ row }) => (
      <Label className="ml-2 font-helvetica-input-13 truncate">
        {row.original.control}
      </Label>
    ),
    accessorKey: "control",
  },
  {
    id: "control_type",
    header: () => (
      <Label className="font-helvetica-table-14">
        <User
          size={15}
          strokeWidth={2}
          className="inline-block mb-1 mr-[3px]"
        />
        Control Type
      </Label>
    ),
    cell: ({ row }) => (
      <Label className="ml-2 font-helvetica-input-13 truncate">
        {row.original.control_type}
      </Label>
    ),
    accessorKey: "control_type",
  },
  {
    id: "control_objective",
    header: () => (
      <Label className="font-helvetica-table-14">
        <User
          size={15}
          strokeWidth={2}
          className="inline-block mb-1 mr-[3px]"
        />
        Control Objective
      </Label>
    ),
    cell: ({ row }) => (
      <Label className="ml-2 font-helvetica-input-13 truncate">
        {row.original.control_objective}
      </Label>
    ),
    accessorKey: "control_objective",
  },
  {
    id: "actions",
    header: () => (
      <Label className="font-helvetica-table-14">
        <EllipsisVertical
          size={15}
          strokeWidth={2}
          className="inline-block mb-1 mr-[3px]"
        />
        More
      </Label>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex justify-center items-center w-full h-full">
          <Popover>
            <PopoverTrigger asChild>
              <Button className="flex justify-center items-center p-1 w-[30px] h-[30px] bg-neutral-200 text-black hover:bg-blue-400">
                <Ellipsis />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[250px] px-1 py-2 bg-neutral-200">
              <div className="flex flex-col gap-1">
                {row.original.summary_audit_program === null ? (
                  <SummaryAuditProgramForm
                    title="Work Program"
                    endpoint="engagements/summary_audit_program"
                    prcm_id={row.original.id ?? null}>
                    <Button
                      variant="ghost"
                      className="w-full bg-neutral-200 text-black shadow-none rounded-md px-4 flex items-center justify-start gap-2 h-[30px] font-helvetica-13 hover:bg-blue-400">
                      <Pencil size={16} strokeWidth={2} />
                      Work Program
                    </Button>
                  </SummaryAuditProgramForm>
                ) : null}

                <PRCMForm
                  data={{
                    process: row.original.process,
                    risk: row.original.risk,
                    risk_rating: row.original.risk_rating,
                    control: row.original.control,
                    control_objective: row.original.control_objective,
                    control_type: row.original.control_type,
                  }}
                  title="Add PRCM"
                  endpoint="engagements/PRCM"
                  id={row?.original?.id ?? null}>
                  <Button
                    variant={"ghost"}
                    className="w-full bg-neutral-200 text-black shadow-none rounded-md px-4 flex items-center justify-start gap-2 h-[30px] font-helvetica-13 hover:bg-blue-400">
                    <Edit size={16} strokeWidth={2} />
                    Edit
                  </Button>
                </PRCMForm>
                <Button
                  variant="ghost"
                  className="w-full bg-neutral-200 text-black shadow-none rounded-md px-4 flex items-center justify-start gap-2 h-[30px] font-helvetica-13 hover:bg-blue-400">
                  <Trash size={16} strokeWidth={2} className="text-red-800" />
                  Delete
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      );
    },
    maxSize: 70,
    size: 100,
  },
];

interface PRCMTableProps {
  data: PRCMValues[];
}

export const PRCMTable = ({ data }: PRCMTableProps) => {
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
    <section className="table-container [&>div]:max-h-[400px]">
      <section>
        <Label className="font-helvetica-14">
          <AlertTriangle
            size={20}
            strokeWidth={3}
            className="inline-block mr-2 mb-[6px] text-red-700"
          />
          Process Risk Control Matrix
        </Label>
      </section>
      <Table
        className="table-fixed"
        style={{
          width: Math.max(table.getCenterTotalSize(), window.innerWidth - 332),
        }}>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className="relative h-10 select-none"
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
                    className="truncate border-l border-l-neutral-800">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center font-helvetica-table-13">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Paginator
        currentPage={table.getState().pagination.pageIndex + 1}
        totalPages={table.getPageCount()}
        onPageChange={table.setPageIndex}
        canPreviousPage={table.getCanPreviousPage()}
        canNextPage={table.getCanNextPage()}
        pages={pages}
        showLeftEllipsis={showLeftEllipsis}
        showRightEllipsis={showRightEllipsis}
      />
    </section>
  );
};
