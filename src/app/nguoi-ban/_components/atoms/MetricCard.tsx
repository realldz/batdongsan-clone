import React from "react";

interface MetricCardProps {
  label: string;
  value: string | number;
}

export function MetricCard({ label, value }: MetricCardProps) {
  return (
    <div className="rounded-2xl bg-[#f6f7f9] px-4 py-3 text-center xl:text-left">
      <div className="text-xs font-bold uppercase tracking-[0.14em] text-gray-400">
        {label}
      </div>
      <div className="mt-1 text-xl font-extrabold text-gray-900">{value}</div>
    </div>
  );
}
