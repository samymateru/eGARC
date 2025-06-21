"use client";
import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs";
import {
  Book,
  Briefcase,
  Cog,
  Contact,
  FileText,
  MonitorUp,
  Save,
  Shield,
  Users,
} from "lucide-react";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
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
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PolicyForm } from "@/components/forms/policy-form";
import { RegulationForm } from "@/components/forms/regulation-form";
import { EngagementProcessForm } from "./../../../../../components/forms/engagement-process-form";
import { useSearchParams } from "next/navigation";
import { StaffForm } from "@/components/forms/staffing-form";
import { Staff } from "./staff";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { EngagementProfileSchema, Response } from "@/lib/types";
import z from "zod";
import { showToast } from "@/components/shared/toast";
import JsonTextEditor from "@/components/shared/json-text-editor";
import { ListMultiSelector } from "@/components/shared/list-multi-select";
import { EngagementContacts } from "./contacts";
import { Loader } from "@/components/shared/loader";
import { ErrorMessage } from "@/lib/utils";
import { ErrorQuery } from "@/components/shared/error-query";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type EngagementProfileValues = z.infer<typeof EngagementProfileSchema>;

type RiskCategory = {
  risk_category?: string;
  sub_risk_category: Array<string>;
};

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

const fetchData = async (endpont: string, id?: string | null) => {
  const response = await fetch(`${BASE_URL}/${endpont}/${id}`, {
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
};

export const Administration = () => {
  const params = useSearchParams();
  const [showSubmenu, setShowSubmenu] = useState(false);
  const leaveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const enterTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const templateRef = useRef<TemplateWrapperHandle>(null);
  const [tab, setTab] = useState<string>("profile");
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
    setTab(tab);
  };

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Tabs
      defaultValue="profile"
      className="flex-1 flex flex-col"
      onValueChange={handleTabChage}>
      <TabsList className="flex justify-between  items-center bg-white rounded-none px-2">
        <section className="flex-1 flex items-center gap-1">
          <TabsTrigger
            value="profile"
            className="h-8 flex items-center gap-2 justify-start bg-black w-[150px] font-helvetica-13 data-[state=active]:text-white data-[state=active]:border-l-[5px] data-[state=active]:border-l-blue-800">
            <Briefcase size={16} strokeWidth={3} />
            Profile
          </TabsTrigger>
          <div
            role="button"
            tabIndex={0}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="rounded-md py-1 px-2 relative h-8 flex items-center gap-2 justify-start bg-black w-[150px] font-helvetica-13 data-[state=active]:text-white data-[state=active]:border-l-[5px] data-[state=active]:border-l-blue-800">
            <Cog size={16} />
            Contexts
            {isClient && showSubmenu && (
              <section className="bg-neutral-300 px-2 py-3 flex flex-col gap-1 absolute top-[calc(100%+3px)] right-[-30px] divide-y mr-1 dark:bg-black shadow-md rounded-md border w-[250px] z-10">
                <TabsTrigger
                  onClick={handleMouseLeave}
                  value="policies"
                  className="h-8 flex items-center gap-2 justify-start bg-black w-full font-helvetica-13 data-[state=active]:text-white data-[state=active]:border-l-[5px] data-[state=active]:border-l-blue-800">
                  <Shield size={16} />
                  Policies
                </TabsTrigger>
                <TabsTrigger
                  onClick={handleMouseLeave}
                  value="regulations"
                  className="h-8 flex items-center gap-2 justify-start bg-black w-full font-helvetica-13 data-[state=active]:text-white data-[state=active]:border-l-[5px] data-[state=active]:border-l-blue-800">
                  <Book size={16} />
                  Regulations
                </TabsTrigger>
                <TabsTrigger
                  onClick={handleMouseLeave}
                  value="engagement_processes"
                  className="h-8 flex items-center gap-2 justify-start bg-black w-full font-helvetica-13 data-[state=active]:text-white data-[state=active]:border-l-[5px] data-[state=active]:border-l-blue-800">
                  <MonitorUp size={16} />
                  Processes
                </TabsTrigger>
              </section>
            )}
          </div>

          <TabsTrigger
            value="business_contacts"
            className="h-8 flex items-center gap-2 justify-start bg-black w-[150px] font-helvetica-13 data-[state=active]:text-white data-[state=active]:border-l-[5px] data-[state=active]:border-l-blue-800">
            <Contact size={16} />
            Contacts
          </TabsTrigger>
          <TabsTrigger
            value="staffing"
            className="h-8 flex items-center gap-2 justify-start bg-black w-[150px] font-helvetica-13 data-[state=active]:text-white data-[state=active]:border-l-[5px] data-[state=active]:border-l-blue-800">
            <Users size={16} />
            Staffing
          </TabsTrigger>
        </section>
        <section className="flex items-center gap-2">
          {tab === "profile" ? (
            <Button
              onClick={() => templateRef.current?.onSaveProfile()}
              className="w-[130px] h-[30px] flex items-center justify-start bg-black font-helvetica-13 text-white">
              <Save size={16} strokeWidth={3} />
              Save
            </Button>
          ) : null}

          {tab === "policies" ? (
            <PolicyForm
              data={{
                name: "",
                version: "",
                key_areas: "",
              }}
              mode="create"
              title="New Policy"
              id={params.get("id")}
              endpoint="engagements/context/policies">
              <Button className="w-[130px] flex items-center justify-start h-[30px] bg-black font-helvetica-13 text-white mr-2">
                <Shield size={16} />
                Policy
              </Button>
            </PolicyForm>
          ) : null}

          {tab === "regulations" ? (
            <RegulationForm
              data={{
                name: "",
                key_areas: "",
              }}
              title="New Regulation"
              mode="create"
              id={params.get("id")}
              endpoint="engagements/context/regulations">
              <Button className="w-[130px] flex items-center justify-start h-[30px] bg-black font-helvetica-13 text-white mr-2">
                <Book size={16} />
                Regulation
              </Button>
            </RegulationForm>
          ) : null}

          {tab === "engagement_processes" ? (
            <EngagementProcessForm
              data={{
                process: "",
                sub_process: [],
                description: "",
                business_unit: "",
              }}
              mode="create"
              title="Engagement Process"
              id={params.get("id")}
              endpoint="engagements/context/engagement_process">
              <Button className="w-[130px] flex items-center justify-start h-[30px] bg-black font-helvetica-13 text-white mr-2">
                <MonitorUp size={16} strokeWidth={3} />
                Process
              </Button>
            </EngagementProcessForm>
          ) : null}

          {tab === "staffing" ? (
            <StaffForm
              defaultValue={{
                role: "",
              }}
              mode="create"
              title="Staffing"
              id={params.get("id")}
              endpoint="engagements/staff">
              <Button className="mr-2 w-[130px] flex items-center justify-start h-[30px] bg-black font-helvetica-13 text-white">
                <Users size={16} />
                Staffing
              </Button>
            </StaffForm>
          ) : null}
        </section>
      </TabsList>
      <Separator className="bg-neutral-500" />
      <TabsContent
        value="profile"
        className="mt-0 overflow-auto  h-[calc(100vh-124px)] pb-[10px] hide-scrollbar">
        <TemplateWrapper ref={templateRef} />
      </TabsContent>
      <TabsContent
        value="business_context"
        className="mt-0 w-full  overflow-auto h-[calc(100vh-90px)] ">
        Context
      </TabsContent>
      <TabsContent
        value="business_contacts"
        className="mt-0 w-full  overflow-auto h-[calc(100vh-90px)] ">
        <EngagementContacts />
      </TabsContent>
      <TabsContent
        value="staffing"
        className="mt-0 w-full  overflow-auto h-[calc(100vh-90px)] ">
        <Staff />
      </TabsContent>
      <TabsContent
        value="policies"
        className="mt-0 w-full  overflow-auto h-[calc(100vh-90px)] ">
        <Policies />
      </TabsContent>
      <TabsContent
        value="regulations"
        className="mt-0 w-full  overflow-auto h-[calc(100vh-90px)] ">
        <Regulations />
      </TabsContent>
      <TabsContent
        value="engagement_processes"
        className="mt-0 w-full  overflow-auto h-[calc(100vh-90px)] ">
        <EngagementProcesses />
      </TabsContent>
    </Tabs>
  );
};

interface TemplateWrapperHandle {
  onSaveProfile: () => void;
  saveProfilePending: boolean;
}

const TemplateWrapper = forwardRef<TemplateWrapperHandle>((_, ref) => {
  const query_client = useQueryClient();
  const params = useSearchParams();

  const [auditBackground, setAuditBackground] = useState({});
  const [auditObjectives, setAuditObjectives] = useState({});
  const [keyLegislations, setKeyLegislations] = useState({});
  const [relevantSystems, setRelevantSystems] = useState({});
  const [keyChanges, setKeyChanges] = useState({});
  const [reliance, setReliance] = useState({});
  const [scopeExclusion, setScopeExclusion] = useState({});
  const [coreRisk, setCoreRisk] = useState<Array<string>>([]);

  const [entityId, setEntityId] = useState<string | null>(null);

  useEffect(() => {
    const entityId = localStorage.getItem("entity_id");
    if (entityId) {
      setEntityId(entityId);
    }
  }, []);

  const results = useQueries({
    queries: [
      {
        queryKey: ["_risk_category_", entityId],
        queryFn: async (): Promise<RiskCategory[]> =>
          fetchData("profile/risk_category", entityId),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: true,
        enabled: !!entityId,
      },
      {
        queryKey: ["_engagement_profile_", params.get("id")],
        queryFn: async (): Promise<EngagementProfileValues> =>
          fetchData("engagements/profile", params.get("id")),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: true,
        enabled: !!params.get("id"),
      },
    ],
  });

  const { mutate: saveProfile, isPending: saveProfilePending } = useMutation({
    mutationKey: ["_save_profile_"],
    mutationFn: async (data: EngagementProfileValues): Promise<Response> => {
      const response = await fetch(
        `${BASE_URL}/engagements/profile/${params.get("id")}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              typeof window === "undefined" ? "" : localStorage.getItem("token")
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

  useEffect(() => {
    setAuditBackground(results[1].data?.audit_background ?? {});
    setAuditObjectives(results[1].data?.audit_objectives ?? {});
    setKeyLegislations(results[1].data?.key_legislations ?? {});
    setKeyChanges(results[1].data?.key_changes ?? {});
    setRelevantSystems(results[1].data?.relevant_systems ?? {});
    setReliance(results[1].data?.reliance ?? {});
    setScopeExclusion(results[1].data?.scope_exclusion ?? {});
    setCoreRisk(results[1].data?.core_risk ?? []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results[1].data]);

  const onSaveProfile = () => {
    const profileData: EngagementProfileValues = {
      audit_background: auditBackground,
      audit_objectives: auditObjectives,
      key_legislations: keyLegislations,
      relevant_systems: relevantSystems,
      key_changes: keyChanges,
      reliance: reliance,
      scope_exclusion: scopeExclusion,
      core_risk: coreRisk,
    };

    saveProfile(profileData, {
      onSuccess: (data) => {
        query_client.invalidateQueries({
          queryKey: ["_engagement_profile_", params.get("id")],
        });
        showToast(data.detail, "success");
      },
      onError: (error) => {
        console.log(error);
      },
      onSettled: () => {},
    });
  };

  useImperativeHandle(ref, () => ({
    onSaveProfile,
    saveProfilePending,
  }));

  if (results[0].isLoading || results[1].isLoading) {
    return (
      <div className="w-full h-full relative">
        <Loader title="Administration" />
      </div>
    );
  }

  if (results[0].isError || results[1].isError) {
    ErrorMessage(results[0].error);
    return (
      <div className="w-full h-full relative">
        <ErrorQuery />
      </div>
    );
  }

  return (
    <section className="flex flex-1 py-3 flex-col gap-2">
      <Label className="font-helvetica-medium pl-2 text-black">
        Engagement Profile
      </Label>
      <Accordion type="multiple" className="flex flex-col gap-1">
        {items.map((item) => (
          <AccordionItem
            value={item.id}
            key={item.id}
            className="flex flex-col border-none w-full overflow-auto px-2">
            <AccordionTrigger
              suppressHydrationWarning
              className="px-4 py-4 h-9 rounded-md leading-6 hover:no-underline w-full font-helvetica-13 bg-neutral-200">
              <span className="flex items-center gap-3 text-black">
                <FileText size={17} strokeWidth={2} />
                <span>{item.title}</span>
              </span>
            </AccordionTrigger>

            <AccordionContent className="text-muted-foreground">
              {item.id === "1" ? (
                <JsonTextEditor
                  initialContent={auditBackground}
                  onChange={setAuditBackground}
                />
              ) : item.id === "2" ? (
                <JsonTextEditor
                  initialContent={auditObjectives}
                  onChange={setAuditObjectives}
                />
              ) : item.id === "3" ? (
                <JsonTextEditor
                  initialContent={keyLegislations}
                  onChange={setKeyLegislations}
                />
              ) : item.id === "4" ? (
                <JsonTextEditor
                  initialContent={relevantSystems}
                  onChange={setRelevantSystems}
                />
              ) : item.id === "5" ? (
                <JsonTextEditor
                  initialContent={keyChanges}
                  onChange={setKeyChanges}
                />
              ) : item.id === "6" ? (
                <JsonTextEditor
                  initialContent={reliance}
                  onChange={setReliance}
                />
              ) : item.id === "7" ? (
                <JsonTextEditor
                  initialContent={scopeExclusion}
                  onChange={setScopeExclusion}
                />
              ) : null}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <section className="px-2">
        <Label className="font-helvetica-14 text-black">Core Risks</Label>
        <ListMultiSelector
          title="Core Risks"
          trigger="Select core risks"
          processes={
            results[0]?.data
              ?.map((item) => item.risk_category)
              .filter((category): category is string => Boolean(category)) ?? []
          }
          value={coreRisk}
          onChange={setCoreRisk}
        />
      </section>
    </section>
  );
});

TemplateWrapper.displayName = "TemplateWrapper";
