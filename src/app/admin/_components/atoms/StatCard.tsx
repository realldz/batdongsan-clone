import type { ReactNode } from "react";

export interface StatCardProps {
  title: string;
  value: string;
  helper: string;
  tone?: "gray" | "red" | "green" | "amber" | "blue";
  icon: ReactNode;
}

export function StatCard({
  title,
  value,
  helper,
  tone = "gray",
  icon,
}: StatCardProps) {
  const tones = {
    gray: "bg-gray-50 text-gray-700 border-gray-100",
    red: "bg-red-50 text-[#e03c31] border-red-100",
    green: "bg-emerald-50 text-emerald-700 border-emerald-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    blue: "bg-blue-50 text-blue-700 border-blue-100",
  } as const;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:border-gray-300 transition-colors">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="text-sm font-bold text-gray-500">{title}</div>
        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${tones[tone]}`}>{icon}</div>
      </div>
      <div className="text-[28px] font-extrabold text-gray-900 leading-none mb-2">{value}</div>
      <div className="text-xs font-semibold text-gray-500">{helper}</div>
    </div>
  );
}
