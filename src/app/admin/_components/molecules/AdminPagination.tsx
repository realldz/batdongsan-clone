import { ChevronLeft, ChevronRight } from "lucide-react";

export interface AdminPaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export function AdminPagination({
  page,
  totalPages,
  onChange,
}: AdminPaginationProps) {
  if (totalPages <= 1) return null;

  const windows: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) windows.push(i);
  } else {
    const start = Math.max(1, Math.min(page - 3, totalPages - 6));
    const end = Math.min(start + 6, totalPages);

    if (start > 1) {
      windows.push(1);
      if (start > 2) windows.push("...");
    }
    for (let i = start; i <= end; i++) windows.push(i);
    if (end < totalPages) {
      if (end < totalPages - 1) windows.push("...");
      windows.push(totalPages);
    }
  }

  return (
    <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4">
      <div className="text-sm font-medium text-gray-500">
        Trang {page} / {totalPages}
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onChange(Math.max(1, page - 1))}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> Trước
        </button>
        {windows.map((item, idx) =>
          item === "..." ? (
            <span key={`e${idx}`} className="text-sm text-gray-400 px-1">
              ...
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onChange(item)}
              className={`h-8 w-8 rounded-lg text-sm font-extrabold transition-colors cursor-pointer ${
                item === page
                  ? "bg-[#e03c31] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item}
            </button>
          ),
        )}
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onChange(Math.min(totalPages, page + 1))}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
        >
          Sau <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
