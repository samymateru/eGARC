"use client";

import { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { RevieCommentReportSchema } from "@/lib/types";
import z from "zod";
import { Label } from "../ui/label";

type ReviewCommentsReportValues = z.infer<typeof RevieCommentReportSchema>;

const columns: ColumnDef<ReviewCommentsReportValues>[] = [
  {
    header: () => <Label className="font-table">Reference</Label>,
    accessorKey: "reference",
    cell: ({ row }) => (
      <div className="truncate font-medium">{row.original.reference}</div>
    ),
    sortUndefined: "last",
    sortDescFirst: false,
  },
  {
    id: "title",
    header: () => <Label className="font-table">Title</Label>,
    accessorKey: "title",
    cell: ({ row }) => (
      <Label className="ml-4 font-table">{row?.original?.title}</Label>
    ),
  },
  {
    id: "description",
    header: () => <Label className="font-table">Description</Label>,
    accessorKey: "description",
    cell: ({ row }) => (
      <Label className="ml-4 font-table">{row?.original?.description}</Label>
    ),
  },
  {
    id: "raiser_name",
    header: () => <Label className="font-table">Raiser Name</Label>,
    accessorKey: "raiser_name",
    cell: ({ row }) => {
      if (row.original.raised_by !== null) {
        return (
          <Label className="ml-4 font-table">
            {row?.original?.raised_by?.email}
          </Label>
        );
      } else {
        return <Label className="ml-4 font-table">N/A</Label>;
      }
    },
  },
  {
    id: "raiser_email",
    header: () => <Label className="font-table">Raise Email</Label>,
    accessorKey: "raiser_email",
    cell: ({ row }) => {
      if (row.original.raised_by !== null) {
        return (
          <Label className="ml-4 font-table">
            {row?.original?.raised_by?.email}
          </Label>
        );
      } else {
        return <Label className="ml-4 font-table">N/A</Label>;
      }
    },
  },
  {
    id: "raised_on",
    header: () => <Label className="font-table">Raised On</Label>,
    accessorKey: "raised_on",
    cell: ({ row }) => {
      if (row.original.raised_by !== null) {
        return (
          <Label className="ml-2 font-table truncate overflow-hidden">
            {new Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }).format(new Date(row.original.raised_by.date_issued ?? ""))}
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
    id: "resolution_summary",
    header: () => <Label className="font-table">Resolution Summary</Label>,
    accessorKey: "resolution_summary",
    cell: ({ row }) => {
      if (row.original.resolution_summary !== null) {
        return (
          <Label className="ml-4 font-table">
            {row?.original?.resolution_summary}
          </Label>
        );
      } else {
        return <Label className="ml-4 font-table">N/A</Label>;
      }
    },
  },
  {
    id: "resolution_details",
    header: () => <Label className="font-table">Resolution Details</Label>,
    accessorKey: "resolution_details",
    cell: ({ row }) => {
      if (row.original.resolution_details !== null) {
        return (
          <Label className="ml-4 font-table">
            {row?.original?.resolution_details}
          </Label>
        );
      } else {
        return <Label className="ml-4 font-table">N/A</Label>;
      }
    },
  },
  {
    id: "resolver_name",
    header: () => <Label className="font-table">Resolver Name</Label>,
    accessorKey: "resolver_name",
    cell: ({ row }) => {
      if (row.original.resolved_by !== null) {
        return (
          <Label className="ml-4 font-table">
            {row?.original?.resolved_by?.name}
          </Label>
        );
      } else {
        return <Label className="ml-4 font-table">N/A</Label>;
      }
    },
  },
  {
    id: "resolver_email",
    header: () => <Label className="font-table">Resolver Email</Label>,
    accessorKey: "resolver_email",
    cell: ({ row }) => {
      if (row.original.resolved_by !== null) {
        return (
          <Label className="ml-4 font-table">
            {row?.original?.resolved_by?.email}
          </Label>
        );
      } else {
        return <Label className="ml-4 font-table">N/A</Label>;
      }
    },
  },
  {
    id: "resolved_on",
    header: () => <Label className="font-table">Resolved On</Label>,
    accessorKey: "resolved_on",
    cell: ({ row }) => {
      if (row?.original?.resolved_by !== null) {
        return (
          <Label className="ml-2 font-table truncate overflow-hidden">
            {new Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }).format(new Date(row?.original?.resolved_by.date_issued ?? ""))}
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
    id: "status",
    header: () => <Label className="font-table">Status</Label>,
    accessorKey: "status",
    cell: ({ row }) => (
      <Label className="ml-4 font-table">{row?.original?.status}</Label>
    ),
  },
  {
    id: "decision",
    header: () => <Label className="font-table">Decision</Label>,
    accessorKey: "decision",
    cell: ({ row }) => {
      if (row.original.decision !== null) {
        return (
          <Label className="ml-4 font-table">{row?.original?.decision}</Label>
        );
      } else {
        return <Label className="ml-4 font-table">N/A</Label>;
      }
    },
  },
];

interface ReviewCommentsReportTableProps {
  data: ReviewCommentsReportValues[];
}

export default function ReviewCommentsReportTable({
  data,
}: ReviewCommentsReportTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "name",
      desc: false,
    },
  ]);

  const table = useReactTable({
    data,
    columns,
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    enableSortingRemoval: false,
  });

  return (
    <div className="flex flex-col w-[calc(100vw-300px)]">
      <div className="w-full flex items-center gap-2"></div>
      <Table
        className="table-fixed"
        style={{
          width: Math.max(table.getCenterTotalSize(), window.innerWidth - 300),
        }}>
        <TableHeader className="border-r border-r-neutral-800">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-muted/50">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className="relative h-10 border-t select-none last:[&>.cursor-col-resize]:opacity-0 border-l border-l-neutral-800"
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
                    className="truncate border-l border-l-neutral-800">
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
    </div>
  );
}
