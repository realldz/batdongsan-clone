import { api } from "@/lib/api";

export interface CouponValidationResult {
  valid: boolean;
  discountType: "percentage" | "fixed_amount";
  discountValue: number;
  code: string;
  message?: string;
}

export async function validateCoupon(code: string, context: "boost" | "vip" | "all" = "all") {
  return api.get<CouponValidationResult>(`/coupons/validate?code=${code}&context=${context}`);
}
