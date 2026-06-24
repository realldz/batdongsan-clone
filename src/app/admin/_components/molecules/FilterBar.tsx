import type { ReactNode } from "react";

export interface FilterBarProps {
  children?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function FilterBar({ children, actions, className = "" }: FilterBarProps) {
  return (
    <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 ${className}`}>
      <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {children}
      </div>
      {actions && (
        <div className="flex items-center gap-3 self-end lg:self-auto">
          {actions}
        </div>
      )}
    </div>
  );
}
