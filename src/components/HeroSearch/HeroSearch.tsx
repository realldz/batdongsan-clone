"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

type SearchTab = "ban" | "thue";

interface PriceRange {
  label: string;
  min: number | undefined;
  max: number | undefined;
}

const salePriceRanges: PriceRange[] = [
  { label: "Dưới 500 triệu", min: undefined, max: 500_000_000 },
  { label: "500 triệu - 1 tỷ", min: 500_000_000, max: 1_000_000_000 },
  { label: "1 - 3 tỷ", min: 1_000_000_000, max: 3_000_000_000 },
  { label: "3 - 5 tỷ", min: 3_000_000_000, max: 5_000_000_000 },
  { label: "5 - 10 tỷ", min: 5_000_000_000, max: 10_000_000_000 },
  { label: "10 - 20 tỷ", min: 10_000_000_000, max: 20_000_000_000 },
  { label: "Trên 20 tỷ", min: 20_000_000_000, max: undefined },
  { label: "Thỏa thuận", min: undefined, max: undefined },
];

const rentPriceRanges: PriceRange[] = [
  { label: "Dưới 3 triệu/tháng", min: undefined, max: 3_000_000 },
  { label: "3 - 5 triệu/tháng", min: 3_000_000, max: 5_000_000 },
  { label: "5 - 10 triệu/tháng", min: 5_000_000, max: 10_000_000 },
  { label: "10 - 15 triệu/tháng", min: 10_000_000, max: 15_000_000 },
  { label: "15 - 20 triệu/tháng", min: 15_000_000, max: 20_000_000 },
  { label: "20 - 30 triệu/tháng", min: 20_000_000, max: 30_000_000 },
  { label: "30 - 50 triệu/tháng", min: 30_000_000, max: 50_000_000 },
  { label: "50 - 100 triệu/tháng", min: 50_000_000, max: 100_000_000 },
  { label: "Trên 100 triệu/tháng", min: 100_000_000, max: undefined },
  { label: "Thỏa thuận", min: undefined, max: undefined },
];

const areaRanges: PriceRange[] = [
  { label: "Dưới 30 m²", min: undefined, max: 30 },
  { label: "30 - 50 m²", min: 30, max: 50 },
  { label: "50 - 80 m²", min: 50, max: 80 },
  { label: "80 - 100 m²", min: 80, max: 100 },
  { label: "100 - 200 m²", min: 100, max: 200 },
  { label: "200 - 500 m²", min: 200, max: 500 },
  { label: "Trên 500 m²", min: 500, max: undefined },
];

const filterOptions: Record<string, string[]> = {
  "Loại nhà đất": [
    "Căn hộ chung cư",
    "Nhà riêng",
    "Nhà mặt phố",
    "Biệt thự, liền kề",
    "Đất nền dự án",
    "Đất",
    "Trang trại, khu nghỉ dưỡng",
    "Kho, nhà xưởng",
    "Văn phòng",
    "Cửa hàng, mặt bằng",
  ],
  "Khu vực": [
    "Hà Nội",
    "TP. Hồ Chí Minh",
    "Đà Nẵng",
    "Hải Phòng",
    "Cần Thơ",
    "Bình Dương",
    "Đồng Nai",
    "Bà Rịa - Vũng Tàu",
    "Khánh Hòa",
    "Quảng Ninh",
  ],
  "Mức giá": [],
  "Diện tích": [],
  "Tin đăng": [
    "Tin mới nhất",
    "Tin thường",
    "Tin VIP",
    "Tin nổi bật",
    "Tin đã xác thực",
    "Có video",
  ],
};

function resolvePriceRanges(tab: SearchTab): PriceRange[] {
  return tab === "thue" ? rentPriceRanges : salePriceRanges;
}

export const HeroSearch = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SearchTab>("ban");
  const [searchText, setSearchText] = useState("");
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setOpenFilter(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (searchText.trim()) params.set("title", searchText.trim());
    if (activeTab === "thue") params.set("type", "rent");

    const khuVuc = selectedFilters["Khu vực"];
    if (khuVuc) params.set("province", khuVuc);

    const mucGia = selectedFilters["Mức giá"];
    if (mucGia) {
      const ranges = resolvePriceRanges(activeTab);
      const found = ranges.find((r) => r.label === mucGia);
      if (found && (found.min !== undefined || found.max !== undefined)) {
        if (found.min !== undefined) params.set("minPrice", String(found.min));
        if (found.max !== undefined) params.set("maxPrice", String(found.max));
      }
    }

    const dienTich = selectedFilters["Diện tích"];
    if (dienTich) {
      const found = areaRanges.find((r) => r.label === dienTich);
      if (found && (found.min !== undefined || found.max !== undefined)) {
        if (found.min !== undefined) params.set("minArea", String(found.min));
        if (found.max !== undefined) params.set("maxArea", String(found.max));
      }
    }

    window.location.href = `/nha-dat?${params.toString()}`;
  };

  const toggleFilter = (name: string) => {
    setOpenFilter(openFilter === name ? null : name);
  };

  const selectFilterOption = (filterName: string, option: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterName]: option,
    }));
    setOpenFilter(null);
  };

  const currentPriceRanges = resolvePriceRanges(activeTab);
  const priceAreaOptions: Record<string, string[]> = {
    "Mức giá": currentPriceRanges.map((r) => r.label),
    "Diện tích": areaRanges.map((r) => r.label),
  };

  const filterNames = ["Loại nhà đất", "Khu vực", "Mức giá", "Diện tích", "Tin đăng"];

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setSelectedFilters((prev) => {
      const next = { ...prev };
      delete next["Mức giá"];
      return next;
    });
  }, [activeTab]);

  return (
    <div className="relative w-full h-[500px] flex items-center justify-center -mt-16">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=2075&ixlib=rb-4.0.3")',
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="relative z-10 w-full max-w-[1000px] px-4">
        <div className="bg-black/50 backdrop-blur-sm p-4 rounded-xl shadow-2xl">
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setActiveTab("ban")}
              className={`px-6 py-2 font-medium rounded text-sm shadow transition-colors ${activeTab === "ban"
                  ? "bg-white text-gray-900"
                  : "bg-transparent text-white hover:bg-white/20"
                }`}
            >
              Nhà đất bán
            </button>
            <button
              onClick={() => setActiveTab("thue")}
              className={`px-6 py-2 font-medium rounded text-sm shadow transition-colors ${activeTab === "thue"
                  ? "bg-white text-gray-900"
                  : "bg-transparent text-white hover:bg-white/20"
                }`}
            >
              Nhà đất cho thuê
            </button>
          </div>

          <div className="bg-white rounded p-4 flex flex-col md:flex-row gap-2 shadow-lg">
            <div className="flex-1 min-w-[300px] flex items-center border border-gray-300 rounded px-3 py-2 bg-white group hover:border-gray-400 focus-within:border-black transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                placeholder="Trần Duy Hưng"
                className="w-full text-sm outline-none text-gray-800 placeholder-gray-400"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-8 flex-shrink-0 py-2.5 bg-primary hover:bg-primary-hover text-white font-medium rounded flex items-center justify-center gap-2 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Tìm kiếm
            </button>
          </div>

          <div className="hidden md:flex flex-wrap gap-2 mt-2" ref={filterRef}>
            {filterNames.map((filter) => (
              <div key={filter} className="relative">
                <button
                  type="button"
                  onClick={() => toggleFilter(filter)}
                  className={`text-white text-sm hover:bg-white/25 cursor-pointer px-4 py-1.5 rounded flex items-center gap-2 transition-colors backdrop-blur-md ${selectedFilters[filter] ? "bg-white/30" : "bg-white/10"
                    }`}
                >
                  <span>{selectedFilters[filter] || filter}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {openFilter === filter && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-20 max-h-64 overflow-y-auto">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFilters((prev) => {
                          const next = { ...prev };
                          delete next[filter];
                          return next;
                        });
                        setOpenFilter(null);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                    >
                      Tất cả
                    </button>
                    {(priceAreaOptions[filter] || filterOptions[filter]).map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => selectFilterOption(filter, option)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${selectedFilters[filter] === option
                            ? "text-primary font-medium bg-red-50"
                            : "text-gray-700"
                          }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <button
              type="button"
              className="text-white ml-auto text-sm bg-white/10 hover:bg-white/25 cursor-pointer p-1.5 rounded transition-colors backdrop-blur-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
