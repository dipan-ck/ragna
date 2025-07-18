"use client";

import * as Label from "@radix-ui/react-label";
import { InputHTMLAttributes, ReactNode } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
}

export const InputField = ({ label, icon, id, ...props }: InputFieldProps) => (
  <div className="space-y-1">
    <Label.Root htmlFor={id} className="text-sm font-medium text-white">
      {label}
    </Label.Root>
    <div className="relative">
      {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">{icon}</div>}
      <input
        id={id}
        {...props}
        className={`w-full ${icon ? "pl-10" : "pl-3"} pr-3 py-2 border border-white/20 rounded-md bg-[#0a0a0a] text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white`}
      />
    </div>
  </div>
);
