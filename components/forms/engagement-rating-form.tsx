import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormError } from "@/components/shared/form-error";
import { useEffect, useState } from "react";
import { Send, CircleX } from "lucide-react";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { RatingSchema, Response } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { ScrollArea } from "../ui/scroll-area";
import { showToast } from "../shared/toast";
import { useSearchParams } from "next/navigation";
import { ErrorMessage } from "@/lib/utils";
import { Textarea } from "../ui/textarea";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type EngagementRatingValues = z.infer<typeof RatingSchema>;

type OpinionRating = {
  values: Array<string>;
};
interface EngagementRatingFormPros {
  children: React.ReactNode;
  id: string | null;
  endpoint: string;
  title: string;
  mode?: string;
  data?: EngagementRatingValues;
}

const fetchData = async (endpont: string, id?: string | null) => {
  const response = await fetch(`${BASE_URL}/${endpont}/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${
        typeof window === "undefined" ? "" : localStorage.getItem("token")
      }`,
    },
  });
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw {
      status: response.status,
      body: errorBody,
    };
  }
  return await response.json();
};

export const EngagementRatingForm = ({
  children,
  id,
  endpoint,
  title,
  data,
}: EngagementRatingFormPros) => {
  const [open, setOpen] = useState(false);

  const query_client = useQueryClient();

  const params = useSearchParams();

  const methods = useForm<EngagementRatingValues>({
    resolver: zodResolver(RatingSchema),
    defaultValues: data,
  });

  const [entityId, setEntityId] = useState<string | null>(null);

  useEffect(() => {
    const entityId = localStorage.getItem("entity_id");
    if (entityId) {
      setEntityId(entityId);
    }
  }, []);

  const results = useQueries({
    queries: [
      {
        queryKey: ["_opinion_rating", entityId],
        queryFn: async (): Promise<OpinionRating> =>
          fetchData("profile/opinion_rating", entityId),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: true,
        enabled: !!entityId,
      },
    ],
  });

  console.log(results[0].data);

  const { mutate: createPRCM, isPending: createPRCMLoading } = useMutation({
    mutationKey: ["_create_prcm_"],
    mutationFn: async (data: EngagementRatingValues): Promise<Response> => {
      const response = await fetch(`${BASE_URL}/${endpoint}/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            typeof window === "undefined" ? "" : localStorage.getItem("token")
          }`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw {
          status: response.status,
          body: errorBody,
        };
      }
      return response.json();
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = methods;

  const onSubmit = (data: EngagementRatingValues) => {
    createPRCM(data, {
      onSuccess: (data) => {
        query_client.invalidateQueries({
          queryKey: ["_prcm_", params.get("id")],
        });
        showToast(data.detail, "success");
      },
      onError: (error) => {
        ErrorMessage(error);
      },
      onSettled: () => {
        reset();
        setOpen(false);
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
        <AlertDialogContent className="p-0 max-w-[calc(100vw-100px)] dark:bg-black">
          <form onSubmit={handleSubmit(onSubmit)}>
            <AlertDialogHeader className="px-4 py-2">
              <AlertDialogTitle className="text-[20px] font-bold font-serif tracking-wider scroll-m-1">
                {title}
              </AlertDialogTitle>
              <AlertDialogDescription className="hidden" />
            </AlertDialogHeader>

            <Separator className="" />
            <main className="px-5 py-3 h-[calc(100vh-98px)] overflow-auto flex flex-col gap-2">
              <section className="flex items-center gap-10 px-3 py-2 rounded-md h-[30px]">
                <Label className="w-[200px] font-[helvetica] font-semibold tracking-wide scroll-m-0">
                  Risk Category
                </Label>
                <Label className="w-[300px] font-[helvetica] font-semibold tracking-wide scroll-m-0">
                  Risk Maturity Rating
                </Label>

                <Label className="flex-1 font-[helvetica] font-semibold tracking-wide scroll-m-0">
                  Ratiaonale for the rating
                </Label>
              </section>

              <Separator className="my-2" />

              <section>
                <div className="*:not-first:mt-2 px-3 mb-2 flex items-center gap-10">
                  <Label
                    htmlFor="criteria"
                    className="font-serif tracking-wide scroll-m-0 font-medium w-[200px]">
                    Operational Risk
                  </Label>
                  <div className="*:not-first:mt-2 w-[300px]">
                    <Controller
                      name="opinion_rating"
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select control type" />
                          </SelectTrigger>

                          <SelectContent className="">
                            <ScrollArea className="max-h-[300px] h-auto overflow-auto">
                              {results[0].data?.values?.map(
                                (opinion, index: number) => (
                                  <SelectItem
                                    className="font-serif tracking-wide scroll-m-1 text-[14px] dark:hover:bg-neutral-800 cursor-pointer"
                                    key={index}
                                    value={opinion ?? "0"}>
                                    {opinion}
                                  </SelectItem>
                                )
                              )}
                            </ScrollArea>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <FormError error={errors.opinion_rating} />
                  </div>
                  <Textarea
                    id="opinion_rating_description"
                    placeholder="Opinion rating description here"
                    className="min-h-[10px] max-h-[120px] flex-1"
                    {...register("opinion_rating_description")}
                  />
                  <FormError error={errors.opinion_rating_description} />
                </div>
              </section>

              <Separator className="my-1" />
              <section>
                <div className="*:not-first:mt-2 px-3 mb-2 flex items-center gap-10">
                  <Label
                    htmlFor="strategy"
                    className="font-serif tracking-wide scroll-m-0 font-medium w-[200px]">
                    Strategic Risk
                  </Label>
                  <div className="*:not-first:mt-2 w-[300px]">
                    <Controller
                      name="opinion_rating"
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select control type" />
                          </SelectTrigger>

                          <SelectContent className="">
                            <ScrollArea className="max-h-[300px] h-auto overflow-auto">
                              {results[0].data?.values?.map(
                                (opinion, index: number) => (
                                  <SelectItem
                                    className="font-serif tracking-wide scroll-m-1 text-[14px] dark:hover:bg-neutral-800 cursor-pointer"
                                    key={index}
                                    value={opinion ?? "0"}>
                                    {opinion}
                                  </SelectItem>
                                )
                              )}
                            </ScrollArea>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <FormError error={errors.opinion_rating} />
                  </div>
                  <Textarea
                    id="opinion_rating_description"
                    placeholder="Opinion rating description here"
                    className="min-h-[10px] max-h-[120px] flex-1"
                    {...register("opinion_rating_description")}
                  />
                  <FormError error={errors.opinion_rating_description} />
                </div>
              </section>
              <Separator className="my-1" />

              <section>
                <div className="*:not-first:mt-2 px-3 mb-2 flex items-center gap-10">
                  <Label
                    htmlFor="strategy"
                    className="font-serif tracking-wide scroll-m-0 font-medium w-[200px]">
                    Credit Risk
                  </Label>
                  <div className="*:not-first:mt-2 w-[300px]">
                    <Controller
                      name="opinion_rating"
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select control type" />
                          </SelectTrigger>

                          <SelectContent className="">
                            <ScrollArea className="max-h-[300px] h-auto overflow-auto">
                              {results[0].data?.values?.map(
                                (opinion, index: number) => (
                                  <SelectItem
                                    className="font-serif tracking-wide scroll-m-1 text-[14px] dark:hover:bg-neutral-800 cursor-pointer"
                                    key={index}
                                    value={opinion ?? "0"}>
                                    {opinion}
                                  </SelectItem>
                                )
                              )}
                            </ScrollArea>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <FormError error={errors.opinion_rating} />
                  </div>
                  <Textarea
                    id="opinion_rating_description"
                    placeholder="Opinion rating description here"
                    className="min-h-[10px] max-h-[120px] flex-1"
                    {...register("opinion_rating_description")}
                  />
                  <FormError error={errors.opinion_rating_description} />
                </div>
              </section>
              <Separator className="my-1" />
              <section>
                <div className="*:not-first:mt-2 px-3 mb-2 flex items-center gap-10">
                  <Label
                    htmlFor="strategy"
                    className="font-serif tracking-wide scroll-m-0 font-medium w-[200px]">
                    Liquidity Risk
                  </Label>
                  <div className="*:not-first:mt-2 w-[300px]">
                    <Controller
                      name="opinion_rating"
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select control type" />
                          </SelectTrigger>

                          <SelectContent className="">
                            <ScrollArea className="max-h-[300px] h-auto overflow-auto">
                              {results[0].data?.values?.map(
                                (opinion, index: number) => (
                                  <SelectItem
                                    className="font-serif tracking-wide scroll-m-1 text-[14px] dark:hover:bg-neutral-800 cursor-pointer"
                                    key={index}
                                    value={opinion ?? "0"}>
                                    {opinion}
                                  </SelectItem>
                                )
                              )}
                            </ScrollArea>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <FormError error={errors.opinion_rating} />
                  </div>
                  <Textarea
                    id="opinion_rating_description"
                    placeholder="Opinion rating description here"
                    className="min-h-[10px] max-h-[120px] flex-1"
                    {...register("opinion_rating_description")}
                  />
                  <FormError error={errors.opinion_rating_description} />
                </div>
              </section>
              <Separator className="my-1" />
              <section>
                <div className="*:not-first:mt-2 px-3 mb-2 flex items-center gap-10">
                  <Label
                    htmlFor="strategy"
                    className="font-serif tracking-wide scroll-m-0 font-medium w-[200px]">
                    Compliance Risk
                  </Label>
                  <div className="*:not-first:mt-2 w-[300px]">
                    <Controller
                      name="opinion_rating"
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select control type" />
                          </SelectTrigger>

                          <SelectContent className="">
                            <ScrollArea className="max-h-[300px] h-auto overflow-auto">
                              {results[0].data?.values?.map(
                                (opinion, index: number) => (
                                  <SelectItem
                                    className="font-serif tracking-wide scroll-m-1 text-[14px] dark:hover:bg-neutral-800 cursor-pointer"
                                    key={index}
                                    value={opinion ?? "0"}>
                                    {opinion}
                                  </SelectItem>
                                )
                              )}
                            </ScrollArea>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <FormError error={errors.opinion_rating} />
                  </div>
                  <Textarea
                    id="opinion_rating_description"
                    placeholder="Opinion rating description here"
                    className="min-h-[10px] max-h-[120px] flex-1"
                    {...register("opinion_rating_description")}
                  />
                  <FormError error={errors.opinion_rating_description} />
                </div>
              </section>
              <Separator className="my-1" />
              <section>
                <div className="*:not-first:mt-2 px-3 mb-2 flex items-center gap-10">
                  <Label
                    htmlFor="strategy"
                    className="font-serif tracking-wide scroll-m-0 font-medium w-[200px]">
                    Marker Risk
                  </Label>
                  <div className="*:not-first:mt-2 w-[300px]">
                    <Controller
                      name="opinion_rating"
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select control type" />
                          </SelectTrigger>

                          <SelectContent className="">
                            <ScrollArea className="max-h-[300px] h-auto overflow-auto">
                              {results[0].data?.values?.map(
                                (opinion, index: number) => (
                                  <SelectItem
                                    className="font-serif tracking-wide scroll-m-1 text-[14px] dark:hover:bg-neutral-800 cursor-pointer"
                                    key={index}
                                    value={opinion ?? "0"}>
                                    {opinion}
                                  </SelectItem>
                                )
                              )}
                            </ScrollArea>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <FormError error={errors.opinion_rating} />
                  </div>
                  <Textarea
                    id="opinion_rating_description"
                    placeholder="Opinion rating description here"
                    className="min-h-[10px] max-h-[120px] flex-1"
                    {...register("opinion_rating_description")}
                  />
                  <FormError error={errors.opinion_rating_description} />
                </div>
              </section>
              <Separator className="my-1" />
              <section>
                <div className="*:not-first:mt-2 px-3 mb-2 flex items-center gap-10">
                  <Label
                    htmlFor="strategy"
                    className="font-serif tracking-wide scroll-m-0 font-medium w-[200px]">
                    Overall Risk
                  </Label>
                  <div className="*:not-first:mt-2 w-[300px]">
                    <Controller
                      name="opinion_rating"
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select control type" />
                          </SelectTrigger>

                          <SelectContent className="">
                            <ScrollArea className="max-h-[300px] h-auto overflow-auto">
                              {results[0].data?.values?.map(
                                (opinion, index: number) => (
                                  <SelectItem
                                    className="font-serif tracking-wide scroll-m-1 text-[14px] dark:hover:bg-neutral-800 cursor-pointer"
                                    key={index}
                                    value={opinion ?? "0"}>
                                    {opinion}
                                  </SelectItem>
                                )
                              )}
                            </ScrollArea>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <FormError error={errors.opinion_rating} />
                  </div>
                  <Textarea
                    id="opinion_rating_description"
                    placeholder="Opinion rating description here"
                    className="min-h-[10px] max-h-[120px] flex-1"
                    {...register("opinion_rating_description")}
                  />
                  <FormError error={errors.opinion_rating_description} />
                </div>
              </section>
              <Separator className="my-1" />

              <div className="*:not-first:mt-2 px-1 mb-2">
                <Label
                  htmlFor="criteria"
                  className="font-serif tracking-wide scroll-m-0 font-medium">
                  Opinion Rating Description
                </Label>
                <Textarea
                  id="opinion_rating_description"
                  placeholder="Opinion rating description here"
                  className="min-h-[100px] max-h-[120px]"
                  {...register("opinion_rating_description")}
                />
                <FormError error={errors.opinion_rating_description} />
              </div>
              <div className="*:not-first:mt-2">
                <Label
                  htmlFor="process"
                  className="font-serif tracking-wide scroll-m-0 font-medium">
                  Process<span className="text-destructive">*</span>
                </Label>
                <Controller
                  name="opinion_rating"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select control type" />
                      </SelectTrigger>

                      <SelectContent className="">
                        <ScrollArea className="max-h-[300px] h-auto overflow-auto">
                          {results[0].data?.values?.map(
                            (opinion, index: number) => (
                              <SelectItem
                                className="font-serif tracking-wide scroll-m-1 text-[14px] dark:hover:bg-neutral-800 cursor-pointer"
                                key={index}
                                value={opinion ?? "0"}>
                                {opinion}
                              </SelectItem>
                            )
                          )}
                        </ScrollArea>
                      </SelectContent>
                    </Select>
                  )}
                />
                <FormError error={errors.opinion_rating} />
              </div>
            </main>
            <Separator />
            <footer className="flex justify-center gap-2 px-4 py-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
                className="bg-red-800 text-white flex-1 font-serif tracking-wide scroll-m-1 font-bold">
                <CircleX className="mr-1" size={16} strokeWidth={3} />
                Cancel
              </Button>
              <Button
                disabled={createPRCMLoading}
                type="submit"
                variant="ghost"
                className="bg-green-800 text-white flex-1 font-serif tracking-wide scroll-m-1 font-bold">
                <Send className="mr-1" size={16} strokeWidth={3} />
                Submit
              </Button>
            </footer>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </FormProvider>
  );
};
