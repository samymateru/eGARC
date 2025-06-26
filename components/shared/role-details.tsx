import { RolesSchema } from "@/lib/types";
import { z } from "zod";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  Activity,
  AlertTriangle,
  BarChart,
  Building,
  CalendarRange,
  CheckCircle,
  CircleCheck,
  CirclePlus,
  ClipboardCheck,
  Clock,
  Edit,
  ListTodo,
  Notebook,
  Settings,
  Trash,
  View,
  XCircle,
} from "lucide-react";
import { Label } from "../ui/label";

type RolesDetailsValues = z.infer<typeof RolesSchema>;

interface RoleDetailsProps {
  role: RolesDetailsValues;
}

export const RoleDetails = ({ role }: RoleDetailsProps) => {
  const renderPermissionIcon = (hasPermission: boolean) =>
    hasPermission ? (
      <CheckCircle
        size={17}
        strokeWidth={3}
        className="text-green-700 mx-auto"
      />
    ) : (
      <XCircle size={17} strokeWidth={3} className="text-red-700 mx-auto" />
    );

  return (
    <section>
      <section
        id="main"
        className="flex flex-col gap-5 h-[calc(100vh-150px)] hide-scrollbar overflow-y-auto overflow-x-hidden">
        <section className="flex items-center pl-5 pt-3 gap-5">
          <section className="flex items-center gap-1">
            <Label className="font-helvetica-13">Archive Audit:</Label>
            <Label className="font-helvetica-13 flex items-center justify-center">
              {role.archive_audit === "yes" ? (
                <CheckCircle
                  size={17}
                  strokeWidth={3}
                  className="text-green-700 mx-auto"
                />
              ) : (
                <XCircle
                  size={17}
                  strokeWidth={3}
                  className="text-red-700 mx-auto"
                />
              )}
            </Label>
          </section>
          <section className="flex items-center gap-1">
            <Label className="font-helvetica-13">Re-open Audit:</Label>
            <Label className="font-helvetica-13 flex items-center justify-center">
              {role.archive_audit === "yes" ? (
                <CheckCircle
                  size={17}
                  strokeWidth={2}
                  className="text-green-700 mx-auto"
                />
              ) : (
                <XCircle
                  size={17}
                  strokeWidth={3}
                  className="text-red-700 mx-auto"
                />
              )}
            </Label>
          </section>
        </section>
        <div className="w-[calc(100vw-307px)] px-2">
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableBody>
                <TableRow className="*:border-border bg-blue-100 hover:bg-blue-100 [&>:not(:last-child)]:border-r">
                  <TableCell className="font-helvetica-13 text-black text-center">
                    <Activity
                      size={16}
                      strokeWidth={2}
                      className="mb-[4px] mr-[6px] inline-block"
                    />
                    Action
                  </TableCell>
                  <TableCell className="py-2 font-helvetica-13 text-black text-center">
                    <View
                      size={16}
                      strokeWidth={2}
                      className="mb-[4px] mr-[6px] inline-block"
                    />
                    View
                  </TableCell>
                  <TableCell className="py-2 font-helvetica-13 text-black text-center">
                    <CirclePlus
                      size={16}
                      strokeWidth={2}
                      className="mb-[4px] mr-[6px] inline-block"
                    />
                    Create
                  </TableCell>
                  <TableCell className="py-2 font-helvetica-13 text-black text-center">
                    <Edit
                      size={16}
                      strokeWidth={2}
                      className="mb-[4px] mr-[6px] inline-block"
                    />
                    Edit
                  </TableCell>
                  <TableCell className="py-2 font-helvetica-13 text-black text-center">
                    <Trash
                      size={16}
                      strokeWidth={2}
                      className="mb-[4px] mr-[6px] inline-block text-red-700"
                    />
                    Delete
                  </TableCell>
                  <TableCell className="py-2 font-helvetica-13 text-black text-center">
                    <CircleCheck
                      size={16}
                      strokeWidth={2}
                      className="mb-[4px] mr-[6px] inline-block"
                    />
                    Approve
                  </TableCell>
                </TableRow>
                <TableRow className="*:border-border hover:bg-neutral-200 [&>:not(:last-child)]:border-r">
                  <TableCell className="font-helvetica-13 text-black">
                    <Settings
                      size={16}
                      strokeWidth={2}
                      className="inline-block mb-[5px] mr-[6px]"
                    />
                    Settings
                  </TableCell>
                  <TableCell className="py-2 font-helvetica-13 text-center">
                    {renderPermissionIcon(
                      role.settings?.includes("view") ?? false
                    )}
                  </TableCell>
                  <TableCell className="py-2 font-helvetica-13 text-center">
                    {renderPermissionIcon(
                      role.settings?.includes("create") ?? false
                    )}
                  </TableCell>
                  <TableCell className="py-2 font-helvetica-13 text-center">
                    {renderPermissionIcon(
                      role.settings?.includes("edit") ?? false
                    )}
                  </TableCell>
                  <TableCell className="py-2 font-helvetica-13 text-center">
                    {renderPermissionIcon(
                      role.settings?.includes("delete") ?? false
                    )}
                  </TableCell>
                  <TableCell className="py-2 font-helvetica-13 text-center">
                    {renderPermissionIcon(
                      role.settings?.includes("approve") ?? false
                    )}
                  </TableCell>
                </TableRow>
                <TableRow className="*:border-border hover:bg-neutral-200 [&>:not(:last-child)]:border-r">
                  <TableCell className="font-helvetica-13 text-black">
                    <Notebook
                      size={16}
                      strokeWidth={2}
                      className="inline-block mb-[5px] mr-[6px]"
                    />
                    Audit Plans
                  </TableCell>
                  <TableCell className="py-2 font-helvetica-13 text-center">
                    {renderPermissionIcon(
                      role.audit_plans?.includes("view") ?? false
                    )}
                  </TableCell>
                  <TableCell className="py-2 font-helvetica-13 text-center">
                    {renderPermissionIcon(
                      role.audit_plans?.includes("create") ?? false
                    )}
                  </TableCell>
                  <TableCell className="py-2 font-helvetica-13 text-center">
                    {renderPermissionIcon(
                      role.audit_plans?.includes("edit") ?? false
                    )}
                  </TableCell>
                  <TableCell className="py-2 font-helvetica-13 text-center">
                    {renderPermissionIcon(
                      role.audit_plans?.includes("delete") ?? false
                    )}
                  </TableCell>
                  <TableCell className="py-2 font-helvetica-13 text-center">
                    {renderPermissionIcon(
                      role.audit_plans?.includes("approve") ?? false
                    )}
                  </TableCell>
                </TableRow>
                <TableRow className="*:border-border hover:bg-neutral-200 [&>:not(:last-child)]:border-r">
                  <TableCell className="font-helvetica-13 text-black">
                    <Building
                      size={16}
                      strokeWidth={2}
                      className="inline-block mb-[5px] mr-[6px]"
                    />
                    Administration
                  </TableCell>
                  <TableCell className="py-2 font-helvetica-13 text-center">
                    {renderPermissionIcon(
                      role.administration?.includes("view") ?? false
                    )}
                  </TableCell>
                  <TableCell className="py-2 font-helvetica-13 text-center">
                    {renderPermissionIcon(
                      role.administration?.includes("create") ?? false
                    )}
                  </TableCell>
                  <TableCell className="py-2 font-helvetica-13 text-center">
                    {renderPermissionIcon(
                      role.administration?.includes("edit") ?? false
                    )}
                  </TableCell>
                  <TableCell className="py-2 font-helvetica-13 text-center">
                    {renderPermissionIcon(
                      role.administration?.includes("delete") ?? false
                    )}
                  </TableCell>
                  <TableCell className="py-2 font-helvetica-13 text-center">
                    {renderPermissionIcon(
                      role.administration?.includes("approve") ?? false
                    )}
                  </TableCell>
                </TableRow>
                <TableRow className="*:border-border hover:bg-neutral-200 [&>:not(:last-child)]:border-r">
                  <TableCell className="font-helvetica-13 text-black">
                    <CalendarRange
                      size={16}
                      strokeWidth={2}
                      className="inline-block mb-[5px] mr-[6px]"
                    />
                    Planning
                  </TableCell>
                  <TableCell className="py-2 font-helvetica-13 text-center">
                    {renderPermissionIcon(
                      role.planning?.includes("view") ?? false
                    )}
                  </TableCell>
                  <TableCell className="py-2 font-helvetica-13 text-center">
                    {renderPermissionIcon(
                      role.planning?.includes("create") ?? false
                    )}
                  </TableCell>
                  <TableCell className="py-2 font-helvetica-13 text-center">
                    {renderPermissionIcon(
                      role.planning?.includes("edit") ?? false
                    )}
                  </TableCell>
                  <TableCell className="py-2 font-helvetica-13 text-center">
                    {renderPermissionIcon(
                      role.planning?.includes("delete") ?? false
                    )}
                  </TableCell>
                  <TableCell className="py-2 font-helvetica-13 text-center">
                    {renderPermissionIcon(
                      role.planning?.includes("approve") ?? false
                    )}
                  </TableCell>
                </TableRow>
                <TableRow className="*:border-border hover:bg-neutral-200 [&>:not(:last-child)]:border-r">
                  <TableCell className="font-helvetica-13 text-black">
                    <ClipboardCheck
                      size={16}
                      strokeWidth={2}
                      className="inline-block mb-[5px] mr-[6px]"
                    />
                    Fieldwork
                  </TableCell>
                  <TableCell className="py-2 font-helvetica-13 text-center">
                    {renderPermissionIcon(
                      role.fieldwork?.includes("view") ?? false
                    )}
                  </TableCell>
                  <TableCell className="py-2 font-helvetica-13 text-center">
                    {renderPermissionIcon(
                      role.fieldwork?.includes("create") ?? false
                    )}
                  </TableCell>
                  <TableCell className="py-2 font-helvetica-13 text-center">
                    {renderPermissionIcon(
                      role.fieldwork?.includes("edit") ?? false
                    )}
                  </TableCell>
                  <TableCell className="py-2 font-helvetica-13 text-center">
                    {renderPermissionIcon(
                      role.fieldwork?.includes("delete") ?? false
                    )}
                  </TableCell>
                  <TableCell className="py-2 font-helvetica-13 text-center">
                    {renderPermissionIcon(
                      role.fieldwork?.includes("approve") ?? false
                    )}
                  </TableCell>
                </TableRow>
                <TableRow className="*:border-border hover:bg-neutral-200 [&>:not(:last-child)]:border-r">
                  <TableCell className="font-helvetica-13 text-black">
                    <BarChart
                      size={16}
                      strokeWidth={2}
                      className="inline-block mb-[5px] mr-[6px]"
                    />
                    Reporting
                  </TableCell>
                  <TableCell className="py-2 font-helvetica-13 text-center">
                    {renderPermissionIcon(
                      role.reporting?.includes("view") ?? false
                    )}
                  </TableCell>
                  <TableCell className="py-2 font-helvetica-13 text-center">
                    {renderPermissionIcon(
                      role.reporting?.includes("create") ?? false
                    )}
                  </TableCell>
                  <TableCell className="py-2 font-helvetica-13 text-center">
                    {renderPermissionIcon(
                      role.reporting?.includes("edit") ?? false
                    )}
                  </TableCell>
                  <TableCell className="py-2 font-helvetica-13 text-center">
                    {renderPermissionIcon(
                      role.reporting?.includes("delete") ?? false
                    )}
                  </TableCell>
                  <TableCell className="py-2 font-helvetica-13 text-center">
                    {renderPermissionIcon(
                      role.reporting?.includes("approve") ?? false
                    )}
                  </TableCell>
                </TableRow>
                <TableRow className="*:border-border hover:bg-neutral-200 [&>:not(:last-child)]:border-r">
                  <TableCell className="font-helvetica-13 text-black">
                    <ListTodo
                      size={16}
                      strokeWidth={2}
                      className="inline-block mb-[5px] mr-[6px]"
                    />
                    Work Program
                  </TableCell>
                  <TableCell className="py-2 font-helvetica-13 text-center">
                    {renderPermissionIcon(
                      role.audit_program?.includes("view") ?? false
                    )}
                  </TableCell>
                  <TableCell className="py-2 font-helvetica-13 text-center">
                    {renderPermissionIcon(
                      role.audit_program?.includes("create") ?? false
                    )}
                  </TableCell>
                  <TableCell className="py-2 font-helvetica-13 text-center">
                    {renderPermissionIcon(
                      role.audit_program?.includes("edit") ?? false
                    )}
                  </TableCell>
                  <TableCell className="py-2 font-helvetica-13 text-center">
                    {renderPermissionIcon(
                      role.audit_program?.includes("delete") ?? false
                    )}
                  </TableCell>
                  <TableCell className="py-2 font-helvetica-13 text-center">
                    {renderPermissionIcon(
                      role.audit_program?.includes("approve") ?? false
                    )}
                  </TableCell>
                </TableRow>
                <TableRow className="*:border-border hover:bg-neutral-200 [&>:not(:last-child)]:border-r">
                  <TableCell className="font-helvetica-13 text-black">
                    <Clock
                      size={16}
                      strokeWidth={2}
                      className="inline-block mb-[5px] mr-[6px]"
                    />
                    Follow Up
                  </TableCell>
                  <TableCell className="py-2 font-helvetica-13 text-center">
                    {renderPermissionIcon(
                      role.follow_up?.includes("view") ?? false
                    )}
                  </TableCell>
                  <TableCell className="py-2 font-helvetica-13 text-center">
                    {renderPermissionIcon(
                      role.follow_up?.includes("create") ?? false
                    )}
                  </TableCell>
                  <TableCell className="py-2 font-helvetica-13 text-center">
                    {renderPermissionIcon(
                      role.follow_up?.includes("edit") ?? false
                    )}
                  </TableCell>
                  <TableCell className="py-2 font-helvetica-13 text-center">
                    {renderPermissionIcon(
                      role.follow_up?.includes("delete") ?? false
                    )}
                  </TableCell>
                  <TableCell className="py-2 font-helvetica-13 text-center">
                    {renderPermissionIcon(
                      role.follow_up?.includes("approve") ?? false
                    )}
                  </TableCell>
                </TableRow>
                <TableRow className="*:border-border hover:bg-neutral-200 [&>:not(:last-child)]:border-r">
                  <TableCell className="font-helvetica-13 text-black">
                    <AlertTriangle
                      size={16}
                      strokeWidth={2}
                      className="inline-block mb-[5px] mr-[6px]"
                    />
                    Issues
                  </TableCell>
                  <TableCell className="py-2 font-helvetica-13 text-center">
                    {renderPermissionIcon(
                      role.issue_management?.includes("view") ?? false
                    )}
                  </TableCell>
                  <TableCell className="py-2 font-helvetica-13 text-center">
                    {renderPermissionIcon(
                      role.issue_management?.includes("create") ?? false
                    )}
                  </TableCell>
                  <TableCell className="py-2 font-helvetica-13 text-center">
                    {renderPermissionIcon(
                      role.issue_management?.includes("edit") ?? false
                    )}
                  </TableCell>
                  <TableCell className="py-2 font-helvetica-13 text-center">
                    {renderPermissionIcon(
                      role.issue_management?.includes("delete") ?? false
                    )}
                  </TableCell>
                  <TableCell className="py-2 font-helvetica-13 text-center">
                    {renderPermissionIcon(
                      role.issue_management?.includes("approve") ?? false
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </section>
    </section>
  );
};
