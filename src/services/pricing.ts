import { api } from "@/lib/api";

export interface PricingInfo {
  boostBasePrice: number;
  boostVipPrice: number;
  vipSilverMonthlyPrice: number;
  vipGoldMonthlyPrice: number;
  vipDiamondMonthlyPrice: number;
  enabled: boolean;
}

export async function getPricing() {
  return api.get<PricingInfo>("/pricing", { cache: "no-store" });
}
