import React from "react";
import { FilterChip } from "../atoms/FilterChip";

interface FilterSectionProps<T extends string> {
  title: string;
  value: T;
  options: readonly T[];
  onSelect: (value: T) => void;
}

export function FilterSection<T extends string>({
  title,
  value,
  options,
  onSelect,
}: FilterSectionProps<T>) {
  return (
    <div>
      <div className="mb-3 text-sm font-extrabold uppercase tracking-[0.16em] text-gray-400">
        {title}
      </div>
      <div className="flex flex-wrap gap-3">
        {options.map((option) => (
          <FilterChip
            key={option}
            label={option}
            active={value === option}
            onClick={() => onSelect(option)}
          />
        ))}
      </div>
    </div>
  );
}
