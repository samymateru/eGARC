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

import { ChevronDownIcon, ChevronUpIcon, Ellipsis } from "lucide-react";

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
import { SummaryAuditProcessSchema } from "@/lib/types";
import SearchInput from "../shared/search-input";
import MultiStatusFilter from "../shared/multi-status-filter";
import { Paginator } from "../shared/paginator";

type SummaryAuditProcessValues = z.infer<typeof SummaryAuditProcessSchema>;

const columns: ColumnDef<SummaryAuditProcessValues>[] = [
  {
    id: "name",
    header: () => <Label className="font-helvetica-table-14">Program</Label>,
    accessorKey: "name",
    cell: ({ row }) => (
      <Label className="ml-2 font-helvetica-table-13 truncate">
        {row.original.name}
      </Label>
    ),
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
    id: "process_rating",
    header: () => <Label className="font-helvetica-table-14">Rating</Label>,
    cell: ({ row }) => (
      <Label className="ml-2 font-helvetica-table-13 truncate">
        {row.original.process_rating}
      </Label>
    ),
    accessorKey: "process_rating",
  },
  {
    id: "issue_count",
    header: () => (
      <Label className="font-helvetica-table-14">Total Issues</Label>
    ),
    accessorKey: "issue_count",
    cell: ({ row }) => {
      return (
        <Label className="ml-7 font-helvetica-table-13 truncate">
          {row.original.issue_count}
        </Label>
      );
    },
  },
  {
    id: "low_risk",
    header: () => <Label className="font-helvetica-table-14">Low Risk</Label>,
    accessorKey: "low_risk",
    cell: ({ row }) => {
      return (
        <Label className="ml-7 font-helvetica-table-13 truncate">
          {row.original.acceptable + row.original.improvement_required}
        </Label>
      );
    },
  },
  {
    id: "high_risk",
    header: () => <Label className="font-helvetica-table-14">High Risk</Label>,
    accessorKey: "high_risk",
    cell: ({ row }) => {
      return (
        <Label className="ml-7 font-helvetica-table-13 truncate">
          {row.original.unacceptable +
            row.original.significant_improvement_required}
        </Label>
      );
    },
  },
  {
    id: "recurring_issues",
    header: () => (
      <Label className="font-helvetica-table-14">Recurring Issues</Label>
    ),
    accessorKey: "recurring_issues",
    cell: ({ row }) => {
      return (
        <Label className="ml-10 font-helvetica-table-13 truncate">
          {row.original.recurring_issues}
        </Label>
      );
    },
  },
  {
    id: "rating",
    header: () => <Label className="font-helvetica-table-14">Rating</Label>,
    accessorKey: "rating",
    cell: () => {
      return (
        <Label className="ml-10 font-helvetica-table-13 truncate">
          {"N/A"}
        </Label>
      );
    },
  },
  {
    id: "actions",
    header: () => <Label className="font-helvetica-table-14">Actions</Label>,
    cell: () => (
      <div className="flex justify-center items-center w-full h-full">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              className="flex justify-center items-center p-1 w-[30px] h-[30px] bg-neutral-200 text-black hover:bg-blue-400"
              variant="ghost">
              <Ellipsis />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[250px] px-1 py-2 bg-neutral-200"></PopoverContent>
        </Popover>
      </div>
    ),
    maxSize: 70,
    size: 100,
  },
];

interface SummaryAuditProcessTableProps {
  data: SummaryAuditProcessValues[];
}

export const SummaryAuditProcessTable = ({
  data,
}: SummaryAuditProcessTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnOrder, setColumnOrder] = useState<string[]>(
    columns.map((column) => column.id as string)
  );

  const [program, setProgam] = useState("");
  const [status, setStatus] = useState<string[]>([]);
  const [tableData, setTableData] = useState<SummaryAuditProcessValues[]>([]);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const statusOptions = useMemo(() => {
    return Array.from(new Set(data.map((item) => String(item?.status))));
  }, [data]);

  useEffect(() => {
    const filtered = data.filter((row) => {
      const matchedProgram =
        row?.name ?? "".toLowerCase().includes(program.toLowerCase());

      const matchedStatus =
        status.length === 0 || status.includes(row.status ?? "");

      return matchedProgram && matchedStatus;
    });
    setTableData(filtered);
  }, [data, status, program]);

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
    <section className="table-container [&>div]:max-h-[230px]">
      <div className="flex items-center justify-between  pb-1 w-[calc(100vw-332px)] py-2 px-2">
        <section className="flex items-center gap-2">
          <SearchInput
            placeholder="Program name"
            value={program}
            onChange={setProgam}
          />
          <MultiStatusFilter
            options={statusOptions}
            value={status}
            onChange={setStatus}
            title="Status"
          />
        </section>
      </div>
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
                    className="truncate border-l border-l-neutral-500 text-black">
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
