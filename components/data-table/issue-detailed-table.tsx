"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDownIcon, ChevronUpIcon, Download } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { IssueDetailedSchema } from "@/lib/types";
import z from "zod";
import { Label } from "../ui/label";
import { IssueDetailedFilter } from "../filters/issue-detailed";
import { Button } from "../ui/button";

type IssueDetailedValues = z.infer<typeof IssueDetailedSchema>;

const columns: ColumnDef<IssueDetailedValues>[] = [
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
    id: "engagement_name",
    header: () => <Label className="font-table">Engagement Name</Label>,
    accessorKey: "engagement_name",
    cell: ({ row }) => (
      <Label className="ml-4 font-table">
        {row?.original?.engagement_name}
      </Label>
    ),
  },
  {
    id: "engagement_code",
    header: () => <Label className="font-table">Engagement Code</Label>,
    accessorKey: "engagement_code",
    cell: ({ row }) => (
      <Label className="ml-4 font-table">
        {row?.original?.engagement_code}
      </Label>
    ),
  },
  {
    id: "year",
    header: () => <Label className="font-table">Year</Label>,
    accessorKey: "financial_year",
    cell: ({ row }) => {
      const formatted = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(row?.original?.financial_year ?? ""));
      return (
        <Label className="ml-2 font-table truncate overflow-hidden">
          {formatted}
        </Label>
      );
    },
  },
  {
    id: "opinion_rating",
    header: () => <Label className="font-table">Opinion Rating</Label>,
    accessorKey: "overall_opinion_rating",
    cell: ({ row }) => (
      <Label className="ml-4 font-table">
        {row?.original?.overall_opinion_rating}
      </Label>
    ),
  },
  {
    id: "issue_name",
    header: () => <Label className="font-table">Title</Label>,
    accessorKey: "issue_name",
    cell: ({ row }) => (
      <Label className="ml-4 font-table">{row?.original?.issue_name}</Label>
    ),
  },
  {
    id: "issue_rating",
    header: () => <Label className="font-table">Rating</Label>,
    accessorKey: "issue_rating",
    cell: ({ row }) => (
      <Label className="ml-4 font-table">{row?.original?.issue_rating}</Label>
    ),
  },
  {
    id: "issue_source",
    header: () => <Label className="font-table">Source</Label>,
    accessorKey: "issue_source",
    cell: ({ row }) => (
      <Label className="ml-4 font-table">{row?.original?.issue_source}</Label>
    ),
  },
  {
    id: "issue_criteria",
    header: () => <Label className="font-table">Criteria</Label>,
    accessorKey: "issue_criteria",
    cell: ({ row }) => (
      <Label className="ml-4 font-table">{row?.original?.issue_criteria}</Label>
    ),
  },
  {
    id: "root_cause_description",
    header: () => <Label className="font-table">Root Cause</Label>,
    accessorKey: "root_cause_description",
    cell: ({ row }) => (
      <Label className="ml-4 font-table">
        {row?.original?.root_cause_description}
      </Label>
    ),
  },
  {
    id: "impact_description",
    header: () => <Label className="font-table">Impact Description</Label>,
    accessorKey: "impact_description",
    cell: ({ row }) => (
      <Label className="ml-4 font-table">
        {row?.original?.impact_description}
      </Label>
    ),
  },
  {
    id: "issue_recommendation",
    header: () => <Label className="font-table">Recommendation</Label>,
    accessorKey: "issue_recommendation",
    cell: ({ row }) => (
      <Label className="ml-4 font-table">
        {row?.original?.issue_recommendation}
      </Label>
    ),
  },
  {
    id: "issue_management_action_plan",
    header: () => <Label className="font-table">Action Plan</Label>,
    accessorKey: "issue_management_action_plan",
    cell: ({ row }) => (
      <Label className="ml-4 font-table">
        {row?.original?.issue_management_action_plan}
      </Label>
    ),
  },
  {
    id: "issue_overall_status",
    header: () => <Label className="font-table">Status</Label>,
    accessorKey: "issue_overall_status",
    cell: ({ row }) => (
      <Label className="ml-4 font-table">
        {row?.original?.issue_overall_status}
      </Label>
    ),
  },
  {
    id: "issue_reportable",
    header: () => <Label className="font-table">Reportable</Label>,
    accessorKey: "issue_reportable",
    cell: ({ row }) => (
      <Label className="ml-4 font-table">
        {row?.original?.issue_reportable ? "YES" : "NO"}
      </Label>
    ),
  },
  {
    id: "is_issue_sent_to_owner",
    header: () => <Label className="font-table">Sent</Label>,
    accessorKey: "is_issue_sent_to_owner",
    cell: ({ row }) =>
      row?.original?.is_issue_sent_to_owner === "Yes" ? (
        <Label className="ml-4 font-table0">
          Yes -{"> "}
          {row.original.date_issue_sent_to_client
            ? new Date(
                row.original.date_issue_sent_to_client
              ).toLocaleDateString()
            : "No date"}
        </Label>
      ) : (
        <Label className="ml-4 font-table">No</Label>
      ),
  },
  {
    id: "estimated_implementation_date",
    header: () => <Label className="font-table">Estimated Date</Label>,
    accessorKey: "estimated_implementation_date",
    cell: ({ row }) => {
      const formatted = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(row?.original?.estimated_implementation_date ?? ""));
      return (
        <Label className="ml-2 font-table truncate overflow-hidden">
          {formatted}
        </Label>
      );
    },
  },
  {
    id: "is_issue_revised",
    header: () => <Label className="font-table">Revised</Label>,
    accessorKey: "is_issue_revised",
    cell: ({ row }) => (
      <Label className="ml-4 font-table">
        {row?.original?.is_issue_revised === "Yes"
          ? `Yes -> ${row.original.issue_revised_count}`
          : "No"}
      </Label>
    ),
  },
  {
    id: "latest_revised_date",
    header: () => <Label className="font-table">Revised Date</Label>,
    accessorKey: "latest_revised_date",
    cell: ({ row }) => {
      const formatted = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(row?.original?.latest_revised_date ?? ""));
      return (
        <Label className="ml-2 font-table truncate overflow-hidden">
          {formatted}
        </Label>
      );
    },
  },
  {
    id: "actual_implementation_date",
    header: () => <Label className="font-table">Actual Date</Label>,
    accessorKey: "latest_revised_date",
    cell: ({ row }) => {
      const dateStr = row?.original?.actual_implementation_date;

      if (dateStr !== null) {
        return (
          <Label className="ml-2 font-table truncate overflow-hidden">
            {new Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }).format(new Date(dateStr))}
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
    id: "is_issue_pass_due",
    header: () => <Label className="font-table">Pass Due</Label>,
    accessorKey: "is_issue_pass_due",
    cell: ({ row }) => (
      <Label className="ml-4 font-table">
        {row?.original?.is_issue_pass_due}
      </Label>
    ),
  },
  {
    id: "issue_due_more_than_90_days",
    header: () => <Label className="font-table">{"Pass > 90"}</Label>,
    accessorKey: "issue_due_more_than_90_days",
    cell: ({ row }) => (
      <Label className="ml-4 font-table">
        {row?.original?.issue_due_more_than_90_days}
      </Label>
    ),
  },
  {
    id: "issue_due_more_than_365_days",
    header: () => <Label className="font-table">{"Pass > 365"}</Label>,
    accessorKey: "issue_due_more_than_365_days",
    cell: ({ row }) => (
      <Label className="ml-4 font-table">
        {row?.original?.issue_due_more_than_365_days}
      </Label>
    ),
  },
  {
    id: "latest_response",
    header: () => <Label className="font-table">Response</Label>,
    accessorKey: "latest_response",
    cell: ({ row }) => (
      <Label className="ml-4 font-table">
        {row?.original?.latest_response === null
          ? "N/A"
          : row?.original?.latest_response}
      </Label>
    ),
  },
];

interface IssueDetailedProps {
  data: IssueDetailedValues[];
}

export default function IssueDetailedTable({ data }: IssueDetailedProps) {
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "issue_name",
      desc: false,
    },
  ]);
  const [tableData, setTableData] = useState<IssueDetailedValues[]>([]);
  const [revised, setSelectedRevised] = useState<string[]>([]);
  const [overdue, setSelectedOverdue] = useState<string[]>([]);
  const [rating, setRating] = useState<string[]>([]);
  const [issueSource, setIssueSource] = useState<string[]>([]);
  const [issueYear, setIssueYear] = useState<string[]>([]);
  const [issueStatus, setIssueStatus] = useState<string[]>([]);

  const issueRatingOptions = useMemo(() => {
    return Array.from(new Set(data.map((item) => String(item.issue_rating))));
  }, [data]);

  const issueStatusOptions = useMemo(() => {
    return Array.from(
      new Set(data.map((item) => String(item.issue_overall_status)))
    );
  }, [data]);

  const yearOptions = useMemo(() => {
    return Array.from(new Set(data.map((item) => String(item.financial_year))));
  }, [data]);

  const revisedOptions = useMemo(() => {
    return Array.from(
      new Set(data.map((item) => String(item.is_issue_revised)))
    );
  }, [data]);

  const overDueOptions = useMemo(() => {
    return Array.from(
      new Set(data.map((item) => String(item.is_issue_revised)))
    );
  }, [data]);

  const issueSourceOptions = useMemo(() => {
    return Array.from(new Set(data.map((item) => String(item.issue_source))));
  }, [data]);

  useEffect(() => {
    const filtered = data.filter((row) => {
      const revisedStatus =
        revised.length === 0 || revised.includes(row.is_issue_revised ?? "");

      const overDueStatus =
        overdue.length === 0 || overdue.includes(row.is_issue_pass_due ?? "");

      const issueRating =
        rating.length === 0 || rating.includes(row.issue_rating ?? "");

      const issueSourceOptions =
        issueSource.length === 0 ||
        issueSource.includes(row.issue_source ?? "");

      const issueYearOptions =
        issueYear.length === 0 ||
        issueYear.includes(String(row?.financial_year) ?? "");

      const issueStatusOptions =
        issueStatus.length === 0 ||
        issueStatus.includes(row.issue_overall_status ?? "");

      return (
        revisedStatus &&
        overDueStatus &&
        issueRating &&
        issueSourceOptions &&
        issueYearOptions &&
        issueStatusOptions
      );
    });
    setTableData(filtered);
  }, [data, revised, overdue, rating, issueSource, issueYear, issueStatus]);

  const table = useReactTable({
    data: tableData,
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
    <div className="flex flex-col w-[calc(100vw-300px)] [&>div]:max-h-[calc(100vh-98px)]">
      <div className="w-full flex items-center gap-2 pb-2 px-2 justify-between">
        <IssueDetailedFilter
          revised={revised}
          revisedOptions={revisedOptions}
          setSelectedRevised={setSelectedRevised}
          overdue={overdue}
          overDueOptions={overDueOptions}
          setSelectedOverdue={setSelectedOverdue}
          issueRatingOptions={issueRatingOptions}
          issueRating={rating}
          setIssueRating={setRating}
          issueSource={issueSource}
          issueSourceOptions={issueSourceOptions}
          setIssueSource={setIssueSource}
          issueYear={issueYear}
          issueYearOptions={yearOptions}
          setIssueYear={setIssueYear}
          issueStatus={issueStatus}
          issueStatusOptions={issueStatusOptions}
          setIssueStatus={setIssueStatus}
        />
        <Button
          className="font-[helvetica] tracking-wide scroll-m-0 font-bold bg-blue-700 w-[130px] flex items-center justify-center text-white h-7"
          variant="ghost">
          <Download size={16} strokeWidth={3} />
          Export
        </Button>
      </div>
      <Table
        className="table-fixed"
        style={{
          width: Math.max(table.getCenterTotalSize(), window.innerWidth - 300),
        }}>
        <TableHeader className="border-r border-r-neutral-800 bg-background/90 sticky top-0 z-10 backdrop-blur-xs">
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
        <TableBody className="border-r border-r-neutral-800 overflow-auto">
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
