import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs";
import { Briefcase, Cog, Contact, Users } from "lucide-react";
export const Administration = () => {
  return (
    <Tabs defaultValue="profile">
      <TabsList className="flex justify-between items-center dark:bg-background mt-1 mb-3">
        <section className="flex-1 flex items-center gap-1">
          <TabsTrigger
            value="profile"
            className="flex items-center gap-2 justify-start dark:bg-neutral-800 w-[150px] font-serif tracking-wide scroll-m-1 font-bold text-[14px] data-[state=active]:dark:bg-orange-800">
            <Briefcase size={16} />
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="business_context"
            className="flex items-center gap-2 justify-start dark:bg-neutral-800 w-[150px] font-serif tracking-wide scroll-m-1 font-bold text-[14px] data-[state=active]:dark:bg-orange-800">
            <Cog size={16} />
            Contexts
          </TabsTrigger>
          <TabsTrigger
            value="business_contacts"
            className="flex items-center gap-2 justify-start dark:bg-neutral-800 w-[150px] font-serif tracking-wide scroll-m-1 font-bold text-[14px] data-[state=active]:dark:bg-orange-800">
            <Contact size={16} />
            Contacts
          </TabsTrigger>
          <TabsTrigger
            value="staffing"
            className="flex items-center gap-2 justify-start dark:bg-neutral-800 w-[150px] font-serif tracking-wide scroll-m-1 font-bold text-[14px] data-[state=active]:dark:bg-orange-800">
            <Users size={16} />
            Staffing
          </TabsTrigger>
        </section>
        <section></section>
      </TabsList>
      <TabsContent value="profile">Profile</TabsContent>
      <TabsContent value="business_context">Context</TabsContent>
      <TabsContent value="business_contacts">Contacts</TabsContent>
      <TabsContent value="staffing">Staffing</TabsContent>
    </Tabs>
  );
};
