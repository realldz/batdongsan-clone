import { api } from "@/lib/api";

// Backend VipTier enum: NONE=0, SILVER=1, GOLD=2, DIAMOND=3
export type SubscriptionTier = "silver" | "gold" | "diamond";

export type SubscriptionStatus = "active" | "cancelled" | "expired";

export interface Subscription {
  id: string;
  tier: number; // VipTier numeric value from backend
  startedAt: string;
  expiredAt: string;
  autoRenew: boolean;
  status: SubscriptionStatus;
}

export interface CreateSubscriptionRequest {
  tier: SubscriptionTier;
  autoRenew?: boolean;
  couponCode?: string;
}

// Map numeric VipTier -> tier key used by the API/pricing
export const VIP_TIER_TO_KEY: Record<number, SubscriptionTier> = {
  1: "silver",
  2: "gold",
  3: "diamond",
};

// Human-readable Vietnamese labels shown in the UI
export const TIER_LABELS: Record<SubscriptionTier, string> = {
  silver: "Bạc",
  gold: "Vàng",
  diamond: "Kim cương",
};

// Pricing key on the pricing payload for each tier
export const TIER_TO_PRICE_KEY: Record<
  SubscriptionTier,
  "vipSilverMonthlyPrice" | "vipGoldMonthlyPrice" | "vipDiamondMonthlyPrice"
> = {
  silver: "vipSilverMonthlyPrice",
  gold: "vipGoldMonthlyPrice",
  diamond: "vipDiamondMonthlyPrice",
};

export function tierLabelFromNumeric(tier: number): string {
  const key = VIP_TIER_TO_KEY[tier];
  return key ? TIER_LABELS[key] : "Không xác định";
}

export async function createSubscription(data: CreateSubscriptionRequest) {
  return api.post<Subscription>("/subscriptions", data, { cache: "no-store" });
}

export async function getActiveSubscription(): Promise<Subscription | null> {
  const result = await api.get<Subscription | null>("/subscriptions/active", {
    cache: "no-store",
  });
  return result ?? null;
}

export async function cancelSubscription(id: string) {
  return api.post<Subscription>(`/subscriptions/${id}/cancel`);
}

export async function reactivateSubscription(id: string) {
  return api.post<Subscription>(`/subscriptions/${id}/reactivate`);
}

export async function changeSubscriptionTier(id: string, tier: SubscriptionTier) {
  return api.patch<Subscription>(`/subscriptions/${id}`, { tier });
}
