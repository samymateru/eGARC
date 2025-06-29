"use client";
import { cn } from "@/lib/utils";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
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
  Calendar,
  ChevronDownIcon,
  ChevronUpIcon,
  CirclePlus,
  Clock,
  Edit,
  Ellipsis,
  EllipsisVertical,
  SendHorizonal,
  Trash2,
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
import { EngagementSchema } from "@/lib/types";
import Link from "next/link";
import SearchInput from "../shared/search-input";
import MultiStatusFilter from "../shared/multi-status-filter";
import { EngagementForm } from "../forms/engagement-form";
import { useSearchParams } from "next/navigation";
import { Paginator } from "../shared/paginator";

type EngagementSchemaValues = z.infer<typeof EngagementSchema>;

interface EngagementTableProps {
  data: EngagementSchemaValues[];
}

export default function EngagementTable({ data }: EngagementTableProps) {
  const params = useSearchParams();

  const columns: ColumnDef<EngagementSchemaValues>[] = [
    {
      id: "code",
      header: () => (
        <Label className="font-helvetica-table-14">
          <User
            size={15}
            strokeWidth={2}
            className="inline-block mb-1 mr-[3px]"
          />
          Code
        </Label>
      ),
      cell: ({ row }) => (
        <Link
          href={{
            pathname: "/eAuditNext/engagement",
            query: {
              id: row.original.id,
              action: "dashboard",
              name: row.original.name,
            },
          }}
          className="ml-2 font-helvetica-table-13 text-blue-700 cursor-pointer hover:underline w-full text-center">
          {row?.original?.code}
        </Link>
      ),
      accessorKey: "code",
    },
    {
      id: "name",
      header: () => (
        <Label className="font-helvetica-table-14">
          <User
            size={15}
            strokeWidth={2}
            className="inline-block mb-1 mr-[3px]"
          />
          Name
        </Label>
      ),
      accessorKey: "name",
      cell: ({ row }) => (
        <Label className="ml-2 font-helvetica-table-13 truncate">
          {row.original.name}
        </Label>
      ),
    },
    {
      id: "status",
      header: () => (
        <Label className="font-helvetica-table-14">
          <Clock
            size={15}
            strokeWidth={2}
            className="inline-block mb-1 mr-[3px]"
          />
          Status
        </Label>
      ),
      cell: ({ row }) => (
        <Label className="ml-2 font-helvetica-table-13 truncate">
          {row.original.status}
        </Label>
      ),
      accessorKey: "status",
    },
    {
      id: "stage",
      header: () => (
        <Label className="font-helvetica-table-14">
          <User
            size={15}
            strokeWidth={2}
            className="inline-block mb-1 mr-[3px]"
          />
          Stage
        </Label>
      ),
      accessorKey: "stage",
      cell: ({ row }) => (
        <Label className="font-helvetica-table-13 truncate">
          {row.original.stage}
        </Label>
      ),
    },
    {
      id: "start_date",
      header: () => (
        <Label className="font-helvetica-table-14">
          <Calendar
            size={15}
            strokeWidth={2}
            className="inline-block mb-1 mr-[3px]"
          />
          Start
        </Label>
      ),
      accessorKey: "start_date",
      cell: ({ row }) => {
        const formatted = new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }).format(new Date(row.original.start_date ?? ""));
        return (
          <Label className="ml-2 font-helvetica-table-13 truncate">
            {formatted}
          </Label>
        );
      },
    },
    {
      id: "end_date",
      header: () => (
        <Label className="font-helvetica-table-14">
          <Calendar
            size={15}
            strokeWidth={2}
            className="inline-block mb-1 mr-[3px]"
          />
          End
        </Label>
      ),
      accessorKey: "end_date",
      cell: ({ row }) => {
        const formatted = new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }).format(new Date(row.original.end_date ?? ""));
        return (
          <Label className="ml-2 font-helvetica-table-13">{formatted}</Label>
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
      cell: ({ row }) => (
        <div className="flex justify-center items-center w-full h-full font-table">
          <Popover>
            <PopoverTrigger asChild>
              <Button className="flex justify-center items-center p-1 w-[30px] h-[30px] hover:bg-blue-400 bg-neutral-200 text-black">
                <Ellipsis />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[250px] px-1 py-2 bg-neutral-200">
              <div className="flex flex-col divide-y">
                <Link
                  href={{
                    pathname: "/eAuditNext/engagement",
                    query: {
                      id: row.original.id,
                      action: "dashboard",
                      name: row.original.name,
                    },
                  }}
                  className="w-full rounded-md px-4 flex items-center justify-start gap-2 h-[30px] font-helvetica-13 hover:bg-blue-400">
                  <SendHorizonal size={16} strokeWidth={2} />
                  Engage
                </Link>

                <EngagementForm
                  endpoint="engagements"
                  title="Engagement"
                  mode="update"
                  data={{
                    name: row.original.name,
                    type: row.original.type,
                    leads: row.original.leads,
                    department: {
                      name: row.original.department.name,
                      code: row.original.department.code,
                    },
                    sub_departments: row.original.sub_departments,
                    risk: {
                      name: row.original.risk.name,
                      magnitude: row.original.risk.magnitude,
                    },
                  }}
                  id={row.original.id}>
                  <Button
                    variant="ghost"
                    className="w-full rounded-md px-4 flex items-center justify-start gap-2 h-[30px] font-helvetica-13 hover:bg-blue-400">
                    <Edit size={16} strokeWidth={2} />
                    Edit
                  </Button>
                </EngagementForm>
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
  const [sorting, setSorting] = useState<SortingState>([]);

  const [columnOrder, setColumnOrder] = useState<string[]>(
    columns.map((column) => column.id as string)
  );

  const [searchName, setSearchName] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [tableData, setTableData] = useState<EngagementSchemaValues[]>([]);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const statusOptions = useMemo(() => {
    return Array.from(new Set(data.map((item) => String(item.status))));
  }, [data]);

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

  const [tableWidth, setTableWidth] = useState<number | null>(null);

  useLayoutEffect(() => {
    if (typeof window !== "undefined" && table?.getCenterTotalSize) {
      setTableWidth(Math.max(table.getCenterTotalSize(), window.innerWidth));
    }
  }, [table]);

  return (
    <section className="table-container [&>div]:max-h-[185px]">
      <div className="flex items-center justify-between pr-2 pb-1">
        <section className="flex items-center gap-3 pl-2">
          <SearchInput
            placeholder="Engagement name"
            value={searchName}
            onChange={setSearchName}
          />
          <MultiStatusFilter
            options={statusOptions}
            value={selectedStatuses}
            onChange={setSelectedStatuses}
          />
        </section>
        <section>
          <EngagementForm
            endpoint="engagements"
            title="Engagement"
            mode="create"
            data={{
              name: "",
              type: "",
              leads: [],
              department: {
                name: "",
                code: "",
              },
              sub_departments: [],
              risk: {
                name: "",
                magnitude: 0,
              },
            }}
            id={params.get("id") ?? undefined}>
            <Button className="bg-neutral-800 font-helvetica-13 text-neutral-300 flex px-3 items-center gap-2 h-[28px] w-fit justify-start">
              <CirclePlus size={16} strokeWidth={3} />
              Engagement
            </Button>
          </EngagementForm>
        </section>
      </div>
      <Table
        className="table-fixed"
        style={{
          width: tableWidth ?? "100%",
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
        <TableBody className="border-r border-r-neutral-800">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="truncate border-l border-l-neutral-500 font-helvetica-table-13">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-black font-helvetica-13">
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
}
