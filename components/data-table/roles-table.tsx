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
  ChevronUpIcon,
  Ellipsis,
  EllipsisVertical,
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
import { RolesSchema } from "@/lib/types";
import { useRouter, useSearchParams } from "next/navigation";
import SearchInput from "../shared/search-input";
import MultiStatusFilter from "../shared/multi-status-filter";
import { Paginator } from "../shared/paginator";

type RolesValues = z.infer<typeof RolesSchema>;

function getColumns(
  router: ReturnType<typeof useRouter>,
  params: ReturnType<typeof useSearchParams>
): ColumnDef<RolesValues>[] {
  return [
    {
      id: "reference",
      header: () => (
        <Label className="font-helvetica-table-14 text-center">
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
        const onTabChange = (tab: string) => {
          const param = new URLSearchParams(params.toString());
          param.set("action", tab);
          router.replace(`?${param.toString()}`, { scroll: false });
        };

        return (
          <Label
            role="button"
            tabIndex={0}
            onClick={() => onTabChange(row.original.reference ?? "table")}
            className="ml-2 font-helvetica-table-13 truncate text-blue-700 cursor-pointer hover:underline">
            {row.original.reference}
          </Label>
        );
      },
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
      id: "default",
      header: () => (
        <Label className="font-helvetica-table-14">
          <User
            size={15}
            strokeWidth={2}
            className="inline-block mb-1 mr-[3px]"
          />
          Default
        </Label>
      ),
      accessorKey: "default",
      cell: ({ row }) => (
        <Label className="ml-2 font-helvetica-table-13 truncate">
          {row.original.default === "yes" ? "Yes" : "No"}
        </Label>
      ),
    },
    {
      id: "section",
      header: () => (
        <Label className="font-helvetica-table-14">
          <User
            size={15}
            strokeWidth={2}
            className="inline-block mb-1 mr-[3px]"
          />
          Section
        </Label>
      ),
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
  const columns = useMemo(() => getColumns(router, params), [router, params]);
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
    pageSize: 20,
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

  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage: table.getState().pagination.pageIndex + 1,
    totalPages: table.getPageCount(),
    paginationItemsToDisplay: 3,
  });

  return (
    <section className="table-container [&>div]:max-h-[220px]">
      <div className="flex items-center justify-between  pb-1 w-[calc(100vw-332px)] pt-2  px-2">
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
        className="table-fixed "
        style={{
          width: Math.max(table.getCenterTotalSize(), window.innerWidth - 301),
        }}>
        <TableHeader className="">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className="relative h-10 border-y select-none last:[&>.cursor-col-resize]:bg-blue-400 last:[&>.cursor-col-resize]:w-[3px] last:[&>.cursor-col-resize]:mr-[7px] last:[&>.cursor-col-resize]:opacity-100"
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
        <TableBody className="border-r border-r-neutral-500 border-b border-b-neutral-500">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="truncate text-black border-l border-l-neutral-500">
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
