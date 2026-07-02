import React from "react";
import Link from "next/link";
import { FileText, CreditCard, BookOpen } from "lucide-react";

export function GuidePanel() {
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="p-5 border-b border-gray-100">
        <h3 className="font-bold text-gray-900 text-base">Báo giá & Hướng dẫn</h3>
      </div>
      <div className="py-2">
        <Link
          href="#"
          className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors text-gray-700"
        >
          <FileText className="w-[18px] h-[18px] text-gray-400" strokeWidth={2} />
          <span className="text-[13px] font-medium">Báo giá</span>
        </Link>
        <Link
          href="#"
          className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors text-gray-700"
        >
          <CreditCard
            className="w-[18px] h-[18px] text-gray-400"
            strokeWidth={2}
          />
          <span className="text-[13px] font-medium">Hướng dẫn thanh toán</span>
        </Link>
        <Link
          href="#"
          className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors text-gray-700"
        >
          <BookOpen className="w-[18px] h-[18px] text-gray-400" strokeWidth={2} />
          <span className="text-[13px] font-medium">Hướng dẫn sử dụng</span>
        </Link>
      </div>
    </div>
  );
}
