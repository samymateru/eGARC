import { AlertTriangle } from "lucide-react";
import { Label } from "../ui/label";

export const ErrorQuery = () => {
  return (
    <div className="w-fit h-[40px] rounded-md flex items-center gap-2 bg-neutral-800 px-4 py-1 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <AlertTriangle size={24} strokeWidth={3} className="text-red-700" />
      <Label className="font-[helvetica] font-bold tracking-wide scroll-m-0">
        Error occured please contact IT support
      </Label>
    </div>
  );
};
