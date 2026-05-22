import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb = ({ items, className }: BreadcrumbProps) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "text-xs lg:text-sm text-gray-500 flex items-center gap-1.5 flex-wrap",
        className
      )}
    >
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;

        return (
          <React.Fragment key={idx}>
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="hover:text-primary transition-colors cursor-pointer"
              >
                {item.label}
              </Link>
            ) : (
              <span className={cn(isLast ? "text-[#2c2c2c] font-medium" : "text-gray-500")}>
                {item.label}
              </span>
            )}
            {!isLast && <span className="text-gray-400 select-none">/</span>}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
