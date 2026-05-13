"use client";

import React, { useMemo, useState } from "react";
import { Info, Crown, Ticket, ChevronRight, Calendar, ChevronDown } from "lucide-react";

export type PackageId = "diamond" | "gold" | "silver" | "standard";
export type DurationDays = 10 | 15 | 30;

export const PACKAGE_PRICES: Record<PackageId, number> = {
  diamond: 270700,
  gold: 106400,
  silver: 48400,
  standard: 2900,
};

export function Step3({ onBack, onSubmit, isSubmitting = false, submitMessage = "" }: { onBack: () => void; onSubmit: (packageId: PackageId, durationDays: DurationDays) => void | Promise<void>; isSubmitting?: boolean; submitMessage?: string }) {
  const [selectedPackage, setSelectedPackage] = useState<PackageId>("standard");
  const [selectedDuration, setSelectedDuration] = useState<DurationDays>(15);
  const total = useMemo(() => PACKAGE_PRICES[selectedPackage] * selectedDuration, [selectedPackage, selectedDuration]);

  const packages: {
    id: PackageId;
    name: string;
    subtitle: string;
    badge: string | null;
    badgeText: string | null;
    badgeColor: string | null;
    price: string;
  }[] = [
    {
      id: "diamond",
      name: "VIP Kim Cương",
      subtitle: "Hiển thị trên cùng",
      badge: "x30",
      badgeText: "lượt liên hệ so với tin thường",
      badgeColor: "bg-[#e03c31]",
      price: "270.700 đ/ngày"
    },
    {
      id: "gold",
      name: "VIP Vàng",
      subtitle: "Dưới VIP Kim Cương",
      badge: "x15",
      badgeText: "lượt liên hệ so với tin thường",
      badgeColor: "bg-[#eab308]",
      price: "106.400 đ/ngày"
    },
    {
      id: "silver",
      name: "VIP Bạc",
      subtitle: "Dưới VIP Vàng",
      badge: "x8",
      badgeText: "lượt liên hệ so với tin thường",
      badgeColor: "bg-[#0d9488]",
      price: "48.400 đ/ngày"
    },
    {
      id: "standard",
      name: "Tin Thường",
      subtitle: "Hiển thị dưới cùng",
      badge: null,
      badgeText: null,
      badgeColor: null,
      price: "2.900 đ/ngày"
    }
  ];

  const durations: { days: DurationDays; label: string; price: string }[] = [
    { days: 10, label: "10 ngày", price: "2.900 đ/ngày" },
    { days: 15, label: "15 ngày", price: "2.600 đ/ngày" },
    { days: 30, label: "30 ngày", price: "2.300 đ/ngày" },
  ];

  return (
    <div className="flex-1 w-[800px] max-w-full mx-auto px-4 py-8 pb-48">
      {/* Chọn loại tin */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-[16px] text-[#2c2c2c]">Chọn loại tin</h2>
          <a href="#" className="text-[13px] text-gray-500 hover:text-[#e03c31] flex items-center gap-1 transition-colors">
            So sánh các loại tin và giá <Info size={14} />
          </a>
        </div>

        <div className="flex items-start gap-2 text-[13px] text-gray-700 mb-6 bg-[#fff9c4] p-2.5 rounded-lg border border-[#fef08a]">
          <span className="text-lg leading-none">💡</span>
          <span>Tin VIP có lượt liên hệ cao hơn Tin Thường từ 8-30 lần</span>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              onClick={() => setSelectedPackage(pkg.id)}
              className={`relative border rounded-xl p-4 cursor-pointer transition-all flex flex-col min-h-[160px] ${
                selectedPackage === pkg.id
                  ? "border-[#2c2c2c] border-2 shadow-sm bg-white"
                  : "border-gray-300 hover:border-gray-400 bg-white"
              }`}
            >
              <div className="mb-1 flex items-center justify-between">
                {/* Visual representation of lines */}
                <div className="flex flex-col gap-[3px]">
                  <div className={`h-1.5 w-6 rounded-full ${pkg.id === "diamond" ? "bg-[#e03c31]" : pkg.id === "gold" ? "bg-[#eab308]" : pkg.id === "silver" ? "bg-[#0d9488]" : "bg-[#2c2c2c]"}`}></div>
                  <div className="h-1.5 w-4 rounded-full bg-gray-200"></div>
                  <div className="h-1.5 w-8 rounded-full bg-gray-200"></div>
                </div>
              </div>

              <h3 className={`font-bold mt-3 mb-1 ${selectedPackage === pkg.id ? "text-[#2c2c2c]" : "text-gray-800"}`}>{pkg.name}</h3>
              <p className="text-[12px] text-gray-500 mb-3 leading-tight">{pkg.subtitle}</p>

              {pkg.badge && (
                <div className="flex items-start gap-1.5 mb-3 mt-auto">
                  <span className={`${pkg.badgeColor} text-white text-[10px] font-bold px-1.5 py-0.5 rounded`}>
                    {pkg.badge}
                  </span>
                  <span className="text-[11px] text-gray-500 leading-tight pr-2">
                    {pkg.badgeText}
                  </span>
                </div>
              )}

              <div className={`mt-auto pt-2 font-bold ${selectedPackage === pkg.id ? "text-[#2c2c2c]" : "text-gray-800"}`}>
                {pkg.price}
              </div>
            </div>
          ))}
        </div>

        {/* Duration Selection */}
        <div className="bg-[#f2f2f2] p-5 rounded-xl mb-8">
          <h3 className="font-bold text-[14px] text-[#2c2c2c] mb-4">Đăng dài ngày hơn, tiết kiệm hơn!</h3>
          <div className="grid grid-cols-3 gap-4">
            {durations.map((duration) => (
              <div
                key={duration.days}
                onClick={() => setSelectedDuration(duration.days)}
                className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-colors ${
                  selectedDuration === duration.days
                    ? "bg-white border-[#2c2c2c] shadow-sm"
                    : "bg-white border-transparent hover:border-gray-300"
                }`}
              >
                <div>
                  <div className={`font-bold text-[15px] mb-1 ${selectedDuration === duration.days ? "text-[#2c2c2c]" : "text-gray-800"}`}>
                    {duration.label}
                  </div>
                  <div className="text-[13px] text-gray-500">{duration.price}</div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedDuration === duration.days ? "border-[#2c2c2c]" : "border-gray-300"
                }`}>
                  {selectedDuration === duration.days && (
                    <div className="w-2.5 h-2.5 bg-[#2c2c2c] rounded-full"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Date and Time Configuration */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-[14px] font-bold text-[#2c2c2c] mb-2">Ngày bắt đầu</label>
            <div className="relative">
              <input
                type="text"
                value="01/04/2026"
                readOnly
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-[#2c2c2c] text-[14px] bg-white cursor-pointer"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-[18px] h-[18px]" />
            </div>
            <p className="text-[12px] text-gray-500 mt-2">Kết thúc ngày 16/04/2026</p>
          </div>
          <div>
            <label className="block text-[14px] font-bold text-[#2c2c2c] mb-2">Hẹn giờ đăng tin</label>
            <div className="relative">
              <select className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-[#2c2c2c] text-[14px] bg-[#f9f9f9] appearance-none cursor-pointer text-gray-700">
                <option>Đăng ngay bây giờ</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-[18px] h-[18px] pointer-events-none" />
            </div>
            <p className="text-[12px] text-gray-500 mt-2">Chỉ áp dụng với tài khoản Pro & tin VIP</p>
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10 shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.05)] flex justify-center">
        <div className="w-[800px] max-w-full flex flex-col p-4">

          {/* VIP Callout */}
          <div className="bg-[#fff0f1] rounded-xl p-3 flex items-center justify-between mb-3 border border-red-50 cursor-pointer hover:border-red-100 transition-colors">
            <div className="flex items-center gap-2">
              <Crown className="text-[#e03c31] w-[18px] h-[18px] fill-current" />
              <span className="font-bold text-[14px] text-gray-800">Gói Tin VIP ưu đãi riêng cho bạn - Tiết kiệm 300.000 đ</span>
            </div>
            <span className="font-bold text-[14px] text-gray-800 hover:text-[#e03c31] hover:underline">Xem gói</span>
          </div>

          {/* Promotions */}
          <div className="flex items-center justify-between py-2 mb-2 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Ticket className="text-gray-500 w-5 h-5" />
              <span className="text-[14px] text-gray-700">Khuyến mãi</span>
            </div>
            <button className="flex items-center gap-1 text-[#0d9488] font-bold text-[14px] hover:underline group">
              Miễn phí 1 tin thường 15 ngày cho Khách hàng mới.
              <ChevronRight className="w-4 h-4 text-gray-500 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {submitMessage && (
            <div className="mb-3 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-[#e03c31]">
              {submitMessage}
            </div>
          )}

          {/* Actions & Price */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={onBack}
              className="border border-[#2c2c2c] hover:bg-gray-50 text-[#2c2c2c] px-6 py-2.5 rounded-full font-bold text-[14px] transition-colors bg-white shrink-0"
            >
              Quay lại
            </button>

            <div className="flex items-center gap-6 shrink-0">
              <div className="text-right">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[14px] text-gray-700">Tổng tiền</span>
                  <span className="text-[20px] font-bold text-[#2c2c2c]">{total.toLocaleString("vi-VN")} đ</span>
                </div>
              </div>
              <button
                onClick={() => onSubmit(selectedPackage, selectedDuration)}
                disabled={isSubmitting}
                className="bg-[#e03c31] hover:bg-[#c9362c] text-white px-8 py-2.5 rounded-full font-bold text-[14px] transition-colors shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Đang gửi..." : "Tiếp tục"}
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
