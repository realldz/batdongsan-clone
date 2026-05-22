"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@/components/atoms/Icon";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  page: number;
  totalPages: number;
  createPageUrl?: (page: number) => string;
  onPageChange?: (page: number) => void;
  className?: string;
}

export const Pagination = ({
  page,
  totalPages,
  createPageUrl,
  onPageChange,
  className,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const generatePageLinks = (current: number, total: number) => {
    const links: { page: number; label: string; current: boolean }[] = [];
    const maxVisible = 5;

    if (total <= maxVisible) {
      for (let i = 1; i <= total; i += 1) {
        links.push({ page: i, label: String(i), current: i === current });
      }
    } else {
      links.push({ page: 1, label: "1", current: current === 1 });

      let start = Math.max(2, current - 1);
      let end = Math.min(total - 1, current + 1);

      if (current <= 3) {
        end = 4;
      } else if (current >= total - 2) {
        start = total - 3;
      }

      if (start > 2) {
        links.push({ page: 0, label: "...", current: false });
      }

      for (let i = start; i <= end; i += 1) {
        links.push({ page: i, label: String(i), current: i === current });
      }

      if (end < total - 1) {
        links.push({ page: 0, label: "...", current: false });
      }

      links.push({ page: total, label: String(total), current: current === total });
    }

    return links;
  };

  const pageLinks = generatePageLinks(page, totalPages);

  const renderPageItem = (link: { page: number; label: string; current: boolean }, idx: number) => {
    if (link.page === 0) {
      return (
        <span
          key={`ellipsis-${idx}`}
          className="w-8 h-8 flex items-center justify-center text-gray-500 select-none"
        >
          ...
        </span>
      );
    }

    const itemClasses = cn(
      "w-8 h-8 flex items-center justify-center font-medium rounded transition-colors cursor-pointer",
      link.current ? "bg-[#2c2c2c] text-white" : "text-gray-700 hover:bg-gray-200"
    );

    if (createPageUrl) {
      return (
        <Link key={link.page} href={createPageUrl(link.page)} className={itemClasses}>
          {link.label}
        </Link>
      );
    }

    return (
      <button
        key={link.page}
        type="button"
        onClick={() => onPageChange?.(link.page)}
        className={itemClasses}
      >
        {link.label}
      </button>
    );
  };

  const renderArrow = (direction: "left" | "right", targetPage: number, disabled: boolean) => {
    const arrowClasses = cn(
      "w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-200 font-medium rounded transition-colors cursor-pointer",
      disabled && "opacity-50 pointer-events-none"
    );

    const icon = direction === "left" ? <Icon name="ChevronLeft" size={16} /> : <Icon name="ChevronRight" size={16} />;

    if (disabled) {
      return (
        <span className={arrowClasses}>
          {icon}
        </span>
      );
    }

    if (createPageUrl) {
      return (
        <Link href={createPageUrl(targetPage)} className={arrowClasses}>
          {icon}
        </Link>
      );
    }

    return (
      <button
        type="button"
        onClick={() => onPageChange?.(targetPage)}
        className={arrowClasses}
      >
        {icon}
      </button>
    );
  };

  return (
    <div className={cn("flex items-center justify-center gap-1 mt-6 mb-12", className)}>
      {renderArrow("left", page - 1, page <= 1)}
      {pageLinks.map((link, idx) => renderPageItem(link, idx))}
      {renderArrow("right", page + 1, page >= totalPages)}
    </div>
  );
};
