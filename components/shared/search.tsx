"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { ReactNode, useEffect, useState } from "react";

type Search = {
  tag?: string;
  name?: string;
  value?: string;
};

interface SearchBar {
  children: ReactNode;
}

export default function SearchBar({ children }: SearchBar) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState<Search[] | null>(null);
  useEffect(() => {
    if (typeof window !== undefined) {
      const searchStr = localStorage.getItem("search");
      const search = searchStr ? JSON.parse(searchStr) : null;
      setSearch(search);
    }
    console.log("mount");
  }, []);

  const onOpen = (open: boolean) => {
    setOpen(open);
    if (open) {
      if (typeof window !== undefined) {
        const searchStr = localStorage.getItem("search");
        const search = searchStr ? JSON.parse(searchStr) : null;
        setSearch(search);
      }
    }
  };
  console.log(search);
  return (
    <Dialog open={open} onOpenChange={onOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
