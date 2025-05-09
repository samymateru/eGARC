// Toast.tsx
"use client";

import { CheckCircle, CircleX } from "lucide-react";
import React from "react";
import { Toaster, toast } from "sonner";

export const showToast = (
  message?: string,
  variant?: "success" | "error" | "warning"
) => {
  switch (variant) {
    case "success":
      toast.success(message, {
        style: {
          backgroundColor: "#052e16",
          color: "white",
          fontSize: "15px",
          fontWeight: "bold",
          height: "45px",
          border: "#262626",
        },
        icon: <CheckCircle size={20} color="white" />,
      });
      break;
    case "error":
      toast.error(message, {
        style: {
          backgroundColor: "#7f1d1d",
          color: "white",
          fontSize: "15px",
          fontWeight: "bold",
          height: "45px",
          border: "#7f1d1d",
        },
        icon: <CircleX size={20} color="white" />,
      });
      break;
    case "warning":
      toast(message, {
        style: {
          backgroundColor: "white",
          color: "orange",
          fontSize: "15px",
          fontWeight: "bold",
          height: "45px",
        },
      });
      break;
    default:
      toast(message);
  }
};

export const ToastProvider: React.FC<{
  alignment?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}> = ({ alignment = "top-right" }) => {
  return <Toaster position={alignment} />;
};
