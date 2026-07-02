import React from "react";
import { X, MapPin, ChevronDown, Check } from "lucide-react";
import { useCreateListing } from "../CreateListingContext";

export function ConfirmAddressModal() {
  const {
    isConfirmModalOpen,
    setIsConfirmModalOpen,
    setIsAddressModalOpen,
    provinceId,
    districtId,
    wardId,
    selectedAddress,
    setSelectedAddress,
    apiProvinces,
    apiDistricts,
    apiWards,
    apiStreets,
    handleProvinceChange,
    handleDistrictChange,
    handleWardChange,
    handleStreetChange,
    handleConfirmAddress,
  } = useCreateListing();

  if (!isConfirmModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-[640px] rounded-lg overflow-hidden flex flex-col max-h-[85vh] shadow-2xl font-sans">
        <div className="bg-[#2c2c2c] px-4 py-3 flex items-center justify-between text-white shrink-0">
          <h3 className="font-bold text-[16px]">Xác nhận địa chỉ</h3>
          <button
            type="button"
            onClick={() => setIsConfirmModalOpen(false)}
            className="text-gray-300 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          {/* Form fields */}
          <div className="space-y-5 mb-8">
            <div>
              <label className="block text-[13px] font-bold mb-2">
                Tỉnh/Thành <span className="text-primary">*</span>
              </label>
              <div className="relative">
                <select
                  value={provinceId}
                  onChange={(event) => handleProvinceChange(event.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2.5 appearance-none outline-none focus:border-[#2c2c2c] text-[14px] bg-white font-medium text-gray-800"
                >
                  <option value="">-- Chọn Tỉnh/Thành --</option>
                  {apiProvinces.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
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
                Quận/Huyện <span className="text-primary">*</span>
              </label>
              {apiDistricts.length > 0 ? (
                <div className="relative">
                  <select
                    value={districtId}
                    onChange={(event) => handleDistrictChange(event.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2.5 appearance-none outline-none focus:border-[#2c2c2c] text-[14px] bg-white font-medium text-gray-800"
                  >
                    <option value="">-- Chọn Quận/Huyện --</option>
                    {apiDistricts.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                  />
                </div>
              ) : (
                <input
                  type="text"
                  value={selectedAddress.district}
                  onChange={(event) =>
                    setSelectedAddress({
                      ...selectedAddress,
                      district: event.target.value,
                    })
                  }
                  placeholder="Nhập Quận/Huyện"
                  className="w-full border border-gray-300 rounded-md px-3 py-2.5 outline-none focus:border-[#2c2c2c] text-[14px] font-medium text-gray-800 bg-white"
                />
              )}
            </div>

            <div>
              <label className="block text-[13px] font-bold mb-2">
                Phường/Xã <span className="text-primary">*</span>
              </label>
              {apiWards.length > 0 ? (
                <div className="relative">
                  <select
                    value={wardId}
                    onChange={(event) => handleWardChange(event.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2.5 appearance-none outline-none focus:border-[#2c2c2c] text-[14px] bg-white font-medium text-gray-800"
                  >
                    <option value="">-- Chọn Phường/Xã --</option>
                    {apiWards.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                  />
                </div>
              ) : (
                <input
                  type="text"
                  value={selectedAddress.ward}
                  onChange={(event) =>
                    setSelectedAddress({
                      ...selectedAddress,
                      ward: event.target.value,
                    })
                  }
                  placeholder="Nhập Phường/Xã"
                  className="w-full border border-gray-300 rounded-md px-3 py-2.5 outline-none focus:border-[#2c2c2c] text-[14px] font-medium text-gray-800 bg-white"
                />
              )}
            </div>

            <div>
              <label className="block text-[13px] font-bold mb-2">Đường/Phố</label>
              {apiStreets.length > 0 ? (
                <div className="relative">
                  <select
                    value={selectedAddress.street}
                    onChange={(event) => handleStreetChange(event.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2.5 appearance-none outline-none focus:border-[#2c2c2c] text-[14px] bg-white font-medium text-gray-800"
                  >
                    <option value="">-- Chọn Đường/Phố --</option>
                    {apiStreets.map((option) => (
                      <option key={option.id} value={option.name}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                  />
                </div>
              ) : (
                <input
                  type="text"
                  value={selectedAddress.street}
                  onChange={(event) =>
                    setSelectedAddress({
                      ...selectedAddress,
                      street: event.target.value,
                    })
                  }
                  placeholder="Nhập tên Đường/Phố"
                  className="w-full border border-gray-300 rounded-md px-3 py-2.5 outline-none focus:border-[#2c2c2c] text-[14px] font-medium text-gray-800 bg-white"
                />
              )}
            </div>

            <div>
              <label className="block text-[13px] font-bold mb-2">
                Địa chỉ chi tiết
              </label>
              <input
                type="text"
                value={selectedAddress.detail}
                onChange={(event) =>
                  setSelectedAddress({
                    ...selectedAddress,
                    detail: event.target.value,
                  })
                }
                placeholder="Nhập số nhà, khu phố, ngõ hẻm..."
                className="w-full border border-gray-300 rounded-md px-3 py-2.5 outline-none focus:border-[#2c2c2c] text-[14px] font-medium text-gray-800 bg-white placeholder:text-gray-400"
              />
            </div>

            <div>
              <label className="block text-[13px] font-bold mb-2">Dự án</label>
              <input
                type="text"
                value={selectedAddress.project}
                onChange={(event) =>
                  setSelectedAddress({
                    ...selectedAddress,
                    project: event.target.value,
                  })
                }
                placeholder="Nhập tên dự án (nếu có)"
                className="w-full border border-gray-300 rounded-md px-3 py-2.5 outline-none focus:border-[#2c2c2c] text-[14px] font-medium text-gray-800 bg-white placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Display Address Section */}
          <div className="mb-8">
            <label className="block text-[13px] font-bold mb-3">
              Địa chỉ hiển thị trên tin đăng <span className="text-primary">*</span>
            </label>

            <div className="bg-[#eef8f2] rounded-md p-3.5 mb-5 flex items-start gap-2.5 border border-[#d3ecd9]">
              <Check
                size={18}
                className="text-[#00a850] mt-0.5 shrink-0"
                strokeWidth={2.5}
              />
              <div>
                <div className="font-bold text-[#00a850] text-[13px] mb-1">
                  Thêm hiển thị cho địa chỉ mới
                </div>
                <div className="text-[13px] text-[#00a850] leading-relaxed">
                  Tin hiển thị ở 2 trang kết quả tìm kiếm (địa chỉ mới và cũ),
                  giúp tiếp cận nhiều người tìm nhà hơn
                </div>
              </div>
            </div>

            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={18} className="text-[#2c2c2c]" />
                <span className="font-bold text-[13px]">Địa chỉ</span>
              </div>
              <div className="pl-6.5 text-[14px] text-[#2c2c2c] flex items-start gap-2 font-medium">
                <span className="text-gray-400 mt-0.5">↳</span>
                <span>
                  {[
                    selectedAddress.ward,
                    selectedAddress.district,
                    selectedAddress.province,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-[13px]">
                Chọn vị trí trên bản đồ
              </span>
              <button
                type="button"
                className="text-[13px] text-gray-500 hover:text-[#2c2c2c] font-bold"
              >
                Đặt lại
              </button>
            </div>
            <div className="text-[13px] text-gray-500 mb-3 font-medium">
              Kéo bản đồ để đổi vị trí ghim
            </div>
            <div className="w-full h-[180px] bg-[#e5e3df] rounded-md relative overflow-hidden border border-gray-300 flex items-center justify-center">
              <div className="absolute inset-0 opacity-40 bg-[url(https://maps.googleapis.com/maps/api/staticmap?center=20.9634,105.8285&zoom=14&size=640x300&maptype=roadmap&key=mock)] bg-cover bg-center mix-blend-multiply"></div>
              <svg
                className="absolute inset-0 w-full h-full opacity-20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 50 Q 150 20, 300 100 T 640 80"
                  fill="none"
                  stroke="#2c2c2c"
                  strokeWidth="3"
                />
                <path d="M200 0 L 250 180" fill="none" stroke="#ffffff" strokeWidth="6" />
                <path d="M0 120 L 640 150" fill="none" stroke="#ffffff" strokeWidth="4" />
              </svg>
              <div className="relative z-10 flex flex-col items-center drop-shadow-md pb-4 animate-bounce">
                <MapPin
                  size={36}
                  className="text-primary"
                  fill="#e03c31"
                  stroke="white"
                  strokeWidth={1}
                />
                <div className="w-2.5 h-1.5 bg-black/30 rounded-[50%] absolute bottom-2 blur-[1px]"></div>
              </div>
              <div className="absolute right-2 bottom-2 bg-white rounded-md shadow-sm border border-gray-200 flex flex-col">
                <div className="w-8 h-8 flex items-center justify-center border-b border-gray-200 font-bold text-gray-600 cursor-pointer">
                  +
                </div>
                <div className="w-8 h-8 flex items-center justify-center font-bold text-gray-600 cursor-pointer">
                  -
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 flex items-center justify-between shrink-0 bg-white">
          <button
            type="button"
            className="font-bold text-[14px] text-[#2c2c2c] px-4 py-2 hover:bg-gray-50 rounded-full transition-colors"
            onClick={() => {
              setIsConfirmModalOpen(false);
              setIsAddressModalOpen(true);
            }}
          >
            Quay lại
          </button>
          <button
            type="button"
            className="bg-primary hover:bg-[#c42c23] text-white px-8 py-2.5 rounded-full font-bold text-[14px] transition-colors"
            onClick={handleConfirmAddress}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}
