import React from "react";
import { cn } from "@/lib/utils";

export interface FormFieldProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export const FormField = ({
  label,
  error,
  helperText,
  required = false,
  children,
  className,
  fullWidth = true,
}: FormFieldProps) => {
  return (
    <div className={cn("flex flex-col gap-1.5", fullWidth && "w-full", className)}>
      {label && (
        <label className="text-sm font-bold text-gray-700 flex items-center gap-0.5 select-none">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative w-full">
        {children}
      </div>
      {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
      {!error && helperText && <span className="text-xs text-gray-400">{helperText}</span>}
    </div>
  );
};
