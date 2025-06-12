"use client";
import {
  Command,
  LoaderCircleIcon,
  Search,
  SearchIcon,
  Trash,
  X,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { ReactNode, useEffect, useId, useState } from "react";
import { cn, deleteSearchFromLocalStorage } from "@/lib/utils";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import Link from "next/link";

type Search = {
  tag: string;
  name: string;
  value: string;
};

interface SearchBarProps {
  className?: ReactNode;
}

export default function SearchBar({ className }: SearchBarProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState<Search[] | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const id = useId();

  useEffect(() => {
    if (inputValue) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
    setIsLoading(false);
  }, [inputValue]);

  useEffect(() => {
    if (typeof window !== undefined) {
      const searchStr = localStorage.getItem("search");
      const search = searchStr ? JSON.parse(searchStr) : null;
      setSearch(search);
    }
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

  const onDelete = () => {
    if (typeof window !== undefined) {
      const searchStr = localStorage.getItem("search");
      const search = searchStr ? JSON.parse(searchStr) : null;
      setSearch(search);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpen}>
      <DialogTrigger asChild>
        <Button
          className={cn(
            "w-full justify-between h-[30px] px-3 border border-neutral-600",
            className
          )}
          variant="ghost">
          <span className="flex items-center gap-1">
            <Search size={6} strokeWidth={3} />
            Search...
          </span>
          <span className="flex items-center gap-[2px]">
            <Command />K
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100vw-100px)] flex flex-col min-h-[200px] px-3 py-2 relative gap-[10px]">
        <DialogHeader className="relative h-fit">
          <DialogTitle className="font-[helvetica] text-left font-bold tracking-wide scroll-m-1 mt-3">
            Search & Filter
          </DialogTitle>
          <DialogDescription className="absolute top-0" />
        </DialogHeader>
        <Button
          onClick={() => setOpen(false)}
          className="w-[30px] h-[30px] absolute top-2 right-2"
          variant="ghost">
          <X size={16} strokeWidth={3} />
        </Button>
        <Separator className="my-1" />
        <section>
          <section>
            <div className="relative">
              <Input
                id={id}
                className="peer ps-9 "
                placeholder="Search..."
                type="search"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                {isLoading ? (
                  <LoaderCircleIcon
                    className="animate-spin"
                    size={16}
                    role="status"
                    aria-label="Loading..."
                  />
                ) : (
                  <SearchIcon size={16} aria-hidden="true" />
                )}
              </div>
            </div>
          </section>
          <section>
            {(search ?? []).filter((item) => item.tag === "plans").length >
            0 ? (
              <section className="pt-3">
                <section>
                  <Label className="font-[helvetica] font-bold tracking-wide">
                    Audit Plans
                  </Label>
                </section>
                <Separator className="my-1" />
                <section>
                  <ul className="flex flex-col">
                    {search
                      ?.filter((item) => item.tag === "plans")
                      .map((item, index: number) => (
                        <div
                          key={index}
                          className="font-[helvetica] tracking-normal scroll-m-0 hover:bg-neutral-800 rounded-md pl-3 pr-1 py-1 flex items-center justify-between">
                          <Link
                            onClick={() => setOpen(false)}
                            href={item.value}
                            className="flex-1">
                            {item.name}
                          </Link>
                          <Button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              deleteSearchFromLocalStorage(item.value);
                              onDelete();
                            }}
                            className="w-[28px] h-[28px] hover:bg-black"
                            variant="ghost">
                            <Trash size={16} strokeWidth={3} />
                          </Button>
                        </div>
                      ))}
                  </ul>
                </section>
              </section>
            ) : null}

            {(search ?? []).filter((item) => item.tag === "engagements")
              .length > 0 ? (
              <section className="pt-3">
                <section>
                  <Label className="font-[helvetica] font-bold tracking-wide">
                    Engagements
                  </Label>
                </section>
                <Separator className="my-1" />
                <section>
                  <ul className="flex flex-col">
                    {search
                      ?.filter((item) => item.tag === "engagements")
                      .map((item, index: number) => (
                        <div
                          key={index}
                          className="font-[helvetica] tracking-normal scroll-m-0 hover:bg-neutral-800 rounded-md pl-3 pr-1 py-1 flex items-center justify-between">
                          <Link
                            onClick={() => setOpen(false)}
                            href={item.value}
                            className="flex-1">
                            {item.name}
                          </Link>
                          <Button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              deleteSearchFromLocalStorage(item.value);
                              onDelete();
                            }}
                            className="w-[28px] h-[28px] hover:bg-black"
                            variant="ghost">
                            <Trash size={16} strokeWidth={3} />
                          </Button>
                        </div>
                      ))}
                  </ul>
                </section>
              </section>
            ) : null}
          </section>
        </section>
      </DialogContent>
    </Dialog>
  );
}
