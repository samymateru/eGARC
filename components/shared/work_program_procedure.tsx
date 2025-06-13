import z from "zod";
import { Button } from "../ui/button";
import {
  CircleAlert,
  Menu,
  PanelLeft,
  Save,
  UserCheck,
  UserCog,
} from "lucide-react";
import PropagateLoader from "react-spinners/PropagateLoader";
import TextEditor from "@/components/shared/tiptap-text-editor";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useId,
  MouseEvent,
} from "react";

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

type PreparedReviewedBy = {
  name: string;
  email: string;
  date_issued: string;
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
    title: "Test Types",
  },
  {
    id: "5",
    title: "Sampling approach",
  },
  {
    id: "6",
    title: "Results of test",
  },
  {
    id: "7",
    title: "Observation",
  },
  {
    id: "8",
    title: "Extended Testing",
  },
  {
    id: "9",
    title: "Extended procedure",
  },
  {
    id: "10",
    title: "Extended results",
  },
  {
    id: "11",
    title: "Effectiveness",
  },
  {
    id: "12",
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
import { useQuery, useQueryClient } from "@tanstack/react-query";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
import { SubProgramSchema_ } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import { ProcedureAction } from "./procedure-action";
import { ToggleProcedureVisibility } from "./toggle-procedure-visibility";
import { showToast } from "./toast";
import { ProcedureRiskControlMatrix } from "./procedure-risk-control-matrix";
import PreparedReviewedBy from "./prepared_reviewed_by";
import { useSaveWorkProgramProcedure } from "@/hooks/use-save-workprogram-procedure";
import { useWorkProgramProcedurePrepare } from "@/hooks/use-edit-workprogram-prepared";
import { useWorkProgramProcedureReview } from "@/hooks/use-edit-workprogram-reviewed";

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
  const [preparedBy, setPreparedBy] = useState<PreparedReviewedBy>();
  const [reviewedBy, setRevieweddBy] = useState<PreparedReviewedBy>();

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
    if (data?.prepared_by) {
      setPreparedBy({
        name: data.prepared_by.name ?? "",
        email: data.prepared_by.email ?? "",
        date_issued: data.prepared_by.date_issued,
      });
    }
    if (data?.reviewed_by) {
      setRevieweddBy({
        name: data.reviewed_by.name ?? "",
        email: data.reviewed_by.email ?? "",
        date_issued: data.reviewed_by.date_issued,
      });
    }
  }, [data]);

  const { mutate: saveProcedure, isPending: saveProcedureLoading } =
    useSaveWorkProgramProcedure(params.get("action"));

  const { mutate: prepare, isPending: prepareLoading } =
    useWorkProgramProcedurePrepare(params.get("action"));

  const { mutate: review, isPending: reviewLoading } =
    useWorkProgramProcedureReview(params.get("action"));

  const [userEmail, setUserEmail] = useState<string | null>();

  const onSubmit = (mode: string) => {
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
          queryKey: ["sub_program_procedure", params.get("action")],
        });
        if (mode === "manual") {
          showToast(data.detail, "success");
        }
      },
      onError: (error) => {
        console.log(error);
      },
      onSettled: () => {},
    });
  };

  const onPrepare = () => {
    const preparedData: PreparedReviewedBy = {
      name: localStorage.getItem("user_name") ?? "",
      email: localStorage.getItem("user_email") ?? "",
      date_issued: new Date().toISOString(),
    };

    prepare(preparedData, {
      onSuccess: (data) => {
        query_client.invalidateQueries({
          queryKey: ["sub_program_procedure", params.get("action")],
        });
        showToast(data.detail, "success");
      },
      onError: (error) => {
        console.log(error);
      },
      onSettled: () => {},
    });
  };

  const onReview = () => {
    const reviewData: PreparedReviewedBy = {
      name: localStorage.getItem("user_name") ?? "",
      email: localStorage.getItem("user_email") ?? "",
      date_issued: new Date().toISOString(),
    };

    review(reviewData, {
      onSuccess: (data) => {
        query_client.invalidateQueries({
          queryKey: ["sub_program_procedure", params.get("action")],
        });
        showToast(data.detail, "success");
      },
      onError: (error) => {
        console.log(error);
      },
      onSettled: () => {},
    });
  };

  useEffect(() => {
    if (typeof window !== undefined) {
      setUserEmail(localStorage.getItem("user_email"));
    }
  }, []);

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
        <section className="flex flex-col w-[calc(100vw-320px)]">
          <header className="flex justify-between w-full px-2">
            <section className="flex items-center justify-end gap-1 py-2">
              <Button
                variant={"ghost"}
                className=" dark:bg-neutral-800 w-[30px] flex justify-center items-center font-table h-[30px] mr-2">
                <PanelLeft size={16} strokeWidth={3} />
              </Button>
              <Separator orientation="vertical" />
              <section className="flex items-center gap-1 font-table font-medium h-full">
                <Label className="font-semibold font-[helvetica] text-[15px] scroll-m-0 px-2 truncate">
                  {data?.title}
                </Label>
                <Separator orientation="vertical" />
                <Label className="font-semibold font-[helvetica] text-xs scroll-m-0 truncate">
                  {data?.reference}
                </Label>
              </section>
            </section>
            <section className="flex-1 flex items-center justify-end gap-2 h-[30px]">
              <div className="px-2">
                <ToggleProcedureVisibility />
              </div>
              <Separator className="mx-1" orientation="vertical" />
              <Button
                disabled={saveProcedureLoading}
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onSubmit("manual");
                }}
                className="w-[130px] font-bold text-white h-7 flex items-center justify-start bg-blue-700">
                <Save size={16} />
                Save
              </Button>
              <Separator className="mx-1" orientation="vertical" />
              <ProcedureAction
                side="bottom"
                subProgramTitle={data?.title ?? ""}>
                <Button
                  variant="ghost"
                  onClick={(e) => e.stopPropagation()}
                  className="w-[130px] font-bold text-white h-7 flex items-center justify-start bg-blue-700">
                  <Menu size={16} />
                  Menu
                </Button>
              </ProcedureAction>
            </section>
          </header>
          <Separator />
          <main className="flex-1 pt-3 w-[calc(100vw-320px)]">
            <ScrollArea className="max-h-[500px] h-auto overflow-auto hide-scrollbar">
              <ProcedureRiskControlMatrix />
              <Separator />
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
                extendedTesting={extendedTesting}
                setExtendedTesting={setExtendedTesting}
                extendedProcedure={extendedProcedure}
                setExtendedProcedure={setExtendedProcedure}
                extendedResults={extendedResults}
                setExtendedResults={setExtendedResults}
                effectiveness={effectiveness}
                setEffectiveness={setEffectiveness}
                conclusion={conclusion}
                setConclusion={setConclusion}
              />
              <Separator />
              <section className="flex items-center gap-2 pt-3 pb-2 w-[calc(100vw-320px)] px-2">
                {!preparedBy ? (
                  <Button
                    disabled={prepareLoading}
                    onClick={onPrepare}
                    variant="ghost"
                    className="w-[130px] font-bold text-white h-7 flex items-center justify-start bg-blue-700">
                    <UserCog size={16} strokeWidth={3} />
                    Prepare
                  </Button>
                ) : null}
                {!reviewedBy &&
                !!preparedBy &&
                userEmail !== preparedBy.email ? (
                  <Button
                    onClick={onReview}
                    disabled={reviewLoading}
                    variant="ghost"
                    className="w-[130px] font-bold text-white h-7 flex items-center justify-start bg-blue-700">
                    <UserCheck size={16} strokeWidth={3} />
                    Review
                  </Button>
                ) : null}
              </section>
              <div className=" pb-2 w-[calc(100vw-320px)] px-2">
                <PreparedReviewedBy
                  preparedBy={preparedBy}
                  reviewedBy={reviewedBy}
                />
              </div>
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
  extendedTesting?: boolean;
  setExtendedTesting?: Dispatch<SetStateAction<boolean>>;
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
  extendedTesting,
  setExtendedTesting,
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
  const [control, setControl] = useState(false);
  const [substantive, setSubstantive] = useState(false);

  const id = useId();

  useEffect(() => {
    const types = [];
    if (control) types.push("control");
    if (substantive) types.push("substantive");
    setTestType?.(types.join(", "));
  }, [control, substantive, setTestType]);

  useEffect(() => {
    const types = testType
      ?.toLowerCase()
      .split(",")
      .map((t) => t.trim());
    setControl(types?.includes("control") ?? false);
    setSubstantive(types?.includes("substantive") ?? false);
  }, [testType]);

  const handleToggle = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setExtendedTesting?.(!extendedTesting);
  };

  const handleControl = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setControl(!control);
  };

  const handleSubstansive = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setSubstantive(!substantive);
  };

  return (
    <section className="flex py-3 flex-col gap-2 w-[calc(100vw-320px)] px-2">
      <Label className="font-hel-heading-bold pl-2">Procedure Details</Label>
      <Accordion type="multiple" className=" flex  flex-col gap-1">
        {items.map((item) => (
          <AccordionItem
            value={item.id}
            key={item.id}
            className="flex flex-col border-none">
            {!(item.id === "9" || item.id === "10") || extendedTesting ? (
              <AccordionTrigger
                suppressHydrationWarning
                icon={item.id === "8" || item.id === "4" ? false : true}
                className={`px-4 py-4 hover:no-underline h-9 rounded-md font-hel-heading ${
                  item.id === "8" || item.id === "4"
                    ? "bg-transparent cursor-none pointer-events-none h-fit py-2"
                    : "dark:bg-neutral-800 dark:hover:bg-neutral-800"
                }`}>
                <span className="flex items-center gap-3">
                  {item.id === "8" ? (
                    <section
                      onClick={(e) => console.log(e)}
                      className="flex flex-col  gap-2">
                      <Label>Perform Extended Testing?</Label>
                      <div className="inline-flex items-center gap-2">
                        <div
                          tabIndex={0}
                          id={id}
                          role="switch"
                          aria-checked={extendedTesting}
                          onClick={handleToggle}
                          aria-label="Toggle switch"
                          className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors pointer-events-auto
                          ${
                            extendedTesting ? "bg-blue-950" : "bg-neutral-500"
                          }`}>
                          <div
                            className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform
                          ${
                            extendedTesting ? "translate-x-6" : "translate-x-0"
                          }`}
                          />
                        </div>
                        <Label
                          htmlFor={id}
                          className="font-table hover:no-underline font-medium">
                          {extendedTesting ? "Yes" : "No"}
                        </Label>
                      </div>
                    </section>
                  ) : item.id === "4" ? (
                    <section className="flex flex-col gap-2 py-2">
                      <Label className="font-table">Audit Test Type</Label>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center space-x-2">
                          <div
                            id={id}
                            role="checkbox"
                            aria-checked={control}
                            aria-label="Checkbox"
                            tabIndex={0}
                            onClick={handleControl}
                            onKeyDown={(e) => {
                              if (e.key === " " || e.key === "Enter") {
                                e.preventDefault();
                                setControl(!control);
                              }
                            }}
                            className={`w-5 h-5 border-2 border-gray-400 rounded-sm flex items-center justify-center cursor-pointer pointer-events-auto ${
                              control ? "bg-blue-950" : "bg-white"
                            }`}>
                            {control && (
                              <svg
                                className="w-3 h-3 text-white"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24">
                                <path d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <Label
                            onClick={(e) => e.stopPropagation()}
                            htmlFor="control"
                            className="pointer-events-auto font-table">
                            Control
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <div
                            id={id}
                            role="checkbox"
                            aria-checked={substantive}
                            aria-label="Checkbox"
                            tabIndex={0}
                            onClick={handleSubstansive}
                            onKeyDown={(e) => {
                              if (e.key === " " || e.key === "Enter") {
                                e.preventDefault();
                                setSubstantive(!substantive);
                              }
                            }}
                            className={`w-5 h-5 border-2 border-gray-400 rounded-sm flex items-center justify-center cursor-pointer pointer-events-auto ${
                              substantive ? "bg-blue-950" : "bg-white"
                            }`}>
                            {substantive && (
                              <svg
                                className="w-3 h-3 text-white"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24">
                                <path d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <Label
                            onClick={(e) => e.stopPropagation()}
                            htmlFor="substansive"
                            className="pointer-events-auto font-table">
                            Substansive
                          </Label>
                        </div>
                      </div>
                    </section>
                  ) : (
                    <span>{item.title}</span>
                  )}
                </span>
              </AccordionTrigger>
            ) : null}

            <AccordionContent className="text-muted-foreground">
              {item.id === "1" ? (
                <TextEditor
                  initialContent={briefDescription}
                  onChange={setBriefDescription}
                />
              ) : item.id === "2" ? (
                <TextEditor
                  initialContent={objective}
                  onChange={setObjective}
                />
              ) : item.id === "3" ? (
                <TextEditor
                  initialContent={testDescription}
                  onChange={setTestDescription}
                />
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
              ) : item.id === "9" && extendedTesting ? (
                <TextEditor
                  initialContent={extendedProcedure}
                  onChange={setExtendedProcedure}
                />
              ) : item.id === "10" && extendedTesting ? (
                <TextEditor
                  initialContent={extendedResults}
                  onChange={setExtendedResults}
                />
              ) : item.id === "11" ? (
                <TextEditor
                  initialContent={effectiveness}
                  onChange={setEffectiveness}
                />
              ) : item.id === "12" ? (
                <TextEditor
                  initialContent={conclusion}
                  onChange={setConclusion}
                />
              ) : null}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};
