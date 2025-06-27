import { Response, StandardTemplateSchema } from "@/lib/types";
import z from "zod";
import { Button } from "../ui/button";
import {
  FileText,
  Menu,
  PanelLeft,
  Paperclip,
  Save,
  UserCheck,
  UserCog,
} from "lucide-react";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { showToast } from "./toast";
import { useSearchParams } from "next/navigation";
import {
  useStdTemplatePrepare,
  useStdTemplateReview,
} from "@/hooks/use-prepare-review-std-template";
import PreparedReviewedBy from "./prepared_reviewed_by";
import { Attachments } from "./attachments";
import { ProcedureAttachmentTable } from "../data-table/procedure-attachments-table";
import { ErrorMessage } from "@/lib/utils";
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

  const {
    data: attachmentData,
    isError: attachmentIsError,
    error: attachmentError,
  } = useQuery({
    queryKey: ["_attachments_", params.get("id"), data?.id],
    queryFn: async () => {
      const response = await fetch(
        `${BASE_URL}/attachments/${params.get("id")}?procedure_id=${params.get(
          "action"
        )}`,
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

  useEffect(() => {
    if (attachmentIsError) {
      ErrorMessage(attachmentError);
    }
  }, [attachmentError, attachmentIsError]);

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
    <section className="flex flex-col w-[calc(100vw-332px)] h-[calc(100vh-99px)] overflow-y-auto overflow-x-hidden">
      <header className="flex justify-between px-2 pt-[3px]">
        <section className="flex items-center justify-end gap-1">
          <Button className="mr-4 w-[30px] flex justify-center items-center font-table h-[30px]">
            <PanelLeft size={16} strokeWidth={3} />
          </Button>
          <Separator orientation="vertical" className="bg-neutral-400" />
          <section className="flex items-center gap-1 max-w-[500px]">
            <Label className="font-helvetica-14 px-2 truncate">
              {data?.title}
            </Label>
            <Separator
              orientation="vertical"
              className="bg-neutral-400 h-[30px]"
            />
            <Label className="font-helvetica-table-13 truncate">
              {data?.reference}
            </Label>
          </section>
        </section>
        <section className="flex-1 flex items-center justify-end gap-2 pr-1 h-[30px]">
          <div className="px-2">
            <ToggleProcedureVisibility />
          </div>
          <Separator
            className="mx-1 bg-neutral-400 h-[28px]"
            orientation="vertical"
          />
          <Button
            onClick={onSubmit}
            disabled={saveProcedureLoading}
            className="w-[130px] flex justify-start items-center h-7 text-white font-helvetica-13 bg-black">
            <Save size={16} strokeWidth={3} />
            Save
          </Button>
          <Separator className="mx-1 bg-neutral-400" orientation="vertical" />
          <PlanningProcedureActions data={data}>
            <Button className="w-[130px] flex justify-start items-center h-7 text-white font-helvetica-13 bg-black">
              <Menu size={16} strokeWidth={3} />
              Menu
            </Button>
          </PlanningProcedureActions>
        </section>
      </header>
      <Separator className="bg-neutral-500 mt-1" />
      <main className="pt-3 overflow-y-auto overflow-x-hidden h-[calc(100vh-91px)] pb-2 w-[calc(100vw-332px)] hide-scrollbar">
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
        <section id="attachments" className="px-2 my-3 flex-col gap-1">
          <section>
            <Label className="font-helvetica-13 text-black">
              <Paperclip
                size={16}
                strokeWidth={2}
                className="inline-block mb-[2px] mr-[5px]"
              />
              Attachments
            </Label>
          </section>
          <section>
            <ProcedureAttachmentTable data={attachmentData ?? []} />
          </section>
        </section>
        <section id="letters" className="px-2 my-2">
          {data?.type === "letter" ? (
            <section id="letters">
              <Attachments />
            </section>
          ) : null}
        </section>
        <section>
          <section className="flex items-center gap-2 pt-3 pb-2 w-[calc(100vw-340px)] px-2">
            {!preparedBy ? (
              <Button
                disabled={prepareLoading}
                onClick={onPrepare}
                className="w-[130px] h-7 flex items-center justify-start text-white font-helvetica-13 bg-black">
                <UserCog size={16} strokeWidth={3} />
                Prepare
              </Button>
            ) : null}
            {!reviewedBy && !!preparedBy && userEmail !== preparedBy.email ? (
              <Button
                onClick={onReview}
                disabled={reviewLoading}
                className="w-[130px] h-7 flex items-center text-white justify-start font-helvetica-13 bg-black">
                <UserCheck size={16} strokeWidth={3} />
                Review
              </Button>
            ) : null}
          </section>
          <div className=" pb-2 w-[calc(100vw-328x)] px-2">
            <PreparedReviewedBy
              preparedBy={preparedBy}
              reviewedBy={reviewedBy}
            />
          </div>
        </section>
        <section className="pt-2 w-full overflow-x-hidden mt-2">
          {data?.type === "risk" ? (
            <section className="flex flex-col gap-2">
              <Label className="font-helvetica-medium ml-2">
                Process Risk Control Matrix
              </Label>
              <PRCM />
            </section>
          ) : null}
          {data?.type === "program" ? (
            <section className="flex flex-col gap-2">
              <Label className="font-helvetica-medium ml-2 text-black">
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
          <AccordionTrigger className="px-4 py-4 h-9 rounded-md leading-6 hover:no-underline w-full font-helvetica-13 bg-neutral-200">
            <span className="flex items-center gap-3">
              <FileText size={17} strokeWidth={2} className="mb-1" />
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
