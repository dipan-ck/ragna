"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import * as Label from "@radix-ui/react-label";

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PasswordField = ({ id, label, value, onChange }: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-1">
      <Label.Root htmlFor={id} className="text-sm font-medium text-white">
        {label}
      </Label.Root>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 h-4 w-4" />
        <input
          id={id}
          name={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder="••••••••"
          className="w-full pl-10 pr-10 py-2 border border-white/20 rounded-md bg-[#0a0a0a]  text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50"
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
};
