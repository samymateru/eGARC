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
import { cn } from "@/lib/utils";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  Ellipsis,
  EllipsisVertical,
  FileText,
  Mail,
  Paperclip,
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
import { AttachmentSchema } from "@/lib/types";
import { ExcelIcon, ImageIcon, PdfIcon, WordIcon } from "../shared/icons";
import { Paginator } from "../shared/paginator";

type AttachmentValues = z.infer<typeof AttachmentSchema>;

interface ReviewCommentsTableProps {
  data: AttachmentValues[];
}

const columns: ColumnDef<AttachmentValues>[] = [
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
    id: "type",
    header: () => (
      <Label className="font-helvetica-table-14">
        <User
          size={15}
          strokeWidth={2}
          className="inline-block mb-1 mr-[3px]"
        />
        Type
      </Label>
    ),
    accessorKey: "type",
    cell: ({ row }) => {
      const types: { [key: string]: string } = {
        pdf: "Pdf",
        "vnd.ms-excel": "Excel",
        jpeg: "Jpeg",
        "vnd.openxmlformats-officedocument.wordprocessingml.document": "Word",
      };

      const icons: { [key: string]: React.ReactNode } = {
        pdf: <PdfIcon />,
        "vnd.ms-excel": <ExcelIcon />,
        jpeg: <ImageIcon />,
        "vnd.openxmlformats-officedocument.wordprocessingml.document": (
          <WordIcon />
        ),
      };

      return (
        <section className="flex items-center gap-1">
          <section>
            {icons[row.original.type] ?? <FileText size={16} strokeWidth={2} />}
          </section>
          <section>
            <Label className="ml-2 font-helvetica-table-13 truncate">
              {types[row.original.type] ?? "N/A"}
            </Label>
          </section>
        </section>
      );
    },
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
    accessorKey: "section",
    cell: ({ row }) => (
      <Label className="ml-2 font-helvetica-table-13 truncate">
        {row.original.section}
      </Label>
    ),
  },
  {
    id: "size",
    header: () => (
      <Label className="font-helvetica-table-14">
        <User
          size={15}
          strokeWidth={2}
          className="inline-block mb-1 mr-[3px]"
        />
        Size
      </Label>
    ),
    accessorKey: "size",
    cell: ({ row }) => (
      <Label className="ml-2 font-helvetica-table-13 truncate">
        {(row.original.size / (1024 * 1024)).toFixed(2)}{" "}
        <span className="font-serif italic text-x">MB</span>
      </Label>
    ),
  },
  {
    id: "attached_by",
    header: () => (
      <Label className="font-helvetica-table-14">
        <User
          size={15}
          strokeWidth={2}
          className="inline-block mb-1 mr-[3px]"
        />
        Attached by
      </Label>
    ),
    accessorKey: "creator_name",
    cell: ({ row }) => (
      <Label className="ml-2 font-helvetica-table-13 truncate">
        {row.original.creator_name}
      </Label>
    ),
  },
  {
    id: "attached_email",
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
    accessorKey: "creator_email",
    cell: ({ row }) => (
      <Label className="ml-2 font-helvetica-table-13 truncate">
        {row.original.creator_email}
      </Label>
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
    cell: () => {
      return (
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
      );
    },
    maxSize: 70,
    size: 100,
  },
];

export const ProcedureAttachmentTable = ({
  data,
}: ReviewCommentsTableProps) => {
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
        <Label className="font-helvetica-13">
          <Paperclip
            size={20}
            strokeWidth={3}
            className="inline-block mr-2 mb-[6px]"
          />
          Attachments
        </Label>
      </section>
      <Table
        className="table-fixed"
        style={{
          width: Math.max(table.getCenterTotalSize(), window.innerWidth - 332),
        }}>
        <TableHeader className="border-r border-r-neutral-500">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-muted/50">
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
