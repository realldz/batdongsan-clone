import React from "react";
import Link from "next/link";
import {
  LayoutList,
  EyeOff,
  AlertCircle,
  Info,
  Lightbulb,
  ChevronRight,
  Image as ImageIcon,
  User,
  Plus,
} from "lucide-react";

export function OverviewInfoSection() {
  return (
    <section>
      <h2 className="text-[22px] font-bold text-gray-900 mb-5 tracking-tight">
        Thông tin dành riêng cho bạn
      </h2>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        <button className="bg-gray-900 text-white px-5 py-2 rounded-full font-bold flex items-center gap-2 shadow-sm">
          <LayoutList className="w-4 h-4 stroke-[2.5]" /> Tất cả
        </button>
        <button className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 px-5 py-2 rounded-full font-bold flex items-center gap-2 transition-colors shadow-sm">
          <EyeOff className="w-4 h-4 stroke-[2.5]" /> Đã tạm ẩn
        </button>
      </div>

      {/* 3 Columns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Col 1: Quan trọng */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary font-bold">
              <AlertCircle className="w-5 h-5 fill-red-100" /> Quan trọng
            </div>
            <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shadow-sm">
              1
            </div>
          </div>

          <div className="bg-primary text-white p-8 rounded-xl text-center flex flex-col items-center shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full translate-y-8 -translate-x-8"></div>

            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-6 z-10">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-90"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </div>
            <h3 className="font-extrabold text-[22px] mb-3 z-10 leading-tight">
              Quà tặng 1 tin thường 15 ngày
            </h3>
            <p className="text-red-50 mb-8 font-medium leading-relaxed z-10 px-2">
              Tin đăng của bạn sẽ được tiếp cận hơn 6 triệu người tìm mua/thuê bất
              động sản mỗi tháng
            </p>
            <Link
              href="/nguoi-ban/dang-tin"
              className="bg-white text-primary font-bold px-6 py-3.5 rounded-full hover:bg-red-50 transition-colors w-full shadow-sm z-10 block text-center"
            >
              + Tạo tin đăng đầu tiên
            </Link>
          </div>
        </div>

        {/* Col 2: Thông tin */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-600 font-bold">
              <Info className="w-5 h-5 fill-emerald-100" /> Thông tin
            </div>
            <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shadow-sm">
              0
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 flex items-start gap-4 shadow-sm hover:border-gray-300 transition-colors">
            <div className="text-3xl leading-none">👏</div>
            <div className="text-gray-900 font-bold leading-snug">
              Bạn đã cập nhật tất cả thông tin của ngày hôm nay
            </div>
          </div>
        </div>

        {/* Col 3: Gợi ý */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-teal-600 font-bold">
              <Lightbulb className="w-5 h-5 fill-teal-100" /> Gợi ý
            </div>
            <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shadow-sm">
              2
            </div>
          </div>

          {/* Suggestion 1 */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-gray-300 transition-colors">
            <div className="text-xs text-teal-600 font-extrabold flex items-center gap-1.5 mb-3 uppercase tracking-wide">
              <div className="w-2 h-2 rounded-full bg-teal-600"></div> Gợi ý
            </div>
            <h3 className="font-extrabold text-lg mb-2 text-gray-900 leading-tight">
              Làm quen với trang Tổng quan!
            </h3>
            <p className="text-gray-600 mb-5 font-medium leading-relaxed">
              Hướng dẫn bạn làm quen và thao tác với một số nội dung chính, giúp
              bạn có trải nghiệm tốt hơn.
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-3 text-gray-800 font-medium">
                <LayoutList className="w-5 h-5 text-gray-400 shrink-0 stroke-[2]" />{" "}
                Thông tin tổng quan về tài khoản của bạn
              </li>
              <li className="flex items-start gap-3 text-gray-800 font-medium">
                <User className="w-5 h-5 text-gray-400 shrink-0 stroke-[2]" />{" "}
                Thông tin cá nhân hoá dành riêng cho bạn
              </li>
              <li className="flex items-start gap-3 text-gray-800 font-medium">
                <EyeOff className="w-5 h-5 text-gray-400 shrink-0 stroke-[2]" /> Ẩn
                những thông tin mà bạn thấy không hữu ích
              </li>
            </ul>
            <button className="w-full py-2.5 border border-gray-300 rounded-lg font-bold hover:bg-gray-50 transition-colors text-gray-800">
              Xem hướng dẫn
            </button>
          </div>

          {/* Suggestion 2 */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-gray-300 transition-colors">
            <div className="text-xs text-teal-600 font-extrabold flex items-center gap-1.5 mb-3 uppercase tracking-wide">
              <div className="w-2 h-2 rounded-full bg-teal-600"></div> Gợi ý
            </div>
            <h3 className="font-extrabold text-lg mb-5 text-gray-900">
              Làm quen với Batdongsan.com.vn
            </h3>

            <div className="space-y-0">
              <div className="flex items-start justify-between cursor-pointer group py-4 border-b border-gray-100 first:pt-0">
                <div className="flex gap-4">
                  <ImageIcon className="w-[22px] h-[22px] text-gray-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors leading-tight">
                      Cập nhật tên và hình ảnh đại diện
                    </div>
                    <div className="text-gray-500 font-medium leading-relaxed pr-2">
                      Tên và hình ảnh sẽ appear ở tất cả các tin đăng của bạn,
                      điều đó sẽ giúp bạn cận người mua dễ dàng hơn.
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
              </div>

              <div className="flex items-center justify-between cursor-pointer group py-4 border-b border-gray-100">
                <div className="flex gap-4 items-center">
                  <LayoutList className="w-[22px] h-[22px] text-gray-500 shrink-0" />
                  <div className="font-bold text-gray-900 group-hover:text-primary transition-colors">
                    Khám phá sổ tay đăng tin
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
              </div>

              <div className="flex items-start justify-between cursor-pointer group py-4 border-b border-gray-100">
                <div className="flex gap-4">
                  <div className="w-[22px] h-[22px] rounded-full border-2 border-gray-400 flex items-center justify-center shrink-0 text-gray-500 mt-0.5">
                    <Plus className="w-3 h-3 stroke-[3]" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors leading-tight">
                      Và bạn đã sẵn sàng để đăng tin đầu tiên. Bắt đầu ngay!
                    </div>
                    <div className="text-gray-500 font-medium leading-relaxed pr-2">
                      Batdongsan.com.vn tặng bạn một tin thường 15 ngày để bắt đầu
                      đăng tin.
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
