import { api } from "@/lib/api";
import type { Property, PropertyType } from "@/services/properties";

export async function getRecommendations(type?: PropertyType): Promise<Property[]> {
  const query = type ? `?type=${type}` : "";
  return api.get<Property[]>(`/recommendations${query}`, { cache: "no-store" });
}
