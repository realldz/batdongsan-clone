import React from "react";
import { cn } from "@/lib/utils";

interface TwoColumnLayoutProps {
  main: React.ReactNode;
  sidebar: React.ReactNode;
  className?: string;
  reverse?: boolean;
}

export function TwoColumnLayout({ main, sidebar, className, reverse = false }: TwoColumnLayoutProps) {
  return (
    <div className={cn("flex flex-col lg:flex-row gap-8 w-full", reverse && "lg:flex-row-reverse", className)}>
      <div className="flex-1 min-w-0">
        {main}
      </div>
      <aside className="w-full lg:w-[320px] flex-shrink-0">
        {sidebar}
      </aside>
    </div>
  );
}
