import { Response, StandardTemplateSchema } from "@/lib/types";
import z from "zod";
import { Button } from "../ui/button";
import { Menu, PanelLeft, Save } from "lucide-react";
import TextEditor from "@/components/shared/tiptap-text-editor";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type EditorOutput = {
  value: string;
};
type SaveProcedure = {
  tests: EditorOutput;
  results: EditorOutput;
  observation: EditorOutput;
  conclusion: EditorOutput;
  type: string | null;
};

const items = [
  {
    id: "1",
    title: "Procedures objective",
  },
  {
    id: "2",
    title: "Procedure/ test Description",
  },
  {
    id: "3",
    title: "Results of procedures",
  },
  {
    id: "4",
    title: "Observation  ",
  },
  {
    id: "5",
    title: "Conclusion",
  },
];

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { ScrollArea } from "../ui/scroll-area";
import { PRCM } from "@/app/(root)/eAuditNext/engagement/_planning/prcm";
import { SummaryAuditProgram } from "@/app/(root)/eAuditNext/engagement/_planning/summary-audit-program";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { PlanningProcedureActions } from "./planning-procedure-actions";
import { ToggleProcedureVisibility } from "./toggle-procedure-visibility";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showToast } from "./toast";
import { useSearchParams } from "next/navigation";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface PlanningHomeProps {
  data?: z.infer<typeof StandardTemplateSchema>;
}

export const StandardTemplateProcedure = ({ data }: PlanningHomeProps) => {
  const [objective, setObjective] = useState<string>("");
  const [tests, setTests] = useState<string>("");
  const [results, setResults] = useState<string>("");
  const [observation, setObservation] = useState<string>("");
  const [conclusion, setConclusion] = useState<string>("");

  useEffect(() => {
    setObjective("");
    setTests(data?.tests.value ?? "");
    setResults(data?.results.value ?? "");
    setObservation(data?.observation.value ?? "");
    setConclusion(data?.conclusion.value ?? "");
  }, [data]);

  const params = useSearchParams();
  const query_client = useQueryClient();

  const { mutate: saveProcedure, isPending: saveProcedureLoading } =
    useMutation({
      mutationKey: ["_save_procedure"],
      mutationFn: async (data: SaveProcedure): Promise<Response> => {
        const response = await fetch(
          `${BASE_URL}/engagements/procedure/${params.get("action")}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${
                typeof window === "undefined"
                  ? ""
                  : localStorage.getItem("token")
              }`,
            },
            body: JSON.stringify(data),
          }
        );
        if (!response.ok) {
          const errorBody = await response.json().catch(() => ({}));
          throw {
            status: response.status,
            body: errorBody,
          };
        }
        return response.json();
      },
    });

  const onSubmit = () => {
    const procedure: SaveProcedure = {
      tests: {
        value: tests,
      },
      results: { value: results },
      observation: {
        value: observation,
      },
      conclusion: {
        value: conclusion,
      },
      type: params.get("stage"),
    };

    saveProcedure(procedure, {
      onSuccess: (data) => {
        query_client.invalidateQueries({
          queryKey: ["work_program"],
        });
        showToast(data.detail, "success");
      },
      onError: (error) => {
        console.log(error);
      },
      onSettled: () => {},
    });
  };

  return (
    <section className="flex flex-col w-full">
      <header className="flex justify-between px-1">
        <section className="flex items-center justify-end gap-1 py-1 pl-1">
          <Button
            variant={"ghost"}
            className="mr-4 dark:bg-neutral-800 w-[30px] flex justify-center items-center font-table h-[30px]">
            <PanelLeft size={16} strokeWidth={3} />
          </Button>
          <Separator orientation="vertical" />
          <section className="flex items-center gap-1 font-table font-medium h-full">
            <Label>{data?.title}</Label>
            <Separator orientation="vertical" />
            <Label>{data?.reference}</Label>
          </section>
        </section>
        <section className="flex-1 flex items-center justify-end gap-2 pr-1">
          <div className="px-2">
            <ToggleProcedureVisibility />
          </div>
          <Button
            onClick={onSubmit}
            disabled={saveProcedureLoading}
            variant={"ghost"}
            className="dark:bg-neutral-800 w-[100px] flex justify-start items-center h-[30px]">
            <Save size={16} strokeWidth={3} />
            Save
          </Button>
          <PlanningProcedureActions data={data}>
            <Button
              variant={"ghost"}
              className="dark:bg-neutral-800 w-[100px] flex justify-start items-center h-[30px]">
              <Menu size={16} strokeWidth={3} />
              Menu
            </Button>
          </PlanningProcedureActions>
        </section>
      </header>
      <Separator />
      <main className="flex-1 pt-3">
        <ScrollArea className="max-h-[500px] h-auto overflow-auto hide-scrollbar">
          <TemplateWrapper
            setObjective={setObjective}
            setTests={setTests}
            setResults={setResults}
            setObservation={setObservation}
            setConclusion={setConclusion}
            objective={objective}
            tests={tests}
            results={results}
            observation={observation}
            conclusion={conclusion}
          />
          <section className="px-2 pt-2">
            {data?.type === "risk" ? <PRCM /> : null}
            {data?.type === "program" ? <SummaryAuditProgram /> : null}
          </section>
        </ScrollArea>
      </main>
    </section>
  );
};

interface TemplateWrapperProps {
  setObjective?: Dispatch<SetStateAction<string>>;
  setTests?: Dispatch<SetStateAction<string>>;
  setResults?: Dispatch<SetStateAction<string>>;
  setObservation?: Dispatch<SetStateAction<string>>;
  setConclusion?: Dispatch<SetStateAction<string>>;
  objective?: string;
  tests?: string;
  results?: string;
  observation?: string;
  conclusion?: string;
}

const TemplateWrapper = ({
  setObjective,
  setTests,
  setResults,
  setObservation,
  setConclusion,
  objective,
  tests,
  results,
  observation,
  conclusion,
}: TemplateWrapperProps) => {
  return (
    <Accordion type="multiple" className="w-full flex flex-col gap-1">
      {items.map((item) => (
        <AccordionItem
          value={item.id}
          key={item.id}
          className="flex flex-col border-none w-full px-2">
          <AccordionTrigger className="px-4 py-4 dark:bg-neutral-800 dark:hover:bg-neutral-800 h-9 rounded-md leading-6 hover:no-underline w-full font-hel-heading">
            <span className="flex items-center gap-3">
              <span>{item.title}</span>
            </span>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            {item.id === "1" ? (
              <TextEditor initialContent={objective} onChange={setObjective} />
            ) : item.id === "2" ? (
              <TextEditor initialContent={tests} onChange={setTests} />
            ) : item.id === "3" ? (
              <TextEditor initialContent={results} onChange={setResults} />
            ) : item.id === "4" ? (
              <TextEditor
                initialContent={observation}
                onChange={setObservation}
              />
            ) : item.id === "5" ? (
              <TextEditor
                initialContent={conclusion}
                onChange={setConclusion}
              />
            ) : null}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
