import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs";
import {
  Book,
  Briefcase,
  Cog,
  Contact,
  MonitorUp,
  Shield,
  Users,
} from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Policies } from "./policies";
import { Regulations } from "./regulations";
import { EngagementProcesses } from "./engagement-processes";

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

  return (
    <Tabs defaultValue="profile" className="flex-1 flex flex-col">
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
        <section></section>
      </TabsList>
      <TabsContent value="profile" className="flex-1 w-full">
        Profile
      </TabsContent>
      <TabsContent value="business_context" className="flex-1 w-full">
        Context
      </TabsContent>
      <TabsContent value="business_contacts" className="flex-1 w-full">
        Contacts
      </TabsContent>
      <TabsContent value="staffing" className="flex-1 w-full">
        Staffing
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
