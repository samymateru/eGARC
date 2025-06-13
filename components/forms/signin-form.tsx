"use client";
import { cn, ErrorMessage } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModeToggle } from "../shared/toggle-button";
import { LogIn, Moon, Sun } from "lucide-react";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { showToast } from "../shared/toast";
import { useRouter } from "next/navigation";
import { FormError } from "../shared/form-error";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type Content = {
  id?: string;
  name?: string;
  email?: string;
  telephone?: string;
  entity_email?: string;
  entity_id?: string;
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
        if (data.status_code === 203) {
          if (typeof window !== undefined) {
            localStorage.setItem("token", data?.token);
            localStorage.setItem("user_id", data?.content?.id ?? "");
            localStorage.setItem("user_name", data?.content?.name ?? "");
            localStorage.setItem("user_email", data?.content?.email ?? "");
            localStorage.setItem(
              "user_telephone",
              data?.content?.telephone ?? ""
            );
            localStorage.setItem(
              "entity_email",
              data?.content?.entity_email ?? ""
            );
            localStorage.setItem("entity_id", data?.content?.entity_id ?? "");
          }
          reset();
          router.push("/");
        } else {
          showToast(data.detail, "error");
        }
      },
      onError: (error: unknown) => {
        ErrorMessage(error);
      },
    });
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={handleSubmit(onSubmit)}>
      <div className="absolute top-2 right-2">
        <ModeToggle>
          <Button className="focus-visible:outline-none focus-visible:ring-0 focus:outline-none w-[38px] h-[38px] rounded-full bg-white dark:bg-background hover:bg-neutral-300 hover:dark:bg-neutral-800 border border-neutral-700">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-black dark:text-white" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-black dark:text-white" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </ModeToggle>
      </div>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold font-serif text-nowrap">
          Welcome back to EGARC !!
        </h1>
        <p className="text-sm text-muted-foreground font-serif text-nowrap">
          Provide email and password to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email" className="">
            Email
          </Label>
          <Input
            id="email"
            {...register("email")}
            type="email"
            placeholder="m@example.com"
            className=""
          />
          <FormError error={errors.email} />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password" className="">
              Password
            </Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline">
              Forgot your password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            className=""
            {...register("password")}
          />
          <FormError error={errors.password} />
        </div>
        <Button type="submit" className="w-full" disabled={isPending}>
          Login
          <LogIn size={16} strokeWidth={3} />
        </Button>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
        <Button variant="outline" className="w-full text-white">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
              fill="currentColor"
            />
          </svg>
          Login with Google
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <a href="/signup" className="underline underline-offset-4">
          Sign up
        </a>
      </div>
    </form>
  );
}
