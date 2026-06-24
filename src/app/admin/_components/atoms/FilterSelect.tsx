export interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: readonly string[] | { label: string; value: string }[];
  className?: string;
}

export function FilterSelect({
  value,
  onChange,
  options,
  className = "",
}: FilterSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm font-bold text-gray-700 outline-none focus:border-[#e03c31] cursor-pointer transition-colors ${className}`}
    >
      {options.map((option) => {
        if (typeof option === "string") {
          return (
            <option key={option} value={option}>
              {option}
            </option>
          );
        }
        return (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        );
      })}
    </select>
  );
}
