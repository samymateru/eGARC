import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs";
import {
  Book,
  Briefcase,
  Cog,
  Contact,
  Menu,
  MonitorUp,
  Shield,
  Users,
} from "lucide-react";
import { ReactNode, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Policies } from "./policies";
import { Regulations } from "./regulations";
import { EngagementProcesses } from "./engagement-processes";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PolicyForm } from "@/components/forms/policy-form";
import { RegulationForm } from "@/components/forms/regulation-form";
import { EngagementProcessForm } from "./../../../../../components/forms/engagement-process-form";
import { useSearchParams } from "next/navigation";
import TextEditor from "@/components/shared/tiptap-text-editor";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StaffForm } from "@/components/forms/staffing-form";
import { Staff } from "./staff";

const items = [
  {
    id: "1",
    title: "Audit Background",
  },
  {
    id: "2",
    title: "Audit Objectives",
  },
  {
    id: "3",
    title: "Key Legislations",
  },
  {
    id: "4",
    title: "Relevant Systems",
  },
  {
    id: "5",
    title: "Key Changes",
  },
  {
    id: "6",
    title: "Reliance",
  },
  {
    id: "7",
    title: "Scope Exclusion",
  },
];

export const Administration = () => {
  const [showSubmenu, setShowSubmenu] = useState(false);
  const leaveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const enterTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (leaveTimeout.current) clearTimeout(leaveTimeout.current);
    enterTimeout.current = setTimeout(() => {
      setShowSubmenu(true);
    }, 200); // delay before showing
  };

  const handleMouseLeave = () => {
    if (enterTimeout.current) clearTimeout(enterTimeout.current);
    leaveTimeout.current = setTimeout(() => {
      setShowSubmenu(false);
    }, 200); // delay before hidin
  };

  const handleTabChage = (tab: string) => {
    console.log(tab);
  };

  return (
    <Tabs
      defaultValue="profile"
      className="flex-1 flex flex-col"
      onValueChange={handleTabChage}>
      <TabsList className="flex justify-between items-center dark:bg-background rounded-none">
        <section className="flex-1 flex items-center gap-1">
          <TabsTrigger
            value="profile"
            className="flex dark:hover:bg-neutral-900 items-center gap-2 justify-start dark:bg-neutral-800 w-[150px] font-serif tracking-wide scroll-m-1 font-bold text-[14px] data-[state=active]:dark:bg-orange-800">
            <Briefcase size={16} />
            Profile
          </TabsTrigger>
          <Button
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative flex dark:hover:dark:bg-slate-900 items-center gap-2 justify-start dark:bg-neutral-800 w-[150px] font-serif tracking-wide scroll-m-1 font-bold text-[14px] h-7 py-1 px-3 dark:text-neutral-400">
            <Cog size={16} />
            Contexts
            {showSubmenu && (
              <section className="p-2 flex flex-col gap-1 absolute top-[calc(100%+3px)] right-[-30px] divide-y mr-1 dark:bg-black shadow-md rounded-md border w-[200px] z-10">
                <TabsTrigger
                  onClick={handleMouseLeave}
                  value="policies"
                  className="flex dark:hover:bg-neutral-900 items-center gap-2 justify-start dark:bg-neutral-800 w-full font-serif tracking-wide scroll-m-1 font-bold text-[14px] data-[state=active]:dark:bg-orange-800">
                  <Shield size={16} />
                  Policies
                </TabsTrigger>
                <TabsTrigger
                  onClick={handleMouseLeave}
                  value="regulations"
                  className="flex items-center dark:hover:bg-neutral-900 gap-2 justify-start dark:bg-neutral-800 w-full font-serif tracking-wide scroll-m-1 font-bold text-[14px] data-[state=active]:dark:bg-orange-800">
                  <Book size={16} />
                  Regulations
                </TabsTrigger>
                <TabsTrigger
                  onClick={handleMouseLeave}
                  value="engagement_processes"
                  className="flex items-center gap-2 dark:hover:bg-neutral-900 justify-start dark:bg-neutral-800 w-full font-serif tracking-wide scroll-m-1 font-bold text-[14px] data-[state=active]:dark:bg-orange-800">
                  <MonitorUp size={16} />
                  Processes
                </TabsTrigger>
              </section>
            )}
          </Button>

          <TabsTrigger
            value="business_contacts"
            className="flex items-center dark:hover:bg-neutral-900 gap-2 justify-start dark:bg-neutral-800 w-[150px] font-serif tracking-wide scroll-m-1 font-bold text-[14px] data-[state=active]:dark:bg-orange-800">
            <Contact size={16} />
            Contacts
          </TabsTrigger>
          <TabsTrigger
            value="staffing"
            className="flex items-center dark:hover:bg-neutral-900 gap-2 justify-start dark:bg-neutral-800 w-[150px] font-serif tracking-wide scroll-m-1 font-bold text-[14px] data-[state=active]:dark:bg-orange-800">
            <Users size={16} />
            Staffing
          </TabsTrigger>
        </section>
        <section>
          <ContexteActions>
            <Button
              variant="ghost"
              className="w-[100px] h-[30px] flex justify-start items-center">
              <Menu />
              Menu
            </Button>
          </ContexteActions>
        </section>
      </TabsList>
      <TabsContent value="profile" className="flex-1 w-full">
        <ScrollArea className="h-[524px] overflow-auto ">
          <TemplateWrapper />
        </ScrollArea>
      </TabsContent>
      <TabsContent value="business_context" className="flex-1 w-full">
        Context
      </TabsContent>
      <TabsContent value="business_contacts" className="flex-1 w-full">
        Contacts
      </TabsContent>
      <TabsContent value="staffing" className="flex-1 w-full">
        <Staff />
      </TabsContent>
      <TabsContent value="policies" className="flex-1 w-full">
        <Policies />
      </TabsContent>
      <TabsContent value="regulations" className="flex-1 w-full">
        <Regulations />
      </TabsContent>
      <TabsContent value="engagement_processes" className="flex-1 w-full">
        <EngagementProcesses />
      </TabsContent>
    </Tabs>
  );
};

interface ContexteActionsProps {
  children: ReactNode;
}

const ContexteActions = ({ children }: ContexteActionsProps) => {
  const params = useSearchParams();
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="flex flex-col gap-1 dark:bg-black">
        <Label className="font-hel-heading-bold">Context Actions</Label>
        <Separator />
        <section className="divede-y">
          <PolicyForm
            title="New Policy"
            id={params.get("id")}
            endpoint="engagements/context/policies">
            <Button
              variant="ghost"
              className="w-full flex items-center justify-start h-[30px]">
              <Shield size={16} />
              Policy
            </Button>
          </PolicyForm>
          <RegulationForm
            title="New Regulation"
            id={params.get("id")}
            endpoint="engagements/context/regulations">
            <Button
              variant="ghost"
              className="w-full flex items-center justify-start h-[30px]">
              <Book size={16} />
              Regulation
            </Button>
          </RegulationForm>
          <EngagementProcessForm
            title="Engagement Process"
            id={params.get("id")}
            endpoint="engagements/context/engagement_process">
            <Button
              variant="ghost"
              className="w-full flex items-center justify-start h-[30px]">
              <MonitorUp size={16} />
              Process
            </Button>
          </EngagementProcessForm>
          <StaffForm
            title="Staffing"
            id={params.get("id")}
            endpoint="engagements/staff">
            <Button
              variant="ghost"
              className="w-full flex items-center justify-start h-[30px]">
              <Users size={16} />
              Staffing
            </Button>
          </StaffForm>
        </section>
      </PopoverContent>
    </Popover>
  );
};

const TemplateWrapper = () => {
  const [auditBackground, setAuditBackground] = useState<string>("");
  const [auditObjectives, setAuditObjectives] = useState<string>("");
  const [keyLegislations, setKeyLegislations] = useState<string>("");
  const [relevantSystems, setRelevantSystems] = useState<string>("");
  const [keyChanges, setKeyChanges] = useState<string>("");
  const [reliance, setReliance] = useState<string>("");
  const [scopeExclusion, setScopeExclusion] = useState<string>("");

  return (
    <section className="flex py-3 flex-col gap-2">
      <Label className="font-hel-heading-bold pl-2">Engagement Details</Label>
      <Accordion type="multiple" className="w-full flex flex-col gap-1">
        {items.map((item) => (
          <AccordionItem
            value={item.id}
            key={item.id}
            className="flex flex-col border-none w-full px-2">
            <AccordionTrigger
              suppressHydrationWarning
              icon={item.id === "8" || item.id === "4" ? false : true}
              className={`px-4 py-4 hover:no-underline h-9 rounded-md font-hel-heading dark:bg-neutral-800 dark:hover:bg-neutral-800`}>
              <span className="flex items-center gap-3">
                <span>{item.title}</span>
              </span>
            </AccordionTrigger>

            <AccordionContent className="text-muted-foreground">
              {item.id === "1" ? (
                <TextEditor
                  initialContent={auditBackground}
                  onChange={setAuditBackground}
                />
              ) : item.id === "2" ? (
                <TextEditor
                  initialContent={auditObjectives}
                  onChange={setAuditObjectives}
                />
              ) : item.id === "3" ? (
                <TextEditor
                  initialContent={keyLegislations}
                  onChange={setKeyLegislations}
                />
              ) : item.id === "4" ? (
                <TextEditor
                  initialContent={relevantSystems}
                  onChange={setRelevantSystems}
                />
              ) : item.id === "5" ? (
                <TextEditor
                  initialContent={keyChanges}
                  onChange={setKeyChanges}
                />
              ) : item.id === "6" ? (
                <TextEditor initialContent={reliance} onChange={setReliance} />
              ) : item.id === "7" ? (
                <TextEditor
                  initialContent={scopeExclusion}
                  onChange={setScopeExclusion}
                />
              ) : null}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};
