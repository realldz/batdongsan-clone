import React from "react";
import Link from "next/link";
import { LayoutList, Crown, ChevronRight } from "lucide-react";

interface OverviewAccountSectionProps {
  wallet: {
    total: string;
    main: string;
    promotion: string;
  };
  activeListingCount?: number;
}

export function OverviewAccountSection({
  wallet,
  activeListingCount = 0,
}: OverviewAccountSectionProps) {
  return (
    <section>
      <h2 className="text-[22px] font-bold text-gray-900 mb-5 tracking-tight">
        Tổng quan tài khoản
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Box Số dư */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between hover:border-gray-300 transition-colors h-[180px]">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-gray-500 font-medium text-sm">Số dư</div>
              <div className="text-2xl font-extrabold text-gray-900">
                {wallet.total}
              </div>
            </div>
            <div className="space-y-1.5 mt-4 text-sm">
              <div className="flex justify-between items-center text-gray-600">
                <span>Tài khoản chính</span>
                <span className="font-bold text-gray-900">{wallet.main}</span>
              </div>
              <div className="flex justify-between items-center text-gray-600">
                <span>Tài khoản khuyến mãi</span>
                <span className="font-bold text-gray-900">
                  {wallet.promotion}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-end">
            <Link
              href="/nguoi-ban/nap-tien"
              className="bg-red-50 text-primary px-4 py-1.5 rounded-full font-bold hover:bg-red-100 transition-colors text-sm"
            >
              Nạp tiền
            </Link>
          </div>
        </div>

        {/* Tin đăng card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between hover:border-gray-300 transition-colors h-[180px]">
          <div>
            <div className="flex items-center gap-2 text-gray-800 mb-3 font-bold">
              <LayoutList className="w-[18px] h-[18px] stroke-[2.5]" />
              <span>Tin đăng</span>
            </div>
            <div className="text-[28px] font-extrabold text-gray-900 leading-none">
              {activeListingCount} tin
            </div>
            <div className="text-gray-500 font-medium mt-1.5">Đang hiển thị</div>
          </div>
          <Link
            href="/nguoi-ban/tin-dang"
            className="text-primary font-bold mt-auto hover:underline flex items-center gap-1 group w-max"
          >
            Đăng tin{" "}
            <ChevronRight className="w-[14px] h-[14px] group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Gói Hội viên card */}
        <div className="bg-[#fff6f6] p-6 rounded-xl border border-red-100 shadow-sm flex flex-col justify-between h-[180px] hover:border-red-200 transition-colors">
          <div>
            <div className="flex items-center gap-2 font-bold mb-3 text-gray-900 flex-wrap">
              <Crown className="w-[18px] h-[18px] text-gray-800" />
              <span>Gói Hội Viên</span>
              <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-[4px] flex items-center shadow-sm whitespace-nowrap">
                <svg
                  className="w-3 h-3 mr-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
                Tiết kiệm đến 39%
              </span>
            </div>
            <div className="text-gray-700 font-medium">
              Thảnh thơi đăng tin/đẩy tin không lo biến động giá
            </div>
          </div>
          <div className="mt-auto">
            <Link
              href="/nguoi-ban/goi-hoi-vien"
              className="bg-white border border-gray-300 px-5 py-2 rounded-full font-bold hover:bg-gray-50 transition-colors text-gray-800 shadow-sm"
            >
              Tìm hiểu ngay
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
