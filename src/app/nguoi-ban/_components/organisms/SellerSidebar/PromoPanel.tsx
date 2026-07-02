import React from "react";
import Link from "next/link";
import { Gift, Crown, BadgePercent } from "lucide-react";

export function PromoPanel() {
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="p-5 border-b border-gray-100">
        <h3 className="font-bold text-gray-900 text-base">Ưu đãi</h3>
      </div>
      <div className="py-2">
        <Link
          href="#"
          className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors"
        >
          <Gift className="w-[18px] h-[18px] text-pink-500" strokeWidth={2} />
          <div className="flex flex-col">
            <span className="text-[13px] font-medium text-gray-800">
              Gói tin Sài Gòn 1k/ngày
            </span>
            <span className="text-[11px] font-bold text-primary">Mới</span>
          </div>
        </Link>
        <Link
          href="#"
          className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors"
        >
          <Gift className="w-[18px] h-[18px] text-orange-500" strokeWidth={2} />
          <span className="text-[13px] font-medium text-gray-800">
            Gói voucher tiết kiệm
          </span>
        </Link>
        <Link
          href="#"
          className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors"
        >
          <Crown className="w-[18px] h-[18px] text-yellow-500" strokeWidth={2} />
          <span className="text-[13px] font-medium text-gray-800">
            Gói voucher Tin VIP
          </span>
        </Link>
        <Link
          href="#"
          className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors"
        >
          <BadgePercent
            className="w-[18px] h-[18px] text-green-500"
            strokeWidth={2}
          />
          <span className="text-[13px] font-medium text-gray-800">
            Gói voucher Đẩy tin
          </span>
        </Link>
        <Link
          href="#"
          className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors"
        >
          <Gift className="w-[18px] h-[18px] text-primary" strokeWidth={2} />
          <span className="text-[13px] font-medium text-gray-800">
            Khuyến mãi của tôi
          </span>
        </Link>
      </div>
    </div>
  );
}
