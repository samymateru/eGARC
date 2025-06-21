"use client";
import { FormError } from "@/components/shared/form-error";
import { showToast } from "@/components/shared/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  CheckIcon,
  EyeIcon,
  EyeOffIcon,
  LogIn,
  Send,
  XIcon,
} from "lucide-react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import "@/app/globals.css";
import z from "zod";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { SelectValue } from "@/components/ui/select";
import { ErrorMessage } from "@/lib/utils";
import { useId, useMemo, useState } from "react";

const organization_types = [
  { value: "Technology", label: "Technology" },
  { value: "Healthcare", label: "Healthcare" },
  { value: "Finance", label: "Finance" },
  { value: "Education", label: "Education" },
  { value: "Manufacturing", label: "Manufacturing" },
  { value: "Retail", label: "Retail" },
  { value: "Energy", label: "Energy" },
  { value: "Construction", label: "Construction" },
  { value: "Transportation", label: "Transportation" },
  { value: "Agriculture", label: "Agriculture" },
  { value: "Entertainment", label: "Entertainment" },
  { value: "Real Estate", label: "Real Estate" },
  { value: "Hospitality", label: "Hospitality" },
  { value: "Telecommunications", label: "Telecommunications" },
  { value: "Legal Services", label: "Legal Services" },
  { value: "Non-Profit", label: "Non-Profit" },
  { value: "Government", label: "Government" },
  { value: "Media", label: "Media" },
  { value: "Professional Services", label: "Professional Services" },
  { value: "Consulting", label: "Consulting" },
];

const EntitySchema = z.object({
  name: z.string().min(1, "Name is required"),
  owner: z.string().min(1, "Owner is required"),
  email: z.string().email("Provide a valid email"),
  telephone: z.string().min(1, "Telephone is required"),
  website: z.string().optional(),
  type: z
    .string({ required_error: "Type is required" })
    .min(1, "Type is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type EntityValues = z.infer<typeof EntitySchema>;

export default function EntityForm() {
  const router = useRouter();
  const methods = useForm<EntityValues>({
    resolver: zodResolver(EntitySchema),
  });

  const id = useId();
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const checkStrength = (pass: string) => {
    const requirements = [
      { regex: /.{8,}/, text: "At least 8 characters" },
      { regex: /[0-9]/, text: "At least 1 number" },
      { regex: /[a-z]/, text: "At least 1 lowercase letter" },
      { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
    ];

    return requirements.map((req) => ({
      met: req.regex.test(pass),
      text: req.text,
    }));
  };

  const strength = checkStrength(password);

  const strengthScore = useMemo(() => {
    return strength.filter((req) => req.met).length;
  }, [strength]);

  const getStrengthColor = (score: number) => {
    if (score === 0) return "bg-border";
    if (score <= 1) return "bg-red-500";
    if (score <= 2) return "bg-orange-500";
    if (score === 3) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const getStrengthText = (score: number) => {
    if (score === 0) return "Enter a password";
    if (score <= 2) return "Weak password";
    if (score === 3) return "Medium password";
    return "Strong password";
  };

  const {
    handleSubmit,
    register,
    reset,
    control,
    formState: { errors },
  } = methods;

  const { mutate: createEntity, isPending: createEntityLoading } = useMutation({
    mutationKey: ["create-entity"],
    mutationFn: async (data: EntityValues) => {
      const response = await fetch(`${BASE_URL}/entity/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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

  const onSubmit = (data: EntityValues) => {
    console.log("Form data:", data);
    createEntity(data, {
      onSuccess: (data) => {
        console.log("Entity created successfully:", data);
        router.push("/signin");
        showToast(data.detail, "success");
      },
      onError: (error) => {
        ErrorMessage(error);
      },
      onSettled: () => {
        reset();
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex justify-center items-center h-[calc(100vh-10px)] py-2 overflow-auto flex-col gap-1 bg-white">
        <section className="flex flex-col items-center text-center mt-2 gap-2">
          <Label className="font-helvetica-large text-black">
            eGARC Management System
          </Label>
          <Label className="font-helvetica-14 text-black">Create Entity</Label>
        </section>

        <section className="py-2 px-5 flex flex-col gap-1 min-w-[700px] text-white">
          <section className="flex justify-between items-center gap-2">
            <div className="*:not-first:mt-2 flex-1">
              <Label htmlFor="name" className="font-helvetica-13 text-black">
                Entity Name<span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Entity name"
                {...register("name")}
                className="font-helvetica-input-13 placeholder:font-helvetica-13 text-black"
              />
              <div className="h-4">
                <FormError error={errors.name} />
              </div>
            </div>
            <div className="*:not-first:mt-2 flex-1">
              <Label htmlFor="owner" className="font-helvetica-13 text-black">
                Entity Owner<span className="text-destructive">*</span>
              </Label>
              <Input
                id="owner"
                placeholder="Entity owner"
                {...register("owner")}
                className="font-helvetica-input-13 placeholder:font-helvetica-13 text-black"
              />
              <div className="h-4">
                <FormError error={errors.owner} />
              </div>
            </div>
          </section>

          <section className="flex justify-between items-center gap-2">
            <div className="*:not-first:mt-2 flex-1">
              <Label htmlFor="email" className="font-helvetica-13 text-black">
                Email<span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                placeholder="Email"
                {...register("email")}
                className="font-helvetica-input-13 placeholder:font-helvetica-13 text-black"
              />
              <div className="h-4">
                <FormError error={errors.email} />
              </div>
            </div>
            <div className="*:not-first:mt-2 flex-1">
              <Label
                htmlFor="telephone"
                className="font-helvetica-13 text-black">
                Telephone<span className="text-destructive">*</span>
              </Label>
              <Input
                id="telephone"
                placeholder="Phone"
                {...register("telephone")}
                className="font-helvetica-input-13 placeholder:font-helvetica-13 text-black"
              />
              <div className="h-4">
                <FormError error={errors.telephone} />
              </div>
            </div>
          </section>

          <section className="flex justify-between items-center gap-2">
            <div className="*:not-first:mt-2 flex-1">
              <Label htmlFor="website" className="font-helvetica-13 text-black">
                Website<span className="text-destructive">*</span>
              </Label>
              <Input
                id="website"
                placeholder="Website"
                {...register("website")}
                className="font-helvetica-input-13 placeholder:font-helvetica-13 text-black"
              />
              <div className="h-4">
                <FormError error={errors.website} />
              </div>
            </div>
            <div className="*:not-first:mt-2 flex-1">
              <Label htmlFor="type" className="font-helvetica-13 text-black">
                Type <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="border border-neutral-500 font-helvetica-13 text-black">
                      <SelectValue
                        placeholder="Select control type"
                        className="placeholder:font-helvetica-13 text-black"
                      />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-100 h-[270px] overflow-hidden">
                      {organization_types.map((item, index) => (
                        <SelectItem
                          key={index}
                          value={item.value}
                          className="font-helvetica-13 hover:bg-blue-400 cursor-pointer w-[calc(100%-4px)] focus:bg-blue-400 focus:text-black">
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <div className="h-4">
                <FormError error={errors.type} />
              </div>
            </div>
          </section>
          <div>
            <div className="*:not-first:mt-2">
              <Label htmlFor={id} className="text-black font-helvetica-13">
                Password
              </Label>
              <div className="relative">
                <Input
                  id={id}
                  className="pe-9 font-helvetica-input-13 placeholder:font-helvetica-13 text-black"
                  placeholder="Password"
                  type={isVisible ? "text" : "password"}
                  value={password}
                  {...register("password")}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-describedby={`${id}-description`}
                />
                <button
                  className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                  type="button"
                  onClick={toggleVisibility}
                  aria-label={isVisible ? "Hide password" : "Show password"}
                  aria-pressed={isVisible}
                  aria-controls="password">
                  {isVisible ? (
                    <EyeOffIcon
                      size={16}
                      aria-hidden="true"
                      className="text-black"
                    />
                  ) : (
                    <EyeIcon
                      size={16}
                      aria-hidden="true"
                      className="text-black"
                    />
                  )}
                </button>
              </div>
            </div>
            <FormError error={errors.password} />

            {/* Password strength indicator */}
            <div
              className="bg-border mt-3 mb-4 h-1 w-full overflow-hidden rounded-full"
              role="progressbar"
              aria-valuenow={strengthScore}
              aria-valuemin={0}
              aria-valuemax={4}
              aria-label="Password strength">
              <div
                className={`h-full ${getStrengthColor(
                  strengthScore
                )} transition-all duration-500 ease-out`}
                style={{ width: `${(strengthScore / 4) * 100}%` }}></div>
            </div>

            {/* Password strength description */}
            <p
              id={`${id}-description`}
              className="text-black font-[helvetica] mb-2 text-sm font-medium">
              {getStrengthText(strengthScore)}. Must contain:
            </p>

            {/* Password requirements list */}
            <ul className="space-y-1.5" aria-label="Password requirements">
              {strength.map((req, index) => (
                <li key={index} className="flex items-center gap-2">
                  {req.met ? (
                    <CheckIcon
                      size={16}
                      className="text-emerald-500"
                      aria-hidden="true"
                    />
                  ) : (
                    <XIcon
                      size={16}
                      className="text-muted-foreground/80"
                      aria-hidden="true"
                    />
                  )}
                  <span
                    className={`text-xs ${
                      req.met ? "text-emerald-600" : "text-muted-foreground"
                    }`}>
                    {req.text}
                    <span className="sr-only">
                      {req.met
                        ? " - Requirement met"
                        : " - Requirement not met"}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <footer className="rounded-br rounded-bl flex px-4 py-2 gap-2 w-[700px]">
          <Button
            onClick={() => router.push("/signin")}
            type="button"
            className="bg-black font-helvetica-13 flex-1">
            <LogIn size={16} strokeWidth={3} />
            Login
          </Button>
          <Button
            disabled={createEntityLoading}
            type="submit"
            className="bg-green-900 font-helvetica-13 flex-1">
            <Send size={16} strokeWidth={3} />
            {"Submit"}
          </Button>
        </footer>
      </form>
    </FormProvider>
  );
}
