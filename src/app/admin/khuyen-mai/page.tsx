"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Edit, Ticket, CheckCircle2, XCircle } from "lucide-react";
import { api } from "@/lib/api";
import { AdminPageTemplate } from "../_components/templates/AdminPageTemplate";
import { AdminHeader } from "../_components/organisms/AdminHeader";
import { TableShell } from "../_components/molecules/TableShell";
import { AdminPagination } from "../_components/molecules/AdminPagination";
import { FilterBar } from "../_components/molecules/FilterBar";
import { SearchInput } from "../_components/atoms/SearchInput";
import { CouponFormModal, CouponData } from "./_components/organisms/CouponFormModal";

interface CouponResponse {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderAmount?: number;
  maxUses?: number;
  usedCount: number;
  validFrom: string;
  validUntil?: string;
  appliesTo: "boost" | "vip" | "all";
  description?: string;
  isActive: boolean;
  createdAt: string;
}

interface PaginatedCoupons {
  items: CouponResponse[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}

export default function AdminCouponsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<CouponData | null>(null);

  useEffect(() => {
    let ignore = false;
    async function fetchCoupons() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page: page.toString(),
          perPage: "10",
        });
        
        if (search) {
          queryParams.append("code", search);
        }

        const res = await api.get<any>(`/admin/coupons?${queryParams.toString()}`);
        if (!ignore) {
          setData(res);
        }
      } catch (error) {
        console.error("Failed to fetch coupons", error);
        toast.error("Không thể tải danh sách khuyến mãi");
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }
    
    fetchCoupons();
    
    return () => {
      ignore = true;
    };
  }, [page, search, refreshKey]);

  const handleToggle = async (id: string) => {
    try {
      await api.post(`/admin/coupons/${id}/toggle`, {});
      toast.success("Đã thay đổi trạng thái khuyến mãi");
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      toast.error("Không thể thay đổi trạng thái");
    }
  };

  const handleOpenCreate = () => {
    setSelectedCoupon(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (coupon: CouponResponse) => {
    setSelectedCoupon({
      ...coupon,
    });
    setModalOpen(true);
  };

  const handleModalSuccess = () => {
    setModalOpen(false);
    setRefreshKey(prev => prev + 1);
  };

  const formatMoney = (val: number) => new Intl.NumberFormat("vi-VN").format(val) + "đ";

  const renderDiscount = (coupon: CouponResponse) => {
    if (coupon.discountType === "percentage") return `Giảm ${coupon.discountValue}%`;
    return `Giảm ${formatMoney(coupon.discountValue)}`;
  };

  const renderAppliesTo = (appliesTo: string) => {
    if (appliesTo === "vip") return <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[11px] font-bold">Gói Hội viên</span>;
    if (appliesTo === "boost") return <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-[11px] font-bold">Đẩy tin</span>;
    return <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-[11px] font-bold">Tất cả</span>;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const pad = (n: number) => String(n).padStart(2, '0');
    const d = pad(date.getDate());
    const m = pad(date.getMonth() + 1);
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  };

  const header = (
    <AdminHeader
      title="Quản lý khuyến mãi"
      description="Thêm, sửa và bật/tắt các mã giảm giá trong hệ thống."
      actions={
        <button 
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-[#e03c31] text-white px-4 py-2.5 rounded-lg text-[13px] font-bold hover:bg-[#c9362c] transition-colors shadow-sm"
        >
          <Ticket className="w-4 h-4" />
          Tạo khuyến mãi
        </button>
      }
    />
  );

  const coupons: CouponResponse[] = Array.isArray(data)
    ? data
    : (data && typeof data === "object" && "items" in data && Array.isArray(data.items))
    ? data.items
    : [];

  const totalItems = Array.isArray(data)
    ? data.length
    : (data && typeof data === "object" && "meta" in data && data.meta ? data.meta.total : 0);

  const totalPages = Array.isArray(data)
    ? 1
    : (data && typeof data === "object" && "meta" in data && data.meta ? data.meta.totalPages : 1);

  const currentPageNum = Array.isArray(data)
    ? 1
    : (data && typeof data === "object" && "meta" in data && data.meta ? data.meta.page : 1);

  const showPagination = !Array.isArray(data) &&
    data &&
    typeof data === "object" &&
    "meta" in data &&
    data.meta &&
    data.meta.totalPages > 1;

  return (
    <AdminPageTemplate header={header}>
      <div className="p-6">
        <FilterBar>
          <SearchInput
            placeholder="Tìm theo mã..."
            value={search}
            onChange={(val) => {
              const params = new URLSearchParams(searchParams);
              if (val) params.set("search", val);
              else params.delete("search");
              params.set("page", "1");
              router.push(`${pathname}?${params.toString()}`);
            }}
            className="flex-1 min-w-[240px] max-w-md"
          />
        </FilterBar>

        <TableShell
          title="Danh sách khuyến mãi"
          description={loading ? "Đang tải..." : `Trang ${page}/${totalPages} · ${totalItems} mã khuyến mãi`}
        >
          <div className="min-w-[1000px] border border-gray-200 rounded-xl overflow-hidden bg-white mt-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">Mã / Áp dụng</th>
                  <th className="px-4 py-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">Mức giảm</th>
                  <th className="px-4 py-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">Lượt dùng</th>
                  <th className="px-4 py-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">Thời hạn</th>
                  <th className="px-4 py-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-4 py-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" />
                    </td>
                  </tr>
                ) : !coupons.length ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-gray-500 text-[13px] font-medium">
                      Không tìm thấy mã khuyến mãi nào.
                    </td>
                  </tr>
                ) : (
                  coupons.map((coupon) => {
                    const isExpired = coupon.validUntil && new Date(coupon.validUntil) < new Date();
                    
                    return (
                      <tr key={coupon.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="text-[13px] font-extrabold text-gray-900 mb-1">{coupon.code}</div>
                          <div className="flex gap-2 items-center">
                            {renderAppliesTo(coupon.appliesTo)}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-[13px] font-bold text-red-600 mb-1">{renderDiscount(coupon)}</div>
                          {coupon.minOrderAmount ? (
                            <div className="text-[11px] text-gray-500">Đơn tối thiểu: {formatMoney(coupon.minOrderAmount)}</div>
                          ) : (
                            <div className="text-[11px] text-gray-500">Không yêu cầu tối thiểu</div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-[13px] font-medium text-gray-900">
                            {coupon.usedCount} <span className="text-gray-400">/ {coupon.maxUses ? coupon.maxUses : "∞"}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-[12px] text-gray-600 mb-1">
                            Từ: {formatDate(coupon.validFrom)}
                          </div>
                          <div className={`text-[12px] font-medium ${isExpired ? "text-red-500" : "text-gray-600"}`}>
                            Đến: {coupon.validUntil ? formatDate(coupon.validUntil) : "Không giới hạn"}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <button 
                            onClick={() => handleToggle(coupon.id)}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                              coupon.isActive 
                                ? "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200" 
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200"
                            }`}
                          >
                            {coupon.isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            {coupon.isActive ? "Hoạt động" : "Tạm dừng"}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleOpenEdit(coupon)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Sửa"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          
          {showPagination && (
            <div className="mt-4">
              <AdminPagination
                page={currentPageNum}
                totalPages={totalPages}
                onChange={(p) => {
                  const params = new URLSearchParams(searchParams);
                  params.set("page", p.toString());
                  router.push(`${pathname}?${params.toString()}`);
                }}
              />
            </div>
          )}
        </TableShell>
      </div>

      <CouponFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialData={selectedCoupon}
        onSuccess={handleModalSuccess}
      />
    </AdminPageTemplate>
  );
}
