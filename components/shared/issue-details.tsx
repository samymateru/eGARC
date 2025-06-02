import { IssueSchema } from "@/lib/types";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  ArrowLeft,
  AtSignIcon,
  CommandIcon,
  Dot,
  EclipseIcon,
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
type IssueValues = z.infer<typeof IssueSchema>;

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
        <section className="w-fit">
          <Button
            className="w-[33px] h-[30px]"
            variant="ghost"
            onClick={() => setAction(issueId ?? "", "Issue")}>
            <ArrowLeft />
          </Button>
        </section>
        <section className="flex-1 flex justify-end">hello</section>
      </header>
      <main className="flex-1 w-full">
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
                <AccordionContent className="text-muted-foreground">
                  {item.id === "1" ? (
                    <div>
                      <Details
                        title={data.title}
                        criteria={data.criteria}
                        finding={data.finding}
                        risk_rating={data.risk_rating}
                        source={data.source}
                        sdi_name={data.sdi_name ?? ""}
                        recomendation={data.recommendation}
                        managament_action_plan={data.management_action_plan}
                        estimated_implementation_date={
                          data.estimated_implementation_date
                        }
                      />
                    </div>
                  ) : item.id === "2" ? (
                    <div>classification</div>
                  ) : item.id === "3" ? (
                    <div>Contacts</div>
                  ) : item.id === "4" ? (
                    <div>response</div>
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
  sdi_name: string;
  recomendation: string;
  managament_action_plan: string;
  estimated_implementation_date: Date;
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
}: DetailsProps) => {
  const date = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(estimated_implementation_date));
  return (
    <section className="pt-3 px-2 text-white flex flex-col gap-4 overflow-auto h-[400px]">
      <section className="flex flex-col">
        <Label className="font-[helvetica] font-[600] tracking-wide text-[16px] flex item-center">
          <Dot size={25} strokeWidth={3} />
          Title
        </Label>
        <Label className="font-[helvetica] font-light tracking-wide scroll-m-0 text-balance px-5 text-neutral-300">
          {title}
        </Label>
      </section>
      <section className="flex flex-col">
        <Label className="font-[helvetica] font-[600] tracking-wide text-[16px] flex item-center">
          <Dot size={25} strokeWidth={3} />
          Criteria
        </Label>
        <Label className="font-[helvetica] font-light tracking-wide scroll-m-0 text-balance px-5 text-neutral-300">
          {criteria}
        </Label>
      </section>
      <section className="flex flex-col">
        <Label className="font-[helvetica] font-[600] tracking-wide text-[16px] flex item-center">
          <Dot size={25} strokeWidth={3} />
          Finding/Weakness
        </Label>
        <Label className="font-[helvetica] font-light tracking-wide scroll-m-0 text-balance px-5 text-neutral-300">
          {finding}
        </Label>
      </section>
      <section className="flex flex-col">
        <Label className="font-[helvetica] font-[600] tracking-wide text-[16px] flex item-center">
          <Dot size={25} strokeWidth={3} />
          Risk Level
        </Label>
        <Label className="font-[helvetica] font-light tracking-wide scroll-m-0 text-balance px-5 text-neutral-300">
          {risk_rating}
        </Label>
      </section>
      <section className="flex flex-col">
        <Label className="font-[helvetica] font-[600] tracking-wide text-[16px] flex item-center">
          <Dot size={25} strokeWidth={3} />
          Source
        </Label>
        <Label className="font-[helvetica] font-light tracking-wide scroll-m-0 text-balance px-5 text-neutral-300">
          {source}
        </Label>
      </section>
      <section className="flex flex-col">
        <Label className="font-[helvetica] font-[600] tracking-wide text-[16px] flex item-center">
          <Dot size={25} strokeWidth={3} />
          SDI Name
        </Label>
        <Label className="font-[helvetica] font-light tracking-wide scroll-m-0 text-balance px-5 text-neutral-300">
          {sdi_name}
        </Label>
      </section>
      <section className="flex flex-col">
        <Label className="font-[helvetica] font-[600] tracking-wide text-[16px] flex item-center">
          <Dot size={25} strokeWidth={3} />
          Recommendation
        </Label>
        <Label className="font-[helvetica] font-light tracking-wide scroll-m-0 text-balance px-5 text-neutral-300">
          {recomendation}
        </Label>
      </section>
      <section className="flex flex-col">
        <Label className="font-[helvetica] font-[600] tracking-wide text-[16px] flex item-center">
          <Dot size={25} strokeWidth={3} />
          Management Action Plan
        </Label>
        <Label className="font-[helvetica] font-light tracking-wide scroll-m-0 text-balance px-5 text-neutral-300">
          {managament_action_plan}
        </Label>
      </section>
      <section className="flex flex-col">
        <Label className="font-[helvetica] font-[600] tracking-wide text-[16px] flex item-center">
          <Dot size={25} strokeWidth={3} />
          Estimated Implementatation Date
        </Label>
        <Label className="font-[helvetica] font-light tracking-wide scroll-m-0 text-balance px-5 text-neutral-300">
          {date}
        </Label>
      </section>
    </section>
  );
};
