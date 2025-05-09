import { LoginForm } from "@/components/forms/signin-form";
import Image from "next/image";
import placeholder from "../../assets/placeholder.svg";
import { Toaster } from "sonner";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden bg-muted lg:block">
        <Image
          src={placeholder}
          priority
          alt="eagrc solutions"
          width={1000}
          height={1000}></Image>
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10 bg-white dark:bg-background">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <Toaster position="top-center" />
    </div>
  );
}
