import type { LeadSource, LeadStatus } from "@/services/leads";

export interface LeadView {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  source: LeadSource;
  sourceLabel: string;
  status: LeadStatus;
  statusLabel: string;
  propertyId: string;
  propertyTitle: string;
  assignedToId: string;
  assignedToName: string;
  createdAt: string;
  createdDate: string;
  createdTime: string;
}
