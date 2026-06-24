"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Download } from "lucide-react";

import { searchLeads, updateLeadStatus, type LeadStatus, type SearchLeadsResult } from "@/services/leads";
import { apiLeadToView, type LeadView } from "@/lib/api-adapters";

import { AdminHeader } from "../_components/organisms/AdminHeader";
import { StatusBadge } from "../_components/atoms/StatusBadge";
import { SearchInput } from "../_components/atoms/SearchInput";
import { FilterSelect } from "../_components/atoms/FilterSelect";
import { ActionButton } from "../_components/atoms/ActionButton";
import { TableShell } from "../_components/molecules/TableShell";
import { EmptyState } from "../_components/atoms/EmptyState";
import { AdminPagination } from "../_components/molecules/AdminPagination";
import { AssignModal } from "../_components/organisms/AssignModal";
import { AdminPageTemplate } from "../_components/templates/AdminPageTemplate";
import { FilterBar } from "../_components/molecules/FilterBar";
import { downloadCsv } from "../_components/utils/csv-export";

const statusOptions: Array<"all" | LeadStatus> = ["all", "new", "contacted", "qualified", "lost"];
const sourceOptions: Array<"all" | string> = ["all", "property_detail", "directory", "search"];

const statusLabelMap: Record<LeadStatus, string> = {
  new: "Mới",
  contacted: "Đã liên hệ",
  qualified: "Tiềm năng",
  lost: "Mất",
};

const sourceLabelMap: Record<string, string> = {
  property_detail: "Chi tiết BĐS",
  directory: "Danh bạ",
  search: "Tìm kiếm",
};

const statusFilterOptions = [
  { label: "Tất cả trạng thái", value: "all" },
  ...statusOptions.filter((s) => s !== "all").map((s) => ({ label: statusLabelMap[s], value: s })),
];

const sourceFilterOptions = [
  { label: "Tất cả nguồn", value: "all" },
  ...sourceOptions.filter((s) => s !== "all").map((s) => ({ label: sourceLabelMap[s], value: s })),
];

function statusTone(status: LeadStatus) {
  if (status === "new") return "blue" as const;
  if (status === "contacted") return "amber" as const;
  if (status === "qualified") return "green" as const;
  return "gray" as const;
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<LeadView[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | LeadStatus>("all");
  const [sourceFilter, setSourceFilter] = useState<"all" | string>("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [assigningLead, setAssigningLead] = useState<LeadView | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page, perPage: 20 };
      if (statusFilter !== "all") params.status = statusFilter;
      if (sourceFilter !== "all") params.source = sourceFilter;

      const result: SearchLeadsResult = await searchLeads(params as Parameters<typeof searchLeads>[0]);
      setLeads(result.leads.map(apiLeadToView));
      setTotalPages(result.pagination.totalPages);
      setTotal(result.pagination.total);
    } catch {
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, sourceFilter]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads, refreshKey]);

  const filteredLeads = useMemo(
    () =>
      leads.filter((l) => {
        const q = search.toLowerCase();
        return (
          !q ||
          l.name.toLowerCase().includes(q) ||
          l.phone.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q) ||
          l.propertyTitle.toLowerCase().includes(q)
        );
      }),
    [leads, search],
  );

  const handleStatusChange = async (id: string, status: LeadStatus) => {
    try {
      await updateLeadStatus(id, status);
      setLeads((prev) =>
        prev.map((l) =>
          l.id === id ? { ...l, status, statusLabel: statusLabelMap[status] } : l,
        ),
      );
    } catch {
      // silently fail
    }
  };

  const handleExportCsv = () => {
    downloadCsv(
      "admin-leads.csv",
      ["Tên", "SĐT", "Email", "Tin nhắn", "BĐS", "Nguồn", "Trạng thái", "Ngày tạo"],
      filteredLeads,
      (row) => [
        row.name,
        row.phone,
        row.email,
        row.message,
        row.propertyTitle,
        row.sourceLabel,
        row.statusLabel,
        row.createdDate,
      ]
    );
  };

  const hasFilters = search || statusFilter !== "all" || sourceFilter !== "all";

  const header = <AdminHeader title="Liên hệ" description="Quản lý liên hệ từ khách hàng" />;

  return (
    <AdminPageTemplate header={header}>
      <FilterBar
        actions={
          <ActionButton
            variant="secondary"
            icon={<Download className="w-4 h-4" />}
            onClick={handleExportCsv}
            disabled={filteredLeads.length === 0}
          >
            Xuất CSV
          </ActionButton>
        }
      >
        <SearchInput
          placeholder="Tìm theo tên, SĐT, email, BĐS..."
          value={search}
          onChange={setSearch}
          className="flex-1 min-w-[240px] max-w-md"
        />
        <FilterSelect
          value={statusFilter}
          onChange={(val) => {
             setStatusFilter(val as typeof statusFilter);
             setPage(1);
          }}
          options={statusFilterOptions}
        />
        <FilterSelect
          value={sourceFilter}
          onChange={(val) => {
            setSourceFilter(val);
            setPage(1);
          }}
          options={sourceFilterOptions}
        />
      </FilterBar>

      <TableShell
        title="Danh sách liên hệ"
        description={total > 0 ? `${total} liên hệ` : "Đang tải..."}
      >
        {loading ? (
          <div className="py-14 text-center text-sm text-gray-500">Đang tải...</div>
        ) : filteredLeads.length === 0 ? (
          <EmptyState
            title={hasFilters ? "Không tìm thấy liên hệ" : "Chưa có liên hệ nào"}
            description={
              hasFilters ? "Thử thay đổi bộ lọc" : "Liên hệ từ khách hàng sẽ hiển thị ở đây"
            }
          />
        ) : (
          <>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-4 py-3 text-xs font-extrabold text-gray-500 uppercase tracking-wider">Tên</th>
                  <th className="text-left px-4 py-3 text-xs font-extrabold text-gray-500 uppercase tracking-wider">SĐT</th>
                  <th className="text-left px-4 py-3 text-xs font-extrabold text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="text-left px-4 py-3 text-xs font-extrabold text-gray-500 uppercase tracking-wider">BĐS</th>
                  <th className="text-left px-4 py-3 text-xs font-extrabold text-gray-500 uppercase tracking-wider">Nguồn</th>
                  <th className="text-left px-4 py-3 text-xs font-extrabold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="text-left px-4 py-3 text-xs font-extrabold text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                  <th className="text-left px-4 py-3 text-xs font-extrabold text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-gray-900">{lead.name}</div>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-700">{lead.phone}</td>
                    <td className="px-4 py-3 text-gray-600">{lead.email}</td>
                    <td className="px-4 py-3">
                      {lead.propertyId ? (
                        <Link
                          href={`/properties/${lead.propertyId}`}
                          className="text-[#e03c31] hover:underline font-medium text-xs max-w-[180px] truncate block"
                          target="_blank"
                        >
                          {lead.propertyTitle}
                        </Link>
                      ) : (
                        <span className="text-gray-400">--</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge tone={lead.source === "property_detail" ? "blue" : lead.source === "search" ? "violet" : "gray"}>
                        {lead.sourceLabel}
                      </StatusBadge>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge tone={statusTone(lead.status)}>{lead.statusLabel}</StatusBadge>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      <div>{lead.createdDate}</div>
                      <div className="text-gray-400">{lead.createdTime}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                          className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs font-medium outline-none focus:border-[#e03c31] cursor-pointer"
                        >
                          {statusOptions.filter((s) => s !== "all").map((s) => (
                            <option key={s} value={s}>{statusLabelMap[s]}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => setAssigningLead(lead)}
                          className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-50 hover:text-[#e03c31] transition-colors cursor-pointer"
                        >
                          Gán
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <AdminPagination page={page} totalPages={totalPages} onChange={setPage} />
          </>
        )}
      </TableShell>

      <AssignModal
        lead={assigningLead}
        isOpen={!!assigningLead}
        onClose={() => setAssigningLead(null)}
        onAssigned={() => {
          setAssigningLead(null);
          setRefreshKey((k) => k + 1);
        }}
      />
    </AdminPageTemplate>
  );
}
