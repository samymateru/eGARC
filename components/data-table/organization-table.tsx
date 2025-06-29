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
  ChevronDownIcon,
  ChevronUpIcon,
  CirclePlus,
  Clock,
  Ellipsis,
  EllipsisVertical,
  Mail,
  Phone,
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
import { OrganizationSchema } from "@/lib/types";
import SearchInput from "../shared/search-input";
import MultiStatusFilter from "../shared/multi-status-filter";
import { OrganizationForm } from "../forms/organization-form";
import { ModuleSelect } from "../shared/module-select";
import { Paginator } from "../shared/paginator";

type OrganizationValues = z.infer<typeof OrganizationSchema>;

const columns: ColumnDef<OrganizationValues>[] = [
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
      <Label className="ml-2  truncate font-helvetica-table-13">
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
    cell: ({ row }) => (
      <Label className="ml-2  truncate font-helvetica-table-13">
        {row.original.email}
      </Label>
    ),
    accessorKey: "email",
  },
  {
    id: "telephone",
    header: () => (
      <Label className="font-helvetica-table-14">
        <Phone
          size={15}
          strokeWidth={2}
          className="inline-block mb-1 mr-[3px]"
        />
        Phone
      </Label>
    ),
    cell: ({ row }) => (
      <Label className="ml-2  truncate font-helvetica-table-13">
        {row.original.telephone}
      </Label>
    ),
    accessorKey: "telephone",
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
    cell: ({ row }) => (
      <Label className="ml-2  truncate font-helvetica-table-13">
        {row.original.default ? "Yes" : "No"}
      </Label>
    ),
    accessorKey: "default",
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
    cell: ({ row }) => (
      <Label className="ml-2  truncate font-helvetica-table-13">
        {row.original.type}
      </Label>
    ),
    accessorKey: "type",
  },
  {
    id: "mode",
    header: () => (
      <Label className="font-helvetica-table-14">
        <User
          size={15}
          strokeWidth={2}
          className="inline-block mb-1 mr-[3px]"
        />
        Mode
      </Label>
    ),
    cell: () => (
      <Label className="ml-2  truncate font-helvetica-table-13">
        {typeof window === "undefined"
          ? ""
          : localStorage.getItem("user_email") ===
            localStorage.getItem("entity_email")
          ? "Own"
          : "Invited"}
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
      <Label className="ml-2  truncate font-helvetica-table-13 text-center w-full">
        {row.original.status}
      </Label>
    ),
    accessorKey: "status",
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
      <div className="w-full flex justify-center">
        <ModuleSelect
          id={row.original.id ?? ""}
          organizationTelephone={row.original.telephone}
          organizationId={row.original.id ?? ""}
          organizationEmail={row.original.email}
          organizationName={row.original.name}
          organizationType={row.original.type}>
          <Button className="flex justify-center items-center p-1 w-[30px] h-[30px] bg-neutral-200 text-black hover:bg-blue-400">
            <Ellipsis />
          </Button>
        </ModuleSelect>
      </div>
    ),
    maxSize: 70,
    size: 100,
  },
];

interface OrganizationTableProps {
  data: OrganizationValues[];
}

export default function OrganizationTable({ data }: OrganizationTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnOrder, setColumnOrder] = useState<string[]>(
    columns.map((column) => column.id as string)
  );

  const [searchName, setSearchName] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [tableData, setTableData] = useState<OrganizationValues[]>([]);

  const statusOptions = useMemo(() => {
    return Array.from(new Set(data.map((item) => String(item.status))));
  }, [data]);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [tableWidth, setTableWidth] = useState<number | null>(null);

  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const userEmail = localStorage.getItem("user_email");
    const entityEmail = localStorage.getItem("entity_email");

    if (userEmail && userEmail === entityEmail) {
      setShouldRender(true);
    }
  }, []);

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

  useLayoutEffect(() => {
    if (typeof window !== "undefined" && table?.getCenterTotalSize) {
      setTableWidth(
        Math.max(table.getCenterTotalSize(), window.innerWidth - 16)
      );
    }
  }, [table]);

  return (
    <section className="table-container !bg-neutral-100 [&>div]:max-h-[calc(100vh-240px)]">
      <div className="flex items-center justify-between my-3">
        <section className="flex items-center gap-3">
          <SearchInput
            placeholder="Search organization..."
            value={searchName}
            onChange={setSearchName}
          />
          <MultiStatusFilter
            options={statusOptions}
            value={selectedStatuses}
            onChange={setSelectedStatuses}
          />
        </section>
        {shouldRender && (
          <OrganizationForm
            data={{
              name: "",
              type: "",
              telephone: "",
              email: "",
            }}
            endpoint="organization"
            title="Organization"
            mode="create"
            id={localStorage.getItem("entity_id") ?? ""}>
            <Button
              variant="ghost"
              className="bg-neutral-800 text-white hover:text-white hover:bg-neutral-900 flex items-center gap-2 h-[30px] w-[150px] justify-start font-serif tracking-wide scroll-m-0">
              <CirclePlus size={16} strokeWidth={3} />
              Organization
            </Button>
          </OrganizationForm>
        )}
      </div>
      <Table
        className="table-fixed "
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
}
