"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-store";
import { useWalletBalance } from "@/lib/use-wallet-balance";
import { useClickOutside } from "@/hooks/useClickOutside";
import {
  LogOut, Wallet, Receipt, Gift, Crown, Briefcase, Settings, HelpCircle, User as UserIcon
} from "lucide-react";

export function SellerProfileMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const initial = user?.fullName?.charAt(0)?.toUpperCase() ?? "U";
  const displayName = user?.fullName ?? "Người dùng";
  const wallet = useWalletBalance();

  useClickOutside(profileRef, () => setIsProfileOpen(false));

  return (
    <div className="relative" ref={profileRef}>
      <button
        onClick={() => setIsProfileOpen(!isProfileOpen)}
        className="w-10 h-10 bg-primary border-2 border-white shadow-sm rounded-full flex items-center justify-center text-white hover:bg-primary-hover transition-colors text-lg font-bold"
      >
        {initial}
      </button>

      {isProfileOpen && (
        <div className="absolute right-0 top-[calc(100%+8px)] w-[320px] bg-white rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden text-[13px] text-gray-700 animate-in fade-in slide-in-from-top-2">
          <div className="p-4 bg-[#fff6f6] border-b border-red-100 flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold">
              {initial}
            </div>
            <div>
              <div className="font-bold text-[15px] text-gray-900">{displayName}</div>
              <div className="text-gray-500 mt-0.5">0 điểm</div>
            </div>
          </div>

          <div className="max-h-[calc(100vh-120px)] overflow-y-auto pb-2 custom-scrollbar">
            {/* Số dư block */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-gray-900 text-sm">Số dư</span>
                <span className="font-bold text-primary text-[15px]">{wallet.total}</span>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center text-gray-600">
                  <span>Tài khoản chính</span>
                  <span className="font-bold">{wallet.main}</span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                  <span>Tài khoản khuyến mãi</span>
                  <span className="font-bold">{wallet.promotion}</span>
                </div>
              </div>
              <Link href="/nguoi-ban/nap-tien" className="flex items-center justify-center gap-2 w-full bg-gray-900 hover:bg-black text-white font-bold py-2.5 rounded-lg transition-colors">
                Nạp Tiền
              </Link>
            </div>

            {/* Quản lý block */}
            <div className="py-2 border-b border-gray-100">
              <div className="px-4 py-2 font-bold text-gray-400 text-[11px] uppercase tracking-wider">Quản lý</div>
              <Link href="/nguoi-ban/thong-tin-so-du" className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors">
                <Wallet className="w-5 h-5 text-gray-400" />
                <span className="font-medium text-gray-800">Thông tin số dư</span>
              </Link>
              <Link href="/nguoi-ban/lich-su-giao-dich" className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors">
                <Receipt className="w-5 h-5 text-gray-400" />
                <span className="font-medium text-gray-800">Lịch sử giao dịch</span>
              </Link>
            </div>

            {/* Ưu đãi block */}
            <div className="py-2 border-b border-gray-100">
              <div className="px-4 py-2 font-bold text-gray-400 text-[11px] uppercase tracking-wider">Ưu đãi</div>
              <Link href="#" className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors">
                <Gift className="w-5 h-5 text-gray-400" />
                <span className="font-medium text-gray-800">Khuyến mãi của tôi</span>
              </Link>
            </div>

            {/* Hoạt động hiệu quả block */}
            <div className="py-2 border-b border-gray-100">
              <div className="px-4 py-2 font-bold text-gray-400 text-[11px] uppercase tracking-wider">Hoạt động hiệu quả hơn</div>
              <Link href="/nguoi-ban/goi-hoi-vien" className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors group">
                <div className="flex items-center gap-3">
                  <Crown className="w-5 h-5 text-[#f59e0b]" />
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800">Gói Hội viên</span>
                    <span className="text-[11px] text-primary font-bold">Tiết kiệm đến 39%</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-gray-400 group-hover:text-primary transition-colors">Đăng ký mua</span>
              </Link>
            </div>

            {/* Hỗ trợ block */}
            <div className="py-2">
              <div className="px-4 py-2 font-bold text-gray-400 text-[11px] uppercase tracking-wider">Tài khoản & Hỗ trợ</div>
              <Link href="/nguoi-ban/tai-khoan" className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors">
                <UserIcon className="w-5 h-5 text-gray-400" />
                <span className="font-medium text-gray-800">Cài đặt tài khoản</span>
              </Link>
              <Link href="/nguoi-ban/tai-khoan?tab=mat-khau" className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors">
                <Settings className="w-5 h-5 text-gray-400" />
                <span className="font-medium text-gray-800">Đổi mật khẩu</span>
              </Link>
              <button onClick={() => { logout(); router.push('/'); }} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left mt-2 border-t border-gray-100">
                <LogOut className="w-5 h-5 text-gray-400" />
                <span className="font-medium text-gray-800">Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
