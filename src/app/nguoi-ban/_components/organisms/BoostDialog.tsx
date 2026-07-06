import React from "react";
import type { Listing } from "../molecules/ListingCard";
import type { PricingInfo } from "@/services/pricing";

export type PushType = "pushed" | "vip_pushed";

interface BoostDialogProps {
  listing: Listing;
  onClose: () => void;
  selectedPushType: PushType;
  setSelectedPushType: (pushType: PushType) => void;
  boostSuccessMessage: string;
  setBoostSuccessMessage: (msg: string) => void;
  isBoostSubmitting: boolean;
  onConfirm: () => void;
  pricing?: PricingInfo | null;
}

export function BoostDialog({
  listing,
  onClose,
  selectedPushType,
  setSelectedPushType,
  boostSuccessMessage,
  setBoostSuccessMessage,
  isBoostSubmitting,
  onConfirm,
  pricing,
}: BoostDialogProps) {
  const formatPrice = (value?: number) => {
    if (value === undefined || value === null) return "-- đ";
    return `${value.toLocaleString("vi-VN")} đ`;
  };

  const boostOptions = [
    { 
      id: "pushed" as PushType, 
      label: "Đẩy tin thường", 
      helper: "Tin được đẩy lên đầu trang, tự động ghim trong 30 ngày.", 
      price: formatPrice(pricing?.boostBasePrice) 
    },
    { 
      id: "vip_pushed" as PushType, 
      label: "Đẩy tin VIP", 
      helper: "Nổi bật hơn tin thường, ưu tiên hiển thị đầu, ghim trong 30 ngày.", 
      price: formatPrice(pricing?.boostVipPrice) 
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-0 sm:items-center sm:p-6 animate-in fade-in duration-200">
      <button
        type="button"
        aria-label="Đóng đẩy tin"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[28px] bg-white shadow-2xl sm:rounded-[28px] animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <div className="text-[22px] font-extrabold text-gray-900">Đẩy tin</div>
            <p className="mt-1 text-sm text-gray-500 font-medium">Mã tin {listing.code}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700 font-bold"
          >
            ×
          </button>
        </div>

        <div className="space-y-5 overflow-y-auto px-6 py-6">
          <div className="rounded-2xl bg-gray-50 p-4">
            <div className="line-clamp-2 text-[17px] font-extrabold text-gray-900">
              {listing.title}
            </div>
            <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-500">
              <span>
                Trạng thái:{" "}
                <span className="font-bold text-gray-800">
                  {listing.status}
                </span>
              </span>
              <span>
                Cấp độ VIP:{" "}
                <span className="font-bold text-gray-800">
                  {listing.packageName}
                </span>
              </span>
            </div>
          </div>

          <div>
            <div className="mb-3 text-sm font-extrabold uppercase tracking-[0.16em] text-gray-400">
              Chọn loại đẩy tin
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {boostOptions.map((option) => {
                const isActive = selectedPushType === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      setSelectedPushType(option.id);
                      setBoostSuccessMessage("");
                    }}
                    className={`rounded-2xl border p-4 text-left transition-colors ${
                      isActive
                        ? "border-primary bg-red-50 text-primary"
                        : "border-gray-200 bg-white text-gray-800 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-extrabold">{option.label}</div>
                      <div className="text-sm font-bold text-primary">{option.price}</div>
                    </div>
                    <div
                      className={`mt-2 text-xs font-medium ${
                        isActive ? "text-red-500" : "text-gray-500"
                      }`}
                    >
                      {option.helper}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
            Khi xác nhận, hệ thống gọi API để trừ lượt đẩy tin (nếu là VIP) hoặc trừ tiền ví và đẩy tin của bạn lên đầu trang trong 30 ngày.
          </div>

          {boostSuccessMessage ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-700">
              {boostSuccessMessage}
            </div>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-gray-100 px-6 py-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-gray-300 px-5 py-3 text-[15px] font-bold text-gray-800 transition-colors hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isBoostSubmitting}
            className="rounded-full bg-primary px-5 py-3 text-[15px] font-bold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isBoostSubmitting ? "Đang xử lý..." : "Xác nhận đẩy tin"}
          </button>
        </div>
      </div>
    </div>
  );
}

