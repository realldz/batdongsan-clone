import { api } from "@/lib/api";
import type { Property, PropertyStatus, PropertyType } from "@/services/properties";

export interface AdminListingsParams {
  page?: number;
  perPage?: number;
  status?: PropertyStatus;
  type?: PropertyType;
  search?: string;
  province?: string;
  fromDate?: string;
  toDate?: string;
}

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
  isBlocked?: boolean;
  listings?: number;
  revenue?: number | string;
  verifiedAt?: string | null;
  merchantType?: "individual" | "enterprise";
  company?: string;
  taxCode?: string;
  area?: string;
  merchantPlan?: string;
  rating?: number;
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
  totalUsers: number;
  totalProperties: number;
  pendingProperties: number;
  activeProperties: number;
  soldProperties: number;
  totalTransactions: number;
  blockedUsers: number;
  activeGrowthPct: number;
}

export interface ApiSettings {
  id?: string;
  key?: string;
  siteName?: string;
  siteDescription?: string;
  logoUrl?: string;
  faviconUrl?: string;
  contactPhone?: string;
  contactEmail?: string;
  address?: string;
  isActive?: boolean;
  metadata?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
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

export async function getAdminSettings() {
  return api.get<ApiSettings>("/admin/settings", { cache: "no-store" });
}

export async function getPendingProperties(params: { page?: number; perPage?: number } = {}) {
  return api.get<Property[]>(`/admin/properties/pending${buildQuery(params)}`, { cache: "no-store" });
}

export async function getAdminProperties(params: AdminListingsParams = {}) {
  return api.get<Property[]>(`/admin/properties${buildQuery(params)}`, { cache: "no-store" });
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

export async function getAdminAgents(params: { page?: number; perPage?: number } = {}) {
  return api.get<ApiUser[]>(`/admin/agents${buildQuery(params)}`, { cache: "no-store" });
}

export async function getAdminEnterprises(params: { page?: number; perPage?: number } = {}) {
  return api.get<ApiUser[]>(`/admin/enterprises${buildQuery(params)}`, { cache: "no-store" });
}

export async function getUsers(params: { page?: number; perPage?: number } = {}) {
  return api.get<ApiUser[]>(`/users${buildQuery(params)}`, { cache: "no-store" });
}

export async function getUserById(id: string) {
  return api.get<ApiUser>(`/users/${id}`, { cache: "no-store" });
}

// No admin-scoped variant exists for these; admin passes OwnershipGuard via role bypass.
export async function updateUser(id: string, data: UpdateUserRequest) {
  return api.patch<ApiUser>(`/users/${id}`, data);
}

export async function softDeleteUser(id: string) {
  return api.delete<{ message?: string }>(`/users/${id}`);
}

export async function restoreUser(id: string) {
  return api.post<ApiUser>(`/users/${id}/restore`);
}

export async function promoteToMerchant(userId: string, role = 3) {
  return api.post<ApiUser>(`/admin/users/${userId}/promote`, { role });
}

export async function blockUser(userId: string, reason?: string) {
  return api.post<ApiUser>(`/admin/users/${userId}/block`, reason ? { reason } : undefined);
}

export async function unblockUser(userId: string) {
  return api.post<ApiUser>(`/admin/users/${userId}/unblock`);
}
