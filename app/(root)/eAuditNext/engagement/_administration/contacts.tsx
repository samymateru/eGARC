"use client";
import { ActionContactsForm } from "@/components/forms/action-business-contacts";
import { InformationContactsForm } from "@/components/forms/information-business-contact";
import { ErrorQuery } from "@/components/shared/error-query";
import { Loader } from "@/components/shared/loader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { BusinessContactSchema, UserSchema } from "@/lib/types";
import { ErrorMessage } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Contact, Dot, User } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type UsersValues = z.infer<typeof UserSchema>;
type BusinessContactsValues = z.infer<typeof BusinessContactSchema>;

export const EngagementContacts = () => {
  const [moduleId, setModuleId] = useState<string | null>();
  const [contacts, setContacts] = useState<UsersValues[]>([]);
  const [actionContacts, setActionContacts] = useState<
    BusinessContactsValues[]
  >([]);
  const [informationContacts, setInformationContacts] = useState<
    BusinessContactsValues[]
  >([]);

  const params = useSearchParams();

  useEffect(() => {
    if (typeof window !== undefined) {
      setModuleId(localStorage.getItem("moduleId"));
    }
  }, []);

  const { data, isLoading, isSuccess, isError, error } = useQuery({
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

  const {
    data: businessContacts,
    isLoading: businessContactsLoading,
    isSuccess: businessContactsSuccess,
    error: businessContactsError,
    isError: businessContactsIsError,
  } = useQuery({
    queryKey: ["_business_contacts_", params.get("id")],
    queryFn: async (): Promise<BusinessContactsValues[]> => {
      const response = await fetch(
        `${BASE_URL}/engagements/business_contact/${params.get("id")}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              typeof window === "undefined" ? "" : localStorage.getItem("token")
            }`,
          },
        }
      );
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

  useEffect(() => {
    if (!isLoading && isSuccess) {
      const headOfAudit = data?.filter(
        (user) =>
          user?.title === "Head of Audit" || user.role === "Head of Audit"
      );

      const business = data.filter((user) => user?.type === "business");

      const contacts = [...business, ...headOfAudit];
      setContacts(contacts);
    }
  }, [data, isLoading, isSuccess]);

  useEffect(() => {
    if (!businessContactsLoading && businessContactsSuccess) {
      const information = businessContacts?.filter(
        (user) => user?.type === "info"
      );

      const actions = businessContacts?.filter(
        (user) => user?.type === "action"
      );

      setActionContacts(actions);
      setInformationContacts(information);
    }
  }, [businessContacts, businessContactsLoading, businessContactsSuccess]);

  if (isError) {
    ErrorMessage(error);
  }

  if (businessContactsLoading) {
    return (
      <div className="w-full h-full relative">
        <Loader title="Business Contacts" />
      </div>
    );
  }

  if (businessContactsIsError) {
    ErrorMessage(businessContactsError);
    return (
      <div className="w-full h-full relative">
        <ErrorQuery />
      </div>
    );
  }

  return (
    <section className="pb-2">
      <section className="p-3 flex flex-col gap-3">
        <section className="flex items-center justify-between px-3">
          <Label className="font-helvetica-14 text-black">
            Business Contacts
          </Label>
          <section className="flex items-center gap-1">
            <ActionContactsForm
              def={actionContacts}
              title="Action Contacts"
              endpoint="engagements/business_contact"
              id={params.get("id")}
              mode="create">
              <Button className="w-[130px] h-[30px] bg-black font-helvetica-13 text-white justify-start">
                <Contact size={16} strokeWidth={3} />
                Action
              </Button>
            </ActionContactsForm>
            <InformationContactsForm
              def={informationContacts}
              title="Information Contacts"
              endpoint="engagements/business_contact"
              id={params.get("id")}
              mode="create">
              <Button className="w-[130px] h-[30px] bg-black font-helvetica-13 text-white flex justify-start">
                <Contact size={16} strokeWidth={3} />
                Informaion
              </Button>
            </InformationContactsForm>
          </section>
        </section>

        <section>
          <ul className="flex flex-col gap-[6px]">
            {contacts.map((user) => (
              <section key={user.id} className="flex items-center gap-2">
                <User size={16} strokeWidth={2} className="text-black" />
                <section className="flex items-center gap-1">
                  <Label className="font-helvetica-14 text-black">
                    {user.title}:
                  </Label>
                  <Label className="font-helvetica-13 text-black">
                    {user.name.toLocaleUpperCase()}
                    <span className="ml-1 italic">&lt;{user.email}&gt;</span>
                  </Label>
                </section>
              </section>
            ))}
          </ul>
        </section>
        <Separator className="my-1" />
        <section className="flex flex-col gap-3">
          <section>
            <Label className="font-[helvetica] font-semibold tracking-normal flex items-center">
              <Dot size={24} strokeWidth={3} />
              Contacts for Action
            </Label>
            <ul className="ml-4 flex flex-col gap-1">
              {actionContacts.map((contact, idx) =>
                contact.user?.map((u, uIdx) => (
                  <section
                    key={`${idx}-${uIdx}-${u.email ?? u.name ?? uIdx}`}
                    className="flex items-center gap-2">
                    <User size={16} strokeWidth={3} />
                    <section className="flex items-center gap-1">
                      <Label className="text-neutral-300 font-[helvetica] tracking-normal scroll-m-1 font-semibold">
                        {u.name?.toLocaleUpperCase()}
                        <span className="ml-1 text-blue-600">
                          &lt;{u.email}&gt;
                        </span>
                      </Label>
                    </section>
                  </section>
                ))
              )}
            </ul>
          </section>
          <Separator className="my-1" />
          <section>
            <Label className="font-[helvetica] font-semibold tracking-normal flex items-center ">
              <Dot size={24} strokeWidth={3} />
              Contacts for Information
            </Label>
            <ul className="flex flex-col gap-[6px]">
              {informationContacts.map((contact, idx) =>
                contact.user?.map((u, uIdx) => (
                  <section
                    key={`${idx}-${uIdx}-${u.email ?? u.name ?? uIdx}`}
                    className="flex items-center gap-2">
                    <User size={16} strokeWidth={3} />
                    <section className="flex items-center gap-1">
                      <Label className="text-neutral-300 font-[helvetica] tracking-normal scroll-m-1 font-semibold">
                        {u.name?.toLocaleUpperCase()}
                        <span className="ml-1 text-blue-600">
                          &lt;{u.email}&gt;
                        </span>
                      </Label>
                    </section>
                  </section>
                ))
              )}
            </ul>
          </section>
        </section>
      </section>
    </section>
  );
};
