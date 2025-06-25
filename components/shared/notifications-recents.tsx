import { Bell, History } from "lucide-react";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export const NotificationRecents = () => {
  return (
    <section className="w-full h-full rounded-md">
      <Tabs
        defaultValue="notifications"
        className="w-full h-full bg-neutral-100 rounded-md flex flex-col">
        <TabsList className="bg-inherit w-full flex justify-between rounded-t-md rounded-b-none pl-5 pr-2 pt-3">
          <section>
            <Label className="text-[20px] font-bold font-[serif] text-black">
              Recents
            </Label>
          </section>
          <section className="flex gap-2">
            <TabsTrigger
              value="notifications"
              className="rounded-none font-helvetica-13 action data-[state=active]:border-l-[7px] data-[state=active]:border-l-blue-700 text-white data-[state=active]:text-white w-[140px]">
              <Bell size={16} strokeWidth={2} className="inline-block mr-1" />
              Notifications
            </TabsTrigger>
            <TabsTrigger
              value="recents"
              className="rounded-none font-helvetica-13 action data-[state=active]:border-l-[7px] data-[state=active]:border-l-blue-700 text-white data-[state=active]:text-white w-[140px]">
              <History
                size={16}
                strokeWidth={2}
                className="inline-block mr-1"
              />
              Recents
            </TabsTrigger>
          </section>
        </TabsList>
        <TabsContent
          value="notifications"
          className="mt-0  w-full flex-1 data-[state=inactive]:hidden">
          <section className="bg-inherit h-full">
            <Label className="text-black ">Notification</Label>
          </section>
        </TabsContent>
        <TabsContent
          value="recents"
          className="mt-0 w-full flex-1 data-[state=inactive]:hidden">
          <section className="bg-inherit h-full">
            <Label className="text-black ">Recents</Label>
          </section>
        </TabsContent>
      </Tabs>
    </section>
  );
};
