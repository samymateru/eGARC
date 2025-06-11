import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { CircleX, Send } from "lucide-react";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormError } from "../shared/form-error";
import { showToast } from "../shared/toast";
import { BusinessContactSchema, IssueResponder, UserSchema } from "@/lib/types";
import { UserMultiSelector } from "../shared/user-multiselector";
import { useSearchParams } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type BusinessContactsValues = z.infer<typeof BusinessContactSchema>;
type UsersValues = z.infer<typeof UserSchema>;
type User = z.infer<typeof IssueResponder>;

interface BusinessContactsFormProps {
  children: ReactNode;
  title: string;
  id: string | null;
  endpoint: string;
  mode?: string;
  def: BusinessContactsValues[];
}

export const InformationContactsForm = ({
  children,
  title,
  id,
  endpoint,
  def,
}: BusinessContactsFormProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [contacts, setContacts] = useState<UsersValues[]>([]);
  const [moduleId, setModuleId] = useState<string | null>();

  const query_client = useQueryClient();

  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["_teams_", moduleId],
    queryFn: async (): Promise<UsersValues[]> => {
      const response = await fetch(`${BASE_URL}/users/module/${moduleId}`, {
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
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    enabled: !!moduleId,
  });

  const { mutate: saveBusinessContact, isPending: saveBusinessContactPending } =
    useMutation({
      mutationKey: ["save_business_contact", id],
      mutationFn: async (data: BusinessContactsValues) => {
        const response = await fetch(`${BASE_URL}/${endpoint}/${id}`, {
          method: "PUT",
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
        return await response.json();
      },
    });
  const params = useSearchParams();
  const methods = useForm<BusinessContactsValues>({
    resolver: zodResolver(BusinessContactSchema),
    defaultValues: def[0],
  });

  useEffect(() => {
    if (!isLoading && isSuccess) {
      const contacts = data?.filter((user) => user?.type === "business");
      setContacts(contacts);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isLoading, isSuccess]);

  useEffect(() => {
    if (typeof window !== undefined) {
      setModuleId(localStorage.getItem("moduleId"));
    }
  }, []);

  useEffect(() => {
    methods.reset({
      user: def[0]?.user || [],
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [def, def[0]]);

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = methods;

  const onSubmit = (data: BusinessContactsValues) => {
    const contactData: BusinessContactsValues = {
      ...data,
      type: "info",
    };
    saveBusinessContact(contactData, {
      onSuccess: (data) => {
        query_client.invalidateQueries({
          queryKey: ["_business_contacts_", params.get("id")],
        });
        showToast(data.detail, "success");
      },
      onError: (error) => {
        console.log(error);
      },
      onSettled: () => {
        reset();
        setOpen(false);
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="p-0 gap-0 max-w-[500px]">
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader className="rounded-tl rounded-tr  py-2">
              <DialogTitle className="font-serif text-[20px] pl-3 tracking-wide scroll-m-0 font-bold text-xl">
                {title}
              </DialogTitle>
              <DialogDescription className="hidden" />
            </DialogHeader>

            <Separator />

            <section className="py-5 px-5 flex flex-col gap-3">
              <div className="*:not-first:mt-2 flex-1">
                <Label className="font-serif tracking-wide scroll-m-0 font-medium">
                  Contact Person
                </Label>
                <Controller
                  name="user"
                  control={control}
                  render={({ field }) => (
                    <UserMultiSelector
                      trigger="Select business contact"
                      users={contacts}
                      title="Business Contacts"
                      value={(field.value || []).map((user: User) => ({
                        ...user,
                        date_issued:
                          user?.date_issued instanceof Date
                            ? user.date_issued.toISOString()
                            : user?.date_issued,
                      }))}
                      onChange={field.onChange}
                    />
                  )}
                />
                <FormError error={errors.user} />
              </div>
            </section>

            <Separator />

            <footer className="rounded-br rounded-bl flex px-4 py-2 gap-2">
              <Button
                variant="ghost"
                type="button"
                onClick={() => setOpen(false)}
                className="bg-red-800 font-serif font-semibold flex-1">
                <CircleX size={16} strokeWidth={3} />
                Cancel
              </Button>
              <Button
                variant="ghost"
                disabled={saveBusinessContactPending}
                type="submit"
                className="bg-green-800 font-serif font-semibold flex-1">
                <Send size={16} strokeWidth={3} />
                {"Submit"}
              </Button>
            </footer>
          </form>
        </DialogContent>
      </Dialog>
    </FormProvider>
  );
};
