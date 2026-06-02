import { api } from "@/lib/api";

export interface GeographyDivision {
  id: string;
  name: string;
  type: string;
  parent: string | null;
  lat: number;
  lon: number;
  [key: string]: any;
}

export async function getProvinces(search?: string) {
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  return api.get<GeographyDivision[]>(`/geography/provinces${query}`);
}

export async function getDistricts(provinceId: string, search?: string) {
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  return api.get<GeographyDivision[]>(`/geography/provinces/${provinceId}/districts${query}`);
}

export async function getWards(districtId: string, search?: string) {
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  return api.get<GeographyDivision[]>(`/geography/districts/${districtId}/wards${query}`);
}

export async function getStreets(wardId: string, search?: string) {
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  return api.get<GeographyDivision[]>(`/geography/wards/${wardId}/streets${query}`);
}

export async function searchGeography(q: string) {
  return api.get<GeographyDivision[]>(`/geography/search?q=${encodeURIComponent(q)}`);
}
