"use client";
import { cn, ErrorMessage } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn } from "lucide-react";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FormError } from "../shared/form-error";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type Content = {
  id?: string;
  name?: string;
  email?: string;
};

export type SignupResponse = {
  token: string;
  detail?: string;
  status_code?: number;
  content?: Content;
};

const SignupSchema = z.object({
  email: z.string().email("Provide valid email please"),
  password: z.string().min(1, "Password field can't be empty"),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const router = useRouter();
  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm<z.infer<typeof SignupSchema>>({
    resolver: zodResolver(SignupSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["signin"],
    mutationFn: async (data: z.infer<typeof SignupSchema>) => {
      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          email: data.email,
          password: data.password,
        }),
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
  const onSubmit: SubmitHandler<z.infer<typeof SignupSchema>> = async (
    data
  ) => {
    mutate(data, {
      onSuccess: (data: SignupResponse) => {
        if (data.token) {
          localStorage.setItem("token", data?.token ?? "");
          localStorage.setItem("user_id", data?.content?.id ?? "");
          localStorage.setItem("user_name", data?.content?.name ?? "");
          localStorage.setItem("user_email", data?.content?.email ?? "");
          router.push("/");
        }
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
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="font-helvetica-large text-nowrap">
          Welcome back to EGARC !!
        </h1>
        <p className="font-helvetica-14 text-nowrap">
          Provide email and password to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email" className="font-helvetica-13">
            Email
          </Label>
          <Input
            id="email"
            {...register("email")}
            type="email"
            placeholder="m@example.com"
            className="font-helvetica-input-13 placeholder:font-helvetica-13"
          />
          <FormError error={errors.email} />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password" className="font-helvetica-13">
              Password
            </Label>
            <a
              href="#"
              className="ml-auto font-helvetica-13 underline-offset-4 hover:underline">
              Forgot your password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            className="font-helvetica-input-13 placeholder:font-helvetica-13"
            {...register("password")}
          />
          <FormError error={errors.password} />
        </div>
        <Button
          type="submit"
          className="w-full font-helvetica-13"
          disabled={isPending}>
          Login
          <LogIn size={16} strokeWidth={3} />
        </Button>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground font-helvetica-13">
            Or continue with
          </span>
        </div>
        <Button className="w-full text-white font-helvetica-13">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            width="24"
            height="24">
            <path
              fill="#4285F4"
              d="M24 9.5c3.34 0 5.63 1.45 6.92 2.67l5.1-5.1C32.22 4.17 28.53 2 24 2 14.92 2 7.47 7.87 4.95 15.44l6.96 5.42C13.2 14.15 18.2 9.5 24 9.5z"
            />
            <path
              fill="#34A853"
              d="M46.1 24.55c0-1.7-.15-2.95-.48-4.23H24v8.01h12.56c-.26 1.73-1.7 4.33-4.9 6.07l7.57 5.88c4.4-4.07 6.87-10.07 6.87-15.73z"
            />
            <path
              fill="#FBBC05"
              d="M10.56 28.02a14.62 14.62 0 0 1 0-8.04L3.6 14.56a24.042 24.042 0 0 0 0 18.88l6.96-5.42z"
            />
            <path
              fill="#EA4335"
              d="M24 46c6.48 0 11.91-2.13 15.87-5.8l-7.58-5.88c-2.06 1.38-4.82 2.2-8.29 2.2-5.8 0-10.8-4.65-12.1-10.9l-6.96 5.42C7.47 40.13 14.92 46 24 46z"
            />
          </svg>
          Login with Google
        </Button>
      </div>
      <div className="text-center text-sm font-helvetica-13 flex items-center justify-center">
        Don&apos;t have an account?{" "}
        <a
          href="/signup"
          className="underline underline-offset-4 font-helvetica-13 text-black ml-1">
          Sign up
        </a>
      </div>
    </form>
  );
}
