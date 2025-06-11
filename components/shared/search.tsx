"use client";

import { useState } from "react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandItem,
  CommandGroup,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";

export default function CommandExample() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {/* Input that opens the command menu when focused or typed in */}
      <Input
        className="w-[300px]"
        placeholder="Search..."
        onFocus={() => setOpen(true)}
        onChange={() => setOpen(true)} // Optional: opens on typing too
      />

      {/* Command Dialog */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search commands..." />
        <CommandList>
          <CommandGroup heading="Actions">
            <CommandItem onSelect={() => setOpen(false)}>Profile</CommandItem>
            <CommandItem onSelect={() => setOpen(false)}>Settings</CommandItem>
            <CommandItem onSelect={() => setOpen(false)}>Logout</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}
