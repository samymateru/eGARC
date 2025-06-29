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
  Calendar,
  ChevronDownIcon,
  ChevronUpIcon,
  CircleCheck,
  Clock,
  Ellipsis,
  EllipsisVertical,
  Info,
  Mail,
  Pencil,
  SendHorizonal,
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
import { TasksSchema } from "@/lib/types";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { ResolveTaskForm } from "../forms/resolve-task-form";
import { TaskDecisionForm } from "../forms/task-decision-form";
import { RaiseTask } from "../forms/raise-task-form";
import MultiStatusFilter from "../shared/multi-status-filter";
import SearchInput from "../shared/search-input";
import { Paginator } from "../shared/paginator";

enum Status {
  PENDING = "Pending",
  ONGOING = "Ongoing",
  CLOSED = "Closed",
}
type TasksValues = z.infer<typeof TasksSchema>;

interface TasksTableProps {
  data: TasksValues[];
}

export const TasksTable = ({ data }: TasksTableProps) => {
  const params = useSearchParams();
  const columns: ColumnDef<TasksValues>[] = [
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
      cell: ({ row }) => (
        <Link
          replace
          href={row?.original?.href ?? "#"}
          className="ml-2 font-helvetica-table-13 text-blue-700 hover:underline  truncate">
          {row.original.reference}
        </Link>
      ),
    },
    {
      id: "title",
      header: () => (
        <Label className="font-helvetica-table-14">
          <User
            size={15}
            strokeWidth={2}
            className="inline-block mb-1 mr-[3px]"
          />
          Title
        </Label>
      ),
      cell: ({ row }) => (
        <Label className="ml-2 font-helvetica-table-13  truncate">
          {row.original.title}
        </Label>
      ),
      accessorKey: "title",
      size: 300,
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
      accessorKey: "status",
      cell: ({ row }) => (
        <Label className="ml-2 font-helvetica-table-13 truncate">
          {row.original.status}
        </Label>
      ),
    },
    {
      id: "decision",
      header: () => (
        <Label className="font-helvetica-table-14">
          <User
            size={15}
            strokeWidth={2}
            className="inline-block mb-1 mr-[3px]"
          />
          Decision
        </Label>
      ),
      accessorKey: "decision",
      cell: ({ row }) => {
        if (row.original.decision !== null) {
          return (
            <Label className="ml-2 font-helvetica-table-13 truncate">
              {row.original.decision}
            </Label>
          );
        } else {
          return (
            <Label className="ml-2 font-helvetica-table-13 truncate">N/A</Label>
          );
        }
      },
    },
    {
      id: "due_date",
      header: () => (
        <Label className="font-helvetica-table-14">
          <Calendar
            size={15}
            strokeWidth={2}
            className="inline-block mb-1 mr-[3px]"
          />
          Due Date
        </Label>
      ),
      cell: ({ row }) => {
        if (row.original.due_date !== null) {
          const formatted = new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }).format(new Date(row?.original?.due_date ?? ""));
          return (
            <Label className="ml-2 font-helvetica-table-13 truncate">
              {formatted}
            </Label>
          );
        } else {
          <Label className="ml-2 font-helvetica-table-13 truncate">N/A</Label>;
        }
      },
      accessorKey: "due_date",
    },
    {
      id: "issuer_name",
      header: () => (
        <Label className="font-helvetica-table-14">
          <User
            size={15}
            strokeWidth={2}
            className="inline-block mb-1 mr-[3px]"
          />
          Issuer Name
        </Label>
      ),
      cell: ({ row }) => (
        <Label className="ml-2 font-helvetica-table-13 truncate">
          {row.original.raised_by.name !== null
            ? row.original.raised_by.name
            : "N/A"}
        </Label>
      ),
      accessorKey: "raised_by",
    },
    {
      id: "issuer_email",
      header: () => (
        <Label className="font-helvetica-table-14">
          <Mail
            size={15}
            strokeWidth={2}
            className="inline-block mb-1 mr-[3px]"
          />
          Issuer Email
        </Label>
      ),
      cell: ({ row }) => (
        <Label className="ml-2 font-helvetica-table-13 truncate">
          {row.original.raised_by?.email !== null
            ? row.original.raised_by?.email
            : "N/A"}
        </Label>
      ),
      accessorKey: "raised_by",
    },
    {
      id: "issued_on",
      header: () => (
        <Label className="font-helvetica-table-14">
          <Calendar
            size={15}
            strokeWidth={2}
            className="inline-block mb-1 mr-[3px]"
          />
          Date Raised
        </Label>
      ),
      cell: ({ row }) => {
        if (row.original.raised_by !== null) {
          const formatted = new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }).format(new Date(row?.original?.raised_by?.date_issued ?? ""));
          return (
            <Label className="ml-2 font-helvetica-table-13 truncate">
              {formatted}
            </Label>
          );
        } else {
          <Label className="ml-2 font-helvetica-table-13 truncate">N/A</Label>;
        }
      },
      accessorKey: "raised_by",
    },
    {
      id: "resolver_name",
      header: () => (
        <Label className="font-helvetica-table-14">
          <User
            size={15}
            strokeWidth={2}
            className="inline-block mb-1 mr-[3px]"
          />
          Resolver Name
        </Label>
      ),
      cell: ({ row }) => {
        if (row.original.resolved_by !== null) {
          return (
            <Label className="ml-2 font-helvetica-table-13 truncate">
              {row.original.resolved_by?.name}
            </Label>
          );
        } else {
          return (
            <Label className="ml-2 font-helvetica-table-13 truncate">N/A</Label>
          );
        }
      },
      accessorKey: "resolved_by",
    },

    {
      id: "resolver_email",
      header: () => (
        <Label className="font-helvetica-table-14">
          <Mail
            size={15}
            strokeWidth={2}
            className="inline-block mb-1 mr-[3px]"
          />
          Resolver Email
        </Label>
      ),
      cell: ({ row }) => {
        if (row.original.resolved_by !== null) {
          return (
            <Label className="ml-2 font-helvetica-table-13 truncate">
              {row.original.resolved_by?.email}
            </Label>
          );
        } else {
          return (
            <Label className="ml-2 font-helvetica-table-13 truncate">N/A</Label>
          );
        }
      },
      accessorKey: "resolved_by",
    },
    {
      id: "resolved_on",
      header: () => (
        <Label className="font-helvetica-table-14">
          <Calendar
            size={15}
            strokeWidth={2}
            className="inline-block mb-1 mr-[3px]"
          />
          Date Resolved
        </Label>
      ),
      cell: ({ row }) => {
        if (row.original.resolved_by !== null) {
          const formatted = new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }).format(new Date(row.original.resolved_by.date_issued ?? ""));
          return (
            <Label className="ml-2 font-helvetica-table-13 truncate">
              {formatted}
            </Label>
          );
        } else {
          return (
            <Label className="ml-2 font-helvetica-table-13 truncate">N/A</Label>
          );
        }
      },
      accessorKey: "resolved_by",
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
      cell: ({ row }) => {
        return (
          <div className="flex justify-center items-center w-full h-full">
            <Popover>
              <PopoverTrigger asChild>
                <Button className="flex justify-center items-center p-1 w-[30px] h-[30px] bg-neutral-200 text-black hover:bg-blue-400">
                  <Ellipsis />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[250px] px-1 py-2 bg-neutral-200">
                <div className="flex flex-col gap-1">
                  <Link
                    className="h-[32px] hover:bg-blue-400 text-black font-helvetica-table-13 flex items-center gap-2 justify-start px-4 py-2 rounded-md"
                    replace
                    href={`/eAuditNext/engagement?id=${
                      row.original.engagement
                    }&action=${row.original.id}&name=${params.get(
                      "name"
                    )}&stage=Tasks`}>
                    <Info size={16} strokeWidth={2} />
                    Details
                  </Link>
                  {row.original.status === Status.PENDING ? (
                    <ResolveTaskForm
                      title="Resolve Task"
                      id={row.original.id}
                      endpoint="task/resolve">
                      <Button className="w-full bg-neutral-200 text-black shadow-none rounded-md px-4 flex items-center justify-start gap-2 h-[30px] font-helvetica-13 hover:bg-blue-400">
                        <SendHorizonal size={16} strokeWidth={2} />
                        Resolve
                      </Button>
                    </ResolveTaskForm>
                  ) : null}
                  {row.original.status === Status.ONGOING ? (
                    <TaskDecisionForm
                      title="Task Decision"
                      id={row.original.id}
                      endpoint="task/resolve/decision">
                      <Button className="w-full bg-neutral-200 text-black shadow-none rounded-md px-4 flex items-center justify-start gap-2 h-[30px] font-helvetica-13 hover:bg-blue-400">
                        <CircleCheck size={16} strokeWidth={2} />
                        Decision
                      </Button>
                    </TaskDecisionForm>
                  ) : null}
                  {row.original.status === Status.PENDING ? (
                    <RaiseTask
                      data={{
                        title: row.original.title,
                        description: row.original.description,
                        action_owner: row.original.action_owner,
                        due_date: new Date(row.original.due_date ?? new Date()),
                      }}
                      title="Edit Task"
                      endpoint="task/raise"
                      mode="update"
                      id={row.original.id}>
                      <Button className="w-full bg-neutral-200 text-black shadow-none rounded-md px-4 flex items-center justify-start gap-2 h-[30px] font-helvetica-13 hover:bg-blue-400">
                        <Pencil size={16} strokeWidth={2} />
                        Edit
                      </Button>
                    </RaiseTask>
                  ) : null}

                  <Button
                    variant="ghost"
                    className="w-full bg-neutral-200 text-black shadow-none rounded-md px-4 flex items-center justify-start gap-2 h-[30px] font-helvetica-13 hover:bg-blue-400">
                    <Trash size={16} strokeWidth={2} className="text-red-800" />
                    Delete
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        );
      },
      maxSize: 70,
      size: 100,
    },
  ];

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnOrder, setColumnOrder] = useState<string[]>(
    columns.map((column) => column.id as string)
  );

  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<string[]>([]);
  const [decision, setDecision] = useState<string[]>([]);
  const [tableData, setTableData] = useState<TasksValues[]>([]);

  const statusOptions = useMemo(() => {
    return Array.from(new Set(data.map((item) => String(item?.status))));
  }, [data]);

  const decisionOptions = useMemo(() => {
    return Array.from(new Set(data.map((item) => String(item?.decision))));
  }, [data]);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  useEffect(() => {
    const filtered = data.filter((row) => {
      const matchedTitle = (row?.title ?? "")
        .toLowerCase()
        .includes(title.toLowerCase());

      const matchedStatus =
        status.length === 0 || status.includes(row.status ?? "");

      const matchedDecision =
        decision.length === 0 || decision.includes(String(row.decision));

      return matchedTitle && matchedStatus && matchedDecision;
    });
    setTableData(filtered);
  }, [data, title, status, decision]);

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
          <SearchInput placeholder="Title" value={title} onChange={setTitle} />
          <MultiStatusFilter
            options={statusOptions}
            value={status}
            onChange={setStatus}
            title="Status"
          />
          <MultiStatusFilter
            options={decisionOptions}
            value={decision}
            onChange={setDecision}
            title="Decision"
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
};
