import { ErrorHandlerSchema } from "@/lib/types";
import { showToast } from "./toast";

export const ErrorHandler = ({ status, body }: ErrorHandlerSchema) => {
  console.log(status);
  if (status === 400) {
    showToast(body?.detail, "error");
  }
};
