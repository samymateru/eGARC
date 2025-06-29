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
  AlertTriangle,
  ChevronDownIcon,
  ChevronUpIcon,
  Ellipsis,
  EllipsisVertical,
  Folder,
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
import { SummaryProcedureSchema } from "@/lib/types";
import Link from "next/link";
import MultiStatusFilter from "../shared/multi-status-filter";
import SearchInput from "../shared/search-input";
import { Paginator } from "../shared/paginator";

type SummaryProcedureValues = z.infer<typeof SummaryProcedureSchema>;

type QueryParams = {
  id?: string | null;
  action?: string | null;
  name?: string | null;
};

function parseQueryParams(query: string): QueryParams {
  const params = new URLSearchParams(query);
  return {
    id: params.get("id"),
    action: params.get("action"),
    name: params.get("name"),
  };
}

const columns: ColumnDef<SummaryProcedureValues>[] = [
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
    accessorKey: "reference",
    cell: ({ row }) => {
      if (typeof window !== undefined) {
        const params: QueryParams = parseQueryParams(window.location.search);
        return (
          <Link
            replace
            href={`/eAuditNext/engagement/?id=${params.id}&action=${row.original.id}&name=${params.name}`}
            className="ml-2 font-helvetica-table-13 text-blue-700 hover:underline  truncate">
            {row.original.reference}
          </Link>
        );
      } else {
        return <div></div>;
      }
    },
  },
  {
    id: "program",
    header: () => (
      <Label className="font-helvetica-table-14">
        <Folder
          size={15}
          strokeWidth={2}
          className="inline-block mb-1 mr-[3px]"
        />
        Program
      </Label>
    ),
    cell: ({ row }) => (
      <Label className="ml-2 font-helvetica-table-13 truncate">
        {row.original.program}
      </Label>
    ),
    accessorKey: "program",
  },
  {
    id: "title",
    header: () => (
      <Label className="font-helvetica-table-14">
        <Folder
          size={15}
          strokeWidth={2}
          className="inline-block mb-1 mr-[3px]"
        />
        Title
      </Label>
    ),
    cell: ({ row }) => (
      <Label className="ml-2 font-helvetica-table-13 truncate">
        {row.original.title}
      </Label>
    ),
    accessorKey: "title",
  },
  {
    id: "effectiveness",
    header: () => (
      <Label className="font-helvetica-table-14">
        <User
          size={15}
          strokeWidth={2}
          className="inline-block mb-1 mr-[3px]"
        />
        Effectiveness
      </Label>
    ),
    accessorKey: "effectiveness",
    cell: ({ row }) => {
      return (
        <Label className="ml-2 font-helvetica-table-13 truncate">
          {row.original.effectiveness}
        </Label>
      );
    },
  },
  {
    id: "issue",
    header: () => (
      <Label className="font-helvetica-table-14">
        <AlertTriangle
          size={15}
          strokeWidth={2}
          className="inline-block mb-1 mr-[3px]"
        />
        Issues
      </Label>
    ),
    accessorKey: "issue_count",
    cell: ({ row }) => {
      return (
        <Label className="ml-2 font-helvetica-table-13 truncate">
          {row.original.issue_count}
        </Label>
      );
    },
  },
  {
    id: "actions",
    header: () => (
      <Label className="font-helvetica-table-14 flex justify-center">
        <EllipsisVertical
          size={15}
          strokeWidth={2}
          className="inline-block mb-1 mr-[3px]"
        />
        Actions
      </Label>
    ),
    cell: () => (
      <div className="flex justify-center items-center w-full h-full">
        <Popover>
          <PopoverTrigger asChild>
            <Button className="flex justify-center items-center p-1 w-[30px] h-[30px] bg-neutral-200 text-black hover:bg-blue-400">
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

interface SummaryProceduresTableProps {
  data: SummaryProcedureValues[];
}

export const SummaryProceduresTable = ({
  data,
}: SummaryProceduresTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnOrder, setColumnOrder] = useState<string[]>(
    columns.map((column) => column.id as string)
  );

  const [program, setProgam] = useState("");
  const [effectiveness, setEffectiveness] = useState<string[]>([]);
  const [tableData, setTableData] = useState<SummaryProcedureValues[]>([]);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const effectivenessOptions = useMemo(() => {
    return Array.from(new Set(data.map((item) => String(item?.effectiveness))));
  }, [data]);

  useEffect(() => {
    const filtered = data.filter((row) => {
      const matchesName =
        row?.title ?? "".toLowerCase().includes(program.toLowerCase());

      const effectivenesStatus =
        effectiveness.length === 0 ||
        effectiveness.includes(row.effectiveness ?? "");

      return matchesName && effectivenesStatus;
    });
    setTableData(filtered);
  }, [data, effectiveness, program]);

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
            options={effectivenessOptions}
            value={effectiveness}
            onChange={setEffectiveness}
            title="Risk Rating"
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
                    className="relative h-10 border-y select-none"
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
                className="h-24 text-center font-helvetica-13 text-black">
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
