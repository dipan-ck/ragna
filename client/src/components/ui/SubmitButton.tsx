import React from "react";
import { Loader2 } from "lucide-react";
import cn from "@/lib/utils/cn";

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  label?: string;
  loadingLabel?: string;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  isLoading = false,
  label = "Submit",
  loadingLabel = "Loading...",
  className,
  disabled,
  type = "submit",
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={isLoading || disabled}
      className={cn(
        "w-full px-4 py-2 bg-white text-black text-sm font-medium rounded-md",
        "hover:bg-white/90 transition-colors duration-200",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "flex items-center justify-center gap-2",
        className
      )}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {isLoading ? loadingLabel : label}
    </button>
  );
};
