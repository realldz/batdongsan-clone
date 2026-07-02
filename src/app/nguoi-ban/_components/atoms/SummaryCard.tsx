import React from "react";

interface SummaryCardProps {
  label: string;
  value: string | number;
  helper?: string;
}

export function SummaryCard({ label, value, helper }: SummaryCardProps) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="text-sm font-semibold text-gray-500">{label}</div>
      <div className="mt-3 text-2xl sm:text-[30px] font-extrabold leading-none text-gray-900">
        {value}
      </div>
      {helper && <div className="mt-2 text-sm text-gray-500">{helper}</div>}
    </div>
  );
}
