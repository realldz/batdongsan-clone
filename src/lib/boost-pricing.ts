import type { BoostQuota } from "@/services/properties";

export interface BoostQuote {
  isFree: boolean;
  price: number;
  freeRemaining: number;
}

// Mirror chính xác công thức boost() backend (property.service.ts:436-454).
// Giá VIP lấy từ boostVipPrice (admin cấu hình trong DB), KHÔNG tự nhân boostBasePrice * 3.
// KHÔNG "sửa cho đẹp": nhánh trả phí nhân boostMultiplier lên cả effectiveBasePrice.
export function computeBoostQuote(
  quota: BoostQuota,
  currentPushLevel: string | undefined,
  pushType: "pushed" | "vip_pushed",
): BoostQuote {
  const { tier, boostMultiplier, monthlyBoostQuota, boostQuotaUsed, boostBasePrice, boostVipPrice } = quota;
  const freeRemaining = Math.max(0, monthlyBoostQuota - boostQuotaUsed);

  const isVipPush = pushType === "vip_pushed";
  const isUpgrade = currentPushLevel === "pushed" && isVipPush;

  const hasFreeBoost = !isVipPush && tier > 0 && boostQuotaUsed < monthlyBoostQuota;
  if (hasFreeBoost) {
    return { isFree: true, price: 0, freeRemaining };
  }

  const effectiveBasePrice = isUpgrade
    ? Math.ceil(boostVipPrice - boostBasePrice)
    : isVipPush
      ? Math.ceil(boostVipPrice)
      : boostBasePrice;

  const multiplier = tier === 0 ? 1 : boostMultiplier;
  const price = Math.ceil(effectiveBasePrice * multiplier);
  return { isFree: false, price, freeRemaining };
}
