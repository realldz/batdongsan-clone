import type { ReactNode } from "react";

export interface TableShellProps {
  title: string;
  description: string;
  action?: ReactNode;
  children: ReactNode;
}

export function TableShell({
  title,
  description,
  action,
  children,
}: TableShellProps) {
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
