"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";
import { useCreateListing } from "./CreateListingContext";

export function Step3({
  onBack,
  onSubmit,
  isSubmitting = false,
  submitMessage = "",
}: {
  onBack: () => void;
  onSubmit: () => void | Promise<void>;
  isSubmitting?: boolean;
  submitMessage?: string;
}) {
  const { title, displayAddress, priceSummary, area, demand, isEditMode } = useCreateListing();

  return (
    <div className="flex-1 w-[800px] max-w-full mx-auto px-4 py-8 pb-48">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center max-w-2xl mx-auto mt-10">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
          Xác nhận thông tin tin đăng
        </h2>
        
        <p className="text-gray-500 mb-8">
          Vui lòng kiểm tra lại thông tin cơ bản trước khi lưu.
        </p>

        <div className="text-left bg-gray-50 rounded-xl p-6 mb-8 space-y-4">
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Tiêu đề</div>
            <div className="font-semibold text-gray-900 line-clamp-2">{title || "Chưa nhập tiêu đề"}</div>
          </div>
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Địa chỉ</div>
            <div className="text-gray-900">{displayAddress || "Chưa nhập địa chỉ"}</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Mức giá</div>
              <div className="font-bold text-primary">{priceSummary}</div>
            </div>
            <div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Diện tích</div>
              <div className="font-bold text-gray-900">{area ? `${area} m²` : "--"}</div>
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Nhu cầu</div>
            <div className="font-bold text-gray-900">{demand === "rent" ? "Cho thuê" : "Bán"}</div>
          </div>
        </div>

        {submitMessage && (
          <div className="mb-6 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-primary text-left">
            {submitMessage}
          </div>
        )}

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={onBack}
            className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-8 py-3 rounded-full font-bold transition-colors min-w-[140px]"
          >
            Quay lại
          </button>
          <button
            onClick={() => onSubmit()}
            disabled={isSubmitting}
            className="bg-primary hover:bg-red-600 text-white px-8 py-3 rounded-full font-bold transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed min-w-[200px]"
          >
            {isSubmitting 
              ? "Đang xử lý..." 
              : isEditMode 
                ? "Lưu thay đổi" 
                : "Hoàn tất đăng tin"}
          </button>
        </div>
      </div>
    </div>
  );
}
