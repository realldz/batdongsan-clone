"use client";

import { useState } from "react";
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
  const [showAllProvinces, setShowAllProvinces] = useState(false);
  const [showAllPrices, setShowAllPrices] = useState(false);
  const [showAllAreas, setShowAllAreas] = useState(false);

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
  const certificateTypeParam = searchParams.get("certificateType");
  if (certificateTypeParam) otherParams.certificateType = certificateTypeParam;
  const negotiableParam = searchParams.get("negotiable");
  if (negotiableParam) otherParams.negotiable = negotiableParam;

  const currentCertificate = searchParams.get("certificateType") || "";
  const currentNegotiable = searchParams.get("negotiable") === "true";

  const certificateOptions = [
    { slug: "so-hong", label: "Sổ hồng" },
    { slug: "so-do", label: "Sổ đỏ" },
  ];

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
          {(() => {
            const provinces = provinceOptions.filter((p) => p !== "Tất cả");
            const visible = showAllProvinces ? provinces : provinces.slice(0, 5);
            return visible.map((province) => (
              <li key={province}>
                <Link
                  href={buildUrl(currentProvince === province ? { province: "" } : { province, page: "1" })}
                  className={`hover:text-primary cursor-pointer transition-colors flex justify-between ${currentProvince === province ? "text-primary font-bold" : ""}`}
                >
                  <span>{province}</span>
                </Link>
              </li>
            ));
          })()}
          <li>
            <button
              type="button"
              onClick={() => setShowAllProvinces((v) => !v)}
              className="text-primary hover:underline cursor-pointer font-medium pt-1 flex items-center gap-1"
            >
              {showAllProvinces ? "Thu gọn" : "Xem thêm"}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-3 w-3 transition-transform ${showAllProvinces ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </li>
        </ul>
      </div>

      {/* Box: Lọc theo khoảng giá */}
      <div className="bg-white rounded p-4 border border-gray-100 shadow-sm">
        <h3 className="font-bold text-[#2c2c2c] mb-3 text-[13px] uppercase tracking-wide">Lọc theo khoảng giá</h3>
        <ul className="space-y-3 text-[#2c2c2c]">
          {(showAllPrices ? currentPriceRanges : currentPriceRanges.slice(0, 9)).map((range) => {
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
          {currentPriceRanges.length > 9 && (
            <li>
              <button
                type="button"
                onClick={() => setShowAllPrices((v) => !v)}
                className="text-gray-500 cursor-pointer pt-1 hover:text-primary transition-colors flex gap-1 items-center"
              >
                {showAllPrices ? "Thu gọn" : "Mở rộng"}
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 transition-transform ${showAllPrices ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
            </li>
          )}
        </ul>
      </div>

      {/* Box: Lọc theo diện tích */}
      <div className="bg-white rounded p-4 border border-gray-100 shadow-sm">
        <h3 className="font-bold text-[#2c2c2c] mb-3 text-[13px] uppercase tracking-wide">Lọc theo diện tích</h3>
        <ul className="space-y-3 text-[#2c2c2c]">
          {(showAllAreas ? areaRanges : areaRanges.slice(0, 6)).map((range) => {
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
          {areaRanges.length > 6 && (
            <li>
              <button
                type="button"
                onClick={() => setShowAllAreas((v) => !v)}
                className="text-gray-500 cursor-pointer pt-1 hover:text-primary transition-colors flex gap-1 items-center"
              >
                {showAllAreas ? "Thu gọn" : "Mở rộng"}
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 transition-transform ${showAllAreas ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
            </li>
          )}
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

      {/* Box: Giấy tờ pháp lý */}
      <div className="bg-white rounded p-4 border border-gray-100 shadow-sm">
        <h3 className="font-bold text-[#2c2c2c] mb-3 text-[13px] uppercase tracking-wide">Giấy tờ pháp lý</h3>
        <ul className="space-y-3 text-[#2c2c2c]">
          {certificateOptions.map((option) => {
            const isActive = currentCertificate === option.slug;
            return (
              <li key={option.slug}>
                <Link
                  href={buildUrl(isActive ? { certificateType: "", page: "1" } : { certificateType: option.slug, page: "1" })}
                  className={`hover:text-primary transition-colors block ${isActive ? "text-primary font-bold" : ""}`}
                >
                  {option.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Box: Thương lượng */}
      <div className="bg-white rounded p-4 border border-gray-100 shadow-sm">
        <h3 className="font-bold text-[#2c2c2c] mb-3 text-[13px] uppercase tracking-wide">Thương lượng</h3>
        <ul className="space-y-3 text-[#2c2c2c]">
          <li>
            <Link
              href={buildUrl(currentNegotiable ? { negotiable: "", page: "1" } : { negotiable: "true", page: "1" })}
              className={`hover:text-primary transition-colors block ${currentNegotiable ? "text-primary font-bold" : ""}`}
            >
              Giá thương lượng
            </Link>
          </li>
        </ul>
      </div>

    </div>
  );
};
