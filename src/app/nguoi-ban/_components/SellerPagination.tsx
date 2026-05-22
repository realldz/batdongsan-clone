"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface SellerPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsLabel?: string;
  pageSize?: number;
}

export function SellerPagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsLabel = "mục",
  pageSize,
}: SellerPaginationProps) {
  if (totalPages <= 1) return null;

  // Generate page numbers with ellipsis support
  const getPages = () => {
    const maxVisible = 5;
    const pages: (number | "ellipsis-start" | "ellipsis-end")[] = [];

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("ellipsis-start");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      // Adjust to make sure we always show a consistent number of slots if possible
      const adjustedStart = currentPage === totalPages ? Math.max(2, totalPages - 2) : start;
      const adjustedEnd = currentPage === 1 ? Math.min(totalPages - 1, 3) : end;

      for (let i = adjustedStart; i <= adjustedEnd; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("ellipsis-end");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPages();
  const startRange = pageSize && totalItems ? Math.min((currentPage - 1) * pageSize + 1, totalItems) : 0;
  const endRange = pageSize && totalItems ? Math.min(currentPage * pageSize, totalItems) : 0;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-6 py-5 border-t border-gray-100 bg-white">
      {totalItems && pageSize ? (
        <div className="text-xs sm:text-sm font-medium text-gray-500 text-center sm:text-left">
          Hiển thị <span className="font-semibold text-gray-800">{startRange}-{endRange}</span> trong số{" "}
          <span className="font-semibold text-gray-800">{totalItems}</span> {itemsLabel}
        </div>
      ) : (
        <div className="text-xs sm:text-sm font-medium text-gray-500 text-center sm:text-left">
          Trang <span className="font-semibold text-gray-800">{currentPage}</span> /{" "}
          <span className="font-semibold text-gray-800">{totalPages}</span>
        </div>
      )}

      <div className="flex items-center justify-center gap-1.5">
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-all hover:bg-gray-50 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-600"
          aria-label="Trang trước"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
        </button>

        {pages.map((page, index) => {
          if (page === "ellipsis-start" || page === "ellipsis-end") {
            return (
              <span
                key={`${page}-${index}`}
                className="flex h-9 w-9 items-center justify-center text-sm font-semibold text-gray-400 select-none"
              >
                ...
              </span>
            );
          }

          const isActive = currentPage === page;

          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`h-9 w-9 rounded-lg text-sm font-bold transition-all ${
                isActive
                  ? "bg-primary text-white border border-primary shadow-sm hover:bg-primary-hover"
                  : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-950"
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-all hover:bg-gray-50 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-600"
          aria-label="Trang sau"
        >
          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
}
