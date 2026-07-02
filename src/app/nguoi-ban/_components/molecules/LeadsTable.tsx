import React from "react";
import Link from "next/link";
import { StatusBadge } from "../atoms/StatusBadge";
import type { LeadView } from "@/lib/api-adapters";
import type { LeadStatus } from "@/services/leads";

const statusLabelMap: Record<string, string> = {
  new: "Mới",
  contacted: "Đã liên hệ",
  qualified: "Tiềm năng",
  lost: "Mất",
};

export function leadStatusTone(status: string) {
  if (status === "new") return "blue" as const;
  if (status === "contacted") return "amber" as const;
  if (status === "qualified") return "green" as const;
  return "gray" as const;
}

interface LeadsTableProps {
  leads: LeadView[];
  showActions?: boolean;
  onStatusChange?: (id: string, status: LeadStatus) => void;
}

export function LeadsTable({
  leads,
  showActions = false,
  onStatusChange,
}: LeadsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="text-left px-4 py-3 text-xs font-extrabold text-gray-500 uppercase tracking-wider">
              Tên
            </th>
            <th className="text-left px-4 py-3 text-xs font-extrabold text-gray-500 uppercase tracking-wider">
              SĐT
            </th>
            {showActions && (
              <th className="text-left px-4 py-3 text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                Email
              </th>
            )}
            <th className="text-left px-4 py-3 text-xs font-extrabold text-gray-500 uppercase tracking-wider">
              Tin đăng
            </th>
            {showActions && (
              <th className="text-left px-4 py-3 text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                Nguồn
              </th>
            )}
            <th className="text-left px-4 py-3 text-xs font-extrabold text-gray-500 uppercase tracking-wider">
              Trạng thái
            </th>
            <th className="text-left px-4 py-3 text-xs font-extrabold text-gray-500 uppercase tracking-wider">
              Thời gian
            </th>
            {showActions && (
              <th className="text-left px-4 py-3 text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr
              key={lead.id}
              className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
            >
              <td className="px-4 py-3 font-bold text-gray-900">{lead.name}</td>
              <td className="px-4 py-3 text-gray-700 font-medium">
                {lead.phone}
              </td>
              {showActions && (
                <td className="px-4 py-3 text-gray-600">{lead.email}</td>
              )}
              <td className="px-4 py-3">
                <Link
                  href={`/properties/${lead.propertyId}`}
                  className="text-primary hover:underline font-medium text-xs max-w-[200px] truncate block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {lead.propertyTitle}
                </Link>
              </td>
              {showActions && (
                <td className="px-4 py-3">
                  <StatusBadge
                    tone={
                      lead.source === "property_detail"
                        ? "blue"
                        : lead.source === "search"
                        ? "violet"
                        : "gray"
                    }
                  >
                    {lead.sourceLabel}
                  </StatusBadge>
                </td>
              )}
              <td className="px-4 py-3">
                <StatusBadge tone={leadStatusTone(lead.status)}>
                  {statusLabelMap[lead.status] || lead.status}
                </StatusBadge>
              </td>
              <td className="px-4 py-3 text-xs text-gray-500">
                {lead.createdTime}
              </td>
              {showActions && onStatusChange && (
                <td className="px-4 py-3">
                  <select
                    value={lead.status}
                    onChange={(e) =>
                      onStatusChange(lead.id, e.target.value as LeadStatus)
                    }
                    className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs font-medium outline-none focus:border-primary"
                  >
                    {(Object.keys(statusLabelMap) as LeadStatus[]).map((s) => (
                      <option key={s} value={s}>
                        {statusLabelMap[s]}
                      </option>
                    ))}
                  </select>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
