import { IssueReccuring } from "../shared/issue-recurring";
import { IssueStatus } from "../shared/issue-status";
import { MainDashboard } from "../shared/main-dashboard";
import { ScrollArea } from "../ui/scroll-area";

export const EauditDashboard = () => {
  return (
    <ScrollArea className="h-[500px] w-full overflow-auto">
      <MainDashboard />
      <section>
        <h1 className="font-serif tracking-wide scroll-m-1 text-[25px] font-extrabold text-center">
          Finding Analysis
        </h1>
        <section className="flex justify-center gap-2 pt-10">
          <IssueStatus />
          <IssueReccuring />
        </section>
      </section>
    </ScrollArea>
  );
};
