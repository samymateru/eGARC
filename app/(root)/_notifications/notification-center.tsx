import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ReactNode, useState } from "react";

interface NotificationCenterProps {
  children: ReactNode;
  user_id?: string;
}

export const NotificationCenter = ({ children }: NotificationCenterProps) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="px-5 py-4 min-h-[500px] min-w-[600px] gap-0 flex flex-col relative">
        <AlertDialogHeader className="flex flex-col h-fit">
          <AlertDialogTitle className="font-serif tracking-wide scroll-m-0 font-semibold text-[20px]">
            eGARC Notify
          </AlertDialogTitle>
          <AlertDialogDescription className="font-serif tracking-tight scroll-m-0 font-normal text-[15px]">
            Receive and send notifications to other team members instatly with
            eGARC Notify
          </AlertDialogDescription>
          <Button
            onClick={() => setOpen(false)}
            variant="ghost"
            className="absolute top-1 right-3 w-[30px] h-[30px]">
            <X size={16} strokeWidth={3} />
          </Button>
        </AlertDialogHeader>
        <section className="flex-1"></section>
      </AlertDialogContent>
    </AlertDialog>
  );
};
