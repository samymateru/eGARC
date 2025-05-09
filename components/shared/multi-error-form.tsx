import { CircleX } from "lucide-react";

type ErrorProps = {
  error?: string;
};
export function MultiErrorForm({ error }: ErrorProps) {
  return (
    <p
      className={`text-red-500 font-medium font-serif text-[13px] pt-[2px] flex  items-center gap-1 ${
        error ? "flex" : "hidden"
      }`}>
      <CircleX size={13} />
      {error}
    </p>
  );
}
