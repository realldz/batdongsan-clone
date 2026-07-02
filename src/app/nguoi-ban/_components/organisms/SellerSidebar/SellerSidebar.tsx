"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  PieChart,
  LayoutList,
  Users,
  BadgePercent,
  User,
  Plus,
  ChevronRight,
  LogOut,
  HelpCircle,
  Gift,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth-store";
import { useWalletBalance } from "@/lib/use-wallet-balance";
import { SidebarPanel } from "./SidebarPanel";
import { AccountPanel } from "./AccountPanel";
import { PromoPanel } from "./PromoPanel";
import { GuidePanel } from "./GuidePanel";

export type ExpandableSection = "account" | "guide" | "promo" | null;

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
    {
      name: "Gói Hội viên",
      href: "/nguoi-ban/goi-hoi-vien",
      icon: BadgePercent,
      badge: "-39%",
    },
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
          <Link
            href="/nguoi-ban/dang-tin"
            className="w-11 h-11 rounded-full bg-white border-2 border-red-500 text-red-500 flex items-center justify-center hover:bg-red-50 transition-colors mb-2"
          >
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
                className={`relative flex flex-col items-center justify-center w-full py-4 hover:bg-gray-50 transition-colors ${
                  isActive ? "text-red-600" : "text-gray-600"
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-600 rounded-r-md"></div>
                )}
                <div className="relative">
                  <item.icon
                    className="w-6 h-6 mb-1.5"
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  {item.badge && (
                    <span className="absolute -top-2.5 -right-6 bg-primary text-white text-[9px] font-bold px-1 py-0.5 rounded-sm whitespace-nowrap shadow-sm">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[11px] text-center px-1 leading-tight ${
                    isActive ? "font-bold" : "font-medium"
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}

          {/* Tài khoản - Expandable */}
          <button
            type="button"
            onClick={() => toggle("account")}
            className={`relative flex flex-col items-center justify-center w-full py-4 hover:bg-gray-50 transition-colors ${
              isAccountActive || expanded === "account"
                ? "text-red-600"
                : "text-gray-600"
            }`}
          >
            {(isAccountActive || expanded === "account") && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-600 rounded-r-md"></div>
            )}
            <User
              className="w-6 h-6 mb-1.5"
              strokeWidth={isAccountActive || expanded === "account" ? 2.5 : 2}
            />
            <span
              className={`text-[11px] text-center px-1 leading-tight ${
                isAccountActive || expanded === "account"
                  ? "font-bold"
                  : "font-medium"
              }`}
            >
              Tài khoản
            </span>
            <ChevronRight
              className={`w-3 h-3 mt-0.5 transition-transform duration-200 ${
                expanded === "account" ? "rotate-90" : ""
              }`}
            />
          </button>

          {/* Ưu đãi - Expandable */}
          <button
            type="button"
            onClick={() => toggle("promo")}
            className={`relative flex flex-col items-center justify-center w-full py-4 hover:bg-gray-50 transition-colors ${
              expanded === "promo" ? "text-red-600" : "text-gray-600"
            }`}
          >
            {expanded === "promo" && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-600 rounded-r-md"></div>
            )}
            <Gift
              className="w-6 h-6 mb-1.5"
              strokeWidth={expanded === "promo" ? 2.5 : 2}
            />
            <span
              className={`text-[11px] text-center px-1 leading-tight ${
                expanded === "promo" ? "font-bold" : "font-medium"
              }`}
            >
              Ưu đãi
            </span>
            <ChevronRight
              className={`w-3 h-3 mt-0.5 transition-transform duration-200 ${
                expanded === "promo" ? "rotate-90" : ""
              }`}
            />
          </button>

          {/* Báo giá & Hướng dẫn - Expandable */}
          <button
            type="button"
            onClick={() => toggle("guide")}
            className={`relative flex flex-col items-center justify-center w-full py-4 hover:bg-gray-50 transition-colors ${
              expanded === "guide" ? "text-red-600" : "text-gray-600"
            }`}
          >
            {expanded === "guide" && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-600 rounded-r-md"></div>
            )}
            <HelpCircle
              className="w-6 h-6 mb-1.5"
              strokeWidth={expanded === "guide" ? 2.5 : 2}
            />
            <span
              className={`text-[11px] text-center px-1 leading-tight ${
                expanded === "guide" ? "font-bold" : "font-medium"
              }`}
            >
              Báo giá
            </span>
            <ChevronRight
              className={`w-3 h-3 mt-0.5 transition-transform duration-200 ${
                expanded === "guide" ? "rotate-90" : ""
              }`}
            />
          </button>
        </nav>

        <div className="flex-1"></div>

        <button
          type="button"
          onClick={() => {
            logout();
            router.push("/");
          }}
          className="flex flex-col items-center justify-center w-full py-4 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <LogOut className="w-5 h-5 mb-1" strokeWidth={2} />
          <span className="text-[10px] font-medium">Đăng xuất</span>
        </button>
      </aside>

      {/* Slide-out Panel */}
      <SidebarPanel isOpen={expanded !== null} panelRef={panelRef}>
        {expanded === "account" && (
          <AccountPanel
            initial={initial}
            displayName={displayName}
            wallet={wallet}
          />
        )}
        {expanded === "promo" && <PromoPanel />}
        {expanded === "guide" && <GuidePanel />}
      </SidebarPanel>

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
