import { api } from "@/lib/api";

export interface PieChartSlice {
  subcategory: string;
  pct: number;
}

export interface PieCharts {
  rentChart: PieChartSlice[];
  saleChart: PieChartSlice[];
  trendAnalysis: string[];
}

export interface FeaturedCity {
  cityId: string;
  cityName: string;
  score: number;
}

export interface RevenuePoint {
  month: string;
  revenue: number;
  count: number;
}

function rangeQuery(range?: number): string {
  return range != null ? `?range=${range}` : "";
}

export async function getPieCharts(range?: number): Promise<PieCharts> {
  return api.get<PieCharts>(`/analytics/pie-charts${rangeQuery(range)}`, { cache: "no-store" });
}

export async function getFeaturedCities(range?: number): Promise<FeaturedCity[]> {
  return api.get<FeaturedCity[]>(`/analytics/featured-cities${rangeQuery(range)}`, { cache: "no-store" });
}

export async function getRevenue(range?: number): Promise<RevenuePoint[]> {
  return api.get<RevenuePoint[]>(`/analytics/revenue${rangeQuery(range)}`, { cache: "no-store" });
}
