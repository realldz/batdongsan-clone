"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { SellerHeader } from "@/app/nguoi-ban/_components/SellerHeader";
import { SellerPagination } from "@/app/nguoi-ban/_components/SellerPagination";
import { EmptyState } from "@/app/nguoi-ban/_components/atoms";
import { LeadsTable } from "@/app/nguoi-ban/_components/molecules";
import { useAuth } from "@/lib/auth-store";
import { apiLeadToView, unwrapArray, type LeadView } from "@/lib/api-adapters";
import { searchProperties, type Property } from "@/services/properties";
import { searchLeads, updateLeadStatus, type LeadStatus } from "@/services/leads";

const statusOptions: Array<"all" | LeadStatus> = ["all", "new", "contacted", "qualified", "lost"];

const statusLabelMap: Record<string, string> = {
  new: "Mới",
  contacted: "Đã liên hệ",
  qualified: "Tiềm năng",
  lost: "Mất",
};

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
        (p) => p.host === user.id || p.user?.id === user.id
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
          }))
        )
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
          l.propertyTitle.toLowerCase().includes(q)
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
          l.id === id ? { ...l, status, statusLabel: statusLabelMap[status] } : l
        )
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
          <h2 className="text-[22px] font-bold text-gray-900 tracking-tight mb-2">
            Danh sách liên hệ
          </h2>
          <p className="text-sm text-gray-500">
            Quản lý liên hệ từ khách hàng quan tâm đến tin đăng của bạn
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Tìm tên, SĐT, BĐS..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none w-full max-w-xs focus:border-primary focus:ring-2 focus:ring-red-100"
          />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as typeof statusFilter);
              setPage(1);
            }}
            className="rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary font-bold text-gray-700"
          >
            <option value="all">Tất cả trạng thái</option>
            {statusOptions
              .filter((s) => s !== "all")
              .map((s) => (
                <option key={s} value={s}>
                  {statusLabelMap[s]}
                </option>
              ))}
          </select>
          <select
            value={propertyFilter}
            onChange={(e) => {
              setPropertyFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary font-bold text-gray-700 max-w-xs"
          >
            <option value="all">Tất cả tin đăng</option>
            {myProperties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-14 text-center text-sm text-gray-500">Đang tải...</div>
          ) : filtered.length === 0 ? (
            <div className="py-6">
              <EmptyState
                title="Chưa có liên hệ nào"
                description={
                  allLeads.length === 0
                    ? "Liên hệ từ khách hàng cho tin đăng của bạn sẽ hiển thị ở đây"
                    : "Không tìm thấy liên hệ phù hợp với bộ lọc"
                }
                icon={<Search className="h-6 w-6 text-gray-500" />}
              />
            </div>
          ) : (
            <>
              <LeadsTable
                leads={pagedLeads}
                showActions={true}
                onStatusChange={handleStatusChange}
              />

              <SellerPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setPage}
                totalItems={filtered.length}
                itemsLabel="liên hệ"
                pageSize={PER_PAGE}
              />
            </>
          )}
        </div>
      </main>
    </>
  );
}
