import type { ReactNode } from "react";

export interface StatsGridProps {
  children: ReactNode;
  cols?: 1 | 2 | 3 | 4;
  className?: string;
}

export function StatsGrid({ children, cols = 4, className = "" }: StatsGridProps) {
  const colClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  }[cols];

  return (
    <div className={`grid ${colClasses} gap-5 mb-8 ${className}`}>
      {children}
    </div>
  );
}
