import { api } from "@/lib/api";
import type { Property, PropertyType } from "@/services/properties";

export interface RecommendationResult {
  sale: Property[];
  rent: Property[];
}

// BE trả cả sale + rent (guest nhận default top, user nhận theo view history).
export async function getRecommendations(): Promise<RecommendationResult> {
  return api.get<RecommendationResult>("/recommendations", { cache: "no-store" });
}

// Chọn nhánh theo type; undefined (trang chủ) ưu tiên sale, fallback rent.
export function pickByType(result: RecommendationResult, type?: PropertyType): Property[] {
  const primary = type === "rent" ? result.rent : result.sale;
  return primary?.length ? primary : (result.sale ?? result.rent ?? []);
}
