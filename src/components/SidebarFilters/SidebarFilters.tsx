"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { priceRangesSale, priceRangesRent, areaRanges, provinceOptions } from "@/components/SearchFilterBar/SearchFilterBar";

function buildQueryString(params: Record<string, string>): string {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });
  return query.toString();
}

export const SidebarFilters = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentProvince = searchParams.get("province") || "";
  const currentMinPrice = searchParams.get("minPrice") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";
  const currentMinArea = searchParams.get("minArea") || "";
  const currentMaxArea = searchParams.get("maxArea") || "";
  const propertyType = searchParams.get("type");

  const currentPriceRanges = propertyType === "rent" ? priceRangesRent : priceRangesSale;

  const otherParams: Record<string, string> = {};
  const type = searchParams.get("type");
  if (type) otherParams.type = type;
  const title = searchParams.get("title");
  if (title) otherParams.title = title;
  const direction = searchParams.get("direction");
  if (direction) otherParams.direction = direction;
  const status = searchParams.get("status");
  if (status) otherParams.status = status;

  const buildUrl = (extra: Record<string, string>) => {
    const all = { ...otherParams, ...extra };
    return `${pathname}?${buildQueryString(all)}`;
  };

  return (
    <div className="space-y-6 text-sm">
      {/* Box: Mua bán nhà đất */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h3 className="font-bold text-[#2c2c2c] mb-3 text-base">Mua bán nhà đất</h3>
        <ul className="space-y-3 text-sm text-gray-600">
          {provinceOptions.filter((p) => p !== "Tất cả").slice(0, 5).map((province) => (
            <li key={province}>
              <Link
                href={buildUrl(currentProvince === province ? { province: "" } : { province, page: "1" })}
                className={`hover:text-primary cursor-pointer transition-colors flex justify-between ${currentProvince === province ? "text-primary font-bold" : ""}`}
              >
                <span>{province}</span>
              </Link>
            </li>
          ))}
          <li className="text-primary hover:underline cursor-pointer font-medium pt-1">Xem thêm v</li>
        </ul>
      </div>

      {/* Box: Lọc theo khoảng giá */}
      <div className="bg-white rounded p-4 border border-gray-100 shadow-sm">
        <h3 className="font-bold text-[#2c2c2c] mb-3 text-[13px] uppercase tracking-wide">Lọc theo khoảng giá</h3>
        <ul className="space-y-3 text-[#2c2c2c]">
          {currentPriceRanges.slice(0, 9).map((range) => {
            const params: Record<string, string> = { page: "1" };
            if (range.min !== undefined) params.minPrice = String(range.min);
            if (range.max !== undefined) params.maxPrice = String(range.max);
            const isActive = currentMinPrice === params.minPrice && currentMaxPrice === (params.maxPrice || "");

            return (
              <li key={range.label}>
                <Link
                  href={buildUrl(params)}
                  className={`hover:text-primary transition-colors block ${isActive ? "text-primary font-bold" : ""}`}
                >
                  {range.label}
                </Link>
              </li>
            );
          })}
          <li className="text-gray-500 cursor-pointer pt-1 hover:text-primary transition-colors flex gap-1 items-center">
            Mở rộng 
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </li>
        </ul>
      </div>

      {/* Box: Lọc theo diện tích */}
      <div className="bg-white rounded p-4 border border-gray-100 shadow-sm">
        <h3 className="font-bold text-[#2c2c2c] mb-3 text-[13px] uppercase tracking-wide">Lọc theo diện tích</h3>
        <ul className="space-y-3 text-[#2c2c2c]">
          {areaRanges.slice(0, 6).map((range) => {
            const params: Record<string, string> = { page: "1" };
            if (range.min !== undefined) params.minArea = String(range.min);
            if (range.max !== undefined) params.maxArea = String(range.max);
            const isActive = currentMinArea === params.minArea && currentMaxArea === (params.maxArea || "");

            return (
              <li key={range.label}>
                <Link
                  href={buildUrl(params)}
                  className={`hover:text-primary transition-colors block ${isActive ? "text-primary font-bold" : ""}`}
                >
                  {range.label}
                </Link>
              </li>
            );
          })}
          <li className="text-gray-500 cursor-pointer pt-1 hover:text-primary transition-colors flex gap-1 items-center">
            Mở rộng 
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </li>
        </ul>
      </div>

      {/* Box: Lọc theo số phòng ngủ */}
      <div className="bg-white rounded p-4 border border-gray-100 shadow-sm">
        <h3 className="font-bold text-[#2c2c2c] mb-3 text-[13px] uppercase tracking-wide">Lọc theo số phòng ngủ</h3>
        <ul className="space-y-3 text-[#2c2c2c]">
          <li className="hover:text-primary cursor-pointer transition-colors">1 phòng ngủ</li>
          <li className="hover:text-primary cursor-pointer transition-colors">2 phòng ngủ</li>
          <li className="hover:text-primary cursor-pointer transition-colors">3 phòng ngủ</li>
          <li className="hover:text-primary cursor-pointer transition-colors">4 phòng ngủ</li>
          <li className="hover:text-primary cursor-pointer transition-colors">5+ phòng ngủ</li>
        </ul>
      </div>

    </div>
  );
};
