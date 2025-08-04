import React, { TextareaHTMLAttributes, ReactNode } from "react";
import cn from "@/lib/utils/cn";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  icon?: ReactNode;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, icon, id, className, ...props }) => {
  return (
    <div className="space-y-1 w-full">
      <label htmlFor={id} className="block text-sm font-medium text-white">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-3 text-white/50">
            {icon}
          </div>
        )}
        <textarea
          id={id}
          {...props}
          className={cn(
            "w-full py-2 pr-3 rounded-md border border-white/20 bg-[#060606] min-h-[150px] resize-vertical",
            "text-sm text-white placeholder:text-white/50",
            "focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]",
            icon ? "pl-10" : "pl-3",
            className
          )}
        />
      </div>
    </div>
  );
};
