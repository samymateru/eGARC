"use client";

import { CSSProperties, useEffect, useId, useState } from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Cell,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Header,
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
  Edit,
  Ellipsis,
  GripVerticalIcon,
  Trash2,
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
import { StaffSchema } from "@/lib/types";
import SearchInput from "../shared/search-input";
import { useRouter } from "next/navigation";

type StaffValues = z.infer<typeof StaffSchema>;

const columns: ColumnDef<StaffValues>[] = [
  {
    id: "sn",
    header: () => <Label className="font-table">S/N</Label>,
    accessorKey: "name",
    cell: ({ row }) => (
      <Label className="ml-4 font-table">{row.index + 1}</Label>
    ),
    size: 5,
  },
  {
    id: "name",
    header: () => <Label className="font-table">Name</Label>,
    accessorKey: "name",
    cell: ({ row }) => (
      <Label className="ml-2 font-table truncate overflow-hidden">
        {row.original.name}
      </Label>
    ),
    size: 250,
  },
  {
    id: "email",
    header: () => <Label className="font-table">Email</Label>,
    accessorKey: "email",
    cell: ({ row }) => (
      <Label className="ml-2 font-table truncate overflow-hidden">
        {row.original.email}
      </Label>
    ),
    size: 200,
  },
  {
    id: "role",
    header: () => <Label className="font-table">Role</Label>,
    cell: ({ row }) => (
      <Label className="ml-2 font-table truncate overflow-hidden">
        {row.original.role}
      </Label>
    ),
    accessorKey: "role",
  },
  {
    id: "start_date",
    header: () => <Label className="font-table">Start</Label>,
    cell: ({ row }) => {
      const formatted = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(row?.original?.start_date));
      return (
        <Label className="ml-2 font-table truncate overflow-hidden">
          {formatted}
        </Label>
      );
    },
    accessorKey: "start_date",
  },
  {
    id: "end_date",
    header: () => <Label className="font-table">End</Label>,
    accessorKey: "end_date",
    cell: ({ row }) => {
      const formatted = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(row.getValue("end_date")));
      return (
        <Label className="ml-2 font-table truncate overflow-hidden">
          {formatted}
        </Label>
      );
    },
  },
  {
    id: "actions",
    header: () => <Label className="font-table">Actions</Label>,
    cell: () => (
      <div className="flex justify-center items-center w-full h-full">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              className="flex justify-center items-center p-1 w-[30px] h-[30px]"
              variant="ghost">
              <Ellipsis />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[250px] px-1 py-2 dark:bg-black pop-bg">
            <div className="flex flex-col divide-y">
              <Button
                variant="ghost"
                className="w-full dark:hover:bg-neutral-800 rounded-md px-4 flex items-center justify-start gap-2 h-[30px] font-table">
                <Edit size={16} strokeWidth={3} />
                Edit
              </Button>
              <Button
                variant="ghost"
                className="w-full dark:hover:bg-neutral-800 rounded-md px-4 flex items-center justify-start gap-2 h-[30px] font-table">
                <Trash2 className="text-red-800" size={16} strokeWidth={3} />
                Delete
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    ),
    size: 20,
    minSize: 3,
  },
];

interface StaffTableProps {
  data: StaffValues[];
}

export default function StaffTable({ data }: StaffTableProps) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);

  const [columnOrder, setColumnOrder] = useState<string[]>(
    columns.map((column) => column.id as string)
  );

  const [searchName, setSearchName] = useState("");
  const [tableData, setTableData] = useState<StaffValues[]>([]);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 9,
  });

  useEffect(() => {
    const filtered = data.filter((row) => {
      const matchesName = row.name
        .toLowerCase()
        .includes(searchName.toLowerCase());

      return matchesName;
    });
    setTableData(filtered);
  }, [data, searchName]);

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

  // reorder columns after drag & drop
  function handleDragEnd(event: DragEndEvent) {
    if (event.active.id === "actions") return;
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setColumnOrder((columnOrder) => {
        const oldIndex = columnOrder.indexOf(active.id as string);
        const newIndex = columnOrder.indexOf(over.id as string);
        return arrayMove(columnOrder, oldIndex, newIndex); //this is just a splice util
      });
    }
  }

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  return (
    <DndContext
      id={useId()}
      collisionDetection={closestCenter}
      modifiers={[restrictToHorizontalAxis]}
      onDragEnd={handleDragEnd}
      sensors={sensors}>
      <div className="flex items-center justify-between pr-2 pb-1 ">
        <section className="flex items-center gap-3 pl-2">
          <SearchInput
            placeholder="Plan name"
            value={searchName}
            onChange={setSearchName}
          />
        </section>
      </div>
      <Table className="w-[calc(100%-1rem)]">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-muted/50">
              <SortableContext
                items={columnOrder}
                strategy={horizontalListSortingStrategy}>
                {headerGroup.headers.map((header) => (
                  <DraggableTableHeader key={header.id} header={header} />
                ))}
              </SortableContext>
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onDoubleClick={() => {
                  router.push(`/eAuditNext/engagements?id=${row.original.id}`);
                }}
                key={row.id}
                data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell) => (
                  <SortableContext
                    key={cell.id}
                    items={columnOrder}
                    strategy={horizontalListSortingStrategy}>
                    <DragAlongCell key={cell.id} cell={cell} />
                  </SortableContext>
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
      <div className="grow">
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
    </DndContext>
  );
}

const DraggableTableHeader = ({
  header,
}: {
  header: Header<StaffValues, unknown>;
}) => {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: header.column.id,
  });
  const isActionColumn = header.column.id === "actions";
  const isSnColumn = header.column.id === "sn";

  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: "relative",
    transform: CSS.Translate.toString(transform),
    transition,
    whiteSpace: "nowrap",
    width: header.column.getSize(),
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <TableHead
      ref={setNodeRef}
      className="before:bg-border relative h-10 border-t before:absolute before:inset-y-0 before:start-0 before:w-px first:before:bg-transparent"
      style={style}
      aria-sort={
        header.column.getIsSorted() === "asc"
          ? "ascending"
          : header.column.getIsSorted() === "desc"
          ? "descending"
          : "none"
      }>
      <div className="flex items-center justify-start gap-0.5">
        {!isActionColumn && !isSnColumn ? (
          <Button
            size="icon"
            variant="ghost"
            className="-ml-2 size-7 shadow-none"
            {...attributes}
            {...listeners}
            aria-label="Drag to reorder">
            <GripVerticalIcon
              className="opacity-60"
              size={16}
              aria-hidden="true"
            />
          </Button>
        ) : null}

        <span className="grow truncate">
          {header.isPlaceholder
            ? null
            : flexRender(header.column.columnDef.header, header.getContext())}
        </span>
        <Button
          size="icon"
          variant="ghost"
          className="group -mr-1 size-7 shadow-none"
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
          }}>
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
          }[header.column.getIsSorted() as string] ?? (
            <ChevronUpIcon
              className="shrink-0 opacity-0 group-hover:opacity-60"
              size={16}
              aria-hidden="true"
            />
          )}
        </Button>
      </div>
    </TableHead>
  );
};

const DragAlongCell = ({ cell }: { cell: Cell<StaffValues, unknown> }) => {
  const { isDragging, setNodeRef, transform, transition } = useSortable({
    id: cell.column.id,
  });

  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: "relative",
    transform: CSS.Translate.toString(transform),
    transition,
    width: cell.column.getSize(),
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <TableCell ref={setNodeRef} className="truncate" style={style}>
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </TableCell>
  );
};
