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
  Calendar,
  ChevronDownIcon,
  ChevronUpIcon,
  Edit,
  Ellipsis,
  EllipsisVertical,
  Mail,
  Shield,
  Trash2,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
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
import { StaffSchema } from "@/lib/types";
import { StaffForm } from "../forms/staffing-form";
import { Paginator } from "../shared/paginator";

type StaffValues = z.infer<typeof StaffSchema>;

const columns: ColumnDef<StaffValues>[] = [
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
    id: "email",
    header: () => (
      <Label className="font-helvetica-table-14">
        <Mail
          size={15}
          strokeWidth={2}
          className="inline-block mb-1 mr-[3px]"
        />
        Email
      </Label>
    ),
    accessorKey: "email",
    cell: ({ row }) => (
      <Label className="ml-2 font-helvetica-table-13 truncate">
        {row.original.email}
      </Label>
    ),
  },
  {
    id: "role",
    header: () => (
      <Label className="font-helvetica-table-14">
        <Shield
          size={15}
          strokeWidth={2}
          className="inline-block mb-1 mr-[3px]"
        />
        Role
      </Label>
    ),
    cell: ({ row }) => (
      <Label className="ml-2 font-helvetica-table-13 truncate">
        {row.original.role}
      </Label>
    ),
    accessorKey: "role",
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
    cell: ({ row }) => {
      const formatted = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(row?.original?.start_date));
      return (
        <Label className="ml-2 font-helvetica-table-13 truncate">
          {formatted}
        </Label>
      );
    },
    accessorKey: "start_date",
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
      }).format(new Date(row.getValue("end_date")));
      return (
        <Label className="ml-2 font-helvetica-table-13 truncate">
          {formatted}
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
    cell: ({ row }) => (
      <div className="flex justify-center items-center w-full h-full">
        <Popover>
          <PopoverTrigger asChild>
            <Button className="flex justify-center items-center p-1 w-[30px] h-[30px] bg-neutral-200 text-black hover:bg-blue-400">
              <Ellipsis />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[250px] px-1 py-2 bg-neutral-200">
            <div className="flex flex-col gap-1">
              <StaffForm
                defaultValue={{
                  name: "sam",
                  role: row.original.role,
                  start_date: new Date(row.original.start_date),
                  end_date: new Date(row.original.end_date),
                }}
                title="Edit Staff"
                mode="update"
                id={row.original.id ?? null}
                endpoint="engagements/context/staff">
                <Button
                  variant="ghost"
                  className="w-full rounded-md px-4 flex items-center justify-start gap-2 h-[30px] font-helvetica-13 hover:bg-blue-400">
                  <Edit size={16} strokeWidth={2} />
                  Edit
                </Button>
              </StaffForm>
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

interface StaffTableProps {
  data: StaffValues[];
}

export default function StaffTable({ data }: StaffTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const [columnOrder, setColumnOrder] = useState<string[]>(
    columns.map((column) => column.id as string)
  );

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 9,
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
        <TableBody className="border-r border-r-neutral-800">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="truncate border-l border-l-neutral-800 text-black">
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
}
