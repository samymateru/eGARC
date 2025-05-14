import { LengthType } from "react-spinners/helpers/props";
import PropagateLoader from "react-spinners/PropagateLoader";
import { Label } from "../ui/label";

interface LoaderProps {
  size?: LengthType;
  title?: string;
}

export const Loader = ({ size, title }: LoaderProps) => {
  return (
    <div className="h-full flex justify-center items-center w-full relative">
      <PropagateLoader size={size} className="text-white" color="white" />
      {title && (
        <Label className="absolute top-[76%] font-[helvetica] text-xs tracking-wide">
          Loading {title}...
        </Label>
      )}
    </div>
  );
};
