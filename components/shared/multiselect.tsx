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

const users = [
  { name: "Alice Johnson", email: "alice.johnson@example.com" },
  { name: "Michael Smith", email: "michael.smith@example.com" },
  { name: "Emily Davis", email: "emily.davis@example.com" },
  { name: "Daniel Wilson", email: "daniel.wilson@example.com" },
  { name: "Olivia Martinez", email: "olivia.martinez@example.com" },
  { name: "James Brown", email: "james.brown@example.com" },
  { name: "Sophia Lee", email: "sophia.lee@example.com" },
  { name: "William Taylor", email: "william.taylor@example.com" },
  { name: "Ava Anderson", email: "ava.anderson@example.com" },
  { name: "Benjamin Thomas", email: "benjamin.thomas@example.com" },
  { name: "Mia Moore", email: "mia.moore@example.com" },
  { name: "Jacob Harris", email: "jacob.harris@example.com" },
  { name: "Charlotte Clark", email: "charlotte.clark@example.com" },
  { name: "Ethan Lewis", email: "ethan.lewis@example.com" },
  { name: "Amelia Walker", email: "amelia.walker@example.com" },
];

interface MultiSelectorProps {
  title: string;
  children?: ReactNode;
  value: { name: string; email: string }[];
  onChange: (value: { name: string; email: string }[]) => void;
}

export const MultipleSelector = ({
  title,
  value,
  onChange,
}: MultiSelectorProps) => {
  const [search, setSearch] = useState("");

  const handleToggle = (user: { name: string; email: string }) => {
    const exists = value.some((u) => u.email === user.email);
    const newValue = exists
      ? value.filter((u) => u.email !== user.email)
      : [...value, user];
    onChange(newValue);
  };

  const isSelected = (email: string) =>
    value.some((user) => user.email === email);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-start">
          {value && value.length > 0
            ? `${value
                .slice(0, 3)
                .map((u) => u.name)
                .join(", ")}${
                value.length > 3 ? ` +${value.length - 3} more` : ""
              }`
            : "Click to select members"}
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[520px] gap-0 flex flex-col max-w-[800px]">
        <DialogHeader className="h-[30px]">
          <DialogTitle className="font-serif tracking-wide scroll-m-0 text-[24px] font-semibold">
            {title}
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <Input
          placeholder="Search members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-3 w-[350px] my-3"
        />

        <section className="flex">
          <ScrollArea className="max-h-[380px] overflow-y-auto h-auto flex-1">
            <section className="flex gap-2 flex-col justify-center">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <section key={index} className="flex items-center gap-1">
                    <Checkbox
                      id={user.email}
                      checked={isSelected(user.email)}
                      onCheckedChange={() => handleToggle(user)}
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
