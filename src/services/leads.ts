import { api, getApiUrl } from "@/lib/api";

export type LeadSource = "property_detail" | "directory" | "search";

export type LeadStatus = "new" | "contacted" | "qualified" | "lost";

export interface LeadPropertyRef {
  id: string;
  title?: string;
}

export interface LeadUserRef {
  id: string;
  fullName?: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  source: LeadSource;
  status: LeadStatus;
  property?: LeadPropertyRef;
  assignedTo?: LeadUserRef;
  createdBy?: LeadUserRef;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateLeadPayload {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  source?: LeadSource;
  propertyId?: string;
}

export interface SearchLeadsParams {
  page?: number;
  perPage?: number;
  status?: LeadStatus;
  source?: LeadSource;
  propertyId?: string;
  assignedToId?: string;
}

export interface LeadPaginationMeta {
  page: number;
  totalPages: number;
  total: number;
  perPage: number;
}

export interface SearchLeadsResult {
  leads: Lead[];
  pagination: LeadPaginationMeta;
}

function buildQuery(params: Record<string, unknown>) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if ((typeof value === "string" || typeof value === "number") && value !== "" && value !== undefined) {
      query.set(key, String(value));
    }
  });
  const text = query.toString();
  return text ? `?${text}` : "";
}

function paginationFromHeaders(res: Response): LeadPaginationMeta {
  const getNum = (name: string): number => {
    const v = res.headers.get(name);
    return v ? Number(v) || 0 : 0;
  };

  return {
    page: getNum("x-page") || 1,
    totalPages: getNum("x-pages-count"),
    total: getNum("x-total-count"),
    perPage: getNum("x-per-page") || 20,
  };
}

export async function searchLeads(params: SearchLeadsParams = {}): Promise<SearchLeadsResult> {
  const query = buildQuery(params as Record<string, unknown>);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${getApiUrl("/leads")}${query}`, { headers, cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Lỗi yêu cầu (${res.status})`);
  }

  const leads: Lead[] = await res.json();
  const pagination = paginationFromHeaders(res);

  return { leads, pagination };
}

export async function getLeadById(id: string): Promise<Lead | null> {
  return api.get<Lead>(`/leads/${id}`);
}

export async function createLead(payload: CreateLeadPayload): Promise<Lead> {
  return api.post<Lead>("/leads", payload);
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<Lead> {
  return api.patch<Lead>(`/leads/${id}/status`, { status });
}

export async function assignLead(id: string, assignedToId: string): Promise<Lead> {
  return api.patch<Lead>(`/leads/${id}/assign`, { assignedToId });
}
