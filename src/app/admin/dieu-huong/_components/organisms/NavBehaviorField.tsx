import type { NavSearchFilters } from "@/config/search-filters";
import { NavFilterBuilder } from "./NavFilterBuilder";

export type NavBehaviorMode = "link" | "filter";

interface NavBehaviorFieldProps {
  mode: NavBehaviorMode;
  href: string;
  searchFilters: NavSearchFilters;
  onModeChange: (mode: NavBehaviorMode) => void;
  onHrefChange: (href: string) => void;
  onFiltersChange: (filters: NavSearchFilters) => void;
}

const toggleBase =
  "flex-1 px-3 py-2 rounded-lg text-[13px] font-bold transition-colors cursor-pointer border";
const toggleActive = "bg-[#e03c31] text-white border-[#e03c31]";
const toggleInactive = "bg-white text-gray-600 border-gray-200 hover:bg-gray-50";

export function NavBehaviorField({
  mode,
  href,
  searchFilters,
  onModeChange,
  onHrefChange,
  onFiltersChange,
}: NavBehaviorFieldProps) {
  return (
    <div className="space-y-2.5">
      <label className="block text-[13px] font-bold text-gray-700">Hành vi khi bấm</label>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onModeChange("link")}
          className={`${toggleBase} ${mode === "link" ? toggleActive : toggleInactive}`}
        >
          Mở đường dẫn
        </button>
        <button
          type="button"
          onClick={() => onModeChange("filter")}
          className={`${toggleBase} ${mode === "filter" ? toggleActive : toggleInactive}`}
        >
          Áp dụng bộ lọc tìm kiếm
        </button>
      </div>

      {mode === "link" ? (
        <input
          value={href}
          onChange={(e) => onHrefChange(e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-[13px] font-bold text-gray-900 outline-none focus:border-[#e03c31] focus:bg-white"
          placeholder="VD: /ban-can-ho-chung-cu hoặc # nếu chỉ mở menu con"
        />
      ) : (
        <NavFilterBuilder value={searchFilters} onChange={onFiltersChange} />
      )}
    </div>
  );
}
