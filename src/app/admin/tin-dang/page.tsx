"use client";

import { useEffect, useState } from "react";
import { Download, EyeOff, Pencil, Trash2, Eye } from "lucide-react";

import { mapAdminStatusToPropertyStatus, propertyToAdminListing, unwrapPaginated } from "@/lib/api-adapters";
import { type Property } from "@/services/properties";
import { getAdminProperties, updateAdminPropertyStatus, deleteAdminProperty, type AdminListingsParams } from "@/services/admin";

import { type AdminListing, type AdminListingStatus } from "../_data/types";
import { AdminHeader } from "../_components/organisms/AdminHeader";
import { StatusBadge } from "../_components/atoms/StatusBadge";
import { SearchInput } from "../_components/atoms/SearchInput";
import { FilterSelect } from "../_components/atoms/FilterSelect";
import { ActionButton } from "../_components/atoms/ActionButton";
import { TableShell } from "../_components/molecules/TableShell";
import { EmptyState } from "../_components/atoms/EmptyState";
import { FilterBar } from "../_components/molecules/FilterBar";
import { AdminPagination } from "../_components/molecules/AdminPagination";
import { AdminPageTemplate } from "../_components/templates/AdminPageTemplate";
import { ListingFormModal } from "../_components/organisms/ListingFormModal";
import { PropertyPreviewModal } from "../_components/organisms/PropertyPreviewModal";
import { downloadCsv } from "../_components/utils/csv-export";

const statusOptions = ["Tất cả", "Đang hiển thị", "Chờ duyệt", "Đã duyệt", "Từ chối", "Đã ẩn", "Hết hạn"] as const;
const typeOptions = ["Tất cả", "Bán", "Cho thuê"] as const;
const PAGE_SIZE = 20;

const statusFilterOptions = statusOptions.map((s) => ({
  label: s === "Tất cả" ? "Tất cả trạng thái" : s,
  value: s,
}));

const typeFilterOptions = typeOptions.map((t) => ({
  label: t === "Tất cả" ? "Tất cả loại tin" : t,
  value: t,
}));

function getListingStatusTone(status: AdminListingStatus) {
  if (status === "Đang hiển thị" || status === "Đã duyệt") return "green";
  if (status === "Chờ duyệt") return "amber";
  if (status === "Từ chối") return "red";
  if (status === "Đã ẩn" || status === "Hết hạn") return "gray";
  return "blue";
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
  const [loading, setLoading] = useState(true);
  const [previewId, setPreviewId] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadListings() {
      setLoading(true);
      try {
        const params: AdminListingsParams = { page: currentPage, perPage: PAGE_SIZE };
        if (search.trim()) params.search = search.trim();
        const status = mapStatusFilterToApi(statusFilter);
        if (status) params.status = status as AdminListingsParams["status"];
        const type = mapTypeFilterToApi(typeFilter);
        if (type) params.type = type as AdminListingsParams["type"];

        const response = await getAdminProperties(params);
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

  const saveEdit = async (data: { status: AdminListingStatus; packageName: AdminListing["packageName"] }) => {
    if (!editingListing) return;
    await updateAdminPropertyStatus(editingListing.id, mapAdminStatusToPropertyStatus(data.status));
    setListings((current) => current.map((listing) => (listing.id === editingListing.id ? { ...listing, status: data.status, packageName: data.packageName } : listing)));
    setEditingListing(null);
  };

  const hideListing = async (id: string) => {
    const currentListing = listings.find((listing) => listing.id === id);
    setListings((current) => current.map((listing) => (listing.id === id ? { ...listing, status: "Đã ẩn" } : listing)));
    try {
      await updateAdminPropertyStatus(id, "hidden");
    } catch {
      if (currentListing) setListings((current) => current.map((listing) => (listing.id === id ? currentListing : listing)));
    }
  };

  const deleteListingAction = async (id: string) => {
    const currentListings = listings;
    setListings((current) => current.filter((listing) => listing.id !== id));
    try {
      await deleteAdminProperty(id);
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

  const handleExportCsv = () => {
    downloadCsv(
      "admin-tin-dang.csv",
      ["Mã tin", "Tiêu đề", "Chủ tin", "Loại", "Khu vực", "Giá", "Trạng thái"],
      listings,
      (row) => [
        row.code,
        row.title,
        row.owner,
        row.type,
        row.location,
        row.price,
        row.status,
      ]
    );
  };

  const header = <AdminHeader title="Quản lý tin đăng" description={`Tìm kiếm, lọc, sửa nhanh, ẩn/xóa tin và xuất báo cáo (API, ${total} tin).`} />;

  return (
    <AdminPageTemplate header={header}>
      <FilterBar
        actions={
          <ActionButton variant="primary" icon={<Download className="w-4 h-4" />} onClick={handleExportCsv}>
            Xuất CSV
          </ActionButton>
        }
      >
        <SearchInput
          placeholder="Tìm theo mã tin, tiêu đề, chủ tin"
          value={search}
          onChange={handleSearchChange}
          className="flex-1 min-w-[240px] max-w-md"
        />
        <FilterSelect
          value={statusFilter}
          onChange={(val) => handleStatusFilterChange(val as (typeof statusOptions)[number])}
          options={statusFilterOptions}
        />
        <FilterSelect
          value={typeFilter}
          onChange={(val) => handleTypeFilterChange(val as (typeof typeOptions)[number])}
          options={typeFilterOptions}
        />
      </FilterBar>

      <TableShell title="Danh sách tin đăng" description={`${total} tin - trang ${currentPage}/${totalPages}`}>
        {loading ? (
          <div className="p-10 text-center text-gray-500">Đang tải...</div>
        ) : listings.length === 0 ? (
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
                {listings.map((listing) => (
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
                        <button onClick={() => setPreviewId(listing.id)} className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-extrabold text-gray-700 hover:bg-white hover:border-gray-300 flex items-center gap-1.5 cursor-pointer"><Eye className="w-3.5 h-3.5" /> Xem</button>
                        <button onClick={() => setEditingListing(listing)} className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-extrabold text-gray-700 hover:bg-white hover:border-gray-300 flex items-center gap-1.5 cursor-pointer"><Pencil className="w-3.5 h-3.5" /> Sửa</button>
                        <button onClick={() => hideListing(listing.id)} className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-extrabold text-gray-700 hover:bg-white hover:border-gray-300 flex items-center gap-1.5 cursor-pointer"><EyeOff className="w-3.5 h-3.5" /> Ẩn</button>
                        <button onClick={() => deleteListingAction(listing.id)} className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-extrabold text-rose-600 hover:bg-rose-50 flex items-center gap-1.5 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /> Xóa</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <AdminPagination page={currentPage} totalPages={totalPages} onChange={setCurrentPage} />
          </>
        )}
      </TableShell>

      <ListingFormModal
        isOpen={!!editingListing}
        onClose={() => setEditingListing(null)}
        listing={editingListing}
        onSave={saveEdit}
      />

      <PropertyPreviewModal propertyId={previewId} onClose={() => setPreviewId(null)} />
    </AdminPageTemplate>
  );
}
