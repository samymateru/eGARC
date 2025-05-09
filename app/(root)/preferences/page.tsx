import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Shield, User, Users } from "lucide-react";

export default function PreferencesPage() {
  return (
    <Tabs defaultValue="account" className="flex-1 flex h-full">
      <TabsList className="flex flex-col gap-[3px] justify-start w-[290px] pb-2 dark:bg-background h-full rounded-none">
        <TabsTrigger
          value="account"
          className="h-9 data-[state=active]:bg-orange-800 dark:hover:bg-neutral-800 w-full flex justify-start gap-2 items-center font-serif tracking-wide scroll-m-0 font-semibold">
          <User size={16} strokeWidth={3} />
          Account
        </TabsTrigger>
        <TabsTrigger
          value="modules"
          className="h-9 data-[state=active]:bg-orange-800 dark:hover:bg-neutral-800 w-full flex justify-start gap-2 items-center font-serif tracking-wide scroll-m-0 font-semibold">
          <Package size={16} strokeWidth={3} />
          Modules
        </TabsTrigger>
        <TabsTrigger
          value="teams"
          className="h-9 data-[state=active]:bg-orange-800 dark:hover:bg-neutral-800 w-full flex justify-start gap-2 items-center font-serif tracking-wide scroll-m-0 font-semibold">
          <Users size={16} strokeWidth={3} />
          Teams
        </TabsTrigger>
        <TabsTrigger
          value="roles"
          className="h-9 data-[state=active]:bg-orange-800 dark:hover:bg-neutral-800 w-full flex justify-start gap-2 items-center font-serif tracking-wide scroll-m-0 font-semibold">
          <Shield size={16} strokeWidth={3} />
          Roles
        </TabsTrigger>
      </TabsList>
      <Separator orientation="vertical" className="" />
      <TabsContent value="account" className="mt-0 flex-1">
        Account
      </TabsContent>
      <TabsContent value="modules" className="mt-0 flex-1">
        module
      </TabsContent>
      <TabsContent value="teams" className="mt-0 flex-1">
        Teams
      </TabsContent>
      <TabsContent value="roles" className="mt-0 flex-1">
        Roles
      </TabsContent>
    </Tabs>
  );
}
