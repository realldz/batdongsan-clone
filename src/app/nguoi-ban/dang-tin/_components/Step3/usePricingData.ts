import { useState, useEffect } from "react";
import { getPricing, type PricingInfo } from "@/services/pricing";

export interface PricingTier {
  id: number;
  name: string;
  description: string;
  pricePerDay: number;
  icon: string;
  badge?: string;
  color: string;
}

export function usePricingData() {
  const [pricing, setPricing] = useState<PricingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let ignore = false;
    async function fetchPricing() {
      try {
        const data = await getPricing();
        if (!ignore) {
          setPricing(data);
          setLoading(false);
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err : new Error("Failed to load pricing"));
          setLoading(false);
        }
      }
    }
    fetchPricing();
    return () => {
      ignore = true;
    };
  }, []);

  const tiers: PricingTier[] = [
    {
      id: 3,
      name: "Tin VIP Kim Cương",
      description: "Hiển thị lớn nhất, trên cùng của trang chủ và trang ngành.",
      pricePerDay: Math.round((pricing?.vipDiamondMonthlyPrice ?? 2200000) / 30),
      icon: "💎",
      badge: "Hiệu quả cao nhất",
      color: "text-red-600",
    },
    {
      id: 2,
      name: "Tin VIP Vàng",
      description: "Hiển thị nổi bật, nằm dưới Tin VIP Kim Cương.",
      pricePerDay: Math.round((pricing?.vipGoldMonthlyPrice ?? 1267000) / 30),
      icon: "⭐",
      color: "text-yellow-500",
    },
    {
      id: 1,
      name: "Tin VIP Bạc",
      description: "Hiển thị tốt, nằm dưới Tin VIP Vàng.",
      pricePerDay: Math.round((pricing?.vipSilverMonthlyPrice ?? 467000) / 30),
      icon: "🌟",
      color: "text-blue-500",
    },
    {
      id: 0,
      name: "Tin Thường",
      description: "Hiển thị tiêu chuẩn, sau các tin VIP.",
      pricePerDay: Math.round((pricing?.boostBasePrice ?? 100000) / 30),
      icon: "📝",
      color: "text-gray-500",
    },
  ];

  return { pricing, tiers, loading, error };
}
