"use client";

import { AdminHeader } from "../_components/AdminHeader";
import { AdminTableShell, EmptyState, StatusBadge } from "../_components/AdminUi";
import { getAdminUsers, type ApiUser } from "@/services/admin";
import { unwrapArray } from "@/lib/api-adapters";
import { assignLead, searchLeads, updateLeadStatus, type LeadStatus, type SearchLeadsResult } from "@/services/leads";
import { apiLeadToView, type LeadView } from "@/lib/api-adapters";
import Link from "next/link";
import { Download, Search, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

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

function statusTone(status: LeadStatus) {
  if (status === "new") return "blue" as const;
  if (status === "contacted") return "amber" as const;
  if (status === "qualified") return "green" as const;
  return "gray" as const;
}

function downloadCsv(rows: LeadView[]) {
  const header = ["Tên", "SĐT", "Email", "Tin nhắn", "BĐS", "Nguồn", "Trạng thái", "Ngày tạo"];
  const csvRows = rows.map((row) => [
    row.name, row.phone, row.email, row.message,
    row.propertyTitle, row.sourceLabel, row.statusLabel, row.createdDate,
  ]);
  const csv = [header, ...csvRows]
    .map((r) => r.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "admin-leads.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function AssignModal({
  lead,
  onClose,
  onAssigned,
}: {
  lead: LeadView;
  onClose: () => void;
  onAssigned: () => void;
}) {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [search, setSearch] = useState("");
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    getAdminUsers({ page: 1, perPage: 100 })
      .then((res) => setUsers(unwrapArray<ApiUser>(res)))
      .catch(() => setUsers([]));
  }, []);

  const filtered = useMemo(
    () =>
      users.filter((u) => {
        const name = (u.fullName ?? u.name ?? u.email ?? "").toLowerCase();
        return name.includes(search.toLowerCase());
      }),
    [users, search],
  );

  const handleAssign = async (userId: string) => {
    setAssigning(true);
    try {
      await assignLead(lead.id, userId);
      onAssigned();
    } catch {
      setAssigning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-base font-extrabold text-gray-900">Gán cho nhân viên</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-5 py-3 border-b border-gray-100 text-sm">
          <span className="text-gray-500">Lead: </span>
          <span className="font-bold">{lead.name}</span>
          <span className="text-gray-400 mx-2">•</span>
          <span>{lead.phone}</span>
        </div>
        <div className="p-5">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm nhân viên..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm outline-none focus:border-[#e03c31] focus:ring-2 focus:ring-red-100"
            />
          </div>
          <div className="max-h-64 overflow-y-auto space-y-1">
            {filtered.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-4">Không tìm thấy người dùng</p>
            ) : (
              filtered.map((u) => (
                <button
                  key={u.id}
                  onClick={() => handleAssign(u.id!)}
                  disabled={assigning}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left disabled:opacity-50"
                >
                  <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                    {(u.fullName ?? u.name ?? "U").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">{u.fullName ?? u.name ?? u.email}</div>
                    <div className="text-xs text-gray-500">{u.email ?? u.phone}</div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
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
  }, [page, statusFilter, sourceFilter, refreshKey]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

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

  const hasFilters = search || statusFilter !== "all" || sourceFilter !== "all";

  return (
    <>
      <AdminHeader title="Liên hệ" description="Quản lý liên hệ từ khách hàng" />
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo tên, SĐT, email, BĐS..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm outline-none bg-white focus:border-[#e03c31] focus:ring-2 focus:ring-red-100"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as typeof statusFilter);
              setPage(1);
            }}
            className="rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#e03c31]"
          >
            <option value="all">Tất cả trạng thái</option>
            {statusOptions.filter((s) => s !== "all").map((s) => (
              <option key={s} value={s}>{statusLabelMap[s]}</option>
            ))}
          </select>
          <select
            value={sourceFilter}
            onChange={(e) => {
              setSourceFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#e03c31]"
          >
            <option value="all">Tất cả nguồn</option>
            {sourceOptions.filter((s) => s !== "all").map((s) => (
              <option key={s} value={s}>{sourceLabelMap[s]}</option>
            ))}
          </select>
          <button
            onClick={() => downloadCsv(filteredLeads)}
            disabled={filteredLeads.length === 0}
            className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-40"
          >
            <Download className="w-4 h-4" /> Xuất CSV
          </button>
        </div>

        <AdminTableShell
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
                            className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs font-medium outline-none focus:border-[#e03c31]"
                          >
                            {statusOptions.filter((s) => s !== "all").map((s) => (
                              <option key={s} value={s}>{statusLabelMap[s]}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => setAssigningLead(lead)}
                            className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-50 hover:text-[#e03c31] transition-colors"
                          >
                            Gán
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {totalPages > 1 ? (
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    Trang {page} / {totalPages}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold hover:bg-gray-50 disabled:opacity-30"
                    >
                      Trước
                    </button>
                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                      const start = Math.max(1, Math.min(page - 3, totalPages - 6));
                      const p = start + i;
                      if (p > totalPages) return null;
                      return (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                            p === page
                              ? "bg-[#e03c31] text-white"
                              : "border border-gray-200 hover:bg-gray-50 text-gray-600"
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold hover:bg-gray-50 disabled:opacity-30"
                    >
                      Sau
                    </button>
                  </div>
                </div>
              ) : null}
            </>
          )}
        </AdminTableShell>
      </main>

      {assigningLead ? (
        <AssignModal
          lead={assigningLead}
          onClose={() => setAssigningLead(null)}
          onAssigned={() => {
            setAssigningLead(null);
            setRefreshKey((k) => k + 1);
          }}
        />
      ) : null}
    </>
  );
}
