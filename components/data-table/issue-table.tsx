"use client";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

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
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  CircleCheck,
  CircleX,
  SendHorizontal,
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
import { SummaryFindingSchema } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import { Checkbox } from "../ui/checkbox";
import SearchInput from "../shared/search-input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showToast } from "../shared/toast";
import Link from "next/link";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type IssueValues = z.infer<typeof SummaryFindingSchema>;

interface IssueTableProps {
  data: IssueValues[];
}

type SendIssue = {
  id?: Array<string>;
};

export const IssueTable = ({ data }: IssueTableProps) => {
  const params = useSearchParams();
  const columns: ColumnDef<IssueValues>[] = [
    {
      id: "select",
      cell: ({ row }) =>
        row.original.status === "Not started" ? (
          <Checkbox
            disabled={row.original.status !== "Not started"}
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ) : null,
      minSize: 24,
      maxSize: 24,
    },
    {
      id: "ref",
      header: () => <Label className="font-table">Reference</Label>,
      accessorKey: "ref",
      cell: ({ row }) => (
        <Link
          href={`/eAuditNext/engagement?id=${params.get(
            "id"
          )}&name=${params.get("name")}&action=${row.original.id}&stage=Issue`}
          replace
          className="ml-4 font-table cursor-pointer">
          {row?.original?.ref}
        </Link>
      ),
    },
    {
      id: "title",
      header: () => <Label className="font-table">Title</Label>,
      accessorKey: "title",
      cell: ({ row }) => (
        <Label className="ml-2 font-table truncate">{row.original.title}</Label>
      ),
    },
    {
      id: "status",
      header: () => <Label className="font-table">Status</Label>,
      cell: ({ row }) => (
        <Label className="ml-2 font-table truncate text-balance text-center">
          {row.original.status}
        </Label>
      ),
      accessorKey: "status",
    },
    {
      id: "rating",
      header: () => <Label className="font-table">Rating</Label>,
      cell: ({ row }) => (
        <Label className="ml-2 font-table truncate overflow-hidden">
          {row.original.risk_rating}
        </Label>
      ),
      accessorKey: "rating",
    },
    {
      id: "regulatory",
      header: () => <Label className="font-table">Regulatory</Label>,
      cell: ({ row }) => (
        <div className="ml-7">
          {row.original.regulatory ? (
            <CircleCheck size={20} strokeWidth={3} className="text-green-900" />
          ) : (
            <CircleX size={20} strokeWidth={3} className="text-red-900" />
          )}
        </div>
      ),
      accessorKey: "regulatory",
    },
    {
      id: "reportable",
      header: () => <Label className="font-table">Reportable</Label>,
      cell: ({ row }) => (
        <div className="ml-7">
          {row.original.reportable ? (
            <CircleCheck size={20} strokeWidth={3} className="text-green-900" />
          ) : (
            <CircleX size={20} strokeWidth={3} className="text-red-900" />
          )}
        </div>
      ),
      accessorKey: "reportable",
    },
    {
      id: "recurring",
      header: () => <Label className="font-table">Recurring</Label>,
      cell: ({ row }) => (
        <div className="ml-7">
          {row.original.recurring_status ? (
            <CircleCheck size={20} strokeWidth={3} className="text-green-900" />
          ) : (
            <CircleX size={20} strokeWidth={3} className="text-red-900" />
          )}
        </div>
      ),
      accessorKey: "recurring_status",
    },
  ];

  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnOrder, setColumnOrder] = useState<string[]>(
    columns.map((column) => column.id as string)
  );

  const query_client = useQueryClient();

  const [searchName, setSearchName] = useState("");
  const [tableData, setTableData] = useState<IssueValues[]>([]);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data: tableData,
    columns,
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    enableRowSelection: true,
    state: {
      sorting,
      pagination,
      columnOrder,
      rowSelection,
    },
    onColumnOrderChange: setColumnOrder,
    enableSortingRemoval: false,
    onRowSelectionChange: setRowSelection,
  });

  useEffect(() => {
    const filtered = data.filter((row) => {
      const matchesName = row.title
        .toLowerCase()
        .includes(searchName.toLowerCase());

      return matchesName;
    });
    setTableData(filtered);
  }, [data, searchName]);

  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage: table.getState().pagination.pageIndex + 1,
    totalPages: table.getPageCount(),
    paginationItemsToDisplay: 5,
  });

  const { mutate: sendIssue, isPending: sendIssueLoading } = useMutation({
    mutationKey: ["send_implementor"],
    mutationFn: async (data: SendIssue) => {
      const response = await fetch(`${BASE_URL}/issue/send_implementor/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            typeof window === "undefined" ? "" : localStorage.getItem("token")
          }`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw {
          status: response.status,
          body: errorBody,
        };
      }
      return await response.json();
    },
  });

  const onSubmit = () => {
    const data: SendIssue = {
      id: table
        .getSelectedRowModel()
        .rows.map((row) => row.original.id)
        .filter((id): id is string => typeof id === "string"),
    };

    sendIssue(data, {
      onSuccess: (data) => {
        query_client.invalidateQueries({
          queryKey: ["sub_program_procedure", params.get("action")],
        });
        showToast(data.detail, "success");
      },
      onError: (error) => {
        console.log(error);
      },
    });
  };

  return (
    <div className="w-full flex flex-col">
      <div className="flex items-center justify-between  pb-1 w-[calc(100vw-320px)] py-2 px-2">
        <section className="">
          <SearchInput
            placeholder="Plan name"
            value={searchName}
            onChange={setSearchName}
          />
        </section>
        <section>
          {table.getSelectedRowModel().rows.length > 0 ? (
            <Button
              onClick={onSubmit}
              disabled={sendIssueLoading}
              variant="ghost"
              className="flex items-center w-[120px] justify-start h-[30px] border border-neutral-700">
              <SendHorizontal size={16} strokeWidth={3} />
              Send
            </Button>
          ) : null}
        </section>
      </div>
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
