import React, { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
}

export function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-14 text-center">
      {icon && (
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
          {icon}
        </div>
      )}
      <h4 className="text-lg font-bold text-gray-900">{title}</h4>
      <p className="mt-2 text-sm leading-6 text-gray-500">{description}</p>
    </div>
  );
}
