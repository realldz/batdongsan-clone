import React from "react";

interface DurationSelectorProps {
  selectedDuration: number;
  onSelect: (days: number) => void;
  pricePerDay: number;
}

export function DurationSelector({ selectedDuration, onSelect, pricePerDay }: DurationSelectorProps) {
  const options = [
    { days: 10, discount: 0 },
    { days: 15, discount: 0.1 }, // 10% off
    { days: 30, discount: 0.2 }, // 20% off
  ];

  return (
    <div className="mb-8 border-t border-gray-200 pt-8">
      <h2 className="font-bold text-[16px] text-[#2c2c2c] mb-4">2. Chọn thời hạn đăng tin</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {options.map((option) => {
          const originalPrice = option.days * pricePerDay;
          const finalPrice = Math.round(originalPrice * (1 - option.discount));
          const finalPricePerDay = Math.round(finalPrice / option.days);

          return (
            <button
              key={option.days}
              onClick={() => onSelect(option.days)}
              className={`relative flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                selectedDuration === option.days
                  ? "border-primary bg-red-50"
                  : "border-gray-200 hover:border-red-200 bg-white"
              }`}
            >
              {option.discount > 0 && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[#17A2B8] text-white text-[11px] font-bold rounded-full whitespace-nowrap">
                  Tiết kiệm {option.discount * 100}%
                </span>
              )}
              <div className="font-bold text-lg mb-1">{option.days} ngày</div>
              <div className="text-sm font-bold text-gray-900">
                {finalPricePerDay.toLocaleString("vi-VN")} đ <span className="font-normal text-gray-500">/ngày</span>
              </div>
              {option.discount > 0 && (
                <div className="text-xs text-gray-400 line-through mt-1">
                  {pricePerDay.toLocaleString("vi-VN")} đ /ngày
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
