import { StandardTemplateSchema } from "@/lib/types";
import z from "zod";
interface PlanningHomeProps {
  data?: z.infer<typeof StandardTemplateSchema>;
}
export const PlanningHome = ({ data }: PlanningHomeProps) => {
  console.log(data);
  return <div>planning</div>;
};
