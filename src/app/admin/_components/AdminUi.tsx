import type { ReactNode } from "react";

export function AdminStatCard({
  title,
  value,
  helper,
  tone = "gray",
  icon,
}: {
  title: string;
  value: string;
  helper: string;
  tone?: "gray" | "red" | "green" | "amber" | "blue";
  icon: ReactNode;
}) {
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

export function StatusBadge({ tone, children }: { tone: "green" | "amber" | "red" | "gray" | "blue" | "violet"; children: ReactNode }) {
  const tones = {
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    red: "bg-rose-50 text-rose-700 border-rose-200",
    gray: "bg-gray-100 text-gray-700 border-gray-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    violet: "bg-violet-50 text-violet-700 border-violet-200",
  } as const;

  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-extrabold whitespace-nowrap ${tones[tone]}`}>{children}</span>;
}

export function AdminTableShell({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-gray-900">{title}</h2>
          <p className="text-xs font-medium text-gray-500 mt-1">{description}</p>
        </div>
        {action}
      </div>
      <div className="overflow-x-auto">{children}</div>
    </section>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="py-14 text-center">
      <div className="text-base font-extrabold text-gray-900 mb-2">{title}</div>
      <div className="text-sm font-medium text-gray-500">{description}</div>
    </div>
  );
}
