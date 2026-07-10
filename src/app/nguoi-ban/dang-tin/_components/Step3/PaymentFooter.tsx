import React from "react";
import { Tag } from "lucide-react";

interface PaymentFooterProps {
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isEditMode: boolean;
  totalPrice: number;
  discount: number;
  couponCode: string;
  onOpenCouponModal: () => void;
  onRemoveCoupon: () => void;
  isPaid?: boolean;
}

export function PaymentFooter({
  onBack,
  onSubmit,
  isSubmitting,
  isEditMode,
  totalPrice,
  discount,
  couponCode,
  onOpenCouponModal,
  onRemoveCoupon,
  isPaid = false,
}: PaymentFooterProps) {
  const finalPrice = Math.max(0, totalPrice - discount);

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-10 flex justify-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="w-[700px] max-w-full flex justify-between items-center">
        {isPaid ? (
          <div className="flex flex-col">
            <span className="text-[14px] text-gray-700 font-bold">Lưu thông tin</span>
            <span className="text-[13px] text-gray-500">Tin của bạn sẽ được tự động lưu.</span>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-[13px] text-gray-500 font-bold">Tổng tiền:</span>
              <span className="text-[18px] font-bold text-primary">
                {finalPrice.toLocaleString("vi-VN")} đ
              </span>
              {discount > 0 && (
                <span className="text-[13px] text-gray-400 line-through">
                  {totalPrice.toLocaleString("vi-VN")} đ
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {couponCode ? (
                <div className="flex items-center gap-1.5 text-[12px] bg-green-50 text-green-700 px-2 py-0.5 rounded font-medium border border-green-200">
                  <Tag size={12} />
                  <span>Mã {couponCode} (-{discount.toLocaleString("vi-VN")} đ)</span>
                  <button onClick={onRemoveCoupon} className="hover:text-green-900 font-bold ml-1">✕</button>
                </div>
              ) : (
                <button
                  onClick={onOpenCouponModal}
                  className="flex items-center gap-1.5 text-[13px] font-medium text-primary hover:underline"
                >
                  <Tag size={14} /> Khuyến mãi
                </button>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2.5 rounded-full font-bold text-[14px] transition-colors shadow-sm bg-white"
          >
            Quay lại
          </button>
          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="bg-primary hover:bg-[#c42c23] text-white px-6 py-2.5 rounded-full font-bold text-[14px] transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? "Đang xử lý..."
              : isPaid
              ? "Lưu thay đổi"
              : isEditMode
              ? "Lưu và Thanh toán"
              : "Thanh toán và Đăng tin"}
          </button>
        </div>
      </div>
    </footer>
  );
}
