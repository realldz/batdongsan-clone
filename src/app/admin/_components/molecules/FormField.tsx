import type { ReactNode } from "react";

export interface FormFieldProps {
  label: string;
  error?: string;
  className?: string;
  children: ReactNode;
}

export function FormField({
  label,
  error,
  className = "",
  children,
}: FormFieldProps) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
        {label}
      </label>
      {children}
      {error && (
        <span className="text-xs font-semibold text-rose-500 block animate-fade-in">
          {error}
        </span>
      )}
    </div>
  );
}
