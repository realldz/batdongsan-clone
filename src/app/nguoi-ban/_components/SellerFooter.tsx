import Link from "next/link";

export function SellerFooter() {
  return (
    <footer className="mt-16 pt-8 border-t border-gray-200 text-gray-500 text-xs sm:text-sm font-medium">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {/* Company Info */}
        <div className="xl:col-span-1">
          <div className="flex items-center gap-2 font-bold text-gray-400 mb-4">
            <div className="w-8 h-8 flex items-center justify-center font-bold text-gray-400 border-2 border-gray-300 rounded text-[8px]">
              BĐS
            </div>
          </div>
          <p className="font-bold text-gray-700 mb-1.5 uppercase tracking-wide text-xs">CÔNG TY CỔ PHẦN PROPERTYGURU VIỆT NAM</p>
          <p className="leading-relaxed mb-1">Tầng 31, Keangnam Hanoi Landmark, Phạm Hùng, Yên Hòa, Cầu Giấy, Hà Nội</p>
          <p className="leading-relaxed mb-4">(024) 3562 5939 - (024) 3562 5940</p>
          <div className="flex gap-4 items-center">
            <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">QR</div>
            <div>
              <p className="font-bold text-gray-700 mb-1">Trải nghiệm trên ứng dụng</p>
              <p className="text-xs text-gray-500">Quét mã QR bằng điện thoại để tải ứng dụng.</p>
            </div>
          </div>
        </div>

        {/* Links Group 1 */}
        <div>
          <p className="font-bold text-gray-900 mb-4 uppercase tracking-wide">Hướng dẫn</p>
          <div className="flex flex-col gap-3">
            <Link href="#" className="hover:text-gray-800 transition-colors">Về chúng tôi</Link>
            <Link href="#" className="hover:text-gray-800 transition-colors">Báo giá & hỗ trợ</Link>
            <Link href="#" className="hover:text-gray-800 transition-colors">Câu hỏi thường gặp</Link>
            <Link href="#" className="hover:text-gray-800 transition-colors">Góp ý báo lỗi</Link>
            <Link href="#" className="hover:text-gray-800 transition-colors">Sitemap</Link>
          </div>
        </div>

        {/* Links Group 2 */}
        <div>
          <p className="font-bold text-gray-900 mb-4 uppercase tracking-wide">Quy định</p>
          <div className="flex flex-col gap-3">
            <Link href="#" className="hover:text-gray-800 transition-colors">Quy định đăng tin</Link>
            <Link href="#" className="hover:text-gray-800 transition-colors">Quy chế hoạt động</Link>
            <Link href="#" className="hover:text-gray-800 transition-colors">Điều khoản thỏa thuận</Link>
            <Link href="#" className="hover:text-gray-800 transition-colors">Chính sách bảo mật</Link>
            <Link href="#" className="hover:text-gray-800 transition-colors">Giải quyết khiếu nại</Link>
          </div>
        </div>

        {/* Contact */}
        <div>
          <p className="font-bold text-gray-900 mb-4 uppercase tracking-wide">Liên hệ</p>
          <div className="flex flex-col gap-4">
            <a href="tel:19001881" className="flex items-center gap-2 hover:text-gray-800 transition-colors font-bold text-base">
              <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">📞</span>
              1900 1881
            </a>
            <a href="https://trogiup.batdongsan.com.vn/" className="flex items-center gap-2 hover:text-gray-800 transition-colors">
              <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">🌐</span>
              trogiup.batdongsan.com.vn
            </a>
            <a href="mailto:hotro@batdongsan.com.vn" className="flex items-center gap-2 hover:text-gray-800 transition-colors">
              <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">✉️</span>
              hotro@batdongsan.com.vn
            </a>
          </div>
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <p>Copyright © 2007 - 2026 Batdongsan.com.vn</p>
        <div className="flex gap-4">
           {/* Social Icons Placeholder */}
           <div className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer"></div>
           <div className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer"></div>
           <div className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer"></div>
        </div>
      </div>
    </footer>
  );
}
