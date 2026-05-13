import { api } from "@/lib/api";
import type { Property } from "@/services/properties";

function buildQuery(params: object) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if ((typeof value === "string" || typeof value === "number") && value !== "") {
      query.set(key, String(value));
    }
  });

  const text = query.toString();
  return text ? `?${text}` : "";
}

export async function toggleFavorite(propertyId: string) {
  return api.post<{ favorited?: boolean; message?: string }>(`/interactions/favorite/${propertyId}`);
}

export async function getFavorites(params: { page?: number; perPage?: number } = {}) {
  return api.get<Property[]>(`/interactions/favorites${buildQuery(params)}`, { cache: "no-store" });
}
