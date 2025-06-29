import { SummaryFindingSchema, IssueResponder } from "@/lib/types";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  ArrowLeft,
  Calendar,
  CommandIcon,
  Dot,
  EclipseIcon,
  Menu,
  User,
  Mail,
  ZapIcon,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Label } from "../ui/label";
import { IssueDetailsActions } from "./issue-details-actions";
import { useQuery } from "@tanstack/react-query";
import { IssueResponsesTable } from "../data-table/issue-responses";
import { Separator } from "../ui/separator";

type IssueValues = z.infer<typeof SummaryFindingSchema>;
type PreparedReviewedBy = z.infer<typeof IssueResponder>;

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface IssueDetailsProps {
  data: IssueValues;
}

const items = [
  {
    id: "1",
    icon: CommandIcon,
    title: "Details",
  },
  {
    id: "2",
    icon: EclipseIcon,
    title: "Classification",
  },
  {
    id: "3",
    icon: ZapIcon,
    title: "Contacts",
  },
];

export const IssueDetails = ({ data }: IssueDetailsProps) => {
  const params = useSearchParams();
  const router = useRouter();
  const [issueId, setIssueId] = useState<string | null>();

  const { data: responses } = useQuery({
    queryKey: ["_issue_responses_", data.id],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/issue/updates/${data.id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            typeof window === "undefined" ? "" : localStorage.getItem("token")
          }`,
        },
      });
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
    const storedId = localStorage.getItem("issue_id");
    if (storedId) {
      setIssueId(storedId);
    }
  }, []);

  const setAction = (action: string, stage?: string) => {
    console.log(action);
    const param = new URLSearchParams(params.toString());
    param.set("action", action);
    if (stage) {
      param.set("stage", stage);
    }
    router.replace(`?${param.toString()}`, { scroll: false });
  };

  return (
    <section className="flex-1 w-[calc(100vw-332px)] flex flex-col">
      <header className="flex items-center px-2 pt-1 pb-[2px] justify-between">
        <section className="w-fit flex items-center h-[30px]">
          <Button
            className="w-[30px] h-[30px] action"
            onClick={() => setAction(issueId ?? "", "Issue")}>
            <ArrowLeft />
          </Button>
          <Separator orientation="vertical" className="mx-2 bg-neutral-400" />
          <Label className="font-helvetica-14 text-black">{data.ref}</Label>
          <Separator orientation="vertical" className="mx-2 bg-neutral-400" />
          <Label className="font-helvetica-13 text-black">{data.status}</Label>
        </section>
        <section className="flex-1 flex justify-end">
          <IssueDetailsActions
            id={data.id}
            prepared={data?.prepared_by}
            reviewed={data?.reviewed_by}
            status={data?.status}>
            <Button className="w-[130px] action h-[30px] flex items-center justify-start">
              <Menu size={16} strokeWidth={2} />
              Menu
            </Button>
          </IssueDetailsActions>
        </section>
      </header>
      <Separator className="bg-neutral-500" />
      <main className=" w-full h-[calc(100vh-144px)] overflow-auto py-2 hide-scrollbar">
        <section className="h-full w-full px-4">
          <Accordion type="single" collapsible className=" flex flex-col gap-1">
            {items.map((item) => (
              <AccordionItem
                value={item.id}
                key={item.id}
                className="flex flex-col border-none w-full">
                <AccordionTrigger className="px-4 py-4 bg-neutral-200 h-9 rounded-md leading-6 hover:no-underline">
                  <span className="flex items-center gap-3">
                    <item.icon
                      size={16}
                      className="shrink-0 opacity-60"
                      aria-hidden="true"
                    />
                    <span className="font-helvetica-13 text-black">
                      {item.title}
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground py-2 w-full">
                  {item.id === "1" ? (
                    <div className="">
                      <Details
                        title={data.title}
                        criteria={data.criteria}
                        finding={data.finding}
                        risk_rating={data.risk_rating}
                        source={data.source}
                        sdi_name={data.sdi_name}
                        recomendation={data.recommendation}
                        managament_action_plan={data.management_action_plan}
                        estimated_implementation_date={
                          data.estimated_implementation_date
                        }
                        date_opened={data.date_opened}
                        date_closed={data.date_closed}
                        date_revised={data.date_revised}
                        revised_status={data.revised_status}
                        revised_count={data.revised_count}
                        regulatory={data?.regulatory ?? false}
                        recurring={data?.recurring_status ?? false}
                        reportable={data?.reportable ?? false}
                        impact_description={data?.impact_description}
                        root_cause_description={data?.root_cause_description}
                        prepared_by={data?.prepared_by}
                        reviewed_by={data?.reviewed_by}
                      />
                    </div>
                  ) : item.id === "2" ? (
                    <div className="w-full">
                      <Classification data={data} />
                    </div>
                  ) : item.id === "3" ? (
                    <div className="w-full">
                      <Contacts data={data} />
                    </div>
                  ) : null}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <IssueResponsesTable data={responses ?? []} />
        </section>
      </main>
    </section>
  );
};

interface DetailsProps {
  title: string;
  criteria: string;
  finding: string;
  risk_rating: string;
  source: string;
  sdi_name?: string;
  recomendation: string;
  managament_action_plan: string;
  estimated_implementation_date: Date;
  date_opened?: Date;
  date_closed?: Date;
  date_revised?: Date;
  regulatory: boolean;
  recurring: boolean;
  reportable: boolean;
  revised_status: boolean;
  revised_count: number;
  root_cause_description: string;
  impact_description: string;
  prepared_by?: PreparedReviewedBy;
  reviewed_by?: PreparedReviewedBy;
}

const Details = ({
  title,
  criteria,
  finding,
  risk_rating,
  source,
  sdi_name,
  recomendation,
  managament_action_plan,
  estimated_implementation_date,
  date_opened,
  date_closed,
  date_revised,
  regulatory,
  recurring,
  reportable,
  revised_status,
  revised_count,
  root_cause_description,
  impact_description,
  prepared_by,
  reviewed_by,
}: DetailsProps) => {
  return (
    <section className="pt-3 px-2 flex flex-col gap-4 max-h-[350px] w-[calc(100vw-332px)] overflow-auto">
      <section className="flex gap-2 items-center">
        <Label className="font-helvetica-14 text-black">Title:</Label>
        <Label className="font-helvetica-13 text-black">{title}</Label>
      </section>
      <section className="flex flex-col">
        <Label className="font-helvetica-14 text-black">Criteria</Label>
        <Label className="font-helvetica-13 text-black">{criteria}</Label>
      </section>
      <section className="flex flex-col">
        <Label className="font-helvetica-14 text-black">Finding/Weakness</Label>
        <Label className="font-helvetica-13 text-black">{finding}</Label>
      </section>
      <section className="flex items-center gap-1">
        <Label className="font-helvetica-14 text-black">Risk Level:</Label>
        <Label className="font-helvetica-13 text-black">{risk_rating}</Label>
      </section>
      <section className="flex items-center gap-1">
        <Label className="font-helvetica-14 text-black">Source:</Label>
        <Label className="font-helvetica-13 text-black">{source}</Label>
      </section>
      <section className="flex items-center gap-1">
        <Label className="font-helvetica-14 text-black">SDI Name:</Label>
        <Label className="font-helvetica-13 text-black">
          {sdi_name !== null ? sdi_name : "N/A"}
        </Label>
      </section>
      <section className="flex flex-col">
        <Label className="font-helvetica-14 text-black">Recommendation</Label>
        <Label className="font-helvetica-13 text-black">{recomendation}</Label>
      </section>
      <section className="flex flex-col">
        <Label className="font-helvetica-14 text-black">
          Management Action Plan
        </Label>
        <Label className="font-helvetica-13 text-black">
          {managament_action_plan}
        </Label>
      </section>
      <section className="flex flex-col">
        <Label className="font-helvetica-14 text-black">
          Root Cause Description
        </Label>
        <Label className="font-helvetica-13 text-black">
          {root_cause_description}
        </Label>
      </section>
      <section className="flex flex-col">
        <Label className="font-helvetica-14 text-black">
          Impact Description
        </Label>
        <Label className="font-helvetica-13 text-black">
          {impact_description}
        </Label>
      </section>
      <Separator className="my-1" />
      <section className="flex items-center gap-1">
        <Label className="font-helvetica-14 text-black  flex item-center gap-1">
          <Calendar size={16} strokeWidth={3} className="text-neutral-400" />
          Estimated Implementatation Date:
        </Label>
        <Label className="font-helvetica-13 text-black">
          {estimated_implementation_date !== null
            ? new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }).format(new Date(estimated_implementation_date ?? ""))
            : "N/A"}
        </Label>
      </section>
      <section className="flex items-center gap-1">
        <Label className="font-helvetica-14 text-black  flex item-center gap-1">
          <Calendar size={16} strokeWidth={3} className="text-neutral-400" />
          Date Sent To Implementer:
        </Label>
        <Label className="font-helvetica-13 text-black">
          {date_opened !== null
            ? new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }).format(new Date(date_opened ?? ""))
            : "N/A"}
        </Label>
      </section>
      <section className="flex items-center gap-1">
        <Label className="font-helvetica-14 text-black flex item-center gap-1">
          <Calendar size={16} strokeWidth={3} className="text-neutral-400" />
          Last Revised Date:
        </Label>
        <Label className="font-helvetica-13 text-black">
          {date_revised !== null
            ? new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }).format(new Date(date_revised ?? ""))
            : "N/A"}
        </Label>
      </section>
      <section className="flex items-center gap-1">
        <Label className="font-helvetica-14 text-black flex item-center gap-1">
          <Calendar size={16} strokeWidth={3} className="text-neutral-400" />
          Actual Close Date:
        </Label>
        <Label className="font-helvetica-13 text-black">
          {date_closed !== null
            ? new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }).format(new Date(date_closed ?? ""))
            : "N/A"}
        </Label>
      </section>
      <Separator className="my-1" />
      <section className="flex flex-col gap-2">
        <section className="flex items-center gap-2">
          <Label className="font-helvetica-14 text-black flex item-center gap-1">
            Recurring:
          </Label>
          <Label className="font-helvetica-13 text-black">
            {recurring ? "Yes" : "No"}
          </Label>
        </section>
        <section className="flex items-center gap-2">
          <Label className="font-helvetica-14 text-black flex item-center gap-1">
            Regulatory:
          </Label>
          <Label className="font-helvetica-13 text-black">
            {regulatory ? "Yes" : "No"}
          </Label>
        </section>
        <section className="flex items-center gap-2">
          <Label className="font-helvetica-14 text-black flex item-center gap-1">
            Reportable:
          </Label>
          <Label className="font-helvetica-13 text-black">
            {reportable ? "Yes" : "No"}
          </Label>
        </section>
        <section className="flex items-center gap-2">
          <Label className="font-helvetica-14 text-black flex item-center gap-1">
            Revised:
          </Label>
          <Label className="font-helvetica-13 text-black">
            {revised_status ? "Yes" : "No"}
            <span>&lt;{revised_count}&gt;</span>
          </Label>
        </section>
      </section>
      <Separator className="my-1" />
      <section className="flex items-center gap-1">
        <section className="flex flex-col mb-2 flex-1 gap-1">
          <Label className="font-helvetica-14 text-black">Prepared By:</Label>
          <section className="flex flex-col gap-2">
            <section className="flex item-center gap-2">
              <User size={16} strokeWidth={2} className="text-black" />
              <Label className="font-helvetica-13 text-black">
                {prepared_by === null ? "N/A" : prepared_by?.name}
              </Label>
            </section>
            <section className="flex item-center gap-2">
              <Mail size={16} strokeWidth={2} className="text-black" />
              <Label className="font-helvetica-13 text-black">
                {prepared_by === null ? "N/A" : prepared_by?.email}
              </Label>
            </section>
            <section className="flex item-center gap-2">
              <Calendar size={16} strokeWidth={2} className="text-black" />
              <Label className="font-helvetica-13 text-black">
                {prepared_by !== null
                  ? new Intl.DateTimeFormat("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }).format(new Date(prepared_by?.date_issued ?? ""))
                  : "N/A"}
              </Label>
            </section>
          </section>
        </section>
        <section className="flex flex-col mb-2 flex-1 gap-1">
          <Label className="font-helvetica-14 text-black">Review By:</Label>
          <section className="flex flex-col gap-2 pl-1">
            <section className="flex item-center gap-2">
              <User size={16} strokeWidth={3} className="text-black" />
              <Label className="font-helvetica-13 text-black">
                {reviewed_by === null ? "N/A" : reviewed_by?.name}
              </Label>
            </section>
            <section className="flex item-center gap-2">
              <Mail size={16} strokeWidth={2} className="text-black" />
              <Label className="font-helvetica-13 text-black">
                {reviewed_by === null ? "N/A" : reviewed_by?.email}
              </Label>
            </section>
            <section className="flex item-center gap-2">
              <Calendar size={16} strokeWidth={2} className="text-black" />
              <Label className="font-helvetica-13 text-black">
                {reviewed_by !== null
                  ? new Intl.DateTimeFormat("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }).format(new Date(reviewed_by?.date_issued ?? ""))
                  : "N/A"}
              </Label>
            </section>
          </section>
        </section>
      </section>
    </section>
  );
};

interface ContactsProps {
  data: IssueValues;
}

const Contacts = ({ data }: ContactsProps) => {
  return (
    <section className="max-h-[350px] overflow-auto flex flex-col gap-2 px-5 py-2">
      <section className="flex items-center gap-2 w-full px-2 flex-1 ">
        <section className="flex-1 flex flex-col h-[100px]">
          <Label className="font-helvetica-14 text-black">Owners</Label>
          <Separator className="my-1 bg-neutral-400" />
          <ul className="flex flex-col flex-1">
            {data?.lod1_owner.map((user) => {
              return (
                <Label
                  key={user.email}
                  className="flex items-center gap-1 text-black font-helvetica-13">
                  <User size={16} strokeWidth={2} />
                  <span>
                    {user.name} <span>&lt;{user.email}&gt;</span>
                  </span>
                </Label>
              );
            })}
          </ul>
        </section>
        <section className="flex-1 flex flex-col h-[100px]">
          <Label className="font-helvetica-14 text-black">Implementers</Label>
          <Separator className="my-1 bg-neutral-400" />
          <ul className="flex flex-col flex-1 ">
            {data?.lod1_implementer.map((user) => {
              return (
                <Label
                  key={user.email}
                  className="flex items-center gap-1 text-black font-helvetica-13">
                  <User size={16} strokeWidth={2} />
                  <span>
                    {user.name} <span>&lt;{user.email}&gt;</span>
                  </span>
                </Label>
              );
            })}
          </ul>
        </section>
      </section>
      <section className="flex items-center gap-2 w-full px-2 flex-1">
        <section className="flex-1 flex flex-col h-[100px]">
          <Label className="font-helvetica-14 text-black">Risk Managers</Label>
          <Separator className="my-1 bg-neutral-400" />
          <ul className="flex flex-col flex-1">
            {data?.lod2_risk_manager?.map((user) => {
              return (
                <Label
                  key={user.email}
                  className="flex items-center gap-1 text-black font-helvetica-13">
                  <User size={16} strokeWidth={2} />
                  <span>
                    {user.name} <span>&lt;{user.email}&gt;</span>
                  </span>
                </Label>
              );
            })}
          </ul>
        </section>
        <section className="flex-1 flex flex-col h-[100px]">
          <Label className="font-helvetica-14 text-black">
            Compliance Officers
          </Label>
          <Separator className="my-1 bg-neutral-400" />
          <ul className="flex flex-col flex-1">
            {data?.lod2_compliance_officer?.map((user) => {
              return (
                <Label
                  key={user.email}
                  className="flex items-center gap-1 text-black font-helvetica-13">
                  <User size={16} strokeWidth={2} />
                  <span>
                    {user.name} <span>&lt;{user.email}&gt;</span>
                  </span>
                </Label>
              );
            })}
          </ul>
        </section>
      </section>
      <section className="flex items-center gap-2 w-full px-2 flex-1">
        <section className="flex-1 flex flex-col h-[100px]">
          <Label className="font-helvetica-14 text-black">Audit Managers</Label>
          <Separator className="my-1 bg-neutral-400" />
          <ul className="flex flex-col flex-1">
            {data?.lod3_audit_manager.map((user) => {
              return (
                <Label
                  key={user.email}
                  className="flex items-center gap-1 text-black font-helvetica-13">
                  <User size={16} strokeWidth={2} />
                  <span>
                    {user?.name} <span>&lt;{user?.email}&gt;</span>
                  </span>
                </Label>
              );
            })}
          </ul>
        </section>
        <section className="flex-1 flex flex-col h-[100px]">
          <Label className="font-helvetica-14 text-black">Observers</Label>
          <Separator className="my-1 bg-neutral-400" />
          <ul className="flex flex-col flex-1">
            {data?.observers.map((user) => {
              return (
                <Label
                  key={user?.email}
                  className="flex items-center gap-1 text-black font-helvetica-13">
                  <User size={16} strokeWidth={2} />
                  <span>
                    {user?.name} <span>&lt;{user?.email}&gt;</span>
                  </span>
                </Label>
              );
            })}
          </ul>
        </section>
      </section>
    </section>
  );
};

interface ClassificationProps {
  data: IssueValues;
}

const Classification = ({ data }: ClassificationProps) => {
  return (
    <section className="flex flex-col gap-7 px-5 py-5">
      <section className="flex items-center gap-2 w-full px-2 flex-1 ">
        <section className="flex-1 flex flex-col h-fit">
          <Label className="font-helvetica-14 text-black">Root Cause</Label>
          <Separator className="my-1 bg-neutral-400" />
          <ul className="flex flex-col flex-1 gap-[2px]">
            <Label className="font-helvetica-13 text-black">
              {data.root_cause}
            </Label>
            <Label className="flex items-center font-helvetica-13 text-black">
              <Dot size={16} />
              {data.sub_root_cause}
            </Label>
          </ul>
        </section>
        <section className="flex-1 flex flex-col h-fit">
          <Label className="font-helvetica-14 text-black">Risk Category</Label>
          <Separator className="my-1 bg-neutral-400" />
          <ul className="flex flex-col flex-1 gap-[2px]">
            <Label className="font-helvetica-13 text-black">
              {data.risk_category}
            </Label>
            <Label className="flex items-center font-helvetica-13 text-black">
              <Dot size={16} />
              {data.sub_risk_category}
            </Label>
          </ul>
        </section>
      </section>
      <section className="flex items-center gap-2 w-full px-2 flex-1">
        <section className="flex-1 flex flex-col h-fit">
          <Label className="font-helvetica-14 text-black">Process</Label>
          <Separator className="my-1 bg-neutral-400" />
          <ul className="flex flex-col flex-1 gap-[2px]">
            <Label className="font-helvetica-13 text-black">
              {data.process}
            </Label>
            <Label className="flex items-center font-helvetica-13 text-black">
              <Dot size={16} />
              {data.sub_process}
            </Label>
          </ul>
        </section>
        <section className="flex-1 flex flex-col h-fit">
          <Label className="font-helvetica-14 text-black">
            Impact Category
          </Label>
          <Separator className="my-1 bg-neutral-400" />
          <ul className="flex flex-col flex-1 gap-[2px]">
            <Label className="font-helvetica-13 text-black">
              {data.impact_category}
            </Label>
            <Label className="flex items-center font-helvetica-13 text-black">
              <Dot size={16} />
              {data.impact_sub_category}
            </Label>
          </ul>
        </section>
      </section>
    </section>
  );
};
