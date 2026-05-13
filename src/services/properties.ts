import { api } from "@/lib/api";

export type PropertyType = "sale" | "rent";
export type PropertyStatus = "pending" | "active" | "sold" | "rented" | "hidden" | "draft" | "rejected";

export interface PropertyCoordinates {
  lat: number;
  lng: number;
}

export interface Property {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  title: string;
  description: string;
  type: PropertyType;
  price: number | string;
  area: number;
  address: string;
  district?: string;
  province?: string;
  coordinates: PropertyCoordinates;
  images?: string[];
  direction?: string;
  legalInfo?: string;
  status?: PropertyStatus;
  host?: string;
  owner?: PropertyOwner;
  user?: PropertyOwner;
}

export interface PropertyOwner {
  id?: string;
  fullName?: string;
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  role?: string | number;
}

export interface PropertySearchParams {
  page?: number;
  perPage?: number;
  title?: string;
  type?: PropertyType;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  address?: string;
  district?: string;
  province?: string;
  direction?: string;
  status?: Exclude<PropertyStatus, "rejected">;
}

export interface CreatePropertyRequest {
  title: string;
  description: string;
  type: PropertyType;
  price: number;
  area: number;
  address: string;
  district?: string;
  province?: string;
  coordinates: PropertyCoordinates;
  images?: string[];
  direction?: string;
  legalInfo?: string;
}

export type UpdatePropertyRequest = Partial<CreatePropertyRequest>;

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

export async function searchProperties(params: PropertySearchParams = {}) {
  return api.get<Property[]>(`/properties${buildQuery(params)}`, { cache: "no-store" });
}

export async function getPropertyById(id: string) {
  return api.get<Property>(`/properties/${id}`, { cache: "no-store" });
}

export async function compareProperties(ids: string[]) {
  return api.get<Property[]>(`/properties/compare${buildQuery({ ids: ids.join(",") })}`, { cache: "no-store" });
}

export async function createProperty(data: CreatePropertyRequest) {
  return api.post<Property>("/properties", data);
}

export async function updateProperty(id: string, data: UpdatePropertyRequest) {
  return api.patch<Property>(`/properties/${id}`, data);
}

export async function getMyProperties(params?: { page?: number; perPage?: number; title?: string }) {
  return api.get<Property[]>(`/properties/my${buildQuery(params ?? {})}`, { cache: "no-store" });
}

export async function deleteProperty(id: string) {
  return api.delete<{ message?: string }>(`/properties/${id}`);
}

export async function updatePropertyStatus(id: string, status: PropertyStatus) {
  return api.put<Property>(`/properties/${id}/status`, { status });
}
