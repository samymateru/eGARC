import {
  AtSignIcon,
  CirclePlus,
  CommandIcon,
  EclipseIcon,
  Ellipsis,
  FileText,
  Folder,
  ZapIcon,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "../ui/button";
import { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { StandardTemplateSchema } from "@/lib/types";
import z from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { MainProgramForm } from "../forms/main-program-form";
import { MainProgramAction } from "./main-program-actions";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type Procedure = {
  procedure_id?: string;
  procedure_title?: string;
  reference: string;
};

type WorkProgramResponse = {
  id?: string;
  name?: string;
  procedures: Array<Procedure>;
};

const items = [
  {
    id: "1",
    icon: CommandIcon,
    title: "Planning",
    content:
      "Origin UI focuses on developer experience and performance. Built with TypeScript, it offers excellent type safety, follows accessibility standards, and provides comprehensive documentation with regular updates.",
  },
  {
    id: "2",
    icon: EclipseIcon,
    title: "Fieldwork",
    content:
      "Use our CSS variables for global styling, or className and style props for component-specific changes. We support CSS modules, Tailwind, and dark mode out of the box.",
  },
  {
    id: "3",
    icon: ZapIcon,
    title: "Reporting",
    content:
      "Yes, with tree-shaking, code splitting, and minimal runtime overhead. Most components are under 5KB gzipped.",
  },
  {
    id: "4",
    icon: AtSignIcon,
    title: "Finalization",
    content:
      "All components follow WAI-ARIA standards, featuring proper ARIA attributes, keyboard navigation, and screen reader support. Regular testing ensures compatibility with NVDA, VoiceOver, and JAWS.",
  },
];

export default function Component() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [updateMenu, setUpdateMenu] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const params = useSearchParams();
  const router = useRouter();

  const { data: workProgram } = useQuery<WorkProgramResponse[]>({
    queryKey: ["work_program", params.get("id")],
    queryFn: async () => {
      const response = await fetch(
        `${BASE_URL}/engagements/work_program/${params.get("id")}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              typeof window === "undefined" ? "" : localStorage.getItem("token")
            }`,
          },
        }
      );
      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw {
          status: response.status,
          body: errorBody,
        };
      }
      return await response.json();
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    enabled: !!params.get("id"),
  });

  const setAction = (action: string, stage?: string) => {
    const param = new URLSearchParams(params.toString());
    param.set("action", action);
    if (stage) {
      param.set("stage", stage);
    }
    router.replace(`?${param.toString()}`, { scroll: false });
  };

  const planningProcedures = queryClient
    .getQueryCache()
    .findAll({ queryKey: ["planning"] });
  const planning = planningProcedures[0]?.state.data as
    | z.infer<typeof StandardTemplateSchema>[]
    | undefined;

  const finalizationProcedures = queryClient
    .getQueryCache()
    .findAll({ queryKey: ["finalization"] });
  const finalization = finalizationProcedures[0]?.state.data as
    | z.infer<typeof StandardTemplateSchema>[]
    | undefined;

  const reportingProcedures = queryClient
    .getQueryCache()
    .findAll({ queryKey: ["reporting"] });
  const reporting = reportingProcedures[0]?.state.data as
    | z.infer<typeof StandardTemplateSchema>[]
    | undefined;

  return (
    <div className="flex flex-col gap-2">
      <Accordion
        type="single"
        collapsible
        className="w-full flex flex-col gap-1">
        {items.map((item) => (
          <AccordionItem
            value={item.id}
            key={item.id}
            className="flex flex-col border-none w-full">
            <AccordionTrigger
              onClick={() => setUpdateMenu((prev) => !prev)}
              className="px-4 py-4 dark:bg-neutral-800 dark:hover:bg-neutral-800 h-9 rounded-md leading-6 hover:no-underline w-full font-hel-heading ">
              <span className="flex items-center gap-3">
                <item.icon
                  size={16}
                  className="shrink-0 opacity-60"
                  aria-hidden="true"
                />
                <span>{item.title}</span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {item.title === "Fieldwork" ? (
                <section>
                  <Button
                    className="h-9 w-full mt-1 flex justify-start font-serif font-table dark:bg-background dark:hover:bg-black dark:text-neutral-200"
                    onClick={() => setAction("summary_procedures")}>
                    Summary of procedures
                  </Button>
                  <Button
                    className="h-9 w-full mt-1 flex justify-start font-serif font-table dark:bg-background dark:hover:bg-black dark:text-neutral-200"
                    onClick={() => setAction("summary_review_comments")}>
                    Summary of comments
                  </Button>
                  <Button
                    className="h-9 w-full mt-1 flex justify-start font-serif font-table dark:bg-background dark:hover:bg-black dark:text-neutral-200"
                    onClick={() => setAction("summary_tasks")}>
                    Summary of tasks
                  </Button>
                </section>
              ) : null}
              {planningProcedures.length > 0 &&
              item.title === "Planning" &&
              planningProcedures[0]?.state?.data ? (
                <>
                  <ScrollArea
                    className="max-h-[400px] h-auto overflow-y-auto"
                    key={item.id}>
                    {planning
                      ?.sort((a, b) => a.reference?.localeCompare(b.reference))
                      ?.map((item) => (
                        <Button
                          className="h-9 w-full mt-1 flex justify-start font-table dark:bg-background dark:hover:bg-black dark:text-neutral-200"
                          key={item.id}
                          onClick={() => {
                            setAction(item.id, "Planning");
                          }}>
                          {item.title}
                        </Button>
                      ))}
                  </ScrollArea>
                </>
              ) : null}
              {finalizationProcedures.length > 0 &&
              item.title === "Finalization" &&
              finalizationProcedures[0]?.state?.data ? (
                <>
                  <ScrollArea
                    className="max-h-[400px] h-auto overflow-y-auto"
                    key={item.id}>
                    {finalization
                      ?.sort((a, b) => a.reference?.localeCompare(b.reference))
                      ?.map((item) => (
                        <Button
                          className="h-9 w-full mt-1 flex justify-start font-table dark:bg-background dark:hover:bg-black dark:text-neutral-200"
                          key={item.id}
                          onClick={() => {
                            setAction(item.id, "Finalization");
                          }}>
                          {item.title}
                        </Button>
                      ))}
                  </ScrollArea>
                </>
              ) : null}
              {reportingProcedures.length > 0 &&
              item.title === "Reporting" &&
              reportingProcedures[0]?.state?.data ? (
                <>
                  <ScrollArea
                    className="max-h-[400px] h-auto overflow-y-auto"
                    key={item.id}>
                    {reporting
                      ?.sort((a, b) => a.reference?.localeCompare(b.reference))
                      ?.map((item) => (
                        <Button
                          className="h-9 w-full mt-1 flex justify-start font-table dark:bg-background dark:hover:bg-black dark:text-neutral-200"
                          key={item.id}
                          onClick={() => {
                            setAction(item.id, "Reporting");
                          }}>
                          <span className="flex items-center gap-3">
                            <FileText />
                            {item.title}
                          </span>
                        </Button>
                      ))}
                  </ScrollArea>
                </>
              ) : null}
            </AccordionContent>
          </AccordionItem>
        ))}
        <Separator />
        <section className="py-2 flex justify-between items-center">
          <Label className="font-hel-heading-bold ">Work Proram</Label>
          <MainProgramForm
            title="Main Program"
            id={params.get("id")}
            endpoint="engagements/main_program">
            <Button
              onClick={(e) => e.stopPropagation()}
              variant="ghost"
              className="w-[30px] h-[30px]">
              <CirclePlus size={16} />
            </Button>
          </MainProgramForm>
        </section>
        {workProgram?.map((item) => (
          <AccordionItem
            value={item.id ?? ""}
            key={item.id}
            className="flex flex-col border-none w-full">
            <AccordionTrigger
              disabled={item.procedures.length < 0 ? true : false}
              onClick={() => setUpdateMenu((prev) => !prev)}
              className="px-4 py-4 dark:bg-neutral-800 dark:hover:bg-neutral-800 h-9 rounded-md leading-6 hover:no-underline w-full font-hel-heading">
              <section className="flex items-center justify-between w-full">
                <span className="flex items-center gap-3">
                  <Folder size={16} strokeWidth={3} />
                  <span className="truncate block max-w-[175px] whitespace-nowrap overflow-hidden">
                    {item.name}
                  </span>
                </span>
                <MainProgramAction id={item.id ?? ""}>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="w-[30px] h-[30px] flex items-center justify-center dark:hover:bg-black rounded-md">
                    <Ellipsis size={16} />
                  </div>
                </MainProgramAction>
              </section>
            </AccordionTrigger>
            {item.procedures?.filter(
              (procedure) => procedure.procedure_id && procedure.procedure_title
            ).length > 0 && (
              <AccordionContent className="text-muted-foreground">
                <section>
                  <ScrollArea
                    className="max-h-[350px] h-auto overflow-y-auto"
                    key={item.id}>
                    {item.procedures
                      ?.sort((a, b) => a.reference?.localeCompare(b.reference))
                      .filter(
                        (procedure) =>
                          procedure.procedure_id && procedure.procedure_title
                      )
                      .map((procedure) => (
                        <Button
                          key={procedure.procedure_id}
                          className="h-9 w-full mt-1 flex justify-start font-serif font-table dark:bg-background dark:hover:bg-black dark:text-neutral-200"
                          onClick={() =>
                            setAction(procedure.procedure_id ?? "")
                          }>
                          <span className="flex items-center justify-between w-full">
                            <span className="flex items-center gap-3">
                              <FileText />
                              {procedure.procedure_title}
                            </span>
                          </span>
                        </Button>
                      ))}
                  </ScrollArea>
                </section>
              </AccordionContent>
            )}
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
