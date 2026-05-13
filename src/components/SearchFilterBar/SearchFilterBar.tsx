"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { CATEGORIES_BY_SLUG } from "@/config/categories";

type Dropdown = "type" | "price" | "area" | null;

const propertyTypeOptions: { label: string; value: string }[] = [
  { label: "Bán", value: "sale" },
  { label: "Cho thuê", value: "rent" },
];

interface PriceRange {
  label: string;
  min: number | undefined;
  max: number | undefined;
}

const priceRangesSale: PriceRange[] = [
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

const priceRangesRent: PriceRange[] = [
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

const areaRanges = [
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

const directionOptions = [
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

const provinceOptions = [
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

const statusOptions = [
  { label: "Tất cả", value: "" },
  { label: "Đang hiển thị", value: "active" },
  { label: "Đã bán/Cho thuê", value: "sold" },
  { label: "Đã ẩn", value: "hidden" },
];

function resolvePriceRanges(type: string): PriceRange[] {
  return type === "Cho thuê" ? priceRangesRent : priceRangesSale;
}

function findPriceRangeLabel(min: string | undefined, max: string | undefined, ranges: PriceRange[]): string {
  if (min === undefined && max === undefined) return "Khoảng giá";
  const nMin = min !== undefined ? Number(min) : undefined;
  const nMax = max !== undefined ? Number(max) : undefined;
  const match = ranges.find((r) => r.min === nMin && r.max === nMax);
  return match?.label ?? "Khoảng giá";
}

function findAreaRangeLabel(min: string | undefined, max: string | undefined): string {
  if (min === undefined && max === undefined) return "Diện tích";
  const nMin = min !== undefined ? Number(min) : undefined;
  const nMax = max !== undefined ? Number(max) : undefined;
  const match = areaRanges.find((r) => r.min === nMin && r.max === nMax);
  return match?.label ?? "Diện tích";
}

export const SearchFilterBar = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [searchText, setSearchText] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<Dropdown>(null);
  const [propertyType, setPropertyType] = useState("Bán");
  const [priceLabel, setPriceLabel] = useState("Khoảng giá");
  const [priceMin, setPriceMin] = useState<number | undefined>(undefined);
  const [priceMax, setPriceMax] = useState<number | undefined>(undefined);
  const [areaLabel, setAreaLabel] = useState("Diện tích");
  const [areaMin, setAreaMin] = useState<number | undefined>(undefined);
  const [areaMax, setAreaMax] = useState<number | undefined>(undefined);
  const [filterOpen, setFilterOpen] = useState(false);

  const [filterDirection, setFilterDirection] = useState("Tất cả");
  const [filterProvince, setFilterProvince] = useState("Tất cả");
  const [filterStatus, setFilterStatus] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const categorySlug = pathname.replace(/^\//, "");
    const config = CATEGORIES_BY_SLUG[categorySlug];

    const typeParam = searchParams.get("type");
    const typeFromPath = !typeParam ? config?.type ?? (categorySlug.startsWith("ban-") ? "sale" : categorySlug.startsWith("thue-") ? "rent" : undefined) : undefined;
    const resolvedType = typeParam || typeFromPath || "sale";
    const newType = resolvedType === "rent" ? "Cho thuê" : "Bán";
    setPropertyType(newType);

    const title = searchParams.get("title");
    setSearchText(title || config?.defaultFilters?.title || config?.label || "");

    const ranges = resolvePriceRanges(newType);
    const minP = searchParams.get("minPrice") ?? undefined;
    const maxP = searchParams.get("maxPrice") ?? undefined;
    setPriceLabel(findPriceRangeLabel(minP, maxP, ranges));
    setPriceMin(minP !== undefined ? Number(minP) : undefined);
    setPriceMax(maxP !== undefined ? Number(maxP) : undefined);

    const minA = searchParams.get("minArea") ?? undefined;
    const maxA = searchParams.get("maxArea") ?? undefined;
    setAreaLabel(findAreaRangeLabel(minA, maxA));
    setAreaMin(minA !== undefined ? Number(minA) : undefined);
    setAreaMax(maxA !== undefined ? Number(maxA) : undefined);

    const direction = searchParams.get("direction");
    if (direction) setFilterDirection(direction);

    const province = searchParams.get("province");
    if (province) setFilterProvince(province);

    const status = searchParams.get("status");
    if (status) setFilterStatus(status);
  }, [searchParams, pathname]);

  const currentPriceRanges = resolvePriceRanges(propertyType);

  const handlePropertyTypeChange = (label: string) => {
    setPropertyType(label);
    setPriceLabel("Khoảng giá");
    setPriceMin(undefined);
    setPriceMax(undefined);
    closeDropdown();
  };

  const closeDropdown = () => setActiveDropdown(null);

  const toggleDropdown = (name: Dropdown) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  useEffect(() => {
    if (!activeDropdown) return;

    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [activeDropdown]);

  const handleSearch = (e?: FormEvent) => {
    e?.preventDefault();

    const params = new URLSearchParams();

    if (searchText.trim()) params.set("title", searchText.trim());

    const typeValue = propertyTypeOptions.find((o) => o.label === propertyType)?.value;
    if (typeValue) params.set("type", typeValue);

    if (priceMin !== undefined) params.set("minPrice", String(priceMin));
    if (priceMax !== undefined) params.set("maxPrice", String(priceMax));
    if (areaMin !== undefined) params.set("minArea", String(areaMin));
    if (areaMax !== undefined) params.set("maxArea", String(areaMax));

    if (filterDirection !== "Tất cả") params.set("direction", filterDirection);
    if (filterProvince !== "Tất cả") params.set("province", filterProvince);
    if (filterStatus) params.set("status", filterStatus);

    params.set("page", "1");

    window.location.href = `${pathname}?${params.toString()}`;
  };

  const activeFilterCount = [filterDirection !== "Tất cả", filterProvince !== "Tất cả", !!filterStatus].filter(Boolean).length;

  return (
    <>
      <div className="w-full bg-white shadow-sm border-b border-gray-100 py-3 z-40 sticky top-16">
        <div className="max-w-[1240px] mx-auto px-4 lg:px-0">
          <form className="flex gap-2" onSubmit={handleSearch}>
            <div className="flex-1 flex items-center border border-gray-300 rounded overflow-hidden hover:border-gray-400 focus-within:border-primary transition-colors bg-white">
              <div className="pl-3 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Nhập tên bất động sản..."
                className="w-full py-2 px-3 outline-none text-sm text-[#2c2c2c] placeholder-gray-500"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="bg-primary hover:bg-primary-hover text-white font-medium px-6 py-2 rounded transition-colors text-sm flex-shrink-0"
            >
              Tìm kiếm
            </button>
            <button
              type="button"
              onClick={() => handleSearch()}
              className="bg-[#009ba1] hover:bg-[#008187] text-white font-medium px-4 py-2 rounded transition-colors text-sm flex-shrink-0 items-center gap-1.5 hidden md:flex"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Xem bản đồ
            </button>
          </form>

          <div className="flex flex-wrap gap-2 mt-3 text-sm" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setFilterOpen(true)}
              className="border border-gray-300 rounded px-3 py-1.5 flex items-center gap-1.5 hover:bg-gray-50 transition-colors bg-white text-[#2c2c2c]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
              Lọc
              {activeFilterCount > 0 ? (
                <span className="bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              ) : null}
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown("type")}
                className="border border-gray-300 rounded px-3 py-1.5 flex items-center gap-1.5 hover:bg-gray-50 transition-colors bg-white text-[#2c2c2c]"
              >
                {propertyType}
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 text-gray-500 transition-transform ${activeDropdown === "type" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {activeDropdown === "type" ? (
                <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1">
                  {propertyTypeOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => { handlePropertyTypeChange(option.label); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${option.label === propertyType ? "bg-red-50 text-primary font-medium" : "text-[#2c2c2c]"}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown("price")}
                className="border border-gray-300 rounded px-3 py-1.5 flex items-center gap-1.5 hover:bg-gray-50 transition-colors bg-white text-[#2c2c2c]"
              >
                {priceLabel}
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 text-gray-500 transition-transform ${activeDropdown === "price" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {activeDropdown === "price" ? (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 max-h-64 overflow-y-auto">
                  {currentPriceRanges.map((range) => (
                    <button
                      key={range.label}
                      type="button"
                      onClick={() => {
                        setPriceLabel(range.label);
                        setPriceMin(range.min);
                        setPriceMax(range.max);
                        closeDropdown();
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${range.label === priceLabel ? "bg-red-50 text-primary font-medium" : "text-[#2c2c2c]"}`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown("area")}
                className="border border-gray-300 rounded px-3 py-1.5 flex items-center gap-1.5 hover:bg-gray-50 transition-colors bg-white text-[#2c2c2c]"
              >
                {areaLabel}
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 text-gray-500 transition-transform ${activeDropdown === "area" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {activeDropdown === "area" ? (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 max-h-64 overflow-y-auto">
                  {areaRanges.map((range) => (
                    <button
                      key={range.label}
                      type="button"
                      onClick={() => {
                        setAreaLabel(range.label);
                        setAreaMin(range.min);
                        setAreaMax(range.max);
                        closeDropdown();
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${range.label === areaLabel ? "bg-red-50 text-primary font-medium" : "text-[#2c2c2c]"}`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {filterOpen ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/40 px-4 py-6"
          onClick={() => setFilterOpen(false)}
        >
          <div
            className="relative w-full max-w-[480px] rounded-2xl bg-white shadow-[0_24px_80px_rgba(15,23,42,0.28)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-[#2c2c2c]">Bộ lọc tìm kiếm</h2>
              <button
                type="button"
                onClick={() => setFilterOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6 6 18" /></svg>
              </button>
            </div>

            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#2c2c2c] mb-1.5">Tỉnh/Thành phố</label>
                <select
                  value={filterProvince}
                  onChange={(e) => setFilterProvince(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-[#2c2c2c] outline-none focus:border-primary"
                >
                  {provinceOptions.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2c2c2c] mb-1.5">Hướng nhà</label>
                <select
                  value={filterDirection}
                  onChange={(e) => setFilterDirection(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-[#2c2c2c] outline-none focus:border-primary"
                >
                  {directionOptions.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2c2c2c] mb-1.5">Trạng thái tin</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-[#2c2c2c] outline-none focus:border-primary"
                >
                  {statusOptions.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 px-6 py-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setFilterDirection("Tất cả");
                  setFilterProvince("Tất cả");
                  setFilterStatus("");
                  setFilterOpen(false);
                }}
                className="flex-1 rounded-xl border border-gray-300 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Đặt lại
              </button>
              <button
                type="button"
                onClick={() => { setFilterOpen(false); handleSearch(); }}
                className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export { priceRangesSale, priceRangesRent, areaRanges, directionOptions, provinceOptions };
