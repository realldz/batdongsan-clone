import { api } from "@/lib/api";

export interface SeoConfig {
  page: string;
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
}

export async function getSeoConfig(page: string): Promise<SeoConfig | null> {
  try {
    return await api.get<SeoConfig>(`/seo/${page}`, { next: { revalidate: 300 } });
  } catch {
    return null;
  }
}

export interface UpsertSeoDto {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
}

export async function updateSeoConfig(page: string, dto: UpsertSeoDto): Promise<SeoConfig> {
  return api.put<SeoConfig>(`/admin/seo/${page}`, dto);
}
