import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useCreateListing } from "../CreateListingContext";

const propertyTypeOptions = [
  "Căn hộ chung cư",
  "Nhà riêng",
  "Nhà mặt phố",
  "Biệt thự",
  "Nhà trọ, phòng trọ",
  "Văn phòng",
  "Cửa hàng, ki-ốt",
  "Đất nền",
  "Kho, nhà xưởng",
];
const priceUnitOptions = ["VND", "Thỏa thuận"];

export function MainInfoSection() {
  const {
    propertyType,
    setPropertyType,
    area,
    setArea,
    price,
    setPrice,
    priceUnit,
    setPriceUnit,
    priceSummary,
    expanded,
    toggleSection,
    errors,
    setErrors,
  } = useCreateListing();

  const hasMainErrors = Boolean(errors.area || errors.price);

  return (
    <div className={`bg-white rounded-lg border mb-6 shadow-sm overflow-hidden font-sans ${hasMainErrors ? "border-red-500" : "border-gray-200"}`}>
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => toggleSection("main")}
      >
        <h2 className="font-bold text-[14px] flex items-center gap-1.5">
          Thông tin chính <span className="text-primary">*</span>
          {hasMainErrors && <span className="text-red-500 text-xs font-normal">(Có lỗi nhập liệu)</span>}
        </h2>
        {expanded.main ? (
          <ChevronUp size={20} className="text-[#2c2c2c]" />
        ) : (
          <ChevronDown size={20} className="text-[#2c2c2c]" />
        )}
      </div>

      {expanded.main ? (
        <div className="px-4 pb-6 pt-0 space-y-4">
          <div>
            <label className="block text-[13px] font-bold mb-2">
              Loại bất động sản <span className="text-primary">*</span>
            </label>
            <div className="relative">
              <select
                value={propertyType}
                onChange={(event) => setPropertyType(event.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2.5 appearance-none outline-none focus:border-[#2c2c2c] text-[14px] bg-white font-medium text-gray-800"
              >
                {propertyTypeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-bold mb-2">
              Diện tích <span className="text-primary">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={area}
                onChange={(event) => {
                  setArea(event.target.value);
                  setErrors((prev) => ({ ...prev, area: "" }));
                }}
                className={`w-full border rounded-md pl-3 pr-10 py-2.5 outline-none focus:border-[#2c2c2c] text-[14px] font-medium ${errors.area ? "border-red-500 focus:border-red-500" : "border-gray-300"}`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[14px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded text-xs font-semibold">
                m²
              </span>
            </div>
            {errors.area && (
              <p className="text-red-500 text-[12px] mt-1.5 font-medium">{errors.area}</p>
            )}
          </div>

          <div className="flex gap-4">
            <div className="flex-[2]">
              <label className="block text-[13px] font-bold mb-2">
                Mức giá <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                value={priceUnit === "Thỏa thuận" ? "0" : price}
                disabled={priceUnit === "Thỏa thuận"}
                onChange={(event) => {
                  setPrice(event.target.value);
                  setErrors((prev) => ({ ...prev, price: "" }));
                }}
                className={`w-full border rounded-md px-3 py-2.5 outline-none focus:border-[#2c2c2c] text-[14px] font-medium ${errors.price ? "border-red-500 focus:border-red-500" : "border-gray-300"} ${priceUnit === "Thỏa thuận" ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}`}
              />
              {errors.price && (
                <p className="text-red-500 text-[12px] mt-1.5 font-medium">{errors.price}</p>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-[13px] font-bold mb-2">Đơn vị</label>
              <div className="relative">
                <select
                  value={priceUnit}
                  onChange={(event) => {
                    setPriceUnit(event.target.value);
                    if (event.target.value === "Thỏa thuận") {
                      setErrors((prev) => ({ ...prev, price: "" }));
                    }
                  }}
                  className="w-full border border-gray-300 rounded-md px-3 py-2.5 appearance-none outline-none focus:border-[#2c2c2c] text-[14px] bg-white font-medium text-gray-800"
                >
                  {priceUnitOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                />
              </div>
            </div>
          </div>

          <div className="text-[13px] text-gray-500 mt-1 font-medium">
            Tổng trị giá <span className="font-bold text-[#2c2c2c]">{priceSummary}</span>
          </div>
        </div>
      ) : (
        <div className="px-4 pb-4 pt-0 text-[14px] text-[#2c2c2c] font-medium">
          {propertyType} • {priceSummary} • {area} m²
        </div>
      )}
    </div>
  );
}
