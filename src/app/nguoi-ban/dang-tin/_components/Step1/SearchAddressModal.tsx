import React from "react";
import { X, Search, MapPin } from "lucide-react";
import { useCreateListing } from "../CreateListingContext";

export function SearchAddressModal() {
  const {
    isAddressModalOpen,
    setIsAddressModalOpen,
    setIsConfirmModalOpen,
    searchQuery,
    setSearchQuery,
    searchResults,
    searching,
    apiProvinces,
    handleSelectSearchResult,
  } = useCreateListing();

  if (!isAddressModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-[640px] rounded-lg overflow-hidden flex flex-col max-h-[85vh] shadow-2xl font-sans">
        <div className="bg-[#2c2c2c] px-4 py-3 flex items-center justify-between text-white">
          <h3 className="font-bold text-[16px]">Nhập địa chỉ</h3>
          <button
            type="button"
            onClick={() => setIsAddressModalOpen(false)}
            className="text-gray-300 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-5 flex flex-col flex-1 overflow-y-auto">
          <div className="relative mb-5">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2c2c2c]"
            />
            <input
              type="text"
              placeholder="Nhập địa chỉ"
              className="w-full border border-gray-300 rounded-full pl-10 pr-10 py-2.5 outline-none focus:border-[#2c2c2c] text-[14px] font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {searching ? (
            <div className="py-8 text-center text-gray-500 flex items-center justify-center gap-2 font-medium">
              <span className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></span>
              Đang tìm kiếm...
            </div>
          ) : searchQuery && searchResults.length > 0 ? (
            <div className="flex flex-col max-h-[50vh] overflow-y-auto custom-scrollbar">
              {searchResults.map((res) => {
                const parentProv = apiProvinces.find((p) => p.id === res.parent);
                const label = parentProv ? `${res.name}, ${parentProv.name}` : res.name;
                return (
                  <div
                    key={res.id}
                    className="py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 text-[14px] flex items-center gap-2 font-medium"
                    onClick={() => handleSelectSearchResult(res)}
                  >
                    <MapPin size={16} className="text-gray-400 shrink-0" />
                    <span>{label}</span>
                  </div>
                );
              })}
            </div>
          ) : searchQuery ? (
            <div className="py-8 text-center text-gray-500 font-medium">
              Không tìm thấy kết quả phù hợp.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <p className="text-gray-600 text-[13px] font-medium">
                Tìm kiếm bằng cách nhập tên phường xã, đường phố hoặc
                tên dự án, hoặc:
              </p>
              <button
                type="button"
                className="border border-[#2c2c2c] text-[#2c2c2c] font-bold px-5 py-2 rounded-full text-[13px] w-max hover:bg-gray-50 transition-colors"
                onClick={() => {
                  setIsAddressModalOpen(false);
                  setIsConfirmModalOpen(true);
                }}
              >
                Chọn địa chỉ
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
