"use client";
import { Bell, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useWalletBalance } from "@/lib/use-wallet-balance";
import { SellerProfileMenu } from "./SellerProfileMenu";
import { NotificationBell } from "@/components/Header/NotificationBell";

export function SellerHeader({ title, subtitle }: { title: string, subtitle?: React.ReactNode }) {
  const wallet = useWalletBalance();

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 flex-shrink-0 z-50 min-h-[72px]">
      <div>
        <h1 className="text-[22px] font-bold text-gray-900 tracking-tight leading-none">{title}</h1>
        {subtitle && <div className="mt-1.5">{subtitle}</div>}
      </div>
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 cursor-pointer px-4 py-2 rounded-full text-sm font-bold transition-colors border border-gray-200 shadow-sm">
          <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold leading-none pb-px shadow-inner">
            đ
          </div>
          <span className="text-gray-800">{wallet.total}</span>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </div>
        <Link href="/nguoi-ban/nap-tien" className="bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 shadow-sm">
          <span className="text-base leading-none">💳</span> Nạp tiền
        </Link>
        <NotificationBell />

        {/* User Profile Menu */}
        <SellerProfileMenu />
      </div>
    </header>
  );
}
