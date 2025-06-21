"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CircleCheck } from "lucide-react";

type Users = {
  id?: string;
  name?: string;
  email?: string;
  date_issued?: string;
};

interface MultiSelectorProps {
  title: string;
  users?: Array<Users>;
  trigger?: string;
  children?: ReactNode;
  value: { id?: string; name?: string; email?: string; date_issued?: string }[];
  onChange: (value: Users[]) => void;
}

export const UserMultiSelector = ({
  title,
  value,
  trigger,
  users,
  onChange,
}: MultiSelectorProps) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState<boolean>(false);
  const handleToggle = (user: Users) => {
    const exists = value.some((u) => u.email === user.email);
    const newValue = exists
      ? value.filter((u) => u.email !== user.email)
      : [...value, user];
    onChange(newValue);
  };

  const isSelected = (email: string) =>
    value.some((user) => user.email === email);

  const filteredUsers =
    users?.filter((user) =>
      user.name?.toLowerCase().includes(search.toLowerCase())
    ) ?? [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          className="w-full text-black border hover:bg-neutral-100 border-neutral-500 bg-inherit justify-start font-bold font-[helvetica] text-[13px] h-auto py-2">
          {value && value.length > 0 ? (
            <div className="flex flex-col gap-0.5 text-left">
              {value.slice(0, 3).map((v, i) => (
                <span key={i} className="truncate">
                  {i + 1}. {v.name}
                </span>
              ))}
              {value.length > 3 && (
                <span className="text-muted-foreground">
                  +{value.length - 3} more
                </span>
              )}
            </div>
          ) : (
            <>{trigger}</>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[520px] gap-0 flex flex-col max-w-[800px] bg-white">
        <DialogHeader className="h-[30px]">
          <DialogTitle className="font-helvetica-large">{title}</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <section className="flex justify-between items-center gap-4">
          <Input
            placeholder="Search members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-3 flex-1 my-3 font-helvetica-13"
          />
          <Button
            className="flex-1 font-helvetica-13 flex items-center gap-2 bg-green-800"
            onClick={() => setOpen(false)}>
            <CircleCheck size={16} strokeWidth={3} />
            Pick
          </Button>
        </section>
        <section className=" w-full flex items-center gap-5 justify-start">
          <section className="flex gap-2 flex-col justify-center flex-1 max-h-[500px] overflow-auto">
            {filteredUsers.length > 0 ? (
              filteredUsers?.map((user, index) => (
                <section
                  key={index}
                  className="flex items-center gap-1 hover:bg-neutral-300 px-2 rounded-md pl-2">
                  <Checkbox
                    id={user.email}
                    checked={isSelected(user.email ?? "")}
                    onCheckedChange={() => handleToggle(user ?? "")}
                  />
                  <Label
                    htmlFor={user.email}
                    className="flex-1 h-8 mr-3 flex items-center px-2 py-1 rounded-md cursor-pointer font-helvetica-13">
                    {user.name}
                  </Label>
                </section>
              ))
            ) : (
              <p className="text-muted-foreground px-2 font-helvetica-13">
                No results found.
              </p>
            )}
          </section>
          <section className="text-sm text-muted-foreground font-helvetica-13 flex-1 max-h-[500px] overflow-auto">
            <strong>Selected:</strong>
            <ul className="list-disc pl-5">
              {value.map((u) => (
                <li key={u.email}>
                  {u.name} ({u.email})
                </li>
              ))}
            </ul>
          </section>
        </section>
      </DialogContent>
    </Dialog>
  );
};
