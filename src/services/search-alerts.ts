import { api } from "@/lib/api";

export type SearchAlertFrequency = "INSTANT" | "DAILY" | "WEEKLY";

export interface SearchAlertCriteria {
  type?: "sale" | "rent";
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  province?: string;
  district?: string;
}

export interface SearchAlert {
  id: string;
  name: string;
  criteria: SearchAlertCriteria;
  frequency: SearchAlertFrequency;
  isActive: boolean;
  lastMatchedAt: string | null;
  createdAt?: string;
}

export interface CreateSearchAlertRequest {
  name: string;
  criteria: SearchAlertCriteria;
  frequency?: SearchAlertFrequency;
}

export type UpdateSearchAlertRequest = Partial<CreateSearchAlertRequest> & {
  isActive?: boolean;
};

export async function listSearchAlerts(): Promise<SearchAlert[]> {
  return api.get<SearchAlert[]>("/search-alerts?perPage=50", { cache: "no-store" });
}

export async function createSearchAlert(data: CreateSearchAlertRequest): Promise<SearchAlert> {
  return api.post<SearchAlert>("/search-alerts", data);
}

export async function updateSearchAlert(id: string, data: UpdateSearchAlertRequest): Promise<SearchAlert> {
  return api.put<SearchAlert>(`/search-alerts/${id}`, data);
}

export async function deleteSearchAlert(id: string): Promise<void> {
  await api.delete(`/search-alerts/${id}`);
}
