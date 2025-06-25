"use client";

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
  Ellipsis,
  Trash2,
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { RolesSchema } from "@/lib/types";
import { useResponsiveTableWidth } from "@/hooks/use-responsive-table-width";
import { useRouter, useSearchParams } from "next/navigation";
import SearchInput from "../shared/search-input";
import MultiStatusFilter from "../shared/multi-status-filter";

type RolesValues = z.infer<typeof RolesSchema>;

function getColumns(
  router: ReturnType<typeof useRouter>,
  params: ReturnType<typeof useSearchParams>
): ColumnDef<RolesValues>[] {
  return [
    {
      id: "reference",
      header: () => (
        <Label className="font-helvetica-table-14">Reference</Label>
      ),
      accessorKey: "id",
      cell: ({ row }) => {
        const onTabChange = (tab: string) => {
          const param = new URLSearchParams(params.toString());
          param.set("action", tab);
          router.replace(`?${param.toString()}`, { scroll: false });
        };

        return (
          <Label
            role="button"
            tabIndex={0}
            onClick={() => onTabChange(row.original.id ?? "table")}
            className="ml-2 font-helvetica-table-13 truncate text-blue-700 cursor-pointer hover:underline">
            {row.original.id}
          </Label>
        );
      },
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
      id: "section",
      header: () => <Label className="font-helvetica-table-14">Section</Label>,
      accessorKey: "section",
      cell: ({ row }) => {
        const sectionMap: Record<string, string> = {
          e_audit: "Module",
          engagement: "Engagement",
        };
        return (
          <Label className="ml-2 font-helvetica-table-13 truncate">
            {sectionMap[row.original?.section] || row.original?.section}
          </Label>
        );
      },
    },
    {
      id: "type",
      header: () => <Label className="font-helvetica-table-14">Type</Label>,
      cell: ({ row }) => {
        const typeMap: Record<string, string> = {
          audit: "Audit",
          business: "Business",
        };
        return (
          <Label className="ml-2 font-helvetica-table-13 truncate">
            {typeMap[row.original?.type] || row.original?.type}
          </Label>
        );
      },
      accessorKey: "type",
    },
    {
      id: "actions",
      header: () => (
        <Label className="font-helvetica-table-14 flex justify-center">
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
            <PopoverContent className="w-[250px] px-1 py-2 bg-neutral-200">
              <div className="flex flex-col gap-1">
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
}

interface RolesTableProps {
  data: RolesValues[];
}

export default function RolesTable({ data }: RolesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const router = useRouter();
  const params = useSearchParams();
  const columns = getColumns(router, params);

  const [name, setName] = useState("");
  const [section, setSection] = useState<string[]>([]);
  const [type, setType] = useState<string[]>([]);
  const [tableData, setTableData] = useState<RolesValues[]>([]);

  const sectionOptions = useMemo(() => {
    return Array.from(new Set(data.map((item) => String(item?.section))));
  }, [data]);

  const typeOptions = useMemo(() => {
    return Array.from(new Set(data.map((item) => String(item?.type))));
  }, [data]);

  useEffect(() => {
    const filtered = data.filter((row) => {
      const matchedName = (row?.name ?? "")
        .toLowerCase()
        .includes(name.toLowerCase());

      const matchedSection =
        section.length === 0 || section.includes(row.section ?? "");

      const matchedType = type.length === 0 || type.includes(String(row.type));

      return matchedName && matchedSection && matchedType;
    });
    setTableData(filtered);
  }, [data, name, section, type]);

  const [columnOrder, setColumnOrder] = useState<string[]>(
    columns.map((column) => column.id as string)
  );

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 9,
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
    state: {
      sorting,
      pagination,
      columnOrder,
    },
    onColumnOrderChange: setColumnOrder,
    enableSortingRemoval: false,
  });

  const tableWidth = useResponsiveTableWidth(table, 310);

  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage: table.getState().pagination.pageIndex + 1,
    totalPages: table.getPageCount(),
    paginationItemsToDisplay: 5,
  });

  return (
    <div className="w-full">
      <div className="flex items-center justify-between  pb-1 w-[calc(100vw-332px)] py-2 px-2">
        <section className="flex items-center gap-2">
          <SearchInput placeholder="Name" value={name} onChange={setName} />
          <MultiStatusFilter
            options={sectionOptions}
            value={section}
            onChange={setSection}
            title="Section"
          />
          <MultiStatusFilter
            options={typeOptions}
            value={type}
            onChange={setType}
            title="Type"
          />
        </section>
      </div>
      <Table
        className="table-fixed"
        style={{
          width: tableWidth,
        }}>
        <TableHeader className="border-r border-r-neutral-800 text-black">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-muted/50">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className="relative h-10 border-y select-none last:[&>.cursor-col-resize]:opacity-0 border-l border-l-neutral-500 border-y-neutral-500"
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
