/* eslint-disable react-hooks/exhaustive-deps */
import {
  AlertTriangle,
  AtSignIcon,
  BookCheck,
  CircleCheck,
  CirclePlus,
  CommandIcon,
  EclipseIcon,
  Ellipsis,
  FileText,
  Folder,
  Loader,
  Mail,
  MessageCircle,
  Settings,
  Star,
  ZapIcon,
} from "lucide-react";
import { useQueries } from "@tanstack/react-query";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "../ui/button";
import { useEffect, useMemo, useState } from "react";
import { StandardTemplateSchema } from "@/lib/types";
import z from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { MainProgramForm } from "../forms/main-program-form";
import { MainProgramAction } from "./main-program-actions";
import { ErrorMessage } from "@/lib/utils";
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

const fetchData = async (endpont: string, id: string | null) => {
  const response = await fetch(`${BASE_URL}/engagements/${endpont}/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${
        typeof window === "undefined" ? "" : localStorage.getItem("token")
      }`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch modules");
  }
  return await response.json();
};

export default function Component() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [updateMenu, setUpdateMenu] = useState<boolean>(false);
  const params = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<boolean>(false);

  const results = useQueries({
    queries: [
      {
        queryKey: ["planning", params.get("id")],
        queryFn: async (): Promise<z.infer<typeof StandardTemplateSchema>[]> =>
          fetchData("planning_procedures", params.get("id")),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        enabled: !!params.get("id"),
      },
      {
        queryKey: ["finalization", params.get("id")],
        queryFn: async (): Promise<z.infer<typeof StandardTemplateSchema>[]> =>
          fetchData("finalization_procedures", params.get("id")),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        enabled: !!params.get("id"),
      },
      {
        queryKey: ["reporting", params.get("id")],
        queryFn: async (): Promise<z.infer<typeof StandardTemplateSchema>[]> =>
          fetchData("reporting_procedures", params.get("id")),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        enabled: !!params.get("id"),
      },
      {
        queryKey: ["work_program", params.get("id")],
        queryFn: async (): Promise<WorkProgramResponse[]> =>
          fetchData("work_program", params.get("id")),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        enabled: !!params.get("id"),
      },
    ],
  });

  useEffect(() => {
    if (results[0].isError) {
      if (!error) {
        ErrorMessage(results[0].error);
        setError(true);
      }
    }
    if (results[1].isError) {
      if (!error) {
        ErrorMessage(results[1].error);
        setError(true);
      }
    }
    if (results[2].isError) {
      if (!error) {
        ErrorMessage(results[2].error);
        setError(true);
      }
    }
    if (results[3].isError) {
      if (!error) {
        ErrorMessage(results[3].error);
        setError(true);
      }
    }
  }, [results]);

  const planningStatus = useMemo(() => {
    if (!results[0].data) return [];
    return [...results[0].data].filter((procedure) => {
      return procedure.reviewed_by && procedure.prepared_by;
    });
  }, [results[0].data]);

  const finalizationStatus = useMemo(() => {
    if (!results[1].data) return [];
    return [...results[1].data].filter((procedure) => {
      return procedure.reviewed_by && procedure.prepared_by;
    });
  }, [results[1].data]);

  const setAction = (action: string, stage?: string) => {
    const param = new URLSearchParams(params.toString());
    param.set("action", action);
    if (stage) {
      param.set("stage", stage);
    }
    router.replace(`?${param.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-col gap-2 relative">
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
              className="px-4 py-4  h-9 rounded-md leading-6 w-full font-helvetica-13 bg-black hover:bg-neutral-900 text-white hover:no-underline">
              <span className="flex items-center justify-between w-full">
                <section className="flex items-center gap-3">
                  <item.icon
                    size={16}
                    className="shrink-0 opacity-90"
                    aria-hidden="true"
                  />
                  <span>{item.title}</span>
                </section>
                {item.id === "1" ? (
                  <>
                    {planningStatus.length === results[0].data?.length ? (
                      <CircleCheck
                        size={16}
                        strokeWidth={3}
                        className="inline-block mr-3 text-green-600"
                      />
                    ) : planningStatus.length > 0 &&
                      planningStatus.length !== results[0].data?.length ? (
                      <Loader
                        size={16}
                        strokeWidth={3}
                        className="inline-block mr-3 text-amber-600"
                      />
                    ) : null}
                  </>
                ) : null}
                {item.id === "4" ? (
                  <>
                    {finalizationStatus.length === results[1].data?.length ? (
                      <CircleCheck
                        size={16}
                        strokeWidth={2}
                        className="inline-block mr-3 text-green-600"
                      />
                    ) : finalizationStatus.length > 0 &&
                      finalizationStatus.length !== results[1].data?.length ? (
                      <Loader
                        size={16}
                        strokeWidth={3}
                        className="inline-block mr-3 text-amber-600"
                      />
                    ) : null}
                  </>
                ) : null}
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-1">
              {item.title === "Fieldwork" ? (
                <section className="flex flex-col gap-1">
                  <Button
                    className="w-full h-8 bg-neutral-200 text-black font-helvetica-13 flex items-center justify-start hover:bg-neutral-400"
                    onClick={() => setAction("summary_procedures")}>
                    <Settings
                      size={16}
                      className="text-black"
                      strokeWidth={2}
                    />
                    Summary of procedures
                  </Button>
                  <Button
                    className="w-full h-8 bg-neutral-200 text-black font-helvetica-13 flex items-center justify-start hover:bg-neutral-400"
                    onClick={() => setAction("summary_review_comments")}>
                    <MessageCircle
                      size={16}
                      className="text-black"
                      strokeWidth={2}
                    />
                    Summary of comments
                  </Button>
                  <Button
                    className="w-full h-8 bg-neutral-200 text-black font-helvetica-13 flex items-center justify-start hover:bg-neutral-400"
                    onClick={() => setAction("summary_tasks")}>
                    <BookCheck
                      size={16}
                      className="text-black"
                      strokeWidth={2}
                    />
                    Summary of tasks
                  </Button>
                </section>
              ) : null}
              {item.title === "Planning" && results[0].data ? (
                <>
                  <section
                    className="max-h-[400px] h-auto overflow-y-auto flex flex-col gap-1"
                    key={item.id}>
                    {results[0].data
                      ?.sort((a, b) => a.reference?.localeCompare(b.reference))
                      ?.map((item) => (
                        <Button
                          className="w-full h-8 bg-neutral-200 text-black font-helvetica-13 flex items-center justify-start hover:bg-neutral-400"
                          key={item.id}
                          onClick={() => {
                            setAction(item.id, "Planning");
                          }}>
                          {item.type === "risk" ? (
                            <AlertTriangle
                              size={16}
                              className="text-red-600"
                              strokeWidth={3}
                            />
                          ) : item.type === "program" ? (
                            <Folder
                              size={16}
                              className="text-black"
                              strokeWidth={2}
                            />
                          ) : item.type === "letter" ? (
                            <Mail
                              size={16}
                              className="text-black-600"
                              strokeWidth={2}
                            />
                          ) : (
                            <Settings
                              size={16}
                              className="text-black-600"
                              strokeWidth={2}
                            />
                          )}
                          {item.title}
                        </Button>
                      ))}
                  </section>
                </>
              ) : null}
              {item.title === "Finalization" && results[1].data ? (
                <>
                  <section
                    className="max-h-[400px] h-auto overflow-y-auto flex flex-col gap-1"
                    key={item.id}>
                    {results[1].data
                      ?.sort((a, b) => a.reference?.localeCompare(b.reference))
                      ?.map((item) => (
                        <Button
                          className="w-full h-8 bg-neutral-200 text-black font-helvetica-13 flex items-center justify-start hover:bg-neutral-400"
                          key={item.id}
                          onClick={() => {
                            setAction(item.id, "Finalization");
                          }}>
                          <Settings
                            size={16}
                            className="text-black-600"
                            strokeWidth={2}
                          />
                          {item.title}
                        </Button>
                      ))}
                  </section>
                </>
              ) : null}
              {item.title === "Reporting" && results[2].data ? (
                <>
                  <section
                    className="max-h-[400px] h-auto overflow-y-auto flex flex-col gap-1"
                    key={item.id}>
                    {results[2].data
                      ?.sort((a, b) => a.reference?.localeCompare(b.reference))
                      ?.map((item) => (
                        <Button
                          className="w-full h-8 bg-neutral-200 text-black font-helvetica-13 flex items-center justify-start hover:bg-neutral-400"
                          key={item.id}
                          onClick={() => {
                            setAction(item.id, "Reporting");
                          }}>
                          {item.type === "finding" ? (
                            <AlertTriangle
                              size={16}
                              className="text-red-600"
                              strokeWidth={2}
                            />
                          ) : item.type === "audit_process" ? (
                            <Star
                              size={16}
                              className="text-black"
                              strokeWidth={2}
                            />
                          ) : item.type === "sheet" ? (
                            <FileText
                              size={16}
                              className="text-black"
                              strokeWidth={2}
                            />
                          ) : (
                            <Settings
                              size={16}
                              className="text-black"
                              strokeWidth={2}
                            />
                          )}
                          {item.title}
                        </Button>
                      ))}
                  </section>
                </>
              ) : null}
            </AccordionContent>
          </AccordionItem>
        ))}
        <Separator className="bg-neutral-400 mt-2" />
        <section className="py-2 flex justify-between items-center">
          <Label className="font-helvetica-medium">
            <Folder
              size={16}
              strokeWidth={2}
              className="mb-[3px] mr-2 inline-block ml-2"
            />
            Work Proram
          </Label>
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
        {results[3]?.data?.map((item) => (
          <AccordionItem
            value={item.id ?? ""}
            key={item.id}
            className="flex flex-col border-none w-full">
            <AccordionTrigger
              disabled={item.procedures.length < 0 ? true : false}
              onClick={() => setUpdateMenu((prev) => !prev)}
              className="px-4 py-4  h-9 rounded-md leading-6 font-helvetica-13 bg-black hover:bg-neutral-900 text-white hover:no-underline">
              <section className="flex items-center justify-between w-full truncate">
                <span className="flex flex-1 items-center gap-3">
                  <Folder size={16} strokeWidth={2} />
                  <Label className="truncate flex-1 font-helvetica-13 w-[100px] cursor-pointer">
                    {item.name}
                  </Label>
                </span>
                <MainProgramAction id={item.id ?? ""}>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="w-[30px] h-[30px] flex items-center justify-center hover:bg-blue-900 rounded-md mx-1">
                    <Ellipsis size={16} />
                  </div>
                </MainProgramAction>
              </section>
            </AccordionTrigger>
            {item.procedures?.filter(
              (procedure) => procedure.procedure_id && procedure.procedure_title
            ).length > 0 && (
              <AccordionContent className="text-muted-foreground">
                <section
                  className="max-h-[350px] overflow-y-auto flex flex-col gap-1 pt-1"
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
                        className="w-full h-8 bg-neutral-200 text-black font-helvetica-13 flex items-center justify-start hover:bg-neutral-400"
                        onClick={() =>
                          setAction(procedure.procedure_id ?? "", "Program")
                        }>
                        <span className="flex items-center justify-between w-full">
                          <span className="flex items-center gap-3 truncate">
                            <Settings size={16} strokeWidth={2} />
                            <Label className="flex-1 truncate font-helvetica-13 cursor-pointer">
                              {procedure.procedure_title}
                            </Label>
                          </span>
                        </span>
                      </Button>
                    ))}
                </section>
              </AccordionContent>
            )}
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
