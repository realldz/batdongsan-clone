import React from "react";
import { ChevronUp, ChevronDown, Plus, Minus } from "lucide-react";
import { useCreateListing } from "../CreateListingContext";

const interiorOptions = ["Đầy đủ", "Cơ bản", "Nội thất cao cấp", "Không nội thất", "Bàn giao thô"];
const directionOptions = [
  "Đông",
  "Tây",
  "Nam",
  "Bắc",
  "Đông Nam",
  "Đông Bắc",
  "Tây Nam",
  "Tây Bắc",
  "Không xác định",
];
const moveInOptions = ["Thoả thuận", "Ở ngay", "Sau 1 tuần", "Sau 15 ngày", "Sau 1 tháng"];
const utilityPriceOptions = ["Theo nhà cung cấp", "Theo giá dân", "Theo giá kinh doanh", "Miễn phí", "Thoả thuận"];
const internetPriceOptions = ["Thoả thuận", "Miễn phí", "200.000 đ/tháng", "300.000 đ/tháng", "Theo nhà cung cấp"];
const certificateOptions = [
  { label: "Đang cập nhật", value: "" },
  { label: "Sổ hồng", value: "so-hong" },
  { label: "Sổ đỏ", value: "so-do" },
  { label: "Hợp đồng mua bán", value: "hd-mua-ban" },
];

export function OtherInfoSection() {
  const {
    interior,
    setInterior,
    certificateType,
    setCertificateType,
    negotiable,
    setNegotiable,
    frontageMeters,
    setFrontageMeters,
    alleyMeters,
    setAlleyMeters,
    totalFloors,
    setTotalFloors,
    floor,
    setFloor,
    bedrooms,
    setBedrooms,
    bathrooms,
    setBathrooms,
    houseDirection,
    setHouseDirection,
    balconyDirection,
    setBalconyDirection,
    moveInTime,
    setMoveInTime,
    electricityPrice,
    setElectricityPrice,
    waterPrice,
    setWaterPrice,
    internetPrice,
    setInternetPrice,
    amenities,
    setAmenities,
    expanded,
    toggleSection,
  } = useCreateListing();

  return (
    <div className="bg-white rounded-lg border border-gray-200 mb-6 shadow-sm overflow-hidden font-sans">
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => toggleSection("other")}
      >
        <h2 className="font-bold text-[14px]">Thông tin khác</h2>
        {expanded.other ? (
          <ChevronUp size={20} className="text-[#2c2c2c]" />
        ) : (
          <ChevronDown size={20} className="text-[#2c2c2c]" />
        )}
      </div>

      {expanded.other ? (
        <div className="px-4 pb-6 pt-0 space-y-4">
          <div>
            <label className="block text-[13px] font-bold mb-2">Nội thất</label>
            <div className="relative">
              <select
                value={interior}
                onChange={(event) => setInterior(event.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2.5 appearance-none outline-none focus:border-[#2c2c2c] text-[14px] bg-white font-medium text-gray-800"
              >
                {interiorOptions.map((option) => (
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
            <label className="block text-[13px] font-bold mb-2">Giấy tờ pháp lý</label>
            <div className="relative">
              <select
                value={certificateType}
                onChange={(event) => setCertificateType(event.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2.5 appearance-none outline-none focus:border-[#2c2c2c] text-[14px] bg-white font-medium text-gray-800"
              >
                {certificateOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Mặt tiền (m)", value: frontageMeters, setValue: setFrontageMeters },
              { label: "Đường vào (m)", value: alleyMeters, setValue: setAlleyMeters },
              { label: "Tổng số tầng", value: totalFloors, setValue: setTotalFloors },
              { label: "Tầng số", value: floor, setValue: setFloor },
            ].map((field) => (
              <div key={field.label}>
                <label className="block text-[13px] font-bold mb-2">{field.label}</label>
                <input
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={field.value}
                  onChange={(event) => field.setValue(event.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2.5 outline-none focus:border-[#2c2c2c] text-[14px] bg-white font-medium text-gray-800"
                />
              </div>
            ))}
          </div>

          <div className="pt-1">
            <button
              type="button"
              onClick={() => setNegotiable(!negotiable)}
              className={`px-4 py-2 rounded-full border text-[13px] font-bold flex items-center gap-2 transition-colors ${
                negotiable
                  ? "bg-[#2c2c2c] text-white border-[#2c2c2c]"
                  : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
              }`}
            >
              <div className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[9px]">
                đ
              </div>
              Giá thương lượng
            </button>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-[13px] font-bold text-gray-700">Số phòng ngủ</span>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setBedrooms(Math.max(0, bedrooms - 1))}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 bg-gray-50 text-gray-400"
              >
                <Minus size={14} />
              </button>
              <span className="w-4 text-center font-bold text-gray-900">{bedrooms}</span>
              <button
                type="button"
                onClick={() => setBedrooms(bedrooms + 1)}
                className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center hover:bg-gray-50 bg-white"
              >
                <Plus size={14} className="text-[#2c2c2c]" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-[13px] font-bold text-gray-700">
              Số phòng tắm, vệ sinh
            </span>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setBathrooms(Math.max(0, bathrooms - 1))}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 bg-gray-50 text-gray-400"
              >
                <Minus size={14} />
              </button>
              <span className="w-4 text-center font-bold text-gray-900">{bathrooms}</span>
              <button
                type="button"
                onClick={() => setBathrooms(bathrooms + 1)}
                className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center hover:bg-gray-50 bg-white"
              >
                <Plus size={14} className="text-[#2c2c2c]" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-bold mb-2">Hướng nhà</label>
            <div className="relative">
              <select
                value={houseDirection}
                onChange={(event) => setHouseDirection(event.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2.5 appearance-none outline-none focus:border-[#2c2c2c] text-[14px] bg-white font-medium text-gray-800"
              >
                {directionOptions.map((option) => (
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
            <label className="block text-[13px] font-bold mb-2">Hướng ban công</label>
            <div className="relative">
              <select
                value={balconyDirection}
                onChange={(event) => setBalconyDirection(event.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2.5 appearance-none outline-none focus:border-[#2c2c2c] text-[14px] bg-white font-medium text-gray-800"
              >
                {directionOptions.map((option) => (
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

          {[
            {
              label: "Thời gian vào ở",
              value: moveInTime,
              setValue: setMoveInTime,
              options: moveInOptions,
            },
            {
              label: "Mức giá điện",
              value: electricityPrice,
              setValue: setElectricityPrice,
              options: utilityPriceOptions,
            },
            {
              label: "Mức giá nước",
              value: waterPrice,
              setValue: setWaterPrice,
              options: utilityPriceOptions,
            },
            {
              label: "Mức giá internet",
              value: internetPrice,
              setValue: setInternetPrice,
              options: internetPriceOptions,
            },
          ].map((field) => (
            <div key={field.label}>
              <label className="block text-[13px] font-bold mb-2">
                {field.label}
              </label>
              <div className="relative">
                <select
                  value={field.value}
                  onChange={(event) => field.setValue(event.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2.5 appearance-none outline-none focus:border-[#2c2c2c] text-[14px] bg-white font-medium text-gray-800"
                >
                  {field.options.map((option) => (
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
          ))}

          <div className="pt-2">
            <label className="block text-[13px] font-bold mb-3">Tiện ích</label>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setAmenities({ ...amenities, camera: !amenities.camera })}
                className={`px-4 py-2 rounded-full border text-[13px] font-bold flex items-center gap-2 transition-colors ${
                  amenities.camera
                    ? "bg-[#2c2c2c] text-white border-[#2c2c2c]"
                    : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                }`}
              >
                <div className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[9px]">
                  C
                </div>
                Camera
              </button>
              <button
                type="button"
                onClick={() => setAmenities({ ...amenities, baove: !amenities.baove })}
                className={`px-4 py-2 rounded-full border text-[13px] font-bold flex items-center gap-2 transition-colors ${
                  amenities.baove
                    ? "bg-[#2c2c2c] text-white border-[#2c2c2c]"
                    : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                }`}
              >
                <div className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[9px]">
                  B
                </div>
                Bảo vệ
              </button>
              <button
                type="button"
                onClick={() => setAmenities({ ...amenities, pccc: !amenities.pccc })}
                className={`px-4 py-2 rounded-full border text-[13px] font-bold flex items-center gap-2 transition-colors ${
                  amenities.pccc
                    ? "bg-[#2c2c2c] text-white border-[#2c2c2c]"
                    : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                }`}
              >
                <div className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[9px]">
                  P
                </div>
                PCCC
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-4 pb-4 pt-0 text-[14px] text-[#2c2c2c] font-medium">
          <div className="flex justify-between py-1.5 border-b border-gray-100 last:border-0">
            <span className="text-gray-500">Nội thất</span>
            <span>{interior}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-gray-100 last:border-0">
            <span className="text-gray-500">Hướng nhà</span>
            <span>{houseDirection}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-gray-100 last:border-0">
            <span className="text-gray-500">Hướng ban công</span>
            <span>{balconyDirection}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-gray-100 last:border-0">
            <span className="text-gray-500">Giấy tờ pháp lý</span>
            <span>
              {certificateOptions.find((o) => o.value === certificateType)?.label ?? "Đang cập nhật"}
            </span>
          </div>
          <div
            className="mt-3 text-blue-600 font-bold hover:underline cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              toggleSection("other");
            }}
          >
            +12 thông tin khác
          </div>
        </div>
      )}
    </div>
  );
}
