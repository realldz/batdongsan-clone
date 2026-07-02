import React, { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  children?: ReactNode;
  className?: string;
}

export function SectionHeader({
  title,
  children,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`flex items-center justify-between mb-5 ${className}`}>
      <h2 className="text-[22px] font-bold text-gray-900 tracking-tight">
        {title}
      </h2>
      {children && <div className="flex-shrink-0">{children}</div>}
    </div>
  );
}
