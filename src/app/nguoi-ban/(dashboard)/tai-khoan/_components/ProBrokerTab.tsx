import React from "react";
import { Info } from "lucide-react";

export function ProBrokerTab() {
  return (
    <div className="space-y-8">
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-[#fff6f6] flex items-center justify-center shrink-0">
            <Info className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Tham gia Môi giới chuyên nghiệp
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4 font-medium">
              Trở thành Môi giới chuyên nghiệp trên Batdongsan.com.vn để nhận được
              nhiều lợi ích:
            </p>
            <ul className="space-y-2 text-sm text-gray-600 mb-5">
              <li className="flex items-start gap-2 font-medium">
                <span className="text-primary font-bold mt-0.5">&bull;</span>
                Tăng độ tin cậy với khách hàng
              </li>
              <li className="flex items-start gap-2 font-medium">
                <span className="text-primary font-bold mt-0.5">&bull;</span>
                Hiển thị huy hiệu chuyên nghiệp trên tin đăng
              </li>
              <li className="flex items-start gap-2 font-medium">
                <span className="text-primary font-bold mt-0.5">&bull;</span>
                Tiếp cận nhiều khách hàng tiềm năng hơn
              </li>
              <li className="flex items-start gap-2 font-medium">
                <span className="text-primary font-bold mt-0.5">&bull;</span>
                Ưu tiên hiển thị trong danh sách môi giới
              </li>
            </ul>
            <button
              type="button"
              className="bg-primary hover:bg-[#c42c23] text-white px-8 py-3 rounded-lg font-bold text-sm transition-colors shadow-sm"
            >
              Đăng ký ngay
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
