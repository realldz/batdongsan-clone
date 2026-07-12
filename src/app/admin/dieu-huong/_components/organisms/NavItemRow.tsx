import { ChevronUp, ChevronDown, Edit, Trash2, Eye, EyeOff, CornerDownRight, SlidersHorizontal } from "lucide-react";
import type { AdminNavItem } from "@/services/navigation";
import { summarizeFilters } from "@/config/search-filters";

interface NavRowProps {
  item: AdminNavItem;
  isChild: boolean;
  isFirst: boolean;
  isLast: boolean;
  onEdit: (item: AdminNavItem) => void;
  onDelete: (item: AdminNavItem) => void;
  onToggle: (item: AdminNavItem) => void;
  onMove: (item: AdminNavItem, dir: -1 | 1) => void;
}

export function NavItemRow({
  item,
  isChild,
  isFirst,
  isLast,
  onEdit,
  onDelete,
  onToggle,
  onMove,
}: NavRowProps) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3">
        <div className={`flex items-center gap-2 ${isChild ? "pl-6" : ""}`}>
          {isChild && <CornerDownRight className="w-3.5 h-3.5 text-gray-300 shrink-0" />}
          <div className="min-w-0">
            <div
              className={`text-[13px] truncate flex items-center gap-1.5 ${
                isChild ? "font-semibold text-gray-700" : "font-extrabold text-gray-900"
              }`}
            >
              {item.label}
              {item.searchFilters && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-bold shrink-0">
                  <SlidersHorizontal className="w-2.5 h-2.5" />
                  Bộ lọc
                </span>
              )}
            </div>
            <div className="text-[11px] text-gray-400 truncate">
              {item.searchFilters ? summarizeFilters(item.searchFilters) : item.href}
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <button
          onClick={() => onToggle(item)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold w-fit transition-colors ${
            item.isActive
              ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
              : "bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200"
          }`}
          title={item.isActive ? "Đang hiển thị — bấm để ẩn" : "Đang ẩn — bấm để hiện"}
        >
          {item.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          {item.isActive ? "Hiển thị" : "Đang ẩn"}
        </button>
      </td>
      <td className="px-4 py-3">
        {item.openInNewTab ? (
          <span className="text-[11px] font-bold text-blue-600">Tab mới</span>
        ) : (
          <span className="text-[11px] text-gray-300">—</span>
        )}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => onMove(item, -1)}
            disabled={isFirst}
            className="p-1.5 text-gray-500 hover:bg-gray-100 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Di chuyển lên"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            onClick={() => onMove(item, 1)}
            disabled={isLast}
            className="p-1.5 text-gray-500 hover:bg-gray-100 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Di chuyển xuống"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(item)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Sửa"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(item)}
            className="p-1.5 text-[#e03c31] hover:bg-red-50 rounded transition-colors"
            title="Xóa"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
