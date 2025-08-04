"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import cn from "@/lib/utils/cn";

interface PasswordInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export const PasswordInput = ({
  id,
  label,
  value,
  onChange,
  className,
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-1 w-full">
      <label htmlFor={id} className="block text-sm font-medium text-white">
        {label}
      </label>
      <div className="relative">
        {/* Left Lock Icon */}
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 h-4 w-4" />

        {/* Input */}
        <input
          id={id}
          name={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder="••••••••"
          className={cn(
            "w-full py-2 pl-10 pr-10 rounded-md border border-white/20 bg-[#0a0a0a]",
            "text-sm text-white placeholder:text-white/50",
            "focus:outline-none focus:ring-2 focus:ring-white",
            className
          )}
        />

        {/* Eye Toggle Button */}
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50"
          aria-label={showPassword ? "Hide password" : "Show password"}
          tabIndex={-1}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
};
