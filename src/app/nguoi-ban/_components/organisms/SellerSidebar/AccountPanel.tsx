import React from "react";
import Link from "next/link";
import {
  LayoutList,
  Users,
  Wallet,
  Receipt,
  Crown,
  Briefcase,
  Settings,
  KeyRound,
} from "lucide-react";
import { WalletSummary } from "../../molecules/WalletSummary";

interface AccountPanelProps {
  initial: string;
  displayName: string;
  wallet: {
    total: string;
    main: string;
    promotion: string;
    code?: string;
  };
}

export function AccountPanel({
  initial,
  displayName,
  wallet,
}: AccountPanelProps) {
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* User Info */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 bg-primary rounded-full flex items-center justify-center text-white text-lg font-bold">
            {initial}
          </div>
          <div>
            <div className="font-bold text-gray-900 text-[15px]">
              {displayName}
            </div>
            <div className="text-gray-500 text-xs">0 điểm</div>
          </div>
        </div>

        <WalletSummary wallet={wallet} showCode={true} variant="card" />

        <Link
          href="/nguoi-ban/nap-tien"
          className="mt-3 flex items-center justify-center gap-2 w-full bg-gray-900 hover:bg-black text-white font-bold py-2.5 rounded-lg transition-colors text-sm"
        >
          Nạp tiền
        </Link>
      </div>

      {/* Quản lý */}
      <div className="py-2">
        <div className="px-5 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
          Quản lý
        </div>
        <Link
          href="/nguoi-ban/tin-dang"
          className="flex items-center gap-3 px-5 py-2.5 hover:bg-gray-50 transition-colors text-gray-700"
        >
          <LayoutList
            className="w-[18px] h-[18px] text-gray-400"
            strokeWidth={2}
          />
          <span className="text-[13px] font-medium">Quản lý tin đăng</span>
        </Link>
        <Link
          href="/nguoi-ban/khach-hang"
          className="flex items-center gap-3 px-5 py-2.5 hover:bg-gray-50 transition-colors text-gray-700"
        >
          <Users className="w-[18px] h-[18px] text-gray-400" strokeWidth={2} />
          <span className="text-[13px] font-medium">Quản lý khách hàng</span>
        </Link>
        <Link
          href="/nguoi-ban/thong-tin-so-du"
          className="flex items-center gap-3 px-5 py-2.5 hover:bg-gray-50 transition-colors text-gray-700"
        >
          <Wallet className="w-[18px] h-[18px] text-gray-400" strokeWidth={2} />
          <span className="text-[13px] font-medium">Thông tin số dư</span>
        </Link>
        <Link
          href="/nguoi-ban/lich-su-giao-dich"
          className="flex items-center gap-3 px-5 py-2.5 hover:bg-gray-50 transition-colors text-gray-700"
        >
          <Receipt className="w-[18px] h-[18px] text-gray-400" strokeWidth={2} />
          <span className="text-[13px] font-medium">Lịch sử giao dịch</span>
        </Link>
      </div>

      {/* Hoạt động hiệu quả */}
      <div className="py-2 border-t border-gray-100">
        <div className="px-5 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
          Hoạt động hiệu quả hơn
        </div>
        <Link
          href="#"
          className="flex items-center justify-between px-5 py-2.5 hover:bg-gray-50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <Crown
              className="w-[18px] h-[18px] text-[#f59e0b]"
              strokeWidth={2}
            />
            <div className="flex flex-col">
              <span className="text-[13px] font-medium text-gray-800">
                Gói Hội viên
              </span>
              <span className="text-[11px] font-bold text-primary">
                Tiết kiệm đến 39%
              </span>
            </div>
          </div>
          <span className="text-[11px] font-bold text-gray-400 group-hover:text-primary transition-colors">
            Đăng ký mua
          </span>
        </Link>
        <Link
          href="#"
          className="flex items-center justify-between px-5 py-2.5 hover:bg-gray-50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <Briefcase
              className="w-[18px] h-[18px] text-blue-600"
              strokeWidth={2}
            />
            <span className="text-[13px] font-medium text-gray-800">
              Tài khoản doanh nghiệp
            </span>
          </div>
          <span className="text-[11px] font-bold text-gray-400 group-hover:text-blue-600 transition-colors">
            Đăng ký
          </span>
        </Link>
      </div>

      {/* Tài khoản & Hỗ trợ */}
      <div className="py-2 border-t border-gray-100">
        <div className="px-5 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
          Tài khoản & Hỗ trợ
        </div>
        <Link
          href="/nguoi-ban/tai-khoan"
          className="flex items-center gap-3 px-5 py-2.5 hover:bg-gray-50 transition-colors text-gray-700"
        >
          <Settings
            className="w-[18px] h-[18px] text-gray-400"
            strokeWidth={2}
          />
          <span className="text-[13px] font-medium">Cài đặt tài khoản</span>
        </Link>
        <Link
          href="/nguoi-ban/tai-khoan?tab=mat-khau"
          className="flex items-center gap-3 px-5 py-2.5 hover:bg-gray-50 transition-colors text-gray-700"
        >
          <KeyRound
            className="w-[18px] h-[18px] text-gray-400"
            strokeWidth={2}
          />
          <span className="text-[13px] font-medium">Đổi mật khẩu</span>
        </Link>
      </div>
    </div>
  );
}
