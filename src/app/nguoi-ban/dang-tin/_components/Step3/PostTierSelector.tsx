import React from "react";
import { type PricingTier } from "./usePricingData";

interface PostTierSelectorProps {
  tiers: PricingTier[];
  selectedTier: number;
  onSelect: (tierId: number) => void;
  onCompare: () => void;
}

export function PostTierSelector({ tiers, selectedTier, onSelect, onCompare }: PostTierSelectorProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-[16px] text-[#2c2c2c]">1. Chọn loại tin đăng</h2>
        <button
          type="button"
          onClick={onCompare}
          className="text-[13px] font-medium text-primary hover:underline"
        >
          So sánh các loại tin và giá
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {tiers.map((tier) => (
          <button
            key={tier.id}
            onClick={() => onSelect(tier.id)}
            className={`relative flex flex-col text-left p-4 rounded-xl border-2 transition-all ${
              selectedTier === tier.id
                ? "border-primary bg-red-50"
                : "border-gray-200 hover:border-red-200 bg-white"
            }`}
          >
            {tier.badge && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-primary text-white text-[11px] font-bold rounded-full whitespace-nowrap">
                {tier.badge}
              </span>
            )}
            <div className="text-2xl mb-2">{tier.icon}</div>
            <div className={`font-bold mb-1 ${tier.color}`}>{tier.name}</div>
            <p className="text-xs text-gray-500 mb-3 flex-1">{tier.description}</p>
            <div className="font-bold text-gray-900">
              {tier.pricePerDay.toLocaleString("vi-VN")} đ <span className="text-xs font-normal text-gray-500">/ngày</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
