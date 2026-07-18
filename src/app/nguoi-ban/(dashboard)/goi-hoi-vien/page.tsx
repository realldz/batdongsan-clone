"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRefreshWallet } from "@/lib/use-wallet-balance";
import { TIER_TO_PRICE_KEY, type SubscriptionTier } from "@/services/subscriptions";
import { MembershipBanner } from "./_components/organisms/MembershipBanner";
import { MembershipTabs } from "./_components/molecules/MembershipTabs";
import { MembershipCard } from "./_components/organisms/MembershipCard";
import { PurchaseModal } from "./_components/organisms/PurchaseModal";
import { ActiveSubscriptionCard } from "./_components/organisms/ActiveSubscriptionCard";
import { FAQSection } from "./_components/organisms/FAQSection";
import { useMembership } from "./_hooks/use-membership";

interface PackageDef {
  tier: SubscriptionTier;
  name: string;
  description: string;
  icon: string;
  divisor: number; // original price factor for "discount" display
  isPopular?: boolean;
  benefits: string[];
}

const PACKAGES: PackageDef[] = [
  {
    tier: "silver",
    name: "Bạc",
    description: "Phù hợp với môi giới mới hoặc giỏ hàng nhỏ",
    icon: "🥈",
    divisor: 0.69,
    benefits: [
      "Đẩy tin <b>1 lần/ngày</b>",
      "Ưu tiên hiển thị <b>mức cơ bản</b>",
    ],
  },
  {
    tier: "gold",
    name: "Vàng",
    description: "Phù hợp với môi giới chuyên nghiệp có giỏ hàng từ 10 BĐS",
    icon: "🥇",
    divisor: 0.67,
    isPopular: true,
    benefits: [
      "Đẩy tin <b>3 lần/ngày</b>",
      "Ưu tiên hiển thị <b>mức cao</b>",
    ],
  },
  {
    tier: "diamond",
    name: "Kim cương",
    description: "Phù hợp với môi giới có giỏ hàng và ngân sách quảng cáo lớn",
    icon: "💎",
    divisor: 0.61,
    benefits: [
      "Đẩy tin <b>không giới hạn</b>",
      "Ưu tiên hiển thị <b>cao nhất</b>",
    ],
  },
];

// Fallback prices if pricing API fails
const FALLBACK_PRICE: Record<SubscriptionTier, number> = {
  silver: 467000,
  gold: 1267000,
  diamond: 2200000,
};

export default function MembershipPage() {
  const { loading, pricing, active, balance, submitting, purchase, cancel, reactivate, changeTier } =
    useMembership();
  const refreshWallet = useRefreshWallet();
  const [activeTab, setActiveTab] = useState("hoi-vien");
  const [selected, setSelected] = useState<PackageDef | null>(null);

  const priceOf = (tier: SubscriptionTier) =>
    pricing?.[TIER_TO_PRICE_KEY[tier]] || FALLBACK_PRICE[tier];

  const handleConfirm = async (couponCode?: string) => {
    if (!selected) return;
    const isUpgrade = active !== null && active.status === "active";
    const ok = isUpgrade
      ? await changeTier(active.id, selected.tier)
      : await purchase(selected.tier, couponCode);
    if (ok) {
      setSelected(null);
      refreshWallet();
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
      </div>
    );
  }

  const isUpgradeFlow = active !== null && active.status === "active";

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 pb-12">
      <div className="bg-white pt-6 px-6 lg:px-8 border-b border-gray-200">
        <MembershipBanner />
        <div className="mt-8">
          <MembershipTabs
            tabs={[
              { id: "hoi-vien", label: "Gói Hội viên" },
              // { id: "voucher-vip", label: "Gói voucher Tin VIP", badge: "Mới" },
              // { id: "voucher-day-tin", label: "Gói voucher Đẩy tin" },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 mt-8">
        {active && (
          <div className="mb-6">
            <ActiveSubscriptionCard
              subscription={active}
              submitting={submitting}
              onCancel={cancel}
              onReactivate={reactivate}
            />
          </div>
        )}

        {activeTab === "hoi-vien" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {PACKAGES.map((pkg) => {
              const price = priceOf(pkg.tier);
              const original = Math.round(price / pkg.divisor);
              const isCurrent = active?.status === "active" && active.tier === tierNum(pkg.tier);
              return (
                <MembershipCard
                  key={pkg.tier}
                  name={pkg.name}
                  description={pkg.description}
                  pricePerMonth={price}
                  originalPricePerMonth={original}
                  savingsPerMonth={original - price}
                  isPopular={pkg.isPopular}
                  isCurrent={isCurrent}
                  buyLabel={isUpgradeFlow ? "Đổi sang gói này" : "Mua gói 1 tháng"}
                  icon={pkg.icon}
                  benefits={pkg.benefits}
                  onBuy={() => setSelected(pkg)}
                />
              );
            })}
          </div>
        )}

        {activeTab !== "hoi-vien" && (
          <div className="bg-white p-12 rounded-xl border border-gray-200 text-center text-gray-500 shadow-sm mt-6">
            Nội dung đang được cập nhật...
          </div>
        )}

        <div className="mt-8">
          <FAQSection />
        </div>
      </div>

      {selected && (
        <PurchaseModal
          isOpen={selected !== null}
          onClose={() => setSelected(null)}
          packageName={selected.name}
          pricePerMonth={priceOf(selected.tier)}
          balance={balance}
          submitting={submitting}
          isUpgrade={isUpgradeFlow}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
}

// silver=1, gold=2, diamond=3
function tierNum(tier: SubscriptionTier): number {
  return { silver: 1, gold: 2, diamond: 3 }[tier];
}
