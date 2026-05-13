"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BriefcaseBusiness,
  Building2,
  ChevronRight,
  LayoutDashboard,
  Newspaper,
  PhoneCall,
  Settings,
  ShieldCheck,
  UserRoundCheck,
  Users,
} from "lucide-react";

const navItems = [
  { name: "Tổng quan", href: "/admin", icon: LayoutDashboard },
  { name: "Tin đăng", href: "/admin/tin-dang", icon: Building2 },
  { name: "Duyệt tin", href: "/admin/duyet-tin", icon: ShieldCheck },
  { name: "Người dùng", href: "/admin/nguoi-dung", icon: Users },
  { name: "Môi giới", href: "/admin/moi-gioi", icon: UserRoundCheck },
  { name: "Doanh nghiệp", href: "/admin/doanh-nghiep", icon: BriefcaseBusiness },
  { name: "Tin tức", href: "/admin/tin-tuc", icon: Newspaper },
  { name: "Liên hệ", href: "/admin/leads", icon: PhoneCall },
  { name: "Cấu hình", href: "/admin/cau-hinh", icon: Settings },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-[260px] bg-white border-r border-gray-200 flex-col shrink-0 shadow-sm">
      <Link href="/" className="h-[72px] flex items-center gap-3 px-6 border-b border-gray-100">
        <div className="w-11 h-11 flex items-center justify-center rounded-lg border-2 border-[#e03c31] bg-red-50 text-[#e03c31] text-xs font-extrabold">
          BĐS
        </div>
        <div>
          <div className="text-[15px] font-extrabold text-gray-900 leading-tight">Admin Center</div>
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Batdongsan</div>
        </div>
      </Link>

      <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-1">
        {navItems.map((item) => {
          const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center justify-between rounded-xl px-3.5 py-3 transition-colors ${
                isActive ? "bg-red-50 text-[#e03c31]" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span className="flex items-center gap-3 min-w-0">
                <item.icon className="w-5 h-5 shrink-0" strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[13px] truncate ${isActive ? "font-extrabold" : "font-bold"}`}>{item.name}</span>
              </span>
              <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} />
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Phiên bản mock</div>
          <div className="text-sm font-extrabold text-gray-900 mb-1">Không yêu cầu đăng nhập</div>
          <div className="text-xs leading-relaxed text-gray-500">Dữ liệu reset khi tải lại trang.</div>
        </div>
      </div>
    </aside>
  );
}
