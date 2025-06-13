import { LengthType } from "react-spinners/helpers/props";
import PropagateLoader from "react-spinners/PropagateLoader";
import { Label } from "../ui/label";

interface LoaderProps {
  size?: LengthType;
  title?: string;
}

export const Loader = ({ size, title }: LoaderProps) => {
  return (
    <div className="flex justify-center items-center w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <PropagateLoader size={size} className="text-white" color="white" />
      {title && (
        <Label className="absolute top-6 font-[helvetica] text-[15px] tracking-wide scroll-m-1">
          Loading {title}...
        </Label>
      )}
    </div>
  );
};
