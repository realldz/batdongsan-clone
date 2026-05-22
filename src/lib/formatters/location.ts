import type { Property } from "@/services/properties";

export function formatLocation(property: Pick<Property, "address" | "district" | "province">): string {
  return [property.district, property.province].filter(Boolean).join(", ") || property.address || "Đang cập nhật";
}

export function formatFullAddress(property: Pick<Property, "address" | "district" | "province">): string {
  return [property.address, property.district, property.province].filter(Boolean).join(", ") || "Đang cập nhật";
}
