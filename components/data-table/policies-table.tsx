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
  ChevronUpIcon,
  Ellipsis,
  EllipsisVertical,
  Paperclip,
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
import { PolicySchema } from "@/lib/types";
import { PolicyForm } from "../forms/policy-form";
import { Paginator } from "../shared/paginator";

type PoliciesValues = z.infer<typeof PolicySchema>;

const columns: ColumnDef<PoliciesValues>[] = [
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
    id: "key_areas",
    header: () => (
      <Label className="font-helvetica-table-14">
        <User
          size={15}
          strokeWidth={2}
          className="inline-block mb-1 mr-[3px]"
        />
        Key areas
      </Label>
    ),
    cell: ({ row }) => (
      <Label className="ml-2 font-helvetica-table-13 truncate">
        {row.original.key_areas}
      </Label>
    ),
    accessorKey: "key_areas",
  },
  {
    id: "version",
    header: () => (
      <Label className="font-helvetica-table-14">
        <User
          size={15}
          strokeWidth={2}
          className="inline-block mb-1 mr-[3px]"
        />
        Version
      </Label>
    ),
    cell: ({ row }) => (
      <Label className="ml-2 font-helvetica-table-13 truncate">
        {row.original.version}
      </Label>
    ),
    accessorKey: "version",
  },
  {
    id: "attachment",
    header: () => (
      <Label className="font-helvetica-table-14">
        <Paperclip
          size={15}
          strokeWidth={2}
          className="inline-block mb-1 mr-[3px]"
        />
        Attachment
      </Label>
    ),
    accessorKey: "attachment",
    cell: ({ row }) => (
      <a
        href={row.getValue("attachment")}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline font-helvetica-table-13 truncate">
        View Attachment
      </a>
    ),
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
        More
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
            <div className="flex flex-col divide-y">
              <PolicyForm
                data={{
                  name: row.original.name,
                  version: row.original.version,
                  key_areas: row.original.key_areas,
                  attachment:
                    typeof window !== undefined
                      ? new File([], "attachment.pdf", {
                          type: "application/pdf",
                        })
                      : undefined,
                }}
                mode="update"
                title="Edit Policy"
                id={row.original.id ?? ""}
                endpoint="engagements/context/policies">
                <Button
                  variant="ghost"
                  className="w-full rounded-md px-4 flex items-center justify-start gap-2 h-[30px] font-helvetica-13 hover:bg-blue-400">
                  <Pencil size={16} strokeWidth={2} />
                  Edit
                </Button>
              </PolicyForm>
              <Button
                variant="ghost"
                className="w-full rounded-md px-4 flex items-center justify-start gap-2 h-[30px] font-helvetica-13 hover:bg-blue-400">
                <Trash size={16} strokeWidth={2} className="text-red-800" />
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

interface PoliciesTableProps {
  data: PoliciesValues[];
}

export const PoliciesTable = ({ data }: PoliciesTableProps) => {
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
                className="h-24 text-center font-helvetica-table-13 text-black">
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
