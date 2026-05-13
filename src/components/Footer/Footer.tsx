import Link from "next/link";
import React from "react";

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-20 pt-10 pb-6 text-sm">
      <div className="max-w-[1240px] mx-auto px-4 lg:px-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-1 mb-4">
              <div className="bg-primary text-white p-1 rounded-sm flex items-center justify-center font-bold tracking-tight leading-none">
                BĐS
              </div>
              <span className="text-primary font-bold tracking-tight leading-none">
                .com.vn
              </span>
            </div>
            <p className="text-gray-500 mb-4 text-xs leading-relaxed">
              Tầng 31, Keangnam Hanoi Landmark, Phạm Hùng, Nam Từ Liêm, Hà Nội
              <br />
              024 3562 5939 - 024 3562 5940
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-[#2c2c2c] mb-4">Hướng dẫn</h4>
            <ul className="space-y-2 text-gray-600">
              <li><Link href="#" className="hover:text-primary transition-colors">Báo giá & hỗ trợ</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Câu hỏi thường gặp</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Thông báo</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Quy định cần biết</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#2c2c2c] mb-4">Về chúng tôi</h4>
            <ul className="space-y-2 text-gray-600">
              <li><Link href="#" className="hover:text-primary transition-colors">Giới thiệu</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Tuyển dụng</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Truyền thông</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Thỏa thuận sử dụng</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#2c2c2c] mb-4">Tải ứng dụng</h4>
            <div className="flex flex-col gap-2">
              <div className="bg-gray-100 p-3 rounded text-center text-gray-600 hover:bg-gray-200 cursor-pointer transition-colors text-xs font-medium">
                Tải cho iOS
              </div>
              <div className="bg-gray-100 p-3 rounded text-center text-gray-600 hover:bg-gray-200 cursor-pointer transition-colors text-xs font-medium">
                Tải cho Android
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-6 text-center text-gray-400 text-xs">
          Copyright © 2026 Batdongsan.com.vn
        </div>
      </div>
    </footer>
  );
};
