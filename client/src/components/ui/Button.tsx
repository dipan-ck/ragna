import React from "react";
import cn from "@/lib/utils/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  className,
  children,
  ...props
}) => {
  return (
    <button
      className={cn(
        "w-full px-4 py-2 text-sm font-medium rounded-md flex items-center justify-center gap-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
        variant === "primary"
          ? "bg-white text-black hover:bg-white/90"
          : "bg-[#090909] text-white border border-[#252525] hover:bg-[#1b1b1b]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;