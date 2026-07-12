"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { CATEGORIES_BY_SLUG } from "@/config/categories";
import {
  priceRangesSale,
  priceRangesRent,
  areaRanges,
  directionOptions,
  provinceOptions,
  resolvePriceRanges,
  findPriceRangeLabel,
  findAreaRangeLabel,
} from "@/config/search-filters";
import { Icon, Button, Select } from "@/components/atoms";
import { Dropdown, Modal } from "@/components/molecules";
import { SaveSearchButton } from "./SaveSearchButton";

const propertyTypeOptions: { label: string; value: string }[] = [
  { label: "Bán", value: "sale" },
  { label: "Cho thuê", value: "rent" },
];

const statusOptions = [
  { label: "Tất cả", value: "" },
  { label: "Đang hiển thị", value: "active" },
  { label: "Đã bán/Cho thuê", value: "sold" },
  { label: "Đã ẩn", value: "hidden" },
];

export const SearchFilterBar = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [searchText, setSearchText] = useState("");
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

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
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
  };

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

    window.location.href = `/nha-dat?${params.toString()}`;
  };

  const activeFilterCount = [filterDirection !== "Tất cả", filterProvince !== "Tất cả", !!filterStatus].filter(Boolean).length;

  return (
    <>
      <div className="w-full bg-white shadow-sm border-b border-gray-100 py-3 z-40 sticky top-16">
        <div className="max-w-[1240px] mx-auto px-4 lg:px-0">
          <form className="flex gap-2" onSubmit={handleSearch}>
            <div className="flex-1 flex items-center border border-gray-300 rounded overflow-hidden hover:border-gray-400 focus-within:border-primary transition-colors bg-white">
              <div className="pl-3 text-gray-400">
                <Icon name="Search" size={18} />
              </div>
              <input
                type="text"
                placeholder="Nhập tên bất động sản..."
                className="w-full py-2.5 px-3 outline-none text-sm text-[#2c2c2c] placeholder-gray-500"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              size="md"
              className="px-6 text-sm"
            >
              Tìm kiếm
            </Button>
            <Button
              type="button"
              onClick={() => handleSearch()}
              variant="secondary"
              size="md"
              leftIcon={<Icon name="Map" size={16} />}
              className="px-4 text-sm hidden md:flex"
            >
              Xem bản đồ
            </Button>
          </form>

          <div className="flex flex-wrap gap-2 mt-3 text-sm">
            <button
              type="button"
              onClick={() => setFilterOpen(true)}
              className="border border-gray-300 rounded px-3 py-1.5 flex items-center gap-1.5 hover:bg-gray-50 transition-colors bg-white text-[#2c2c2c] cursor-pointer"
            >
              <Icon name="Filter" size={14} />
              Lọc
              {activeFilterCount > 0 ? (
                <span className="bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              ) : null}
            </button>

            <Dropdown
              trigger={
                <button
                  type="button"
                  className="border border-gray-300 rounded px-3 py-1.5 flex items-center gap-1.5 hover:bg-gray-50 transition-colors bg-white text-[#2c2c2c]"
                >
                  {propertyType}
                  <Icon name="ChevronDown" size={12} className="text-gray-500" />
                </button>
              }
              align="left"
              panelClassName="w-40 py-1"
            >
              {propertyTypeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    handlePropertyTypeChange(option.label);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer ${
                    option.label === propertyType ? "bg-red-50 text-primary font-medium" : "text-[#2c2c2c]"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </Dropdown>

            <Dropdown
              trigger={
                <button
                  type="button"
                  className="border border-gray-300 rounded px-3 py-1.5 flex items-center gap-1.5 hover:bg-gray-50 transition-colors bg-white text-[#2c2c2c]"
                >
                  {priceLabel}
                  <Icon name="ChevronDown" size={12} className="text-gray-500" />
                </button>
              }
              align="left"
              panelClassName="w-48 py-1 max-h-64 overflow-y-auto"
            >
              {currentPriceRanges.map((range) => (
                <button
                  key={range.label}
                  type="button"
                  onClick={() => {
                    setPriceLabel(range.label);
                    setPriceMin(range.min);
                    setPriceMax(range.max);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer ${
                    range.label === priceLabel ? "bg-red-50 text-primary font-medium" : "text-[#2c2c2c]"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </Dropdown>

            <Dropdown
              trigger={
                <button
                  type="button"
                  className="border border-gray-300 rounded px-3 py-1.5 flex items-center gap-1.5 hover:bg-gray-50 transition-colors bg-white text-[#2c2c2c]"
                >
                  {areaLabel}
                  <Icon name="ChevronDown" size={12} className="text-gray-500" />
                </button>
              }
              align="left"
              panelClassName="w-48 py-1 max-h-64 overflow-y-auto"
            >
              {areaRanges.map((range) => (
                <button
                  key={range.label}
                  type="button"
                  onClick={() => {
                    setAreaLabel(range.label);
                    setAreaMin(range.min);
                    setAreaMax(range.max);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer ${
                    range.label === areaLabel ? "bg-red-50 text-primary font-medium" : "text-[#2c2c2c]"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </Dropdown>

            <SaveSearchButton />
          </div>
        </div>
      </div>

      <Modal
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        size="md"
        title="Bộ lọc tìm kiếm"
      >
        <div className="space-y-4 text-left">
          <div>
            <Select
              label="Tỉnh/Thành phố"
              options={provinceOptions}
              value={filterProvince}
              onChange={(e) => setFilterProvince(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <Select
              label="Hướng nhà"
              options={directionOptions}
              value={filterDirection}
              onChange={(e) => setFilterDirection(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <Select
              label="Trạng thái tin"
              options={statusOptions}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-100">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setFilterDirection("Tất cả");
              setFilterProvince("Tất cả");
              setFilterStatus("");
              setFilterOpen(false);
            }}
            className="flex-1 rounded-xl"
          >
            Đặt lại
          </Button>
          <Button
            type="button"
            onClick={() => {
              setFilterOpen(false);
              handleSearch();
            }}
            className="flex-1 rounded-xl font-semibold"
          >
            Áp dụng
          </Button>
        </div>
      </Modal>
    </>
  );
};

export { priceRangesSale, priceRangesRent, areaRanges, directionOptions, provinceOptions };
