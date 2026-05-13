"use client";

import { SellerHeader } from "../../_components/SellerHeader";
import type { ReactNode } from "react";
import { useWalletBalance, useWalletLoading } from "@/lib/use-wallet-balance";
import { CreditCard, Gift, Wallet } from "lucide-react";
import Link from "next/link";

export default function WalletBalancePage() {
  const wallet = useWalletBalance();
  const loading = useWalletLoading();

  return (
    <>
      <SellerHeader title="Thông tin số dư" />
      <main className="flex-1 overflow-y-auto p-6 lg:p-8 xl:p-10 pb-20 bg-[#f6f7f9]">
        <div className="mx-auto max-w-5xl space-y-6">
          <section className="rounded-3xl border border-red-100 bg-[linear-gradient(135deg,#fff7f6_0%,#fff_60%,#fff3f1_100%)] p-6 shadow-sm">
            {loading ? (
              <div className="flex flex-col gap-3 animate-pulse">
                <div className="h-4 w-32 bg-red-100 rounded" />
                <div className="h-10 w-48 bg-red-100 rounded" />
                <div className="h-4 w-40 bg-red-100 rounded" />
              </div>
            ) : (
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="mb-2 text-sm font-extrabold uppercase tracking-[0.18em] text-[#e03c31]">Số dư khả dụng</div>
                  <h2 className="text-4xl font-extrabold text-gray-900">{wallet.total}</h2>
                  <p className="mt-2 text-sm font-medium text-gray-500">Nguồn dữ liệu: {wallet.source === "api" ? "API ví" : "fallback mock"}</p>
                </div>
                <Link href="/nguoi-ban/nap-tien" className="inline-flex items-center justify-center rounded-full bg-[#e03c31] px-6 py-3 text-sm font-extrabold text-white shadow-sm transition-colors hover:bg-[#c43329]">
                  Nạp tiền
                </Link>
              </div>
            )}
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => <SkeletonBalanceCard key={i} />)
              : (
                <>
                  <BalanceCard icon={<Wallet className="h-5 w-5" />} label="Tài khoản chính" value={wallet.main} />
                  <BalanceCard icon={<Gift className="h-5 w-5" />} label="Tài khoản khuyến mãi" value={wallet.promotion} />
                  <BalanceCard icon={<CreditCard className="h-5 w-5" />} label="Mã nạp tiền" value={wallet.code} />
                </>
              )}
          </section>

          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-extrabold text-gray-900">Quản lý ví</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Link href="/nguoi-ban/lich-su-giao-dich" className="rounded-2xl border border-gray-200 px-5 py-4 font-bold text-gray-800 transition-colors hover:bg-gray-50">
                Xem lịch sử giao dịch
              </Link>
              <Link href="/nguoi-ban/nap-tien" className="rounded-2xl border border-gray-200 px-5 py-4 font-bold text-gray-800 transition-colors hover:bg-gray-50">
                Nạp thêm tiền
              </Link>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

function BalanceCard({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-[#e03c31]">{icon}</div>
      <div className="text-sm font-bold text-gray-500">{label}</div>
      <div className="mt-2 text-2xl font-extrabold text-gray-900">{value}</div>
    </div>
  );
}

function SkeletonBalanceCard() {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm animate-pulse">
      <div className="mb-4 h-11 w-11 rounded-2xl bg-gray-100" />
      <div className="h-4 w-24 bg-gray-100 rounded" />
      <div className="mt-3 h-8 w-32 bg-gray-100 rounded" />
    </div>
  );
}
