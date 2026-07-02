import React, { ReactNode } from "react";

interface BalanceCardProps {
  icon: ReactNode;
  label: string;
  value: string;
}

export function BalanceCard({ icon, label, value }: BalanceCardProps) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-primary">
        {icon}
      </div>
      <div className="text-sm font-bold text-gray-500">{label}</div>
      <div className="mt-2 text-2xl font-extrabold text-gray-900">{value}</div>
    </div>
  );
}

export function SkeletonBalanceCard() {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm animate-pulse">
      <div className="mb-4 h-11 w-11 rounded-2xl bg-gray-100" />
      <div className="h-4 w-24 bg-gray-100 rounded" />
      <div className="mt-3 h-8 w-32 bg-gray-100 rounded" />
    </div>
  );
}
