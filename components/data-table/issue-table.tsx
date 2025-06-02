"use client";

import { CSSProperties, useId, useState } from "react";
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
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  CircleCheck,
  CircleX,
  GripVerticalIcon,
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
import { IssueSchema } from "@/lib/types";
import { useRouter, useSearchParams } from "next/navigation";

type IssueValues = z.infer<typeof IssueSchema>;

const columns: ColumnDef<IssueValues>[] = [
  {
    id: "ref",
    header: () => <Label className="font-table">Reference</Label>,
    accessorKey: "ref",
    cell: ({ row }) => (
      <Label className="ml-4 font-table">{row?.original?.ref}</Label>
    ),
    size: 20,
  },
  {
    id: "title",
    header: () => <Label className="font-table">Title</Label>,
    accessorKey: "title",
    cell: ({ row }) => (
      <Label className="ml-2 font-table truncate overflow-hidden">
        {row.original.title}
      </Label>
    ),
    size: 300,
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
    size: 200,
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
    size: 350,
  },
  {
    id: "regulatory",
    header: () => <Label className="font-table">Regulatory</Label>,
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        {row.original.regulatory ? (
          <CircleCheck size={20} strokeWidth={3} className="text-green-900" />
        ) : (
          <CircleX size={20} strokeWidth={3} className="text-red-900" />
        )}
      </div>
    ),
    accessorKey: "regulatory",
    size: 20,
  },
  {
    id: "reportable",
    header: () => <Label className="font-table">Reportable</Label>,
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        {row.original.reportable ? (
          <CircleCheck size={20} strokeWidth={3} className="text-green-900" />
        ) : (
          <CircleX size={20} strokeWidth={3} className="text-red-900" />
        )}
      </div>
    ),
    accessorKey: "reportable",
    size: 20,
  },
  {
    id: "recurring",
    header: () => <Label className="font-table">Recurring</Label>,
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        {row.original.recurring_status ? (
          <CircleCheck size={20} strokeWidth={3} className="text-green-900" />
        ) : (
          <CircleX size={20} strokeWidth={3} className="text-red-900" />
        )}
      </div>
    ),
    accessorKey: "recurring_status",
    size: 20,
  },
];

interface IssueTableProps {
  data: IssueValues[];
}

export const IssueTable = ({ data }: IssueTableProps) => {
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
      <Table>
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
};

const DraggableTableHeader = ({
  header,
}: {
  header: Header<IssueValues, unknown>;
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

const DragAlongCell = ({ cell }: { cell: Cell<IssueValues, unknown> }) => {
  const params = useSearchParams();
  const router = useRouter();

  const { isDragging, setNodeRef, transform, transition } = useSortable({
    id: cell.column.id,
  });

  const setAction = (action: string, stage?: string) => {
    const param = new URLSearchParams(params.toString());
    param.set("action", action);
    if (stage) {
      param.set("stage", stage);
    }
    router.replace(`?${param.toString()}`, { scroll: false });
  };

  const cellValue = cell.getValue();

  // Add onClick only for "Issued_id" column
  const handleClick = () => {
    if (cell.column.id === "ref" && cellValue) {
      const data = cell.row.original?.id;
      setAction(data ?? "");
      localStorage.setItem("issue_id", params.get("action") ?? "");
    }
  };
  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: "relative",
    transform: CSS.Translate.toString(transform),
    transition,
    width: cell.column.getSize(),
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <TableCell ref={setNodeRef} onClick={handleClick} style={style}>
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </TableCell>
  );
};
