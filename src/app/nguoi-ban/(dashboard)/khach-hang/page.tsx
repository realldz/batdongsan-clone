"use client";

import { SellerHeader } from "@/app/nguoi-ban/_components/SellerHeader";
import { StatusBadge } from "@/app/admin/_components/AdminUi";
import { useAuth } from "@/lib/auth-store";
import { apiLeadToView, unwrapArray, type LeadView } from "@/lib/api-adapters";
import { searchProperties, type Property } from "@/services/properties";
import { searchLeads, updateLeadStatus, type LeadStatus } from "@/services/leads";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

const statusOptions: Array<"all" | LeadStatus> = ["all", "new", "contacted", "qualified", "lost"];

const statusLabelMap: Record<string, string> = {
  new: "Mới",
  contacted: "Đã liên hệ",
  qualified: "Tiềm năng",
  lost: "Mất",
};

function leadStatusTone(status: string) {
  if (status === "new") return "blue" as const;
  if (status === "contacted") return "amber" as const;
  if (status === "qualified") return "green" as const;
  return "gray" as const;
}

const PER_PAGE = 20;

export default function KhachHangPage() {
  const { user } = useAuth();
  const [allLeads, setAllLeads] = useState<LeadView[]>([]);
  const [myProperties, setMyProperties] = useState<Property[]>([]);
  const [statusFilter, setStatusFilter] = useState<"all" | LeadStatus>("all");
  const [propertyFilter, setPropertyFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchLeads = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const propsResp = await searchProperties({ page: 1, perPage: 100 });
      const allProps = unwrapArray<Property>(propsResp);
      const myProps = allProps.filter(
        (p) => p.host === user.id || p.user?.id === user.id,
      );

      setMyProperties(myProps);

      if (myProps.length === 0) {
        setAllLeads([]);
        return;
      }

      const leadResults = await Promise.all(
        myProps.map((p) =>
          searchLeads({ propertyId: p.id, page: 1, perPage: 50 }).catch(() => ({
            leads: [],
            pagination: { page: 1, totalPages: 0, total: 0, perPage: 10 },
          })),
        ),
      );

      const merged = leadResults
        .flatMap((r) => r.leads.map(apiLeadToView))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setAllLeads(merged);
    } catch {
      setAllLeads([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const filtered = useMemo(() => {
    let result = allLeads;
    if (statusFilter !== "all") result = result.filter((l) => l.status === statusFilter);
    if (propertyFilter !== "all") result = result.filter((l) => l.propertyId === propertyFilter);
    const q = search.toLowerCase();
    if (q) {
      result = result.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.phone.includes(q) ||
          l.propertyTitle.toLowerCase().includes(q),
      );
    }
    return result;
  }, [allLeads, statusFilter, propertyFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pagedLeads = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const handleStatusChange = async (id: string, status: LeadStatus) => {
    try {
      await updateLeadStatus(id, status);
      setAllLeads((prev) =>
        prev.map((l) =>
          l.id === id ? { ...l, status, statusLabel: statusLabelMap[status] } : l,
        ),
      );
    } catch {
      // silently fail
    }
  };

  return (
    <>
      <SellerHeader title="Quản lý khách hàng" />
      <main className="flex-1 overflow-y-auto p-6 lg:p-8 xl:p-10 space-y-6 pb-20">
        <div>
          <h2 className="text-[22px] font-bold text-gray-900 tracking-tight mb-2">Danh sách liên hệ</h2>
          <p className="text-sm text-gray-500">Quản lý liên hệ từ khách hàng quan tâm đến tin đăng của bạn</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Tìm tên, SĐT, BĐS..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none w-full max-w-xs focus:border-primary focus:ring-2 focus:ring-red-100"
          />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value as typeof statusFilter); setPage(1); }}
            className="rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary"
          >
            <option value="all">Tất cả trạng thái</option>
            {statusOptions.filter((s) => s !== "all").map((s) => (
              <option key={s} value={s}>{statusLabelMap[s]}</option>
            ))}
          </select>
          <select
            value={propertyFilter}
            onChange={(e) => { setPropertyFilter(e.target.value); setPage(1); }}
            className="rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary"
          >
            <option value="all">Tất cả tin đăng</option>
            {myProperties.map((p) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-14 text-center text-sm text-gray-500">Đang tải...</div>
          ) : filtered.length === 0 ? (
            <div className="py-14 text-center">
              <div className="text-base font-extrabold text-gray-900 mb-2">Chưa có liên hệ nào</div>
              <div className="text-sm text-gray-500">
                {allLeads.length === 0
                  ? "Liên hệ từ khách hàng cho tin đăng của bạn sẽ hiển thị ở đây"
                  : "Không tìm thấy liên hệ phù hợp với bộ lọc"}
              </div>
            </div>
          ) : (
            <>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left px-4 py-3 text-xs font-extrabold text-gray-500 uppercase tracking-wider">Tên</th>
                    <th className="text-left px-4 py-3 text-xs font-extrabold text-gray-500 uppercase tracking-wider">SĐT</th>
                    <th className="text-left px-4 py-3 text-xs font-extrabold text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="text-left px-4 py-3 text-xs font-extrabold text-gray-500 uppercase tracking-wider">Tin đăng</th>
                    <th className="text-left px-4 py-3 text-xs font-extrabold text-gray-500 uppercase tracking-wider">Nguồn</th>
                    <th className="text-left px-4 py-3 text-xs font-extrabold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                    <th className="text-left px-4 py-3 text-xs font-extrabold text-gray-500 uppercase tracking-wider">Thời gian</th>
                    <th className="text-left px-4 py-3 text-xs font-extrabold text-gray-500 uppercase tracking-wider">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedLeads.map((lead) => (
                    <tr key={lead.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3 font-bold text-gray-900">{lead.name}</td>
                      <td className="px-4 py-3 text-gray-700 font-medium">{lead.phone}</td>
                      <td className="px-4 py-3 text-gray-600">{lead.email}</td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/properties/${lead.propertyId}`}
                          className="text-primary hover:underline font-medium text-xs max-w-[200px] truncate block"
                          target="_blank"
                        >
                          {lead.propertyTitle}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge tone={lead.source === "property_detail" ? "blue" : lead.source === "search" ? "violet" : "gray"}>
                          {lead.sourceLabel}
                        </StatusBadge>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge tone={leadStatusTone(lead.status)}>{lead.statusLabel}</StatusBadge>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">{lead.createdTime}</td>
                      <td className="px-4 py-3">
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                          className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs font-medium outline-none focus:border-primary"
                        >
                          {statusOptions.filter((s) => s !== "all").map((s) => (
                            <option key={s} value={s}>{statusLabelMap[s]}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {totalPages > 1 ? (
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    {filtered.length} liên hệ — Trang {currentPage} / {totalPages}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage <= 1}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold hover:bg-gray-50 disabled:opacity-30"
                    >
                      Trước
                    </button>
                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                      const start = Math.max(1, Math.min(currentPage - 3, totalPages - 6));
                      const p = start + i;
                      if (p > totalPages) return null;
                      return (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                            p === currentPage
                              ? "bg-primary text-white"
                              : "border border-gray-200 hover:bg-gray-50 text-gray-600"
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage >= totalPages}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold hover:bg-gray-50 disabled:opacity-30"
                    >
                      Sau
                    </button>
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>
      </main>
    </>
  );
}
