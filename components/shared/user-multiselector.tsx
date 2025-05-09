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
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CircleCheck } from "lucide-react";

type Users = {
  id?: string;
  name?: string;
  email?: string;
};

interface MultiSelectorProps {
  title: string;
  users?: Array<Users>;
  trigger?: string;
  children?: ReactNode;
  value: { name: string; email: string }[];
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
          variant="outline"
          className="w-full justify-start font-serif tracking-wide font-semibold h-auto py-2">
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
      <DialogContent className="h-[520px] gap-0 flex flex-col max-w-[800px] dark:bg-black">
        <DialogHeader className="h-[30px]">
          <DialogTitle className="font-serif tracking-wide scroll-m-0 text-[24px] font-semibold">
            {title}
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <section className="flex justify-between items-center gap-4">
          <Input
            placeholder="Search members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-3 flex-1 my-3"
          />
          <Button
            variant="ghost"
            className="flex-1 font-semibold font-serif tracking-wide scroll-m-0 flex items-center gap-2 bg-green-800"
            onClick={() => setOpen(false)}>
            <CircleCheck size={16} strokeWidth={3} />
            Pick
          </Button>
        </section>
        <section className="flex">
          <ScrollArea className="max-h-[380px] overflow-y-auto h-auto flex-1">
            <section className="flex gap-2 flex-col justify-center">
              {filteredUsers.length > 0 ? (
                filteredUsers?.map((user, index) => (
                  <section key={index} className="flex items-center gap-1">
                    <Checkbox
                      id={user.email}
                      checked={isSelected(user.email ?? "")}
                      onCheckedChange={() => handleToggle(user ?? "")}
                    />
                    <Label
                      htmlFor={user.email}
                      className="flex-1 h-8 mr-3 flex items-center px-2 py-1 rounded-md cursor-pointer font-serif tracking-wide scroll-m-0 font-semibold dark:hover:bg-neutral-700">
                      {user.name}
                    </Label>
                  </section>
                ))
              ) : (
                <p className="text-muted-foreground px-2">No results found.</p>
              )}
            </section>
          </ScrollArea>
          <section className="pt-3 text-sm text-muted-foreground w-[370px]">
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
