import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Send, CircleX } from "lucide-react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Response, RiskMaturityRatingSchema } from "@/lib/types";
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
import { Input } from "../ui/input";
import { Label } from "../ui/label";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type RiskMaturityValues = z.infer<typeof RiskMaturityRatingSchema>;

type OpinionRating = {
  values: Array<string>;
};
interface EngagementRatingFormPros {
  children: React.ReactNode;
  id: string | null;
  endpoint: string;
  title: string;
  mode?: string;
  data?: RiskMaturityValues;
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

  const [openSelect, setOpenSelect] = useState<
    | null
    | "operational"
    | "strategic"
    | "liquidity"
    | "market"
    | "overall"
    | "credit"
    | "compliance"
    | "overall_rating"
  >(null);

  const query_client = useQueryClient();

  const params = useSearchParams();

  const methods = useForm<RiskMaturityValues>({
    resolver: zodResolver(RiskMaturityRatingSchema),
    defaultValues: data,
  });

  const [entityId, setEntityId] = useState<string | null>(null);

  const handleToggle = (
    select:
      | "operational"
      | "strategic"
      | "liquidity"
      | "market"
      | "overall"
      | "credit"
      | "compliance"
      | "overall_rating"
  ) => {
    setOpenSelect((prev) => (prev === select ? null : select));
  };

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

  const { mutate: createPRCM, isPending: createPRCMLoading } = useMutation({
    mutationKey: ["_create_prcm_"],
    mutationFn: async (data: RiskMaturityValues): Promise<Response> => {
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

  const { handleSubmit, reset, control } = methods;

  const operationalRisk = useWatch({ control, name: "operational_risk" });
  const strategicRisk = useWatch({
    control: methods.control,
    name: "strategic_risk",
  });
  const creditRisk = useWatch({
    control: methods.control,
    name: "credit_risk",
  });
  const liquidityRisk = useWatch({
    control: methods.control,
    name: "liquidity_risk",
  });
  const complianceRisk = useWatch({
    control: methods.control,
    name: "compliance_risk",
  });
  const marketRisk = useWatch({
    control: methods.control,
    name: "market_risk",
  });
  const overallOpinionRating = useWatch({
    control: methods.control,
    name: "overall_opinion_rating",
  });
  const overallRating = useWatch({
    control: methods.control,
    name: "overall_rating",
  });
  const overallRisk = useWatch({ control: methods.control, name: "overall" });

  const onSubmit = (data: RiskMaturityValues) => {
    console.log(data);
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
        <AlertDialogContent className="p-0 max-w-[calc(100vw-100px)] bg-white">
          <form onSubmit={handleSubmit(onSubmit)}>
            <AlertDialogHeader className="px-4 py-2">
              <AlertDialogTitle className="text-[20px] font-bold font-serif tracking-wider scroll-m-1">
                {title}
              </AlertDialogTitle>
              <AlertDialogDescription className="hidden" />
            </AlertDialogHeader>

            <Separator className="" />
            <main className="px-5 py-3 h-[calc(100vh-98px)] overflow-auto flex flex-col gap-2">
              <div className="mx-auto w-full">
                <div className="overflow-hidden rounded-md border">
                  <Table>
                    <TableBody>
                      <TableRow className="*:border-border  [&>:not(:last-child)]:border-r">
                        <TableCell className="font-helvetica-13 text-black w-[200px]">
                          Risk Category
                        </TableCell>
                        <TableCell className="py-2 font-helvetica-13 text-black w-[300px]">
                          Maturity Rating
                        </TableCell>
                        <TableCell className="py-2 font-helvetica-13 text-black">
                          Rating Rationale
                        </TableCell>
                      </TableRow>
                      <TableRow className="*:border-border [&>:not(:last-child)]:border-r">
                        <TableCell className="font-helvetica-13 text-black">
                          Operational Risk
                        </TableCell>
                        <TableCell className="py-2 font-helvetica-13 text-black">
                          <Select
                            open={openSelect === "operational"}
                            onOpenChange={() => handleToggle("operational")}
                            onValueChange={(value) =>
                              methods.setValue("operational_risk", {
                                maturity_rating: value,
                                rationale: operationalRisk?.rationale ?? "",
                              })
                            }
                            value={operationalRisk?.maturity_rating}>
                            <SelectTrigger className="border border-neutral-500 font-helvetica-13">
                              <SelectValue placeholder="Select operational risk" />
                            </SelectTrigger>
                            <SelectContent className="bg-neutral-100">
                              <ScrollArea className="max-h-[260px] h-auto overflow-auto">
                                {results[0]?.data?.values?.map(
                                  (type, index) => (
                                    <SelectItem
                                      key={index}
                                      value={type}
                                      className="font-helvetica-13 hover:bg-blue-400 cursor-pointer w-[calc(100%-4px)] focus:bg-blue-400 focus:text-black">
                                      {type}
                                    </SelectItem>
                                  )
                                )}
                              </ScrollArea>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="py-2 font-helvetica-13 text-black">
                          <Input
                            placeholder="Operational rationale"
                            value={operationalRisk?.rationale ?? ""}
                            onChange={(e) =>
                              methods.setValue("operational_risk", {
                                rationale: e.target.value,
                                maturity_rating:
                                  operationalRisk?.maturity_rating ?? "",
                              })
                            }
                            className="font-helvetica-input-13"
                          />
                        </TableCell>
                      </TableRow>

                      <TableRow className="*:border-border [&>:not(:last-child)]:border-r">
                        <TableCell className="font-helvetica-13 text-black">
                          Strategic Risk
                        </TableCell>
                        <TableCell className="py-2 font-helvetica-13 text-black">
                          <Select
                            open={openSelect === "strategic"}
                            onOpenChange={() => handleToggle("strategic")}
                            onValueChange={(value) =>
                              methods.setValue("strategic_risk", {
                                maturity_rating: value,
                                rationale: strategicRisk?.rationale ?? "",
                              })
                            }
                            value={strategicRisk?.maturity_rating}>
                            <SelectTrigger className="border border-neutral-500 font-helvetica-13">
                              <SelectValue placeholder="Select strategic risk" />
                            </SelectTrigger>
                            <SelectContent className="bg-neutral-100">
                              <ScrollArea className="max-h-[260px] h-auto overflow-auto">
                                {results[0]?.data?.values?.map(
                                  (type, index) => (
                                    <SelectItem
                                      key={index}
                                      value={type}
                                      className="font-helvetica-13 hover:bg-blue-400 cursor-pointer w-[calc(100%-4px)] focus:bg-blue-400 focus:text-black">
                                      {type}
                                    </SelectItem>
                                  )
                                )}
                              </ScrollArea>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="py-2 font-helvetica-13 text-black">
                          <Input
                            placeholder="Strategic rationale"
                            value={strategicRisk?.rationale ?? ""}
                            onChange={(e) =>
                              methods.setValue("strategic_risk", {
                                rationale: e.target.value,
                                maturity_rating:
                                  strategicRisk?.maturity_rating ?? "",
                              })
                            }
                            className="font-helvetica-input-13"
                          />
                        </TableCell>
                      </TableRow>

                      <TableRow className="*:border-border [&>:not(:last-child)]:border-r">
                        <TableCell className="font-helvetica-13 text-black">
                          Credit Risk
                        </TableCell>
                        <TableCell className="py-2 font-helvetica-13 text-black">
                          <Select
                            open={openSelect === "credit"}
                            onOpenChange={() => handleToggle("credit")}
                            onValueChange={(value) =>
                              methods.setValue("credit_risk", {
                                maturity_rating: value,
                                rationale: creditRisk?.rationale ?? "",
                              })
                            }
                            value={creditRisk?.maturity_rating}>
                            <SelectTrigger className="border border-neutral-500 font-helvetica-13">
                              <SelectValue placeholder="Select credit risk" />
                            </SelectTrigger>
                            <SelectContent className="bg-neutral-100">
                              <ScrollArea className="max-h-[260px] h-auto overflow-auto">
                                {results[0]?.data?.values?.map(
                                  (type, index) => (
                                    <SelectItem
                                      key={index}
                                      value={type}
                                      className="font-helvetica-13 hover:bg-blue-400 cursor-pointer w-[calc(100%-4px)] focus:bg-blue-400 focus:text-black">
                                      {type}
                                    </SelectItem>
                                  )
                                )}
                              </ScrollArea>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="py-2 font-helvetica-13 text-black">
                          <Input
                            placeholder="Credit rationale"
                            value={creditRisk?.rationale ?? ""}
                            onChange={(e) =>
                              methods.setValue("credit_risk", {
                                rationale: e.target.value,
                                maturity_rating:
                                  creditRisk?.maturity_rating ?? "",
                              })
                            }
                            className="font-helvetica-input-13"
                          />
                        </TableCell>
                      </TableRow>

                      <TableRow className="*:border-border [&>:not(:last-child)]:border-r">
                        <TableCell className="font-helvetica-13 text-black">
                          Liquidity Risk
                        </TableCell>
                        <TableCell className="py-2 font-helvetica-13 text-black">
                          <Select
                            open={openSelect === "liquidity"}
                            onOpenChange={() => handleToggle("liquidity")}
                            onValueChange={(value) =>
                              methods.setValue("liquidity_risk", {
                                maturity_rating: value,
                                rationale: liquidityRisk?.rationale ?? "",
                              })
                            }
                            value={liquidityRisk?.maturity_rating}>
                            <SelectTrigger className="border border-neutral-500 font-helvetica-13">
                              <SelectValue placeholder="Select liquidity risk" />
                            </SelectTrigger>
                            <SelectContent className="bg-neutral-100">
                              <ScrollArea className="max-h-[260px] h-auto overflow-auto">
                                {results[0]?.data?.values?.map(
                                  (type, index) => (
                                    <SelectItem
                                      key={index}
                                      value={type}
                                      className="font-helvetica-13 hover:bg-blue-400 cursor-pointer w-[calc(100%-4px)] focus:bg-blue-400 focus:text-black">
                                      {type}
                                    </SelectItem>
                                  )
                                )}
                              </ScrollArea>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="py-2 font-helvetica-13 text-black">
                          <Input
                            placeholder="Liquidity rationale"
                            value={liquidityRisk?.rationale ?? ""}
                            onChange={(e) =>
                              methods.setValue("liquidity_risk", {
                                rationale: e.target.value,
                                maturity_rating:
                                  liquidityRisk?.maturity_rating ?? "",
                              })
                            }
                            className="font-helvetica-input-13"
                          />
                        </TableCell>
                      </TableRow>

                      <TableRow className="*:border-border [&>:not(:last-child)]:border-r">
                        <TableCell className="font-helvetica-13 text-black">
                          Compliance Risk
                        </TableCell>
                        <TableCell className="py-2 font-helvetica-13 text-black">
                          <Select
                            open={openSelect === "compliance"}
                            onOpenChange={() => handleToggle("compliance")}
                            onValueChange={(value) =>
                              methods.setValue("compliance_risk", {
                                maturity_rating: value,
                                rationale: complianceRisk?.rationale ?? "",
                              })
                            }
                            value={complianceRisk?.maturity_rating}>
                            <SelectTrigger className="border border-neutral-500 font-helvetica-13">
                              <SelectValue placeholder="Select compliance risk" />
                            </SelectTrigger>
                            <SelectContent className="bg-neutral-100">
                              <ScrollArea className="max-h-[260px] h-auto overflow-auto">
                                {results[0]?.data?.values?.map(
                                  (type, index) => (
                                    <SelectItem
                                      key={index}
                                      value={type}
                                      className="font-helvetica-13 hover:bg-blue-400 cursor-pointer w-[calc(100%-4px)] focus:bg-blue-400 focus:text-black">
                                      {type}
                                    </SelectItem>
                                  )
                                )}
                              </ScrollArea>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="py-2 font-helvetica-13 text-black">
                          <Input
                            placeholder="Compliance rationale"
                            value={complianceRisk?.rationale ?? ""}
                            onChange={(e) =>
                              methods.setValue("compliance_risk", {
                                rationale: e.target.value,
                                maturity_rating:
                                  complianceRisk?.maturity_rating ?? "",
                              })
                            }
                            className="font-helvetica-input-13"
                          />
                        </TableCell>
                      </TableRow>

                      <TableRow className="*:border-border [&>:not(:last-child)]:border-r">
                        <TableCell className="font-helvetica-13 text-black">
                          Market Risk
                        </TableCell>
                        <TableCell className="py-2 font-helvetica-13 text-black">
                          <Select
                            open={openSelect === "market"}
                            onOpenChange={() => handleToggle("market")}
                            onValueChange={(value) =>
                              methods.setValue("market_risk", {
                                maturity_rating: value,
                                rationale: marketRisk?.rationale ?? "",
                              })
                            }
                            value={marketRisk?.maturity_rating}>
                            <SelectTrigger className="border border-neutral-500 font-helvetica-13">
                              <SelectValue placeholder="Select market risk" />
                            </SelectTrigger>
                            <SelectContent className="bg-neutral-100">
                              <ScrollArea className="max-h-[260px] h-auto overflow-auto">
                                {results[0]?.data?.values?.map(
                                  (type, index) => (
                                    <SelectItem
                                      key={index}
                                      value={type}
                                      className="font-helvetica-13 hover:bg-blue-400 cursor-pointer w-[calc(100%-4px)] focus:bg-blue-400 focus:text-black">
                                      {type}
                                    </SelectItem>
                                  )
                                )}
                              </ScrollArea>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="py-2 font-helvetica-13 text-black">
                          <Input
                            placeholder="Market rationale"
                            value={marketRisk?.rationale ?? ""}
                            onChange={(e) =>
                              methods.setValue("market_risk", {
                                rationale: e.target.value,
                                maturity_rating:
                                  marketRisk?.maturity_rating ?? "",
                              })
                            }
                            className="font-helvetica-input-13"
                          />
                        </TableCell>
                      </TableRow>

                      <TableRow className="*:border-border [&>:not(:last-child)]:border-r">
                        <TableCell className="font-helvetica-13 text-black">
                          Overall Risk Rating
                        </TableCell>
                        <TableCell className="py-2 font-helvetica-13 text-black">
                          <Select
                            open={openSelect === "overall"}
                            onOpenChange={() => handleToggle("overall")}
                            onValueChange={(value) =>
                              methods.setValue("overall", {
                                maturity_rating: value,
                                rationale: overallRisk?.rationale ?? "",
                              })
                            }
                            value={overallRisk?.maturity_rating}>
                            <SelectTrigger className="border border-neutral-500 font-helvetica-13">
                              <SelectValue placeholder="Select overall risk" />
                            </SelectTrigger>
                            <SelectContent className="bg-neutral-100">
                              <ScrollArea className="max-h-[260px] h-auto overflow-auto">
                                {results[0]?.data?.values?.map(
                                  (type, index) => (
                                    <SelectItem
                                      key={index}
                                      value={type}
                                      className="font-helvetica-13 hover:bg-blue-400 cursor-pointer w-[calc(100%-4px)] focus:bg-blue-400 focus:text-black">
                                      {type}
                                    </SelectItem>
                                  )
                                )}
                              </ScrollArea>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="py-2 font-helvetica-13 text-black">
                          <Input
                            placeholder="Overall rationale"
                            value={overallRisk?.rationale ?? ""}
                            onChange={(e) =>
                              methods.setValue("overall", {
                                rationale: e.target.value,
                                maturity_rating:
                                  overallRisk?.maturity_rating ?? "",
                              })
                            }
                            className="font-helvetica-input-13"
                          />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
              <section className="flex items-center gap-3">
                <div className="*:not-first:mt-2 flex-1">
                  <Label
                    htmlFor="overall_opinion_rating"
                    className="font-helvetica-13">
                    Overall opinion rating{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="overall_opinion_rating"
                    placeholder="Overall opinion rating"
                    value={overallOpinionRating ?? ""}
                    onChange={(e) =>
                      methods.setValue("overall_opinion_rating", e.target.value)
                    }
                    className="font-helvetica-input-13"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="overall_opinion_rating"
                    className="font-helvetica-13">
                    Overall rating
                    <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    open={openSelect === "overall_rating"}
                    onOpenChange={() => handleToggle("overall_rating")}
                    onValueChange={(value) =>
                      methods.setValue("overall_rating", value)
                    }
                    value={overallRating}>
                    <SelectTrigger className="border border-neutral-500 font-helvetica-13 w-[300px]">
                      <SelectValue placeholder="Select overall risk" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-100">
                      <ScrollArea className="max-h-[260px] h-auto overflow-auto">
                        {results[0]?.data?.values?.map((type, index) => (
                          <SelectItem
                            key={index}
                            value={type}
                            className="font-helvetica-13 hover:bg-blue-400 cursor-pointer w-[calc(100%-4px)] focus:bg-blue-400 focus:text-black">
                            {type}
                          </SelectItem>
                        ))}
                      </ScrollArea>
                    </SelectContent>
                  </Select>
                </div>
              </section>
            </main>
            <Separator />
            <footer className="flex justify-center gap-2 px-4 py-2">
              <Button
                type="button"
                onClick={() => setOpen(false)}
                className="bg-black text-white flex-1 font-helvetica-13">
                <CircleX className="mr-1" size={16} strokeWidth={3} />
                Cancel
              </Button>
              <Button
                disabled={createPRCMLoading}
                type="submit"
                className="bg-green-700 text-white flex-1 font-helvetica-13">
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
