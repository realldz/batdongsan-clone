import React from "react";
import Link from "next/link";
import { Eye, Cloud } from "lucide-react";
import { useCreateListing } from "./CreateListingContext";

export function CreateListingHeader() {
  const { isEditMode, isAddressConfirmed, currentStep } = useCreateListing();

  return (
    <header className="bg-white sticky top-0 z-20">
      <div className="px-6 py-4 flex items-center justify-between max-w-[1400px] w-full mx-auto">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <h1 className="text-xl font-bold text-[#2c2c2c]">
              {isEditMode ? "Chỉnh sửa tin đăng" : "Tạo tin đăng"}
            </h1>
            {isAddressConfirmed && (
              <div className="flex items-center gap-1.5 text-gray-500 text-[13px] ml-2">
                <Cloud size={16} /> Đã lưu nháp
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-1.5 border border-gray-200 rounded-full text-gray-400 cursor-not-allowed bg-white"
          >
            <Eye size={16} />
            <span className="font-medium text-[13px]">Xem trước</span>
          </button>
          <Link
            href="/nguoi-ban/tin-dang"
            className="px-4 py-1.5 border border-gray-300 rounded-full text-[#2c2c2c] font-medium text-[13px] hover:bg-gray-50 transition-colors bg-white font-bold"
          >
            Thoát
          </Link>
        </div>
      </div>
      {/* Progress bar area */}
      <div className="w-full flex bg-white">
        <div
          className={`${
            currentStep === 1
              ? "w-[30%]"
              : currentStep === 2
              ? "w-[65%]"
              : "w-full"
          } border-b-[3px] border-primary relative transition-all duration-300`}
        >
          <div className="absolute bottom-[8px] left-6 text-[13px] font-bold text-[#2c2c2c] whitespace-nowrap">
            {currentStep === 1
              ? "Bước 1. Thông tin BĐS"
              : currentStep === 2
              ? "Bước 2. Hình ảnh & video"
              : "Bước 3. Cấu hình & thanh toán"}
          </div>
        </div>
        <div
          className={`${
            currentStep === 1 ? "w-[70%]" : currentStep === 2 ? "w-[35%]" : "w-0"
          } border-b-[3px] border-gray-100 transition-all duration-300`}
        />
      </div>
    </header>
  );
}
