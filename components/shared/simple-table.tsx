import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

export default function VerticalTable() {
  return (
    <div className="mx-auto max-w-lg">
      <div className="overflow-hidden rounded-md border border-neutral-500">
        <Table>
          <TableBody>
            <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
              <TableCell className="font-helvetica-14 text-black">
                Action
              </TableCell>
              <TableCell className="py-2 font-helvetica-14 text-black">
                View
              </TableCell>
              <TableCell className="py-2 font-helvetica-14 text-black">
                Create
              </TableCell>
              <TableCell className="py-2 font-helvetica-14 text-black">
                Edit
              </TableCell>
              <TableCell className="py-2 font-helvetica-14 text-black">
                Delete
              </TableCell>
              <TableCell className="py-2 font-helvetica-14 text-black">
                Approve
              </TableCell>
            </TableRow>
            <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
              <TableCell className="bg-muted/50 py-2 font-medium">
                Settings
              </TableCell>
              <TableCell className="py-2 font-helvetica-14 text-black"></TableCell>
            </TableRow>
            <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
              <TableCell className="bg-muted/50 py-2 font-medium">
                Location
              </TableCell>
              <TableCell className="py-2">Seoul, KR</TableCell>
            </TableRow>
            <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
              <TableCell className="bg-muted/50 py-2 font-medium">
                Status
              </TableCell>
              <TableCell className="py-2">Active</TableCell>
            </TableRow>
            <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
              <TableCell className="bg-muted/50 py-2 font-medium">
                Balance
              </TableCell>
              <TableCell className="py-2">$1,000.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <p className="text-muted-foreground mt-4 text-center text-sm">
        Vertical table
      </p>
    </div>
  );
}
