import type { Lead, LeadSource, LeadStatus } from "@/services/leads";
import type { LeadView } from "@/types";
import { formatDate, formatRelativeTime } from "@/lib/formatters/date";

const leadSourceLabels: Record<LeadSource, string> = {
  property_detail: "Chi tiết BĐS",
  directory: "Danh bạ",
  search: "Tìm kiếm",
};

const leadStatusLabels: Record<LeadStatus, string> = {
  new: "Mới",
  contacted: "Đã liên hệ",
  qualified: "Tiềm năng",
  lost: "Mất",
};

export function apiLeadToView(lead: Lead): LeadView {
  return {
    id: lead.id,
    name: lead.name,
    phone: lead.phone,
    email: lead.email ?? "--",
    message: lead.message ?? "",
    source: lead.source,
    sourceLabel: leadSourceLabels[lead.source] ?? lead.source,
    status: lead.status,
    statusLabel: leadStatusLabels[lead.status] ?? lead.status,
    propertyId: lead.property?.id ?? "",
    propertyTitle: lead.property?.title ?? "--",
    assignedToId: lead.assignedTo?.id ?? "",
    assignedToName: lead.assignedTo?.fullName ?? "--",
    createdAt: lead.createdAt,
    createdDate: formatDate(lead.createdAt),
    createdTime: formatRelativeTime(lead.createdAt),
    notes: lead.notes,
  };
}

export function unwrapLeads(value: unknown): Lead[] {
  if (Array.isArray(value)) return value as Lead[];

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const candidates = [record.data, record.items, record.results, record.docs];
    const found = candidates.find(Array.isArray);
    if (found) return found as Lead[];
  }

  return [];
}
