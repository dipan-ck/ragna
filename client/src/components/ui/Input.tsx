"use client";

import React, { InputHTMLAttributes, ReactNode } from "react";
import cn from "@/lib/utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, icon, id, className, ...props }) => {
  return (
    <div className="space-y-1 w-full">
      <label htmlFor={id} className="block text-sm font-medium text-white">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
            {icon}
          </div>
        )}
        <input
          id={id}
          {...props}
          className={cn(
            "w-full py-2 pr-3 rounded-md border border-white/20 bg-[#0a0a0a]",
            "text-sm text-white placeholder:text-white/50",
            "focus:outline-none focus:ring-2 focus:ring-[#4a4a4a]",
            icon ? "pl-10" : "pl-3",
            className
          )}
        />
      </div>
    </div>
  );
};
