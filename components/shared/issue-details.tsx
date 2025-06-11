import { SummaryFindingSchema, IssueResponder } from "@/lib/types";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  ArrowLeft,
  AtSignIcon,
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
  {
    id: "4",
    icon: AtSignIcon,
    title: "Responses",
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
    <section className="flex-1 w-full flex flex-col">
      <header className="flex items-center px-2 py-1 justify-between">
        <section className="w-fit flex items-center h-[30px]">
          <Button
            className="w-[33px] h-[30px]"
            variant="ghost"
            onClick={() => setAction(issueId ?? "", "Issue")}>
            <ArrowLeft />
          </Button>
          <Separator orientation="vertical" className="mx-2" />
          <Label className="">{data.ref}</Label>
          <Separator orientation="vertical" className="mx-2" />
          <Label>{data.status}</Label>
        </section>
        <section className="flex-1 flex justify-end">
          <IssueDetailsActions id={data.id}>
            <Button
              className="w-[120px] h-[30px] flex items-center justify-start"
              variant="ghost">
              <Menu size={16} strokeWidth={3} />
              Menu
            </Button>
          </IssueDetailsActions>
        </section>
      </header>
      <main className=" w-full h-[calc(100vh-98px)] overflow-auto py-2 hide-scrollbar">
        <section className="h-full w-full px-4">
          <Accordion
            type="single"
            collapsible
            className="w-full flex flex-col gap-1">
            {items.map((item) => (
              <AccordionItem
                value={item.id}
                key={item.id}
                className="flex flex-col border-none w-full">
                <AccordionTrigger className="px-4 py-4 dark:bg-neutral-800 dark:hover:bg-neutral-800 h-9 rounded-md leading-6 hover:no-underline w-full font-hel-heading ">
                  <span className="flex items-center gap-3">
                    <item.icon
                      size={16}
                      className="shrink-0 opacity-60"
                      aria-hidden="true"
                    />
                    <span>{item.title}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground py-2">
                  {item.id === "1" ? (
                    <div>
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
                    <div className="w-[calc(100vw-352px)]">
                      <Classification data={data} />
                    </div>
                  ) : item.id === "3" ? (
                    <div>
                      <Contacts data={data} />
                    </div>
                  ) : item.id === "4" ? (
                    <div className="w-[calc(100vw-352px)]">
                      <IssueResponsesTable data={responses ?? []} />
                    </div>
                  ) : null}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
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
    <section className="pt-3 px-2 text-white flex flex-col gap-4 h-[400px] overflow-auto">
      <Separator className="my-1" />
      <section className="flex gap-2 items-center">
        <Label className="font-[helvetica] font-bold text-[15px]">Title:</Label>
        <Label className="font-[helvetica] font-medium text-neutral-300">
          {title}
        </Label>
      </section>
      <section className="flex flex-col">
        <Label className="font-[helvetica] font-bold text-[15px]">
          Criteria
        </Label>
        <Label className="font-[helvetica] font-medium text-neutral-300">
          {criteria}
        </Label>
      </section>
      <section className="flex flex-col">
        <Label className="font-[helvetica] font-bold text-[15px]">
          Finding/Weakness
        </Label>
        <Label className="font-[helvetica] font-medium text-neutral-300">
          {finding}
        </Label>
      </section>
      <section className="flex items-center gap-1">
        <Label className="font-[helvetica] font-bold text-[15px]">
          Risk Level:
        </Label>
        <Label className="font-[helvetica] font-medium text-neutral-300">
          {risk_rating}
        </Label>
      </section>
      <section className="flex items-center gap-1">
        <Label className="font-[helvetica] font-bold text-[15px]">
          Source:
        </Label>
        <Label className="font-[helvetica] font-medium text-neutral-300">
          {source}
        </Label>
      </section>
      <section className="flex items-center gap-1">
        <Label className="font-[helvetica] font-bold text-[15px]">
          SDI Name:
        </Label>
        <Label className="font-[helvetica] font-medium text-neutral-300">
          {sdi_name !== null ? sdi_name : "N/A"}
        </Label>
      </section>
      <section className="flex flex-col">
        <Label className="ffont-[helvetica] font-bold text-[15px]">
          Recommendation
        </Label>
        <Label className="font-[helvetica] font-medium text-neutral-300">
          {recomendation}
        </Label>
      </section>
      <section className="flex flex-col">
        <Label className="font-[helvetica] font-bold text-[15px]">
          Management Action Plan
        </Label>
        <Label className="font-[helvetica] font-medium text-neutral-300">
          {managament_action_plan}
        </Label>
      </section>
      <section className="flex flex-col">
        <Label className="font-[helvetica] font-bold text-[15px]">
          Root Cause Description
        </Label>
        <Label className="font-[helvetica] font-medium text-neutral-300">
          {root_cause_description}
        </Label>
      </section>
      <section className="flex flex-col">
        <Label className="font-[helvetica] font-bold text-[15px]">
          Impact Description
        </Label>
        <Label className="font-[helvetica] font-medium text-neutral-300">
          {impact_description}
        </Label>
      </section>
      <Separator className="my-1" />
      <section className="flex items-center gap-1">
        <Label className="font-[helvetica] font-bold text-[15px]  flex item-center gap-1">
          <Calendar size={16} strokeWidth={3} className="text-neutral-400" />
          Estimated Implementatation Date:
        </Label>
        <Label className="font-[helvetica] font-medium text-neutral-300">
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
        <Label className="font-[helvetica] font-bold text-[15px]  flex item-center gap-1">
          <Calendar size={16} strokeWidth={3} className="text-neutral-400" />
          Date Sent To Implementer:
        </Label>
        <Label className="font-[helvetica] font-medium text-neutral-300">
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
        <Label className="font-[helvetica] font-bold text-[15px] flex item-center gap-1">
          <Calendar size={16} strokeWidth={3} className="text-neutral-400" />
          Last Revised Date:
        </Label>
        <Label className="font-[helvetica] font-medium text-neutral-300">
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
        <Label className="font-[helvetica] font-bold text-[15px] flex item-center gap-1">
          <Calendar size={16} strokeWidth={3} className="text-neutral-400" />
          Actual Close Date:
        </Label>
        <Label className="font-[helvetica] font-medium text-neutral-300">
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
          <Label className="font-[helvetica] font-bold text-[15px] flex item-center gap-1">
            Recurring:
          </Label>
          <Label className="font-[helvetica] font-medium text-neutral-300">
            {recurring ? "Yes" : "No"}
          </Label>
        </section>
        <section className="flex items-center gap-2">
          <Label className="font-[helvetica] font-bold text-[15px] flex item-center gap-1">
            Regulatory:
          </Label>
          <Label className="font-[helvetica] font-medium text-neutral-300">
            {regulatory ? "Yes" : "No"}
          </Label>
        </section>
        <section className="flex items-center gap-2">
          <Label className="font-[helvetica] font-bold text-[15px] flex item-center gap-1">
            Reportable:
          </Label>
          <Label className="font-[helvetica] font-medium text-neutral-300">
            {reportable ? "Yes" : "No"}
          </Label>
        </section>
        <section className="flex items-center gap-2">
          <Label className="font-[helvetica] font-bold text-[15px] flex item-center gap-1">
            Revised:
          </Label>
          <Label className="font-[helvetica] font-medium text-neutral-300">
            {revised_status ? "Yes" : "No"}
            <span>&lt;{revised_count}&gt;</span>
          </Label>
        </section>
      </section>
      <Separator className="my-1" />
      <section className="flex items-center gap-1">
        <section className="flex flex-col mb-2 flex-1 gap-1">
          <Label className="font-[helvetica] font-bold text-[15px]">
            Prepared By:
          </Label>
          <section className="flex flex-col gap-2 pl-1">
            <section className="flex item-center gap-2">
              <User
                size={16}
                strokeWidth={3}
                className="text-muted-foreground"
              />
              <Label className="text-neutral-300">
                {prepared_by === null ? "N/A" : prepared_by?.name}
              </Label>
            </section>
            <section className="flex item-center gap-2">
              <Mail
                size={16}
                strokeWidth={3}
                className="text-muted-foreground"
              />
              <Label className="text-neutral-300 italic">
                {prepared_by === null ? "N/A" : prepared_by?.email}
              </Label>
            </section>
            <section className="flex item-center gap-2">
              <Calendar
                size={16}
                strokeWidth={3}
                className="text-muted-foreground"
              />
              <Label className="text-neutral-300">
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
          <Label className="font-[helvetica] font-bold text-[15px]">
            Review By:
          </Label>
          <section className="flex flex-col gap-2 pl-1">
            <section className="flex item-center gap-2">
              <User
                size={16}
                strokeWidth={3}
                className="text-muted-foreground"
              />
              <Label className="text-neutral-300">
                {reviewed_by === null ? "N/A" : reviewed_by?.name}
              </Label>
            </section>
            <section className="flex item-center gap-2">
              <Mail
                size={16}
                strokeWidth={3}
                className="text-muted-foreground"
              />
              <Label className="text-neutral-300 italic">
                {reviewed_by === null ? "N/A" : reviewed_by?.email}
              </Label>
            </section>
            <section className="flex item-center gap-2">
              <Calendar
                size={16}
                strokeWidth={3}
                className="text-muted-foreground"
              />
              <Label className="text-neutral-300">
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
      <Separator className="my-1" />
    </section>
  );
};

interface ContactsProps {
  data: IssueValues;
}

const Contacts = ({ data }: ContactsProps) => {
  return (
    <section className="h-[400px] overflow-auto flex flex-col gap-2 px-5 py-2">
      <section className="flex items-center gap-2 w-full px-2 flex-1 ">
        <section className="flex-1 flex flex-col h-[100px]">
          <Label className="font-[helvetica] text-[15px] font-bold scroll-m-1 tracking-normal text-white">
            Owners
          </Label>
          <Separator className="my-1" />
          <ul className="flex flex-col flex-1">
            {data.lod1_owner.map((user) => {
              return (
                <Label key={user.email} className="flex items-center gap-1">
                  <User size={16} strokeWidth={3} />
                  <span>
                    {user.name} <span>&lt;{user.email}&gt;</span>
                  </span>
                </Label>
              );
            })}
          </ul>
        </section>
        <section className="flex-1 flex flex-col h-[100px]">
          <Label className="font-[helvetica] text-[15px] font-bold scroll-m-1 tracking-normal text-white">
            Implementers
          </Label>
          <Separator className="my-1" />
          <ul className="flex flex-col flex-1 ">
            {data.lod1_implementer.map((user) => {
              return (
                <Label key={user.email} className="flex items-center gap-1">
                  <User size={16} strokeWidth={3} />
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
          <Label className="font-[helvetica] text-[15px] font-bold scroll-m-1 tracking-normal text-white">
            Risk Managers
          </Label>
          <Separator className="my-1" />
          <ul className="flex flex-col flex-1">
            {data.lod2_risk_manager.map((user) => {
              return (
                <Label key={user.email} className="flex items-center gap-1">
                  <User size={16} strokeWidth={3} />
                  <span>
                    {user.name} <span>&lt;{user.email}&gt;</span>
                  </span>
                </Label>
              );
            })}
          </ul>
        </section>
        <section className="flex-1 flex flex-col h-[100px]">
          <Label className="font-[helvetica] text-[15px] font-bold scroll-m-1 tracking-normal text-white">
            Compliance Officers
          </Label>
          <Separator className="my-1" />
          <ul className="flex flex-col flex-1">
            {data.lod2_compliance_officer.map((user) => {
              return (
                <Label key={user.email} className="flex items-center gap-1">
                  <User size={16} strokeWidth={3} />
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
          <Label className="font-[helvetica] text-[15px] font-bold scroll-m-1 tracking-normal text-white">
            Audit Managers
          </Label>
          <Separator className="my-1" />
          <ul className="flex flex-col flex-1">
            {data?.lod3_audit_manager.map((user) => {
              return (
                <Label key={user.email} className="flex items-center gap-1">
                  <User size={16} strokeWidth={3} />
                  <span>
                    {user?.name} <span>&lt;{user?.email}&gt;</span>
                  </span>
                </Label>
              );
            })}
          </ul>
        </section>
        <section className="flex-1 flex flex-col h-[100px]">
          <Label className="font-[helvetica] text-[15px] font-bold scroll-m-1 tracking-normal text-white">
            Observers
          </Label>
          <Separator className="my-1" />
          <ul className="flex flex-col flex-1">
            {data?.observers.map((user) => {
              return (
                <Label key={user?.email} className="flex items-center gap-1">
                  <User size={16} strokeWidth={3} />
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
          <Label className="font-[helvetica] text-[15px] font-bold scroll-m-1 tracking-normal text-white">
            Root Cause
          </Label>
          <Separator className="my-1" />
          <ul className="flex flex-col flex-1 gap-[2px]">
            <Label className="font-semibold">{data.root_cause}</Label>
            <Label className="flex items-center">
              <Dot size={16} />
              {data.sub_root_cause}
            </Label>
          </ul>
        </section>
        <section className="flex-1 flex flex-col h-fit">
          <Label className="font-[helvetica] text-[15px] font-bold scroll-m-1 tracking-normal text-white">
            Risk Category
          </Label>
          <Separator className="my-1" />
          <ul className="flex flex-col flex-1 gap-[2px]">
            <Label className="font-semibold">{data.risk_category}</Label>
            <Label className="flex items-center">
              <Dot size={16} />
              {data.sub_risk_category}
            </Label>
          </ul>
        </section>
      </section>
      <section className="flex items-center gap-2 w-full px-2 flex-1">
        <section className="flex-1 flex flex-col h-fit">
          <Label className="font-[helvetica] text-[15px] font-bold scroll-m-1 tracking-normal text-white">
            Process
          </Label>
          <Separator className="my-1" />
          <ul className="flex flex-col flex-1 gap-[2px]">
            <Label className="font-semibold">{data.process}</Label>
            <Label className="flex items-center">
              <Dot size={16} />
              {data.sub_process}
            </Label>
          </ul>
        </section>
        <section className="flex-1 flex flex-col h-fit">
          <Label className="font-[helvetica] text-[15px] font-bold scroll-m-1 tracking-normal text-white">
            Impact Category
          </Label>
          <Separator className="my-1" />
          <ul className="flex flex-col flex-1 gap-[2px]">
            <Label className="font-semibold">{data.impact_category}</Label>
            <Label className="flex items-center">
              <Dot size={16} />
              {data.impact_sub_category}
            </Label>
          </ul>
        </section>
      </section>
    </section>
  );
};
