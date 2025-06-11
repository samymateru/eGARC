import { Response, StandardTemplateSchema } from "@/lib/types";
import z from "zod";
import { Button } from "../ui/button";
import { Menu, PanelLeft, Save, UserCheck, UserCog } from "lucide-react";
import TextEditor from "@/components/shared/tiptap-text-editor";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type EditorOutput = {
  value: string;
};
type SaveProcedure = {
  objectives: EditorOutput;
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
import { PRCM } from "@/app/(root)/eAuditNext/engagement/_planning/prcm";
import { SummaryAuditProgram } from "@/app/(root)/eAuditNext/engagement/_planning/summary-audit-program";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { PlanningProcedureActions } from "./planning-procedure-actions";
import { ToggleProcedureVisibility } from "./toggle-procedure-visibility";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showToast } from "./toast";
import { useSearchParams } from "next/navigation";
import {
  useStdTemplatePrepare,
  useStdTemplateReview,
} from "@/hooks/use-prepare-review-std-template";
import PreparedReviewedBy from "./prepared_reviewed_by";
import { Attachments } from "./attachments";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface PlanningHomeProps {
  data?: z.infer<typeof StandardTemplateSchema>;
}

type PreparedReviewedBy = {
  name: string;
  email: string;
  date_issued: string;
};

export const StandardTemplateProcedure = ({ data }: PlanningHomeProps) => {
  const params = useSearchParams();
  const [objective, setObjective] = useState<string>("");
  const [tests, setTests] = useState<string>("");
  const [results, setResults] = useState<string>("");
  const [observation, setObservation] = useState<string>("");
  const [conclusion, setConclusion] = useState<string>("");
  const [preparedBy, setPreparedBy] = useState<PreparedReviewedBy>();
  const [reviewedBy, setRevieweddBy] = useState<PreparedReviewedBy>();

  const { mutate: prepare, isPending: prepareLoading } = useStdTemplatePrepare(
    params.get("action"),
    params.get("stage") ?? ""
  );

  const { mutate: review, isPending: reviewLoading } = useStdTemplateReview(
    params.get("action"),
    params.get("stage") ?? ""
  );

  const [userEmail, setUserEmail] = useState<string | null>();

  useEffect(() => {
    setObjective(data?.objectives.value ?? "");
    setTests(data?.tests.value ?? "");
    setResults(data?.results.value ?? "");
    setObservation(data?.observation.value ?? "");
    setConclusion(data?.conclusion.value ?? "");
    if (data?.prepared_by) {
      setPreparedBy({
        name: data.prepared_by.name ?? "",
        email: data.prepared_by?.email ?? "",
        date_issued: data.prepared_by?.date_issued ?? "",
      });
    }
    if (data?.reviewed_by) {
      setRevieweddBy({
        name: data.reviewed_by.name ?? "",
        email: data.reviewed_by?.email ?? "",
        date_issued: data.reviewed_by?.date_issued ?? "",
      });
    }
  }, [data]);

  const query_client = useQueryClient();

  const { mutate: saveProcedure, isPending: saveProcedureLoading } =
    useMutation({
      mutationKey: ["_save_procedure", params.get("action")],
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
      objectives: { value: objective },
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
          queryKey: ["planning", params.get("id")],
        });

        query_client.invalidateQueries({
          queryKey: ["finalization", params.get("id")],
        });

        query_client.invalidateQueries({
          queryKey: ["reporting", params.get("id")],
        });
        showToast(data.detail, "success");
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
          queryKey: ["planning", params.get("id")],
        });

        query_client.invalidateQueries({
          queryKey: ["finalization", params.get("id")],
        });

        query_client.invalidateQueries({
          queryKey: ["reporting", params.get("id")],
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
          queryKey: ["planning", params.get("id")],
        });

        query_client.invalidateQueries({
          queryKey: ["finalization", params.get("id")],
        });

        query_client.invalidateQueries({
          queryKey: ["reporting", params.get("id")],
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
            <Label className="font-semibold font-[helvetica] text-[15px] scroll-m-0 px-2 truncate">
              {data?.title}
            </Label>
            <Separator orientation="vertical" />
            <Label className="font-semibold font-[helvetica] text-xs scroll-m-0 truncate">
              {data?.reference}
            </Label>
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
      <main className="pt-3 overflow-y-auto overflow-x-hidden h-[calc(100vh-91px)] w-[calc(100vw-320px)]">
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
        <Separator className="my-3" />
        <section id="letters" className="px-2 my-2">
          {data?.type === "letter" ? (
            <section id="letters">
              <Attachments />
            </section>
          ) : null}
        </section>
        <Separator className="my-3" />
        <section>
          <section className="flex items-center gap-2 pt-3 pb-2 w-[calc(100vw-320px)] px-2">
            {!preparedBy ? (
              <Button
                disabled={prepareLoading}
                onClick={onPrepare}
                variant="ghost"
                className="w-[120px] h-[30px] flex items-center justify-start bg-blue-950">
                <UserCog size={16} strokeWidth={3} />
                Prepare
              </Button>
            ) : null}
            {!reviewedBy && !!preparedBy && userEmail !== preparedBy.email ? (
              <Button
                onClick={onReview}
                disabled={reviewLoading}
                variant="ghost"
                className="w-[120px] h-[30px] flex items-center justify-start bg-blue-950">
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
        </section>
        <section className="pt-2 w-full overflow-x-hidden mt-2">
          {data?.type === "risk" ? (
            <section>
              <Label className="font-[helvetica] font-semibold tracking-normal scroll-m-0 text-[16px] ml-2">
                Process Risk Control Matrix
              </Label>
              <PRCM />
            </section>
          ) : null}
          {data?.type === "program" ? (
            <section>
              <Label className="font-[helvetica] font-semibold tracking-normal scroll-m-0 text-[16px] ml-2">
                Engagement Work Program
              </Label>
              <SummaryAuditProgram />
            </section>
          ) : null}
        </section>
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
