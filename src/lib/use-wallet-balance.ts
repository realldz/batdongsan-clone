"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, createElement, type ReactNode } from "react";
import { getWalletBalance, type WalletBalance } from "@/services/wallet";

export interface WalletBalanceView {
  total: string;
  main: string;
  promotion: string;
  code: string;
}

const fallbackWallet: WalletBalanceView = {
  total: "0 đ",
  main: "0 đ",
  promotion: "0 đ",
  code: "BDSVN050",
};

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^\d.-]/g, ""));
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function formatAmount(value: unknown): string {
  const number = toNumber(value);
  if (number === null) return typeof value === "string" && value ? value : "0 đ";

  return `${new Intl.NumberFormat("vi-VN").format(number)} đ`;
}

function mapWalletBalance(balance: WalletBalance): WalletBalanceView {
  const main = balance.mainBalance ?? balance.balance ?? 0;
  const promotion = balance.promotionBalance ?? 0;
  const total = balance.balance ?? (toNumber(main) ?? 0) + (toNumber(promotion) ?? 0);

  return {
    total: formatAmount(total),
    main: formatAmount(main),
    promotion: formatAmount(promotion),
    code: typeof balance.code === "string" && balance.code ? balance.code : fallbackWallet.code,
  };
}

type WalletRefreshContextValue = {
  wallet: WalletBalanceView;
  loading: boolean;
  refresh: () => void;
};

const WalletRefreshContext = createContext<WalletRefreshContextValue | null>(null);

export function WalletRefreshProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<WalletBalanceView>(fallbackWallet);
  const [tick, setTick] = useState(0);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => setTick((prev) => prev + 1), []);

  useEffect(() => {
    let ignore = false;

    async function loadWallet() {
      setLoading(true);
      try {
        const balance = await getWalletBalance();
        if (!ignore) {
          setWallet(mapWalletBalance(balance));
        }
      } catch {
        if (!ignore) {
          setWallet(fallbackWallet);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadWallet();

    return () => {
      ignore = true;
    };
  }, [tick]);

  const value = useMemo(() => ({ wallet, loading, refresh }), [wallet, loading, refresh]);

  return createElement(WalletRefreshContext.Provider, { value }, children);
}

function useWalletContext() {
  const context = useContext(WalletRefreshContext);
  if (!context) {
    return { wallet: fallbackWallet, loading: false, refresh: () => {} };
  }
  return context;
}

export function useWalletBalance(): WalletBalanceView {
  return useWalletContext().wallet;
}

export function useWalletLoading(): boolean {
  return useWalletContext().loading;
}

export function useRefreshWallet(): () => void {
  return useWalletContext().refresh;
}
