import { CircleX } from "lucide-react";

type ErrorProps = {
  error?: { message?: string };
};
export function FormError({ error }: ErrorProps) {
  return (
    <p
      className={`text-red-500 font-medium font-serif text-[13px] pt-[2px] flex  items-center gap-1 ${
        error ? "flex" : "hidden"
      }`}>
      <CircleX size={13} />
      {String(error?.message)}
    </p>
  );
}
