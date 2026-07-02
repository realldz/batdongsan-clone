import React, { ReactNode } from "react";

interface FilterChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
  icon?: ReactNode;
  className?: string;
}

export function FilterChip({
  label,
  active,
  onClick,
  icon,
  className = "",
}: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2.5 text-sm font-bold transition-colors ${
        active
          ? "border-primary bg-red-50 text-primary"
          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
      } ${className}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{label}</span>
    </button>
  );
}
