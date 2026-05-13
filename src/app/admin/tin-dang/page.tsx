"use client";

import { AdminHeader } from "../_components/AdminHeader";
import { AdminTableShell, EmptyState, StatusBadge } from "../_components/AdminUi";
import { type AdminListing, type AdminListingStatus } from "../_data/mock";
import { mapAdminStatusToPropertyStatus, propertyToAdminListing, unwrapPaginated } from "@/lib/api-adapters";
import { deleteProperty, searchProperties, updatePropertyStatus, type Property } from "@/services/properties";
import { Download, EyeOff, Pencil, Search, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const statusOptions = ["Tất cả", "Đang hiển thị", "Chờ duyệt", "Đã duyệt", "Từ chối", "Đã ẩn", "Hết hạn"] as const;
const typeOptions = ["Tất cả", "Bán", "Cho thuê"] as const;
const packageOptions = ["Tin thường", "Tin VIP", "Tin nổi bật"] as const;
const PAGE_SIZE = 20;

function getListingStatusTone(status: AdminListingStatus) {
  if (status === "Đang hiển thị" || status === "Đã duyệt") return "green";
  if (status === "Chờ duyệt") return "amber";
  if (status === "Từ chối") return "red";
  if (status === "Đã ẩn" || status === "Hết hạn") return "gray";
  return "blue";
}

function downloadCsv(rows: AdminListing[]) {
  const header = ["Mã tin", "Tiêu đề", "Chủ tin", "Loại", "Khu vực", "Giá", "Trạng thái"];
  const csvRows = rows.map((row) => [row.code, row.title, row.owner, row.type, row.location, row.price, row.status]);
  const csv = [header, ...csvRows].map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "admin-tin-dang.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function mapStatusFilterToApi(status: string): string {
  if (status === "Đang hiển thị") return "active";
  if (status === "Chờ duyệt") return "pending";
  if (status === "Đã duyệt") return "active";
  if (status === "Từ chối") return "rejected";
  if (status === "Đã ẩn") return "hidden";
  if (status === "Hết hạn") return "sold";
  return "";
}

function mapTypeFilterToApi(type: string): string {
  if (type === "Bán") return "sale";
  if (type === "Cho thuê") return "rent";
  return "";
}

export default function AdminListingsPage() {
  const [listings, setListings] = useState<AdminListing[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<(typeof statusOptions)[number]>("Tất cả");
  const [typeFilter, setTypeFilter] = useState<(typeof typeOptions)[number]>("Tất cả");
  const [editingListing, setEditingListing] = useState<AdminListing | null>(null);
  const [draftStatus, setDraftStatus] = useState<AdminListingStatus>("Đang hiển thị");
  const [draftPackage, setDraftPackage] = useState<(typeof packageOptions)[number]>("Tin thường");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadListings() {
      setLoading(true);
      try {
        const params: Record<string, string | number> = { page: currentPage, perPage: PAGE_SIZE };
        if (search.trim()) params.title = search.trim();
        const status = mapStatusFilterToApi(statusFilter);
        if (status) params.status = status;
        const type = mapTypeFilterToApi(typeFilter);
        if (type) params.type = type;

        const response = await searchProperties(params as any);
        const result = unwrapPaginated<Property>(response);

        if (!ignore) {
          setListings(result.data.map(propertyToAdminListing));
          setTotal(result.pagination.total);
          setTotalPages(result.pagination.totalPages || 1);
          setCurrentPage(result.pagination.page);
        }
      } catch {
        if (!ignore) {
          setListings([]);
          setTotal(0);
          setTotalPages(1);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadListings();
    return () => { ignore = true; };
  }, [currentPage, search, statusFilter, typeFilter]);

  const filteredListings = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return listings.filter((listing) => {
      const matchesSearch = keyword.length === 0 || listing.title.toLowerCase().includes(keyword) || listing.code.toLowerCase().includes(keyword) || listing.owner.toLowerCase().includes(keyword);
      const matchesStatus = statusFilter === "Tất cả" || listing.status === statusFilter;
      const matchesType = typeFilter === "Tất cả" || listing.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [listings, search, statusFilter, typeFilter]);

  const openEdit = (listing: AdminListing) => {
    setEditingListing(listing);
    setDraftStatus(listing.status);
    setDraftPackage(listing.packageName);
  };

  const saveEdit = async () => {
    if (!editingListing) return;
    setIsSubmitting(true);
    try {
      await updatePropertyStatus(editingListing.id, mapAdminStatusToPropertyStatus(draftStatus));
      setListings((current) => current.map((listing) => (listing.id === editingListing.id ? { ...listing, status: draftStatus, packageName: draftPackage } : listing)));
      setEditingListing(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const hideListing = async (id: string) => {
    const currentListing = listings.find((listing) => listing.id === id);
    setListings((current) => current.map((listing) => (listing.id === id ? { ...listing, status: "Đã ẩn" } : listing)));
    try {
      await updatePropertyStatus(id, "hidden");
    } catch {
      if (currentListing) setListings((current) => current.map((listing) => (listing.id === id ? currentListing : listing)));
    }
  };

  const deleteListingAction = async (id: string) => {
    const currentListings = listings;
    setListings((current) => current.filter((listing) => listing.id !== id));
    try {
      await deleteProperty(id);
    } catch {
      setListings(currentListings);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: (typeof statusOptions)[number]) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleTypeFilterChange = (value: (typeof typeOptions)[number]) => {
    setTypeFilter(value);
    setCurrentPage(1);
  };

  const totalPagesArray = Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1);

  return (
    <>
      <AdminHeader title="Quản lý tin đăng" description={`Tìm kiếm, lọc, sửa nhanh, ẩn/xóa tin và xuất báo cáo (API, ${total} tin).`} />
      <main className="flex-1 overflow-y-auto p-5 lg:p-7 space-y-5 pb-12">
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col xl:flex-row gap-3 xl:items-center xl:justify-between">
          <div className="relative w-full xl:max-w-[420px]">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input value={search} onChange={(event) => handleSearchChange(event.target.value)} placeholder="Tìm theo mã tin, tiêu đề, chủ tin" className="w-full h-11 rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-4 text-sm font-medium outline-none focus:border-[#e03c31] focus:bg-white" />
          </div>
          <div className="flex flex-wrap gap-3">
            <select value={statusFilter} onChange={(event) => handleStatusFilterChange(event.target.value as (typeof statusOptions)[number])} className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm font-bold text-gray-700 outline-none focus:border-[#e03c31]">
              {statusOptions.map((status) => <option key={status}>{status}</option>)}
            </select>
            <select value={typeFilter} onChange={(event) => handleTypeFilterChange(event.target.value as (typeof typeOptions)[number])} className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm font-bold text-gray-700 outline-none focus:border-[#e03c31]">
              {typeOptions.map((type) => <option key={type}>{type}</option>)}
            </select>
            <button onClick={() => downloadCsv(filteredListings)} className="h-11 rounded-lg bg-gray-900 px-4 text-white text-sm font-bold hover:bg-black transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" /> Xuất CSV
            </button>
          </div>
        </section>

        <AdminTableShell title="Danh sách tin đăng" description={`${total} tin - trang ${currentPage}/${totalPages}`}>
          {loading ? (
            <div className="p-10 text-center text-gray-500">Đang tải...</div>
          ) : filteredListings.length === 0 ? (
            <EmptyState title="Không có tin đăng" description="Thử đổi từ khóa hoặc bộ lọc khác." />
          ) : (
            <>
              <table className="w-full min-w-[1120px] text-left">
                <thead className="bg-gray-50 text-[11px] uppercase tracking-wider text-gray-500 font-extrabold">
                  <tr>
                    <th className="px-5 py-3">Tin đăng</th>
                    <th className="px-5 py-3">Chủ tin</th>
                    <th className="px-5 py-3">Loại</th>
                    <th className="px-5 py-3">Giá/diện tích</th>
                    <th className="px-5 py-3">Gói</th>
                    <th className="px-5 py-3">Trạng thái</th>
                    <th className="px-5 py-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredListings.map((listing) => (
                    <tr key={listing.id} className="hover:bg-gray-50 align-top">
                      <td className="px-5 py-4 max-w-[360px]">
                        <div className="font-extrabold text-gray-900 line-clamp-2">{listing.title}</div>
                        <div className="text-xs font-medium text-gray-500 mt-1">{listing.code} · {listing.location}</div>
                        <div className="text-[11px] font-bold text-gray-400 mt-1">Hết hạn: {listing.expiresAt} · {listing.views.toLocaleString("vi-VN")} lượt xem</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-bold text-gray-800">{listing.owner}</div>
                        <div className="text-xs font-medium text-gray-500 mt-1">{listing.ownerType}</div>
                      </td>
                      <td className="px-5 py-4 font-bold text-gray-700">{listing.type}<div className="text-xs font-medium text-gray-500 mt-1">{listing.category}</div></td>
                      <td className="px-5 py-4"><div className="font-extrabold text-gray-900">{listing.price}</div><div className="text-xs font-medium text-gray-500 mt-1">{listing.area}</div></td>
                      <td className="px-5 py-4 font-bold text-gray-700">{listing.packageName}</td>
                      <td className="px-5 py-4"><StatusBadge tone={getListingStatusTone(listing.status)}>{listing.status}</StatusBadge></td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openEdit(listing)} className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-extrabold text-gray-700 hover:bg-white hover:border-gray-300 flex items-center gap-1.5"><Pencil className="w-3.5 h-3.5" /> Sửa</button>
                          <button onClick={() => hideListing(listing.id)} className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-extrabold text-gray-700 hover:bg-white hover:border-gray-300 flex items-center gap-1.5"><EyeOff className="w-3.5 h-3.5" /> Ẩn</button>
                          <button onClick={() => deleteListingAction(listing.id)} className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-extrabold text-rose-600 hover:bg-rose-50 flex items-center gap-1.5"><Trash2 className="w-3.5 h-3.5" /> Xóa</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 ? (
                <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4">
                  <div className="text-sm font-medium text-gray-500">
                    Trang {currentPage} / {totalPages}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Trước
                    </button>
                    {totalPagesArray.map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        className={`h-8 w-8 rounded-lg text-sm font-extrabold transition-colors ${currentPage === page ? "bg-[#e03c31] text-white" : "text-gray-700 hover:bg-gray-100"}`}
                      >
                        {page}
                      </button>
                    ))}
                    {totalPages > 10 ? <span className="text-sm text-gray-400">...</span> : null}
                    <button
                      type="button"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
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

      {editingListing ? (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
          <div className="w-full max-w-[520px] rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-gray-900">Sửa nhanh tin đăng</h2>
                <p className="text-xs font-medium text-gray-500 mt-1">{editingListing.code}</p>
              </div>
              <button onClick={() => setEditingListing(null)} className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="font-bold text-gray-900 leading-relaxed">{editingListing.title}</div>
              <label className="block">
                <span className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Trạng thái</span>
                <select value={draftStatus} onChange={(event) => setDraftStatus(event.target.value as AdminListingStatus)} className="mt-2 w-full h-11 rounded-lg border border-gray-200 px-3 font-bold outline-none focus:border-[#e03c31]">
                  {statusOptions.filter((status) => status !== "Tất cả").map((status) => <option key={status}>{status}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Gói hiển thị</span>
                <select value={draftPackage} onChange={(event) => setDraftPackage(event.target.value as (typeof packageOptions)[number])} className="mt-2 w-full h-11 rounded-lg border border-gray-200 px-3 font-bold outline-none focus:border-[#e03c31]">
                  {packageOptions.map((packageName) => <option key={packageName}>{packageName}</option>)}
                </select>
              </label>
            </div>
            <div className="px-5 py-4 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setEditingListing(null)} className="h-10 px-4 rounded-lg border border-gray-200 bg-white text-sm font-bold text-gray-700 hover:bg-gray-50">Hủy</button>
              <button onClick={saveEdit} disabled={isSubmitting} className="h-10 px-4 rounded-lg bg-[#e03c31] text-white text-sm font-extrabold hover:bg-[#c43329] disabled:opacity-60 disabled:cursor-not-allowed">{isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}</button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
