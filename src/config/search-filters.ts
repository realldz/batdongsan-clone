/**
 * Single source of truth for the search-filter dropdown presets used by both the
 * public SearchFilterBar and the admin navigation filter builder. Keeping the
 * ranges here (instead of inline in SearchFilterBar) lets the admin pick the exact
 * same min/max preset values, so a saved nav filter renders with its dropdown label
 * pre-selected when the resulting URL loads.
 */

export interface NavSearchFilters {
  type?: "sale" | "rent";
  title?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  direction?: string;
  province?: string;
}

export interface Range {
  label: string;
  min: number | undefined;
  max: number | undefined;
}

export const priceRangesSale: Range[] = [
  { label: "Tất cả", min: undefined, max: undefined },
  { label: "Dưới 500 triệu", min: undefined, max: 500_000_000 },
  { label: "500 - 800 triệu", min: 500_000_000, max: 800_000_000 },
  { label: "800 triệu - 1 tỷ", min: 800_000_000, max: 1_000_000_000 },
  { label: "1 - 2 tỷ", min: 1_000_000_000, max: 2_000_000_000 },
  { label: "2 - 3 tỷ", min: 2_000_000_000, max: 3_000_000_000 },
  { label: "3 - 5 tỷ", min: 3_000_000_000, max: 5_000_000_000 },
  { label: "5 - 7 tỷ", min: 5_000_000_000, max: 7_000_000_000 },
  { label: "7 - 10 tỷ", min: 7_000_000_000, max: 10_000_000_000 },
  { label: "10 - 15 tỷ", min: 10_000_000_000, max: 15_000_000_000 },
  { label: "15 - 20 tỷ", min: 15_000_000_000, max: 20_000_000_000 },
  { label: "20 - 30 tỷ", min: 20_000_000_000, max: 30_000_000_000 },
  { label: "Trên 30 tỷ", min: 30_000_000_000, max: undefined },
];

export const priceRangesRent: Range[] = [
  { label: "Tất cả", min: undefined, max: undefined },
  { label: "Dưới 3 triệu/tháng", min: undefined, max: 3_000_000 },
  { label: "3 - 5 triệu/tháng", min: 3_000_000, max: 5_000_000 },
  { label: "5 - 10 triệu/tháng", min: 5_000_000, max: 10_000_000 },
  { label: "10 - 15 triệu/tháng", min: 10_000_000, max: 15_000_000 },
  { label: "15 - 20 triệu/tháng", min: 15_000_000, max: 20_000_000 },
  { label: "20 - 30 triệu/tháng", min: 20_000_000, max: 30_000_000 },
  { label: "30 - 50 triệu/tháng", min: 30_000_000, max: 50_000_000 },
  { label: "50 - 100 triệu/tháng", min: 50_000_000, max: 100_000_000 },
  { label: "Trên 100 triệu/tháng", min: 100_000_000, max: undefined },
];

export const areaRanges: Range[] = [
  { label: "Tất cả", min: undefined, max: undefined },
  { label: "Dưới 30 m²", min: undefined, max: 30 },
  { label: "30 - 50 m²", min: 30, max: 50 },
  { label: "50 - 80 m²", min: 50, max: 80 },
  { label: "80 - 100 m²", min: 80, max: 100 },
  { label: "100 - 150 m²", min: 100, max: 150 },
  { label: "150 - 200 m²", min: 150, max: 200 },
  { label: "200 - 300 m²", min: 200, max: 300 },
  { label: "300 - 500 m²", min: 300, max: 500 },
  { label: "Trên 500 m²", min: 500, max: undefined },
];

export const directionOptions = [
  "Tất cả",
  "Đông",
  "Tây",
  "Nam",
  "Bắc",
  "Đông Bắc",
  "Đông Nam",
  "Tây Bắc",
  "Tây Nam",
];

export const provinceOptions = [
  "Tất cả",
  "Hà Nội",
  "TP.HCM",
  "Đà Nẵng",
  "Hải Phòng",
  "Cần Thơ",
  "An Giang",
  "Bà Rịa - Vũng Tàu",
  "Bắc Giang",
  "Bắc Kạn",
  "Bạc Liêu",
  "Bắc Ninh",
  "Bến Tre",
  "Bình Định",
  "Bình Dương",
  "Bình Phước",
  "Bình Thuận",
  "Cà Mau",
  "Cao Bằng",
  "Đắk Lắk",
  "Đắk Nông",
  "Điện Biên",
  "Đồng Nai",
  "Đồng Tháp",
  "Gia Lai",
  "Hà Giang",
  "Hà Nam",
  "Hà Tĩnh",
  "Hải Dương",
  "Hậu Giang",
  "Hòa Bình",
  "Hưng Yên",
  "Khánh Hòa",
  "Kiên Giang",
  "Kon Tum",
  "Lai Châu",
  "Lâm Đồng",
  "Lạng Sơn",
  "Lào Cai",
  "Long An",
  "Nam Định",
  "Nghệ An",
  "Ninh Bình",
  "Ninh Thuận",
  "Phú Thọ",
  "Phú Yên",
  "Quảng Bình",
  "Quảng Nam",
  "Quảng Ngãi",
  "Quảng Ninh",
  "Quảng Trị",
  "Sóc Trăng",
  "Sơn La",
  "Tây Ninh",
  "Thái Bình",
  "Thái Nguyên",
  "Thanh Hóa",
  "Thừa Thiên Huế",
  "Tiền Giang",
  "Trà Vinh",
  "Tuyên Quang",
  "Vĩnh Long",
  "Vĩnh Phúc",
  "Yên Bái",
];

export function resolvePriceRanges(typeLabel: string): Range[] {
  return typeLabel === "Cho thuê" ? priceRangesRent : priceRangesSale;
}

export function findPriceRangeLabel(
  min: string | undefined,
  max: string | undefined,
  ranges: Range[],
): string {
  if (min === undefined && max === undefined) return "Khoảng giá";
  const nMin = min !== undefined ? Number(min) : undefined;
  const nMax = max !== undefined ? Number(max) : undefined;
  const match = ranges.find((r) => r.min === nMin && r.max === nMax);
  return match?.label ?? "Khoảng giá";
}

export function findAreaRangeLabel(min: string | undefined, max: string | undefined): string {
  if (min === undefined && max === undefined) return "Diện tích";
  const nMin = min !== undefined ? Number(min) : undefined;
  const nMax = max !== undefined ? Number(max) : undefined;
  const match = areaRanges.find((r) => r.min === nMin && r.max === nMax);
  return match?.label ?? "Diện tích";
}

/** Build the /nha-dat href a filter preset navigates to (mirrors backend resolveHref). */
export function buildSearchHref(f: NavSearchFilters): string {
  const params = new URLSearchParams();
  if (f.type) params.set("type", f.type);
  if (f.title) params.set("title", f.title);
  if (f.minPrice !== undefined) params.set("minPrice", String(f.minPrice));
  if (f.maxPrice !== undefined) params.set("maxPrice", String(f.maxPrice));
  if (f.minArea !== undefined) params.set("minArea", String(f.minArea));
  if (f.maxArea !== undefined) params.set("maxArea", String(f.maxArea));
  if (f.direction) params.set("direction", f.direction);
  if (f.province) params.set("province", f.province);
  const qs = params.toString();
  return qs ? `/nha-dat?${qs}` : "/nha-dat";
}

/** Human-readable one-line summary of a filter preset for admin table + preview. */
export function summarizeFilters(f: NavSearchFilters): string {
  const parts: string[] = [];
  if (f.type) parts.push(f.type === "rent" ? "Cho thuê" : "Bán");
  if (f.title) parts.push(`"${f.title}"`);
  const priceRanges = resolvePriceRanges(f.type === "rent" ? "Cho thuê" : "Bán");
  const priceLabel = findPriceRangeLabel(
    f.minPrice !== undefined ? String(f.minPrice) : undefined,
    f.maxPrice !== undefined ? String(f.maxPrice) : undefined,
    priceRanges,
  );
  if (priceLabel !== "Khoảng giá") parts.push(priceLabel);
  const areaLabel = findAreaRangeLabel(
    f.minArea !== undefined ? String(f.minArea) : undefined,
    f.maxArea !== undefined ? String(f.maxArea) : undefined,
  );
  if (areaLabel !== "Diện tích") parts.push(areaLabel);
  if (f.direction) parts.push(f.direction);
  if (f.province) parts.push(f.province);
  return parts.length > 0 ? parts.join(" · ") : "Tất cả bất động sản";
}
