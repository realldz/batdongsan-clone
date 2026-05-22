import type { PropertyType } from "@/services/properties";

export function toNumber(value: number | string | undefined): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

export function formatCompactNumber(value: number, maximumFractionDigits = 2): string {
  return new Intl.NumberFormat("vi-VN", { maximumFractionDigits }).format(value);
}

export function formatCurrency(value: number | string | undefined, type?: PropertyType): string {
  const amount = toNumber(value);

  if (amount <= 0) return "Thỏa thuận";
  if (amount >= 1_000_000_000) return `${formatCompactNumber(amount / 1_000_000_000)} tỷ${type === "rent" ? "/tháng" : ""}`;
  if (amount >= 1_000_000) return `${formatCompactNumber(amount / 1_000_000)} triệu${type === "rent" ? "/tháng" : ""}`;

  return `${formatCompactNumber(amount)} đ${type === "rent" ? "/tháng" : ""}`;
}

export function formatPricePerSqm(price: number | string | undefined, area: number | string | undefined): string {
  const priceValue = toNumber(price);
  const areaValue = toNumber(area);

  if (priceValue <= 0 || areaValue <= 0) return "--";

  const pricePerSqm = priceValue / areaValue;
  if (pricePerSqm >= 1_000_000) return `${formatCompactNumber(pricePerSqm / 1_000_000)} tr/m²`;

  return `${formatCompactNumber(pricePerSqm)} đ/m²`;
}
