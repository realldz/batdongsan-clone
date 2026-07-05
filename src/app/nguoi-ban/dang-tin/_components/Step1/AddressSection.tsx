import React from "react";
import { ChevronUp, ChevronDown, MapPin, Search, Edit2 } from "lucide-react";
import { useCreateListing } from "../CreateListingContext";
import { DraggableMap } from "@/components/Map";

export function AddressSection() {
  const {
    isAddressConfirmed,
    setIsAddressModalOpen,
    displayAddress,
    expanded,
    toggleSection,
    selectedAddress,
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

              <DraggableMap
                lat={selectedAddress.lat || 20.9634}
                lng={selectedAddress.lng || 105.8285}
                draggable={false}
                className="mt-4"
              />
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
