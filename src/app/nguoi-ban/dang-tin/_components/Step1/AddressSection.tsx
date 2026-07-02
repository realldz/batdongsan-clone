import React from "react";
import { ChevronUp, ChevronDown, MapPin, Search, Edit2 } from "lucide-react";
import { useCreateListing } from "../CreateListingContext";

export function AddressSection() {
  const {
    isAddressConfirmed,
    setIsAddressModalOpen,
    displayAddress,
    expanded,
    toggleSection,
  } = useCreateListing();

  return (
    <div className="bg-white rounded-lg border border-gray-200 mb-6 shadow-sm overflow-hidden">
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => toggleSection("address")}
      >
        <h2 className="font-bold text-[14px]">
          Địa chỉ <span className="text-primary">*</span>
        </h2>
        {expanded.address ? (
          <ChevronUp size={20} className="text-[#2c2c2c]" />
        ) : (
          <ChevronDown size={20} className="text-[#2c2c2c]" />
        )}
      </div>

      {expanded.address ? (
        <div className="px-4 pb-6 pt-0">
          {!isAddressConfirmed ? (
            <div
              onClick={() => setIsAddressModalOpen(true)}
              className="flex items-center gap-2 w-full border border-gray-300 rounded-full px-4 py-2.5 cursor-text bg-white hover:border-gray-400 transition-colors"
            >
              <Search size={18} className="text-[#2c2c2c]" />
              <span className="text-gray-500 text-[14px] font-medium">Nhập địa chỉ</span>
            </div>
          ) : (
            <div className="relative font-sans">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <MapPin size={16} className="text-[#2c2c2c]" />
                  <span className="font-bold text-[13px]">Địa chỉ</span>
                </div>
                <div className="pl-6 text-[14px] text-[#2c2c2c] font-medium">
                  {displayAddress}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAddressModalOpen(true)}
                className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-50 bg-white"
              >
                <Edit2 size={14} className="text-gray-600" />
              </button>

              <div className="w-full h-[180px] bg-[#e5e3df] rounded-md relative overflow-hidden border border-gray-300 flex items-center justify-center mt-4">
                <div className="absolute inset-0 opacity-60 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=20.9634,105.8285&zoom=14&size=640x300&maptype=roadmap&key=mock')] bg-cover bg-center mix-blend-multiply"></div>
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
              </div>
            </div>
          )}
        </div>
      ) : (
        isAddressConfirmed && (
          <div className="px-4 pb-4 pt-0 relative font-sans">
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-1">
                <MapPin size={16} className="text-[#2c2c2c]" />
                <span className="font-bold text-[13px]">Địa chỉ</span>
              </div>
              <div className="pl-6 text-[14px] text-[#2c2c2c] font-medium">
                {displayAddress}
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsAddressModalOpen(true);
              }}
              className="absolute top-0 right-4 w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-50 bg-white"
            >
              <Edit2 size={14} className="text-gray-600" />
            </button>
          </div>
        )
      )}
    </div>
  );
}
