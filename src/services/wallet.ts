import { api } from "@/lib/api";

export interface WalletBalance {
  balance?: number | string;
  mainBalance?: number | string;
  promotionBalance?: number | string;
  code?: string;
  [key: string]: unknown;
}

export interface WalletTransaction {
  id: string;
  amount: number | string;
  type?: string;
  status?: string;
  description?: string;
  createdAt?: string;
  [key: string]: unknown;
}

export interface WalletDepositRequest {
  amount: number;
  method?: string;
}

export interface WalletPayRequest {
  amount: number;
  description?: string;
  propertyId?: string;
}

export async function getWalletBalance() {
  return api.get<WalletBalance>("/wallet/balance", { cache: "no-store" });
}

export async function depositWallet(data: WalletDepositRequest) {
  return api.post<WalletTransaction | WalletBalance>("/wallet/deposit", data);
}

export async function payWallet(data: WalletPayRequest) {
  return api.post<WalletTransaction | WalletBalance>("/wallet/pay", data);
}

export async function getWalletHistory(params?: { page?: number; perPage?: number; type?: string }) {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.perPage) searchParams.set("perPage", String(params.perPage));
  if (params?.type) searchParams.set("type", params.type);
  const query = searchParams.toString();
  const url = query ? `/wallet/history?${query}` : "/wallet/history";
  return api.get<WalletTransaction[]>(url, { cache: "no-store" });
}

export async function createPaymentUrl(method: string, amount: number) {
  return api.post<{
    paymentUrl: string
  }>("/wallet/deposit/gateway", {
    method,
    amount
  }, { cache: "no-store" });
}

export async function handleReturnPayment(params: string) {
  return api.get("/wallet/deposit/return" + "?" + params);
}