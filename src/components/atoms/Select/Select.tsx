import React from "react";
import { cn } from "@/lib/utils";
import { Icon } from "../Icon";

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[] | string[];
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, error, helperText, fullWidth = true, id, ...props }, ref) => {
    const selectId = id || React.useId();

    return (
      <div className={cn("flex flex-col gap-1.5", fullWidth && "w-full")}>
        {label && (
          <label htmlFor={selectId} className="text-sm font-bold text-gray-700">
            {label}
          </label>
        )}
        <div className="relative w-full">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              "w-full rounded-xl border border-[#d7dbe0] bg-white px-4 py-3 text-sm text-[#2c2c2c] outline-none transition appearance-none pr-10",
              "focus:border-primary focus:ring-4 focus:ring-red-100",
              "disabled:bg-gray-50 disabled:text-gray-400",
              error && "border-red-500 focus:border-red-500 focus:ring-red-100",
              className
            )}
            {...props}
          >
            {options.map((opt, idx) => {
              const val = typeof opt === "string" ? opt : opt.value;
              const lbl = typeof opt === "string" ? opt : opt.label;
              return (
                <option key={idx} value={val}>
                  {lbl}
                </option>
              );
            })}
          </select>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
            <Icon name="ChevronDown" size={16} />
          </div>
        </div>
        {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
        {!error && helperText && <span className="text-xs text-gray-400">{helperText}</span>}
      </div>
    );
  }
);

Select.displayName = "Select";
