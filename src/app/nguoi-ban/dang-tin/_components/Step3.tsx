"use client";

import React, { useState } from "react";
import { useCreateListing } from "./CreateListingContext";
import { usePricingData } from "./Step3/usePricingData";
import { PostTierSelector } from "./Step3/PostTierSelector";
import { DurationSelector } from "./Step3/DurationSelector";
import { CompareModal } from "./Step3/CompareModal";
import { CouponModal } from "./Step3/CouponModal";
import { PaymentFooter } from "./Step3/PaymentFooter";
import { Loader2 } from "lucide-react";

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
  const {
    isEditMode,
    editProperty,
    postTier,
    setPostTier,
    postDuration,
    setPostDuration,
    startDate,
    setStartDate,
    couponCode,
    setCouponCode,
    couponDiscount,
    setCouponDiscount,
  } = useCreateListing();

  const { tiers, loading, error } = usePricingData();
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);

  const status = editProperty?.status;
  const isPaid = isEditMode && (status === "active" || status === "pending");
  const isPending = status === "pending";
  const isActive = status === "active";

  if (loading) {
    return (
      <div className="flex-1 w-[700px] max-w-full mx-auto px-4 py-12 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 w-[700px] max-w-full mx-auto px-4 py-12 flex items-center justify-center">
        <div className="text-center text-red-500 font-bold">Lỗi tải cấu hình giá: {error.message}</div>
      </div>
    );
  }

  const selectedTierData = tiers.find((t) => t.id === postTier) || tiers[0];
  const originalPrice = selectedTierData.pricePerDay * postDuration;

  // Tính discount mặc định từ option thời hạn (nếu có)
  let durationDiscount = 0;
  if (postDuration === 15) durationDiscount = 0.1;
  if (postDuration === 30) durationDiscount = 0.2;

  const priceAfterDurationDiscount = Math.round(originalPrice * (1 - durationDiscount));
  const totalPrice = priceAfterDurationDiscount; // Giá trước khi áp dụng coupon ngoài

  return (
    <div className="flex-1 w-[700px] max-w-full mx-auto px-4 py-8 pb-32">
      {isActive && (
        <div className="mb-6 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-[13px] text-blue-800">
          <span className="font-bold">Tin của bạn đã được duyệt và đang hiển thị.</span> Bạn không thể thay đổi gói đăng tin lúc này. Mọi thay đổi về nội dung sẽ cần được duyệt lại.
        </div>
      )}
      {isPending && (
        <div className="mb-6 rounded-lg border border-yellow-100 bg-yellow-50 px-4 py-3 text-[13px] text-yellow-800">
          <span className="font-bold">Tin đang chờ duyệt.</span> Bạn chỉ có thể thay đổi ngày bắt đầu đăng tin.
        </div>
      )}

      {submitMessage && (
        <div className="mb-8 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-[13px] font-bold text-primary">
          {submitMessage}
        </div>
      )}

      <div className={isPaid ? "opacity-60 pointer-events-none" : ""}>
        <PostTierSelector
          tiers={tiers}
          selectedTier={postTier}
          onSelect={setPostTier}
          onCompare={() => setIsCompareModalOpen(true)}
        />

        <DurationSelector
          selectedDuration={postDuration}
          onSelect={setPostDuration}
          pricePerDay={selectedTierData.pricePerDay}
        />
      </div>

      <div className={`mb-8 border-t border-gray-200 pt-8 ${isActive ? "opacity-60 pointer-events-none" : ""}`}>
        <h2 className="font-bold text-[16px] text-[#2c2c2c] mb-4">3. Chọn ngày bắt đầu</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[13px] font-bold text-[#2c2c2c] mb-2">Ngày bắt đầu</label>
              <input
                type="date"
                value={startDate ? startDate.toISOString().split("T")[0] : ""}
                onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : new Date())}
                min={new Date().toISOString().split("T")[0]}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#2c2c2c] text-[14px] transition-colors bg-white shadow-sm hover:border-gray-400"
              />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#2c2c2c] mb-2">Giờ đăng dự kiến</label>
              <select className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#2c2c2c] text-[14px] transition-colors bg-white shadow-sm hover:border-gray-400">
                <option value="now">Đăng ngay bây giờ</option>
                <option value="later">Hẹn giờ khác (Chỉ dành cho VIP)</option>
              </select>
            </div>
          </div>
          {startDate && (
            <p className="text-sm text-gray-500 mt-3">
              Tin sẽ hết hạn vào ngày:{" "}
              <span className="font-bold">
                {new Date(startDate.getTime() + postDuration * 24 * 60 * 60 * 1000).toLocaleDateString("vi-VN")}
              </span>
            </p>
          )}
      </div>

      <CompareModal isOpen={isCompareModalOpen} onClose={() => setIsCompareModalOpen(false)} />
      
      <CouponModal
        isOpen={isCouponModalOpen}
        onClose={() => setIsCouponModalOpen(false)}
        onApply={(code, discount) => {
          setCouponCode(code);
          setCouponDiscount(discount);
        }}
      />

      <PaymentFooter
        onBack={onBack}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        isEditMode={isEditMode}
        totalPrice={totalPrice}
        discount={couponDiscount}
        couponCode={couponCode}
        onOpenCouponModal={() => setIsCouponModalOpen(true)}
        onRemoveCoupon={() => {
          setCouponCode("");
          setCouponDiscount(0);
        }}
        isPaid={isPaid}
      />
    </div>
  );
}
