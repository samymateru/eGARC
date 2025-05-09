import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ReactNode, useState } from "react";
import { Button } from "../ui/button";
import {
  CircleCheck,
  Contact,
  Dot,
  Mail,
  NotebookText,
  Reply,
  Save,
  SendHorizonal,
  Tags,
  ThumbsDown,
  ThumbsUp,
  X,
} from "lucide-react";
import { SaveIssue } from "./save";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";

enum SendStatus {
  IN_PROGRESS_IMPLEMENTER = "In progress -> implementer",
}

enum SaveStatus {
  OPEN = "Open",
  IN_PROGRESS_IMPLEMENTER = "In progress -> implementer",
}

enum ResponseStatus {
  IN_PROGRESS_OWNER = "In progress -> owner",
  CLOSED_NOT_VERIFIED = "Closed -> not verified",
  CLOSED_VERIFIED_BY_RISK = "Closed -> verified by risk",
  CLOSED_RISK_NA = "Closed -> risk N/A",
  CLOSED_RISK_ACCEPTED = "Closed -> risk accepted",
}

function isRecognizedResponseStatus(status: string): boolean {
  return Object.values(ResponseStatus).includes(status as ResponseStatus);
}

function isRecognizedSaveStatus(status: string): boolean {
  return Object.values(SaveStatus).includes(status as SaveStatus);
}

function isRecognizedSendStatus(status: string): boolean {
  return Object.values(SendStatus).includes(status as SendStatus);
}

interface IssueProps {
  children: ReactNode;
  status: string;
}
export const Issue = ({ children, status }: IssueProps) => {
  const [open, setOpen] = useState<boolean>(false);
  console.log(isRecognizedResponseStatus("Open"));
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className=" bg-white max-w-full h-full p-0 gap-0 sm:rounded-none border-none flex flex-col">
        <DialogHeader className="pr-2 relative bg-black pl-6 pt-2 flex justify-between items-center py-2 flex-row h-fit m-0">
          <DialogTitle>Issue name</DialogTitle>
          <section className="flex gap-5">
            <section className="flex gap-2">
              {isRecognizedSaveStatus(status) ? (
                <SaveIssue title="Save issue implementation">
                  <Button className="w-[120px] font-serif tracking-wide scroll-m-0 font-bold bg-white text-black hover:bg-neutral-300">
                    <Save size={16} strokeWidth={3} />
                    Save
                  </Button>
                </SaveIssue>
              ) : null}
              {isRecognizedSendStatus(status) ? (
                <Button className="w-[120px] font-serif tracking-wide scroll-m-0 font-bold bg-white text-black hover:bg-neutral-300">
                  <SendHorizonal size={16} strokeWidth={3} />
                  Send
                </Button>
              ) : null}

              {isRecognizedResponseStatus(status) ? (
                <Button className="bg-green-600 w-[120px] font-serif tracking-wide scroll-m-0 font-bold text-black hover:bg-green-700">
                  <ThumbsUp size={16} strokeWidth={3} />
                  Accept
                </Button>
              ) : null}
              {isRecognizedResponseStatus(status) ? (
                <Button className="w-[120px] font-serif tracking-wide scroll-m-0 font-bold bg-white text-black hover:bg-neutral-300">
                  <ThumbsDown size={16} strokeWidth={3} />
                  Decline
                </Button>
              ) : null}
            </section>
            <Button
              onClick={() => setOpen(false)}
              className="w-[35px] h-[35px] rounded-full bg-white text-black hover:bg-neutral-300">
              <X size={16} strokeWidth={3} />
            </Button>
          </section>
          <DialogDescription className="absolute" />
        </DialogHeader>
        <main className="flex-1 bg-black">
          <IssueDetails />
        </main>
      </DialogContent>
    </Dialog>
  );
};

const IssueDetails = () => {
  return (
    <Tabs defaultValue="details" className="w-full bg-black h-full flex">
      <TabsList className="rounded-none flex flex-col items-start justify-start h-full [&>*]:w-[240px] [&>*]:py-[8px]">
        <TabsTrigger
          value="details"
          className="flex items-center justify-start gap-2 text-[15px] font-serif font-bold tracking-wide scroll-m-0">
          <NotebookText size={20} />
          Details
        </TabsTrigger>
        <TabsTrigger
          value="contacts"
          className="flex items-center justify-start gap-2 text-[15px] font-serif font-bold tracking-wide scroll-m-0">
          <Contact size={20} />
          Contacts
        </TabsTrigger>
        <TabsTrigger
          value="classification"
          className="flex items-center justify-start gap-2 text-[15px] font-serif font-bold tracking-wide scroll-m-0">
          <Tags size={20} />
          Classification
        </TabsTrigger>
        <TabsTrigger
          value="responses"
          className="flex items-center justify-start gap-2 text-[15px] font-serif font-bold tracking-wide scroll-m-0">
          <Reply size={20} />
          Responses
        </TabsTrigger>
      </TabsList>
      <section className="flex-1">
        <TabsContent value="details">
          <Details />
        </TabsContent>
        <TabsContent value="contacts">
          <Contacts />
        </TabsContent>
        <TabsContent value="classification">
          Issue classification will land here
        </TabsContent>
        <TabsContent value="responses">
          Issue response will land here
        </TabsContent>
      </section>
    </Tabs>
  );
};

const Details = () => {
  return (
    <ScrollArea className="h-[500px]">
      <article className="flex flex-col gap-3 pt-5">
        <section className="flex justify-center gap-10 pb-2">
          <section className="flex items-center justify-center gap-[6px]">
            <div className="font-serif font-bold tracking-wide scroll-m-0 text-[20px] flex items-center text-white">
              Recurring
            </div>
            <CircleCheck
              size={20}
              strokeWidth={4}
              className="mt-[5px] text-green-900"
            />
          </section>
          <section className="flex items-center justify-center gap-[6px]">
            <div className="font-serif font-bold tracking-wide scroll-m-0 text-[20px] flex items-center text-white">
              Reportable
            </div>
            <CircleCheck
              size={20}
              className="mt-[5px] text-green-900"
              strokeWidth={4}
            />
          </section>
          <section className="flex items-center justify-center gap-[6px]">
            <div className="font-serif font-bold tracking-wide scroll-m-0 text-[20px] flex items-center text-white">
              Regulatory
            </div>
            <CircleCheck
              size={20}
              className="mt-[5px] text-green-900"
              strokeWidth={4}
            />
          </section>
        </section>
        <Separator />
        <section className="px-5">
          <h1 className="font-serif font-bold tracking-wide scroll-m-0 text-[22px] flex items-center text-white">
            <Dot size={20} strokeWidth={3} />
            Criteria
          </h1>
          <p className="text-neutral-500 text-justify pl-3 font-serif tracking-tight scroll-m-1">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam nisi
            vel perspiciatis, neque esse vitae aut libero commodi repellendus
            eaque reiciendis voluptas autem eum quas facere inventore, ullam
            labore maiores. Sequi, harum tenetur itaque quaerat alias autem
            obcaecati consectetur rerum ipsum quae dolore perspiciatis dicta,
            explicabo, incidunt dolorum sint libero.
          </p>
        </section>
        <section className="px-5">
          <h1 className="font-serif font-bold tracking-wide scroll-m-0 text-[22px] flex items-center text-white">
            <Dot size={20} strokeWidth={3} />
            Finding / Weakness
          </h1>
          <p className="text-neutral-500 text-justify pl-3 font-serif tracking-tight scroll-m-1">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam nisi
            vel perspiciatis, neque esse vitae aut libero commodi repellendus
            eaque reiciendis voluptas autem eum quas facere inventore, ullam
            labore maiores. Sequi, harum tenetur itaque quaerat alias autem
            obcaecati consectetur rerum ipsum quae dolore perspiciatis dicta,
            explicabo, incidunt dolorum sint libero.
          </p>
        </section>
        <section className="px-5">
          <h1 className="font-serif font-bold tracking-wide scroll-m-0 text-[22px] flex items-center text-white">
            <Dot size={20} strokeWidth={3} />
            Finding rating
          </h1>
          <p className="text-neutral-500 text-justify pl-3 font-serif tracking-tight scroll-m-1">
            Acceptable
          </p>
        </section>
        <section className="px-5">
          <h1 className="font-serif font-bold tracking-wide scroll-m-0 text-[22px] flex items-center text-white">
            <Dot size={20} strokeWidth={3} />
            Root Cause Description
          </h1>
          <p className="text-neutral-500 text-justify pl-3 font-serif tracking-tight scroll-m-1">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam nisi
            vel perspiciatis, neque esse vitae aut libero commodi repellendus
            eaque reiciendis voluptas autem eum quas facere inventore, ullam
            labore maiores. Sequi, harum tenetur itaque quaerat alias autem
            obcaecati consectetur rerum ipsum quae dolore perspiciatis dicta,
            explicabo, incidunt dolorum sint libero.
          </p>
        </section>
        <section className="px-5">
          <h1 className="font-serif font-bold tracking-wide scroll-m-0 text-[22px] flex items-center text-white">
            <Dot size={20} strokeWidth={3} />
            Potential Impact description
          </h1>
          <p className="text-neutral-500 text-justify pl-3 font-serif tracking-tight scroll-m-1">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam nisi
            vel perspiciatis, neque esse vitae aut libero commodi repellendus
            eaque reiciendis voluptas autem eum quas facere inventore, ullam
            labore maiores. Sequi, harum tenetur itaque quaerat alias autem
            obcaecati consectetur rerum ipsum quae dolore perspiciatis dicta,
            explicabo, incidunt dolorum sint libero.
          </p>
        </section>
        <section className="px-5">
          <h1 className="font-serif font-bold tracking-wide scroll-m-0 text-[22px] flex items-center text-white">
            <Dot size={20} strokeWidth={3} />
            Recommendation
          </h1>
          <p className="text-neutral-500 text-justify pl-3 font-serif tracking-tight scroll-m-1">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam nisi
            vel perspiciatis, neque esse vitae aut libero commodi repellendus
            eaque reiciendis voluptas autem eum quas facere inventore, ullam
            labore maiores. Sequi, harum tenetur itaque quaerat alias autem
            obcaecati consectetur rerum ipsum quae dolore perspiciatis dicta,
            explicabo, incidunt dolorum sint libero.
          </p>
        </section>
        <section className="px-5">
          <h1 className="font-serif font-bold tracking-wide scroll-m-0 text-[22px] flex items-center text-white">
            <Dot size={20} strokeWidth={3} />
            Management Action Plan
          </h1>
          <p className="text-neutral-500 text-justify pl-3 font-serif tracking-tight scroll-m-1">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam nisi
            vel perspiciatis, neque esse vitae aut libero commodi repellendus
            eaque reiciendis voluptas autem eum quas facere inventore, ullam
            labore maiores. Sequi, harum tenetur itaque quaerat alias autem
            obcaecati consectetur rerum ipsum quae dolore perspiciatis dicta,
            explicabo, incidunt dolorum sint libero.
          </p>
        </section>
      </article>
    </ScrollArea>
  );
};

const Contacts = () => {
  return (
    <article className="">
      <section className="flex justify-center pb-2">
        <Label className="font-serif font-bold tracking-wide scroll-m-0 text-[25px] flex items-center text-white">
          Issue Contacts Infomation
        </Label>
      </section>
      <Separator />
      <section className="pl-4 flex flex-col gap-3 pt-4">
        <section className="flex flex-col">
          <div className="flex gap-1 items-center">
            <Dot size={22} />
            <Label className="font-serif font-bold tracking-wide scroll-m-0 text-[16px] flex items-center text-white">
              LOD 1 Implementer:
            </Label>
          </div>
          <div>
            <div className="flex gap-1 items-center pl-3">
              <Mail size={18} />
              Email
            </div>
          </div>
        </section>
        <section className="flex flex-col">
          <div className="flex gap-1 items-center">
            <Dot size={22} />
            <Label className="font-serif font-bold tracking-wide scroll-m-0 text-[16px] flex items-center text-white">
              LOD 1 Owner:
            </Label>
          </div>
          <div>
            <div className="flex gap-1 items-center pl-3">
              <Mail size={18} />
              Email
            </div>
          </div>
        </section>
        <section className="flex flex-col">
          <div className="flex gap-1 items-center">
            <Dot size={22} />
            <Label className="font-serif font-bold tracking-wide scroll-m-0 text-[16px] flex items-center text-white">
              LOD 2 Risk Manager:
            </Label>
          </div>
          <div>
            <div className="flex gap-1 items-center pl-3">
              <Mail size={18} />
              Email
            </div>
          </div>
        </section>
        <section className="flex flex-col">
          <div className="flex gap-1 items-center">
            <Dot size={22} />
            <Label className="font-serif font-bold tracking-wide scroll-m-0 text-[16px] flex items-center text-white">
              LOD 2 Compliance Officer:
            </Label>
          </div>
          <div>
            <div className="flex gap-1 items-center pl-3">
              <Mail size={18} />
              Email
            </div>
          </div>
        </section>
        <section className="flex flex-col">
          <div className="flex gap-1 items-center">
            <Dot size={22} />
            <Label className="font-serif font-bold tracking-wide scroll-m-0 text-[16px] flex items-center text-white">
              LOD 3 Audit Manager:
            </Label>
          </div>
          <div>
            <div className="flex gap-1 items-center pl-3">
              <Mail size={18} />
              Email
            </div>
          </div>
        </section>
      </section>
    </article>
  );
};
