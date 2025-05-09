import { AtSignIcon, CommandIcon, EclipseIcon, ZapIcon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

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

  const setAction = (action: string) => {
    const param = new URLSearchParams(params.toString());
    param.set("action", action);
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
    <div className="">
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
              className="px-4 py-4 dark:bg-neutral-800 dark:hover:bg-neutral-800 h-9 rounded-md text-[15px] leading-6 hover:no-underline w-full font-serif font-semibold tracking-wide">
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
                    className="h-9 w-full mt-1 flex justify-start font-serif font-medium tracking-wide dark:bg-background dark:hover:bg-black dark:text-neutral-200"
                    onClick={() => setAction("summary_procedures")}>
                    {1}. Summary of procedures
                  </Button>
                  <Button
                    className="h-9 w-full mt-1 flex justify-start font-serif font-medium tracking-wide dark:bg-background dark:hover:bg-black dark:text-neutral-200"
                    onClick={() => setAction("summary_review_comments")}>
                    {2}. Summary of comments
                  </Button>
                  <Button
                    className="h-9 w-full mt-1 flex justify-start font-serif font-medium tracking-wide dark:bg-background dark:hover:bg-black dark:text-neutral-200"
                    onClick={() => setAction("summary_tasks")}>
                    {3}. Summary of tasks
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
                    {planning?.map((item, index: number) => (
                      <Button
                        className="h-9 w-full mt-1 flex justify-start font-serif font-medium tracking-wide dark:bg-background dark:hover:bg-black dark:text-neutral-200"
                        key={item.id}
                        onClick={() => setAction(item.reference)}>
                        {index + 1}. {item.title}
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
                    {finalization?.map((item, index: number) => (
                      <Button
                        className="h-9 w-full mt-1 flex justify-start font-serif font-medium tracking-wide dark:bg-background dark:hover:bg-black dark:text-neutral-200"
                        key={item.id}
                        onClick={() => setAction(item.reference)}>
                        {index + 1}. {item.title}
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
                    {reporting?.map((item, index: number) => (
                      <Button
                        className="h-9 w-full mt-1 flex justify-start font-serif font-medium tracking-wide dark:bg-background dark:hover:bg-black dark:text-neutral-200"
                        key={item.id}
                        onClick={() => setAction(item.reference)}>
                        {index + 1}. {item.title}
                      </Button>
                    ))}
                  </ScrollArea>
                </>
              ) : null}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
