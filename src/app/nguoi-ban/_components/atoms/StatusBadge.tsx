import type { ReactNode } from "react";

export interface StatusBadgeProps {
  tone: "green" | "amber" | "red" | "gray" | "blue" | "violet";
  children: ReactNode;
}

export function StatusBadge({ tone, children }: StatusBadgeProps) {
  const tones = {
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    red: "bg-rose-50 text-rose-700 border-rose-200",
    gray: "bg-gray-100 text-gray-700 border-gray-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    violet: "bg-violet-50 text-violet-700 border-violet-200",
  } as const;

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-extrabold whitespace-nowrap ${tones[tone]}`}>
      {children}
    </span>
  );
}
