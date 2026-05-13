"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  PieChart, LayoutList, Users, BadgePercent, User, Plus,
  Settings, KeyRound, ChevronRight, LogOut,
  FileText, HelpCircle, CreditCard, BookOpen,
  Wallet, Receipt, Crown, Briefcase, Gift
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth-store";
import { useWalletBalance } from "@/lib/use-wallet-balance";

type ExpandableSection = "account" | "guide" | "promo" | null;

export function SellerSidebar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const initial = user?.fullName?.charAt(0)?.toUpperCase() ?? "U";
  const displayName = user?.fullName ?? "Người dùng";
  const pathname = usePathname();
  const wallet = useWalletBalance();
  const [expanded, setExpanded] = useState<ExpandableSection>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const rail = document.getElementById("seller-rail");
      if (
        expanded &&
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        rail &&
        !rail.contains(e.target as Node)
      ) {
        setExpanded(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [expanded]);

  const navItems = [
    { name: "Tổng quan", href: "/nguoi-ban", icon: PieChart },
    { name: "Tin đăng", href: "/nguoi-ban/tin-dang", icon: LayoutList },
    { name: "Khách hàng", href: "/nguoi-ban/khach-hang", icon: Users },
    { name: "Gói Hội viên", href: "/nguoi-ban/goi-hoi-vien", icon: BadgePercent, badge: "-39%" },
  ];

  const toggle = (section: ExpandableSection) => {
    setExpanded(expanded === section ? null : section);
  };

  const isAccountActive =
    pathname.startsWith("/nguoi-ban/tai-khoan") ||
    pathname.startsWith("/nguoi-ban/nap-tien") ||
    pathname.startsWith("/nguoi-ban/thong-tin-so-du") ||
    pathname.startsWith("/nguoi-ban/lich-su-giao-dich");

  return (
    <>
      {/* Icon Rail */}
      <aside
        id="seller-rail"
        style={{ zIndex: 50, position: "relative" }}
        className="w-[100px] bg-white border-r border-gray-200 flex flex-col items-center py-4 flex-shrink-0 shadow-sm"
      >
        <Link href="/" className="mb-6 flex flex-col items-center">
          <div className="w-12 h-12 flex items-center justify-center font-bold text-red-500 border-2 border-red-500 rounded text-xs bg-red-50">
            BĐS
          </div>
        </Link>

        <div className="w-full flex flex-col items-center mb-6 px-2">
          <Link href="/nguoi-ban/dang-tin" className="w-11 h-11 rounded-full bg-white border-2 border-red-500 text-red-500 flex items-center justify-center hover:bg-red-50 transition-colors mb-2">
            <Plus className="w-6 h-6 stroke-[3px]" />
          </Link>
          <span className="text-[11px] font-bold text-gray-800">Đăng tin</span>
        </div>

        <nav className="flex flex-col w-full">
          {navItems.map((item) => {
            const isActive =
              item.href === "/nguoi-ban"
                ? pathname === "/nguoi-ban"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setExpanded(null)}
                className={`relative flex flex-col items-center justify-center w-full py-4 hover:bg-gray-50 transition-colors ${isActive ? "text-red-600" : "text-gray-600"}`}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-600 rounded-r-md"></div>
                )}
                <div className="relative">
                  <item.icon className="w-6 h-6 mb-1.5" strokeWidth={isActive ? 2.5 : 2} />
                  {item.badge && (
                    <span className="absolute -top-2.5 -right-6 bg-[#e03c31] text-white text-[9px] font-bold px-1 py-0.5 rounded-sm whitespace-nowrap shadow-sm">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className={`text-[11px] text-center px-1 leading-tight ${isActive ? "font-bold" : "font-medium"}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}

          {/* Tài khoản - Expandable */}
          <button
            onClick={() => toggle("account")}
            className={`relative flex flex-col items-center justify-center w-full py-4 hover:bg-gray-50 transition-colors ${isAccountActive || expanded === "account" ? "text-red-600" : "text-gray-600"}`}
          >
            {(isAccountActive || expanded === "account") && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-600 rounded-r-md"></div>
            )}
            <User className="w-6 h-6 mb-1.5" strokeWidth={isAccountActive || expanded === "account" ? 2.5 : 2} />
            <span className={`text-[11px] text-center px-1 leading-tight ${isAccountActive || expanded === "account" ? "font-bold" : "font-medium"}`}>
              Tài khoản
            </span>
            <ChevronRight className={`w-3 h-3 mt-0.5 transition-transform duration-200 ${expanded === "account" ? "rotate-90" : ""}`} />
          </button>

          {/* Ưu đãi - Expandable */}
          <button
            onClick={() => toggle("promo")}
            className={`relative flex flex-col items-center justify-center w-full py-4 hover:bg-gray-50 transition-colors ${expanded === "promo" ? "text-red-600" : "text-gray-600"}`}
          >
            {expanded === "promo" && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-600 rounded-r-md"></div>
            )}
            <Gift className="w-6 h-6 mb-1.5" strokeWidth={expanded === "promo" ? 2.5 : 2} />
            <span className={`text-[11px] text-center px-1 leading-tight ${expanded === "promo" ? "font-bold" : "font-medium"}`}>
              Ưu đãi
            </span>
            <ChevronRight className={`w-3 h-3 mt-0.5 transition-transform duration-200 ${expanded === "promo" ? "rotate-90" : ""}`} />
          </button>

          {/* Báo giá & Hướng dẫn - Expandable */}
          <button
            onClick={() => toggle("guide")}
            className={`relative flex flex-col items-center justify-center w-full py-4 hover:bg-gray-50 transition-colors ${expanded === "guide" ? "text-red-600" : "text-gray-600"}`}
          >
            {expanded === "guide" && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-600 rounded-r-md"></div>
            )}
            <HelpCircle className="w-6 h-6 mb-1.5" strokeWidth={expanded === "guide" ? 2.5 : 2} />
            <span className={`text-[11px] text-center px-1 leading-tight ${expanded === "guide" ? "font-bold" : "font-medium"}`}>
              Báo giá
            </span>
            <ChevronRight className={`w-3 h-3 mt-0.5 transition-transform duration-200 ${expanded === "guide" ? "rotate-90" : ""}`} />
          </button>
        </nav>

        <div className="flex-1"></div>

        <button onClick={() => { logout(); router.push('/'); }} className="flex flex-col items-center justify-center w-full py-4 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors">
          <LogOut className="w-5 h-5 mb-1" strokeWidth={2} />
          <span className="text-[10px] font-medium">Đăng xuất</span>
        </button>
      </aside>

      {/* Slide-out Panel */}
      <div
        ref={panelRef}
        className={`fixed top-0 left-[100px] h-full w-[260px] bg-white border-r border-gray-200 shadow-[4px_0_24px_rgba(0,0,0,0.1)] z-40 transition-transform duration-200 ease-in-out ${
          expanded ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {expanded === "account" && (
          <div className="flex flex-col h-full overflow-y-auto">
            {/* User Info */}
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 bg-[#e03c31] rounded-full flex items-center justify-center text-white text-lg font-bold">
                  {initial}
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-[15px]">{displayName}</div>
                  <div className="text-gray-500 text-xs">0 điểm</div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-500">Số dư</span>
                  <span className="font-bold text-[#e03c31] text-base">{wallet.total}</span>
                </div>
                <div className="space-y-1.5 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Tài khoản chính</span>
                    <span className="font-bold">{wallet.main}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tài khoản khuyến mãi</span>
                    <span className="font-bold">{wallet.promotion}</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
                  Số tài khoản định danh: <span className="font-bold text-gray-800">{wallet.code}</span>
                </div>
              </div>

              <Link
                href="/nguoi-ban/nap-tien"
                className="mt-3 flex items-center justify-center gap-2 w-full bg-gray-900 hover:bg-black text-white font-bold py-2.5 rounded-lg transition-colors text-sm"
              >
                Nạp tiền
              </Link>
            </div>

            {/* Quản lý */}
            <div className="py-2">
              <div className="px-5 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Quản lý</div>
              <Link href="/nguoi-ban/tin-dang" className="flex items-center gap-3 px-5 py-2.5 hover:bg-gray-50 transition-colors text-gray-700">
                <LayoutList className="w-[18px] h-[18px] text-gray-400" strokeWidth={2} />
                <span className="text-[13px] font-medium">Quản lý tin đăng</span>
              </Link>
              <Link href="/nguoi-ban/khach-hang" className="flex items-center gap-3 px-5 py-2.5 hover:bg-gray-50 transition-colors text-gray-700">
                <Users className="w-[18px] h-[18px] text-gray-400" strokeWidth={2} />
                <span className="text-[13px] font-medium">Quản lý khách hàng</span>
              </Link>
              <Link href="/nguoi-ban/thong-tin-so-du" className="flex items-center gap-3 px-5 py-2.5 hover:bg-gray-50 transition-colors text-gray-700">
                <Wallet className="w-[18px] h-[18px] text-gray-400" strokeWidth={2} />
                <span className="text-[13px] font-medium">Thông tin số dư</span>
              </Link>
              <Link href="/nguoi-ban/lich-su-giao-dich" className="flex items-center gap-3 px-5 py-2.5 hover:bg-gray-50 transition-colors text-gray-700">
                <Receipt className="w-[18px] h-[18px] text-gray-400" strokeWidth={2} />
                <span className="text-[13px] font-medium">Lịch sử giao dịch</span>
              </Link>
            </div>

            {/* Hoạt động hiệu quả */}
            <div className="py-2 border-t border-gray-100">
              <div className="px-5 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Hoạt động hiệu quả hơn</div>
              <Link href="#" className="flex items-center justify-between px-5 py-2.5 hover:bg-gray-50 transition-colors group">
                <div className="flex items-center gap-3">
                  <Crown className="w-[18px] h-[18px] text-[#f59e0b]" strokeWidth={2} />
                  <div className="flex flex-col">
                    <span className="text-[13px] font-medium text-gray-800">Gói Hội viên</span>
                    <span className="text-[11px] font-bold text-[#e03c31]">Tiết kiệm đến 39%</span>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-gray-400 group-hover:text-[#e03c31] transition-colors">Đăng ký mua</span>
              </Link>
              <Link href="#" className="flex items-center justify-between px-5 py-2.5 hover:bg-gray-50 transition-colors group">
                <div className="flex items-center gap-3">
                  <Briefcase className="w-[18px] h-[18px] text-blue-600" strokeWidth={2} />
                  <span className="text-[13px] font-medium text-gray-800">Tài khoản doanh nghiệp</span>
                </div>
                <span className="text-[11px] font-bold text-gray-400 group-hover:text-blue-600 transition-colors">Đăng ký</span>
              </Link>
            </div>

            {/* Tài khoản & Hỗ trợ */}
            <div className="py-2 border-t border-gray-100">
              <div className="px-5 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Tài khoản & Hỗ trợ</div>
              <Link href="/nguoi-ban/tai-khoan" className="flex items-center gap-3 px-5 py-2.5 hover:bg-gray-50 transition-colors text-gray-700">
                <Settings className="w-[18px] h-[18px] text-gray-400" strokeWidth={2} />
                <span className="text-[13px] font-medium">Cài đặt tài khoản</span>
              </Link>
              <Link href="/nguoi-ban/tai-khoan?tab=mat-khau" className="flex items-center gap-3 px-5 py-2.5 hover:bg-gray-50 transition-colors text-gray-700">
                <KeyRound className="w-[18px] h-[18px] text-gray-400" strokeWidth={2} />
                <span className="text-[13px] font-medium">Đổi mật khẩu</span>
              </Link>
            </div>
          </div>
        )}

        {expanded === "promo" && (
          <div className="flex flex-col h-full overflow-y-auto">
            <div className="p-5 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-base">Ưu đãi</h3>
            </div>
            <div className="py-2">
              <Link href="#" className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                <Gift className="w-[18px] h-[18px] text-pink-500" strokeWidth={2} />
                <div className="flex flex-col">
                  <span className="text-[13px] font-medium text-gray-800">Gói tin Sài Gòn 1k/ngày</span>
                  <span className="text-[11px] font-bold text-[#e03c31]">Mới</span>
                </div>
              </Link>
              <Link href="#" className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                <Gift className="w-[18px] h-[18px] text-orange-500" strokeWidth={2} />
                <span className="text-[13px] font-medium text-gray-800">Gói voucher tiết kiệm</span>
              </Link>
              <Link href="#" className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                <Crown className="w-[18px] h-[18px] text-yellow-500" strokeWidth={2} />
                <span className="text-[13px] font-medium text-gray-800">Gói voucher Tin VIP</span>
              </Link>
              <Link href="#" className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                <BadgePercent className="w-[18px] h-[18px] text-green-500" strokeWidth={2} />
                <span className="text-[13px] font-medium text-gray-800">Gói voucher Đẩy tin</span>
              </Link>
              <Link href="#" className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                <Gift className="w-[18px] h-[18px] text-[#e03c31]" strokeWidth={2} />
                <span className="text-[13px] font-medium text-gray-800">Khuyến mãi của tôi</span>
              </Link>
            </div>
          </div>
        )}

        {expanded === "guide" && (
          <div className="flex flex-col h-full overflow-y-auto">
            <div className="p-5 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-base">Báo giá & Hướng dẫn</h3>
            </div>
            <div className="py-2">
              <Link href="#" className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors text-gray-700">
                <FileText className="w-[18px] h-[18px] text-gray-400" strokeWidth={2} />
                <span className="text-[13px] font-medium">Báo giá</span>
              </Link>
              <Link href="#" className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors text-gray-700">
                <CreditCard className="w-[18px] h-[18px] text-gray-400" strokeWidth={2} />
                <span className="text-[13px] font-medium">Hướng dẫn thanh toán</span>
              </Link>
              <Link href="#" className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors text-gray-700">
                <BookOpen className="w-[18px] h-[18px] text-gray-400" strokeWidth={2} />
                <span className="text-[13px] font-medium">Hướng dẫn sử dụng</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Backdrop overlay when panel is open */}
      {expanded && (
        <div
          className="fixed inset-0 z-30 bg-transparent"
          onClick={() => setExpanded(null)}
        />
      )}
    </>
  );
}
