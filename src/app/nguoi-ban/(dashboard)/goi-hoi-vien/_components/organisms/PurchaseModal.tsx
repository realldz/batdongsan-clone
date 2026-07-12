"use client";

import { X, AlertTriangle, Loader2, CheckCircle2, Tag } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { validateCoupon } from "@/services/coupons";

export interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageName: string;
  pricePerMonth: number;
  balance: number;
  submitting: boolean;
  // isUpgrade: modal used to change tier on an active subscription
  isUpgrade?: boolean;
  onConfirm: (couponCode?: string) => void;
}

interface AppliedCoupon {
  code: string;
  discount: number; // absolute VND discount computed against pricePerMonth
}

function formatMoney(amount: number): string {
  return new Intl.NumberFormat("vi-VN").format(Math.max(0, Math.round(amount))) + " đ";
}

export function PurchaseModal({
  isOpen,
  onClose,
  packageName,
  pricePerMonth,
  balance,
  submitting,
  isUpgrade,
  onConfirm,
}: PurchaseModalProps) {
  const [couponInput, setCouponInput] = useState("");
  const [applied, setApplied] = useState<AppliedCoupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [validating, setValidating] = useState(false);

  if (!isOpen) return null;

  const total = Math.max(0, pricePerMonth - (applied?.discount ?? 0));
  // On upgrade the backend charges only the prorated difference (unknown to FE),
  // so we don't block on balance here — let the backend validate.
  const insufficient = !isUpgrade && balance < total;

  async function handleApplyCoupon() {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    setValidating(true);
    setCouponError(null);
    try {
      const result = await validateCoupon(code, "vip");
      if (!result.valid) {
        setApplied(null);
        setCouponError("Mã khuyến mãi không hợp lệ hoặc đã hết hạn.");
        return;
      }
      // Preview discount locally; backend re-applies authoritatively on purchase
      const discount =
        result.discountType === "percentage"
          ? (pricePerMonth * result.discountValue) / 100
          : result.discountValue;
      setApplied({ code: result.code, discount });
    } catch {
      setApplied(null);
      setCouponError("Không thể kiểm tra mã. Vui lòng thử lại.");
    } finally {
      setValidating(false);
    }
  }

  function handleRemoveCoupon() {
    setApplied(null);
    setCouponInput("");
    setCouponError(null);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-[420px] mx-4 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-[15px] font-extrabold text-gray-900">
            {isUpgrade ? "Đổi hạng Hội viên" : "Mua Gói Hội viên"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-1 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center shrink-0">
              <span className="text-2xl">🏠</span>
            </div>
            <div>
              <h3 className="text-[13px] font-extrabold text-gray-900">{packageName}</h3>
              <p className="text-[11px] text-[#e03c31] font-bold">
                {formatMoney(pricePerMonth)}/tháng
              </p>
            </div>
          </div>

          {/* Coupon input — not applicable when changing tier (backend PATCH ignores it) */}
          {!isUpgrade && (
          <div className="mb-5">
            <label className="mb-2 flex items-center gap-1.5 text-[13px] font-bold text-gray-700">
              <Tag className="h-3.5 w-3.5 text-[#e03c31]" /> Mã khuyến mãi
            </label>
            {applied ? (
              <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-3 py-2.5">
                <span className="flex items-center gap-1.5 text-[13px] font-bold text-green-700">
                  <CheckCircle2 className="h-4 w-4" /> {applied.code}
                  <span className="font-medium text-green-600">
                    (-{formatMoney(applied.discount)})
                  </span>
                </span>
                <button
                  onClick={handleRemoveCoupon}
                  className="text-[12px] font-bold text-gray-500 hover:text-gray-700"
                >
                  Bỏ
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Nhập mã"
                  className="flex-1 rounded-lg border border-gray-200 px-3 py-2.5 text-[13px] font-medium uppercase outline-none focus:border-[#e03c31]"
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={validating || !couponInput.trim()}
                  className="rounded-lg border border-[#e03c31] px-4 py-2.5 text-[13px] font-bold text-[#e03c31] transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {validating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Áp dụng"}
                </button>
              </div>
            )}
            {couponError && (
              <p className="mt-1.5 text-[12px] font-medium text-[#e03c31]">{couponError}</p>
            )}
          </div>
          )}

          {isUpgrade && (
            <div className="mb-5 rounded-lg border border-blue-100 bg-blue-50 p-3 text-[12px] font-medium leading-relaxed text-blue-700">
              Khi đổi lên hạng cao hơn, hệ thống chỉ tính phí chênh lệch theo số ngày còn lại của gói hiện tại.
            </div>
          )}

          {insufficient && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2.5 text-amber-800">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
              <div className="text-[11px] leading-relaxed flex-1">
                <p className="font-bold mb-1.5">
                  Số dư ví ({formatMoney(balance)}) không đủ để thanh toán.
                </p>
                <Link
                  href="/nguoi-ban/nap-tien"
                  className="inline-block bg-[#e03c31] text-white px-3 py-1.5 rounded-md font-bold hover:bg-[#c9362c] transition-colors shadow-sm"
                >
                  Nạp tiền
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="p-5 border-t border-gray-100 bg-white">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[13px] text-gray-600 font-bold">Tổng tiền</span>
            <div className="text-right">
              {applied && applied.discount > 0 && (
                <span className="mr-2 text-[13px] text-gray-400 line-through">
                  {formatMoney(pricePerMonth)}
                </span>
              )}
              <span className="text-[20px] font-extrabold text-[#e03c31]">
                {formatMoney(total)}
              </span>
            </div>
          </div>
          <button
            onClick={() => onConfirm(applied?.code)}
            disabled={submitting || insufficient}
            className={`w-full py-3.5 rounded-lg text-white text-[13px] font-bold transition-colors flex items-center justify-center gap-2 ${
              submitting || insufficient
                ? "bg-[#fca5a5] cursor-not-allowed"
                : "bg-[#e03c31] hover:bg-[#c9362c]"
            }`}
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitting
              ? "Đang xử lý..."
              : isUpgrade
                ? "Xác nhận đổi hạng"
                : "Thanh Toán"}
          </button>
        </div>
      </div>
    </div>
  );
}
