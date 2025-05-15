import z from "zod";
import { Button } from "../ui/button";
import { CircleAlert, Menu, PanelLeft, Save } from "lucide-react";
import PropagateLoader from "react-spinners/PropagateLoader";
import TextEditor from "@/components/shared/tiptap-text-editor";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type SaveWorkProgramProcedure = {
  brief_description?: string;
  audit_objective?: string;
  test_description?: string;
  test_type?: string;
  sampling_approach?: string;
  results_of_test?: string;
  observation?: string;
  extended_testing?: boolean;
  extended_procedure?: string;
  extended_results?: string;
  effectiveness?: string;
  conclusion?: string;
};

const items = [
  {
    id: "1",
    title: "Brief description",
  },
  {
    id: "2",
    title: "Audit objective",
  },
  {
    id: "3",
    title: "Test description",
  },
  {
    id: "4",
    title: "Sampling approach",
  },
  {
    id: "5",
    title: "Results of test",
  },
  {
    id: "6",
    title: "Observation",
  },
  {
    id: "7",
    title: "Extended procedure",
  },
  {
    id: "8",
    title: "Extended results",
  },
  {
    id: "9",
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
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
import { Response, SubProgramSchema_ } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import { ProcedureAction } from "./procedure-action";
import { ToggleProcedureVisibility } from "./toggle-procedure-visibility";
import { showToast } from "./toast";

type SubProgramValues = z.infer<typeof SubProgramSchema_>;

interface WorkProgramProcedureProps {
  id?: string;
}

export const WorkProgramProcedure = ({}: WorkProgramProcedureProps) => {
  const query_client = useQueryClient();
  const params = useSearchParams();

  const [briefDescription, setBriefDescription] = useState<string>("");
  const [objective, setObjective] = useState<string>("");
  const [testDescription, setTestDescription] = useState<string>("");
  const [testType, setTestType] = useState<string>("");
  const [samplingApproach, setSamplingApproach] = useState<string>("");
  const [results, setResults] = useState<string>("");
  const [observation, setObservation] = useState<string>("");
  const [extendedTesting, setExtendedTesting] = useState<boolean>(false);
  const [extendedProcedure, setExtendedProcedure] = useState<string>("");
  const [extendedResults, setExtendedResults] = useState<string>("");
  const [effectiveness, setEffectiveness] = useState<string>("");
  const [conclusion, setConclusion] = useState<string>("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["sub_program_procedure", params.get("action")],
    queryFn: async (): Promise<SubProgramValues> => {
      const response = await fetch(
        `${BASE_URL}/engagements/sub_program_/${params.get("action")}`,
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
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
    enabled: !!params.get("action"),
  });

  useEffect(() => {
    setBriefDescription(data?.brief_description ?? "");
    setObjective(data?.audit_objective ?? "");
    setTestDescription(data?.test_description ?? "");
    setTestType(data?.test_type ?? "");
    setSamplingApproach(data?.sampling_approach ?? "");
    setResults(data?.results_of_test ?? "");
    setObservation(data?.observation ?? "");
    setExtendedTesting(data?.extended_testing ?? false);
    setExtendedProcedure(data?.extended_procedure ?? "");
    setExtendedResults(data?.extended_results ?? "");
    setEffectiveness(data?.effectiveness ?? "");
    setConclusion(data?.conclusion ?? "");
  }, [data]);

  const { mutate: saveProcedure, isPending: saveProcedureLoading } =
    useMutation({
      mutationKey: ["_save_work_program_procedure"],
      mutationFn: async (data: SaveWorkProgramProcedure): Promise<Response> => {
        const response = await fetch(
          `${BASE_URL}/engagements/sub_program/save/${params.get("action")}`,
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
    const procedure: SaveWorkProgramProcedure = {
      brief_description: briefDescription,
      audit_objective: objective,
      test_description: testDescription,
      test_type: testType,
      sampling_approach: samplingApproach,
      results_of_test: results,
      observation: observation,
      extended_testing: extendedTesting,
      extended_procedure: extendedProcedure,
      extended_results: extendedResults,
      effectiveness: effectiveness,
      conclusion: conclusion,
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
    <>
      {isLoading ? (
        <div className="h-full flex justify-center items-center w-full">
          <PropagateLoader className="text-white" color="white" />
        </div>
      ) : isError ? (
        <div className="h-full flex items-center justify-center w-full">
          <div className="rounded-lg border border-red-500/50 px-4 py-3 text-red-600 w-[200px]">
            <p className="text-sm">
              <CircleAlert
                className="-mt-0.5 me-3 inline-flex opacity-60"
                size={16}
                strokeWidth={2}
                aria-hidden="true"
              />
              An error occurred!
            </p>
          </div>
        </div>
      ) : (
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
                disabled={saveProcedureLoading}
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onSubmit();
                }}
                className="w-[100px] h-[30px] flex items-center justify-start dark:hover:bg-neutral-800 rounded-md">
                <Save size={16} />
                Save
              </Button>
              <ProcedureAction side="bottom">
                <Button
                  variant="ghost"
                  onClick={(e) => e.stopPropagation()}
                  className="w-[100px] h-[30px] flex items-center justify-start dark:hover:bg-neutral-800 rounded-md">
                  <Menu size={16} />
                  Menu
                </Button>
              </ProcedureAction>
            </section>
          </header>
          <Separator />
          <main className="flex-1 pt-3">
            <ScrollArea className="max-h-[500px] h-auto overflow-auto hide-scrollbar">
              <TemplateWrapper
                briefDescription={briefDescription}
                setBriefDescription={setBriefDescription}
                objective={objective}
                setObjective={setObjective}
                testDescription={testDescription}
                setTestDescription={setTestDescription}
                testType={testType}
                setTestType={setTestType}
                samplingApproach={samplingApproach}
                setSamplingApproach={setSamplingApproach}
                results={results}
                setResults={setResults}
                observation={observation}
                setObservation={setObservation}
                extendedProcedure={extendedProcedure}
                setExtendedProcedure={setExtendedProcedure}
                extendedResults={extendedResults}
                setExtendedResults={setExtendedResults}
                effectiveness={effectiveness}
                setEffectiveness={setEffectiveness}
                conclusion={conclusion}
                setConclusion={setConclusion}
              />
            </ScrollArea>
          </main>
        </section>
      )}
    </>
  );
};

interface TemplateWrapperProps {
  briefDescription?: string;
  setBriefDescription?: Dispatch<SetStateAction<string>>;
  objective?: string;
  setObjective?: Dispatch<SetStateAction<string>>;
  testDescription?: string;
  setTestDescription?: Dispatch<SetStateAction<string>>;
  testType?: string;
  setTestType?: Dispatch<SetStateAction<string>>;
  samplingApproach?: string;
  setSamplingApproach?: Dispatch<SetStateAction<string>>;
  results?: string;
  setResults?: Dispatch<SetStateAction<string>>;
  observation?: string;
  setObservation?: Dispatch<SetStateAction<string>>;
  extendedProcedure?: string;
  setExtendedProcedure?: Dispatch<SetStateAction<string>>;
  extendedResults?: string;
  setExtendedResults?: Dispatch<SetStateAction<string>>;
  effectiveness?: string;
  setEffectiveness?: Dispatch<SetStateAction<string>>;
  conclusion?: string;
  setConclusion?: Dispatch<SetStateAction<string>>;
}
const TemplateWrapper = ({
  briefDescription,
  setBriefDescription,
  objective,
  setObjective,
  testDescription,
  setTestDescription,
  testType,
  setTestType,
  samplingApproach,
  setSamplingApproach,
  results,
  setResults,
  observation,
  setObservation,
  extendedProcedure,
  setExtendedProcedure,
  extendedResults,
  setExtendedResults,
  effectiveness,
  setEffectiveness,
  conclusion,
  setConclusion,
}: TemplateWrapperProps) => {
  return (
    <Accordion type="multiple" className="w-full flex flex-col gap-1">
      {items.map((item) => (
        <AccordionItem
          value={item.id}
          key={item.id}
          className="flex flex-col border-none w-full px-2">
          <AccordionTrigger className="px-4 py-4 dark:bg-neutral-800 dark:hover:bg-neutral-800 h-9 rounded-md text-[15px] leading-6 hover:no-underline w-full font-serif font-semibold tracking-wide">
            <span className="flex items-center gap-3">
              <span>{item.title}</span>
            </span>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            {item.id === "1" ? (
              <TextEditor
                initialContent={briefDescription}
                onChange={setBriefDescription}
              />
            ) : item.id === "2" ? (
              <TextEditor initialContent={objective} onChange={setObjective} />
            ) : item.id === "3" ? (
              <TextEditor
                initialContent={testDescription}
                onChange={setTestDescription}
              />
            ) : item.id === "4" ? (
              <TextEditor initialContent={testType} onChange={setTestType} />
            ) : item.id === "5" ? (
              <TextEditor
                initialContent={samplingApproach}
                onChange={setSamplingApproach}
              />
            ) : item.id === "6" ? (
              <TextEditor initialContent={results} onChange={setResults} />
            ) : item.id === "7" ? (
              <TextEditor
                initialContent={observation}
                onChange={setObservation}
              />
            ) : item.id === "8" ? (
              <TextEditor
                initialContent={extendedProcedure}
                onChange={setExtendedProcedure}
              />
            ) : item.id === "9" ? (
              <TextEditor
                initialContent={extendedResults}
                onChange={setExtendedResults}
              />
            ) : item.id === "10" ? (
              <TextEditor
                initialContent={effectiveness}
                onChange={setEffectiveness}
              />
            ) : item.id === "11" ? (
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
