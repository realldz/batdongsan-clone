import { api } from "@/lib/api";
import type { Property } from "@/services/properties";

export interface ApiUser {
  id: string;
  fullName?: string;
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  role?: number | string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  status?: string;
  listings?: number;
  revenue?: number | string;
}

export interface UpdateUserRequest {
  fullName?: string;
  email?: string;
  password?: string;
  phone?: string;
  avatar?: string;
  role?: number;
}

export interface AdminCreateUserRequest {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  avatar?: string;
  role: number;
}

export interface AdminStatistics {
  totalUsers?: number;
  users?: number;
  activeUsers?: number;
  lockedUsers?: number;
  totalProperties?: number;
  activeProperties?: number;
  pendingProperties?: number;
  totalViews?: number;
  totalRevenue?: number | string;
  revenue?: number | string;
  [key: string]: unknown;
}

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

export async function getAdminStatistics() {
  return api.get<AdminStatistics>("/admin/statistics", { cache: "no-store" });
}

export async function getPendingProperties(params: { page?: number; perPage?: number } = {}) {
  return api.get<Property[]>(`/admin/properties/pending${buildQuery(params)}`, { cache: "no-store" });
}

export async function approveProperty(id: string) {
  return api.put<Property>(`/admin/properties/${id}/approve`);
}

export async function rejectProperty(id: string) {
  return api.put<Property>(`/admin/properties/${id}/reject`);
}

export async function getAdminUsers(params: { page?: number; perPage?: number } = {}) {
  return api.get<ApiUser[]>(`/admin/users${buildQuery(params)}`, { cache: "no-store" });
}

export async function createAdminUser(data: AdminCreateUserRequest) {
  return api.post<ApiUser>("/admin/users", data);
}

export async function getUsers(params: { page?: number; perPage?: number } = {}) {
  return api.get<ApiUser[]>(`/users${buildQuery(params)}`, { cache: "no-store" });
}

export async function getUserById(id: string) {
  return api.get<ApiUser>(`/users/${id}`, { cache: "no-store" });
}

export async function updateUser(id: string, data: UpdateUserRequest) {
  return api.patch<ApiUser>(`/users/${id}`, data);
}

export async function softDeleteUser(id: string) {
  return api.delete<{ message?: string }>(`/users/${id}`);
}

export async function restoreUser(id: string) {
  return api.post<ApiUser>(`/users/${id}/restore`);
}
