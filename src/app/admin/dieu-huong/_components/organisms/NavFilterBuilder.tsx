import { useMemo } from "react";
import {
  type NavSearchFilters,
  type Range,
  priceRangesSale,
  priceRangesRent,
  areaRanges,
  directionOptions,
  provinceOptions,
  buildSearchHref,
  summarizeFilters,
} from "@/config/search-filters";

interface NavFilterBuilderProps {
  value: NavSearchFilters;
  onChange: (next: NavSearchFilters) => void;
}

const selectClass =
  "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-[13px] font-bold text-gray-900 outline-none focus:border-[#e03c31] focus:bg-white";

// Encode a range as "min|max" so a single <select> value round-trips both bounds.
function rangeKey(min: number | undefined, max: number | undefined): string {
  return `${min ?? ""}|${max ?? ""}`;
}

function matchRange(min: number | undefined, max: number | undefined, ranges: Range[]): string {
  const found = ranges.find((r) => r.min === min && r.max === max);
  return found ? rangeKey(found.min, found.max) : "";
}

export function NavFilterBuilder({ value, onChange }: NavFilterBuilderProps) {
  const typeLabel = value.type === "rent" ? "Cho thuê" : "Bán";
  const priceRanges = value.type === "rent" ? priceRangesRent : priceRangesSale;

  const priceValue = useMemo(
    () => matchRange(value.minPrice, value.maxPrice, priceRanges),
    [value.minPrice, value.maxPrice, priceRanges],
  );
  const areaValue = useMemo(
    () => matchRange(value.minArea, value.maxArea, areaRanges),
    [value.minArea, value.maxArea],
  );

  const set = (patch: Partial<NavSearchFilters>) => onChange({ ...value, ...patch });

  const handlePrice = (key: string) => {
    const r = priceRanges.find((x) => rangeKey(x.min, x.max) === key);
    set({ minPrice: r?.min, maxPrice: r?.max });
  };
  const handleArea = (key: string) => {
    const r = areaRanges.find((x) => rangeKey(x.min, x.max) === key);
    set({ minArea: r?.min, maxArea: r?.max });
  };

  const preview = summarizeFilters(value);
  const href = buildSearchHref(value);

  return (
    <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50/60 p-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="block text-[12px] font-bold text-gray-600">Loại</label>
          <select
            value={value.type ?? ""}
            onChange={(e) => {
              const t = e.target.value === "rent" ? "rent" : e.target.value === "sale" ? "sale" : undefined;
              // Switching type invalidates the price preset (sale/rent ranges differ).
              set({ type: t, minPrice: undefined, maxPrice: undefined });
            }}
            className={selectClass}
          >
            <option value="">Không đặt</option>
            <option value="sale">Bán</option>
            <option value="rent">Cho thuê</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[12px] font-bold text-gray-600">Từ khóa</label>
          <input
            value={value.title ?? ""}
            onChange={(e) => set({ title: e.target.value || undefined })}
            className={selectClass}
            placeholder="VD: chung cư"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-[12px] font-bold text-gray-600">Khoảng giá ({typeLabel})</label>
          <select value={priceValue} onChange={(e) => handlePrice(e.target.value)} className={selectClass}>
            <option value="">Không đặt</option>
            {priceRanges
              .filter((r) => r.min !== undefined || r.max !== undefined)
              .map((r) => (
                <option key={r.label} value={rangeKey(r.min, r.max)}>
                  {r.label}
                </option>
              ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[12px] font-bold text-gray-600">Diện tích</label>
          <select value={areaValue} onChange={(e) => handleArea(e.target.value)} className={selectClass}>
            <option value="">Không đặt</option>
            {areaRanges
              .filter((r) => r.min !== undefined || r.max !== undefined)
              .map((r) => (
                <option key={r.label} value={rangeKey(r.min, r.max)}>
                  {r.label}
                </option>
              ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[12px] font-bold text-gray-600">Hướng</label>
          <select
            value={value.direction ?? "Tất cả"}
            onChange={(e) => set({ direction: e.target.value === "Tất cả" ? undefined : e.target.value })}
            className={selectClass}
          >
            {directionOptions.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[12px] font-bold text-gray-600">Tỉnh/Thành</label>
          <select
            value={value.province ?? "Tất cả"}
            onChange={(e) => set({ province: e.target.value === "Tất cả" ? undefined : e.target.value })}
            className={selectClass}
          >
            {provinceOptions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-lg bg-white border border-gray-200 px-3 py-2.5 space-y-1">
        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Xem trước</div>
        <div className="text-[13px] font-bold text-gray-800">{preview}</div>
        <div className="text-[11px] text-gray-400 break-all font-mono">{href}</div>
      </div>
    </div>
  );
}
