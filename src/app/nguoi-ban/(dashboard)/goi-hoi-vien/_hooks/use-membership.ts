"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { getWalletBalance } from "@/services/wallet";
import {
  cancelSubscription,
  changeSubscriptionTier,
  createSubscription,
  getActiveSubscription,
  reactivateSubscription,
  type Subscription,
  type SubscriptionTier,
} from "@/services/subscriptions";

export interface MembershipPricing {
  boostBasePrice: number;
  vipSilverMonthlyPrice: number;
  vipGoldMonthlyPrice: number;
  vipDiamondMonthlyPrice: number;
  boostVipPrice: number;
  enabled: boolean;
}

function parseBalance(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^\d.-]/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

async function fetchBalance(): Promise<number> {
  const wallet = await getWalletBalance();
  return parseBalance(wallet.balance ?? wallet.mainBalance);
}

interface UseMembershipResult {
  loading: boolean;
  pricing: MembershipPricing | null;
  active: Subscription | null;
  balance: number;
  submitting: boolean;
  refresh: () => Promise<void>;
  purchase: (tier: SubscriptionTier, couponCode?: string) => Promise<boolean>;
  cancel: (id: string) => Promise<void>;
  reactivate: (id: string) => Promise<void>;
  changeTier: (id: string, tier: SubscriptionTier) => Promise<boolean>;
}

export function useMembership(): UseMembershipResult {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pricing, setPricing] = useState<MembershipPricing | null>(null);
  const [active, setActive] = useState<Subscription | null>(null);
  const [balance, setBalance] = useState(0);

  // Reload active subscription + balance (pricing is static, fetched once)
  const refresh = useCallback(async () => {
    try {
      const [sub, bal] = await Promise.all([
        getActiveSubscription().catch(() => null),
        fetchBalance().catch(() => 0),
      ]);
      setActive(sub);
      setBalance(bal);
    } catch (error) {
      console.error("Failed to refresh membership state", error);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const { api } = await import("@/lib/api");
        const [pricingData, sub, bal] = await Promise.all([
          api.get<MembershipPricing>("/pricing").catch(() => null),
          getActiveSubscription().catch(() => null),
          fetchBalance().catch(() => 0),
        ]);
        if (!ignore) {
          setPricing(pricingData);
          setActive(sub);
          setBalance(bal);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  const purchase = useCallback(
    async (tier: SubscriptionTier, couponCode?: string): Promise<boolean> => {
      setSubmitting(true);
      try {
        await createSubscription({ tier, couponCode });
        toast.success("Mua gói hội viên thành công!");
        await refresh();
        return true;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Không thể mua gói. Vui lòng thử lại.";
        toast.error(message);
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [refresh],
  );

  const cancel = useCallback(
    async (id: string) => {
      setSubmitting(true);
      try {
        await cancelSubscription(id);
        toast.success("Đã tắt tự động gia hạn.");
        await refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Không thể hủy gia hạn.");
      } finally {
        setSubmitting(false);
      }
    },
    [refresh],
  );

  const reactivate = useCallback(
    async (id: string) => {
      setSubmitting(true);
      try {
        await reactivateSubscription(id);
        toast.success("Đã kích hoạt lại gói.");
        await refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Không thể kích hoạt lại.");
      } finally {
        setSubmitting(false);
      }
    },
    [refresh],
  );

  const changeTier = useCallback(
    async (id: string, tier: SubscriptionTier): Promise<boolean> => {
      setSubmitting(true);
      try {
        await changeSubscriptionTier(id, tier);
        toast.success("Đổi hạng thành công!");
        await refresh();
        return true;
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Không thể đổi hạng.");
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [refresh],
  );

  return {
    loading,
    pricing,
    active,
    balance,
    submitting,
    refresh,
    purchase,
    cancel,
    reactivate,
    changeTier,
  };
}
