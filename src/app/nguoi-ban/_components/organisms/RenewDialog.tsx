import React from "react";
import type { Listing } from "../molecules/ListingCard";

export const renewOptions = [
  { days: 7, label: "7 ngày", price: "99.000 đ", helper: "Phù hợp tin sắp hết hạn" },
  { days: 15, label: "15 ngày", price: "169.000 đ", helper: "Tiết kiệm hơn 15%" },
  { days: 30, label: "30 ngày", price: "299.000 đ", helper: "Hiển thị lâu hơn" },
] as const;

interface RenewDialogProps {
  listing: Listing;
  onClose: () => void;
  selectedRenewDays: 7 | 15 | 30;
  setSelectedRenewDays: (days: 7 | 15 | 30) => void;
  renewSuccessMessage: string;
  setRenewSuccessMessage: (msg: string) => void;
  isRenewSubmitting: boolean;
  onConfirm: () => void;
}

export function RenewDialog({
  listing,
  onClose,
  selectedRenewDays,
  setSelectedRenewDays,
  renewSuccessMessage,
  setRenewSuccessMessage,
  isRenewSubmitting,
  onConfirm,
}: RenewDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-0 sm:items-center sm:p-6 animate-in fade-in duration-200">
      <button
        type="button"
        aria-label="Đóng gia hạn tin"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[28px] bg-white shadow-2xl sm:rounded-[28px] animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <div className="text-[22px] font-extrabold text-gray-900">Gia hạn tin</div>
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
                Gói hiện tại:{" "}
                <span className="font-bold text-gray-800">
                  {listing.packageName}
                </span>
              </span>
              <span>
                Hết hạn:{" "}
                <span className="font-bold text-gray-800">
                  {listing.expiresAt}
                </span>
              </span>
            </div>
          </div>

          <div>
            <div className="mb-3 text-sm font-extrabold uppercase tracking-[0.16em] text-gray-400">
              Chọn thời hạn gia hạn
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {renewOptions.map((option) => {
                const isActive = selectedRenewDays === option.days;

                return (
                  <button
                    key={option.days}
                    type="button"
                    onClick={() => {
                      setSelectedRenewDays(option.days);
                      setRenewSuccessMessage("");
                    }}
                    className={`rounded-2xl border p-4 text-left transition-colors ${
                      isActive
                        ? "border-primary bg-red-50 text-primary"
                        : "border-gray-200 bg-white text-gray-800 hover:bg-gray-50"
                    }`}
                  >
                    <div className="text-lg font-extrabold">{option.label}</div>
                    <div className="mt-1 text-sm font-bold">{option.price}</div>
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
            Khi xác nhận, hệ thống gọi API thanh toán ví để trừ tiền gia hạn tin.
          </div>

          {renewSuccessMessage ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-700">
              {renewSuccessMessage}
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
            disabled={isRenewSubmitting}
            className="rounded-full bg-primary px-5 py-3 text-[15px] font-bold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isRenewSubmitting ? "Đang thanh toán..." : "Xác nhận gia hạn"}
          </button>
        </div>
      </div>
    </div>
  );
}
