"use client";
import { ErrorHandlerSchema } from "@/lib/types";
import { showToast } from "./toast";

export const ErrorHandler = ({ status, body }: ErrorHandlerSchema) => {
  console.log(status);
  if (status === 400) {
    showToast(body?.detail, "error");
  }
  if (status === 401) {
    if (typeof window !== "undefined") {
      showToast(body?.detail, "warning");
      setTimeout(() => {
        window.location.href = "/signin";
      }, 2000);
    }
  }
};
