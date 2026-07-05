"use client";

import { useEffect, useState } from "react";
import { BriefcaseBusiness, Building2, Eye } from "lucide-react";
import { type AdminEnterprise } from "../_data/types";
import { AdminHeader } from "../_components/organisms/AdminHeader";
import { StatusBadge } from "../_components/atoms/StatusBadge";
import { TableShell } from "../_components/molecules/TableShell";
import { StatsGrid } from "../_components/molecules/StatsGrid";
import { StatCard } from "../_components/atoms/StatCard";
import { AdminPagination } from "../_components/molecules/AdminPagination";
import { AdminPageTemplate } from "../_components/templates/AdminPageTemplate";

const PAGE_SIZE = 2;

export default function AdminEnterprisesPage() {
  const [enterprises, setEnterprises] = useState<AdminEnterprise[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, paidPlans: 0, totalListings: 0 });

  useEffect(() => {
    let ignore = false;
    async function loadEnterprises() {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/enterprises?page=${currentPage}&perPage=${PAGE_SIZE}`);
        const result = await res.json();
        if (!ignore) {
          setEnterprises(result.data);
          setTotal(result.pagination.total);
          setTotalPages(result.pagination.totalPages || 1);
          setStats(result.stats);
        }
      } catch {
        if (!ignore) {
          setEnterprises([]);
          setTotal(0);
          setTotalPages(1);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    loadEnterprises();
    return () => {
      ignore = true;
    };
  }, [currentPage]);

  const header = <AdminHeader title="Quản lý doanh nghiệp" description="Theo dõi hồ sơ doanh nghiệp, gói dịch vụ và trạng thái vận hành." />;

  return (
    <AdminPageTemplate header={header}>
      <StatsGrid cols={3}>
        <StatCard title="Tổng doanh nghiệp" value={`${stats.total}`} helper="Doanh nghiệp đã đăng ký" icon={<BriefcaseBusiness className="w-5 h-5" />} />
        <StatCard title="Gói trả phí" value={`${stats.paidPlans}`} helper="Sử dụng dịch vụ cao cấp" tone="blue" icon={<Building2 className="w-5 h-5" />} />
        <StatCard title="Tổng tin đăng" value={`${stats.totalListings}`} helper="Tin đăng từ doanh nghiệp" tone="green" icon={<Eye className="w-5 h-5" />} />
      </StatsGrid>

      <TableShell title="Danh sách doanh nghiệp" description={`Trang ${currentPage}/${totalPages} · ${total} doanh nghiệp`}>
        {loading ? (
          <div className="py-14 text-center text-sm font-medium text-gray-400">Đang tải dữ liệu...</div>
        ) : enterprises.length === 0 ? (
          <div className="py-14 text-center text-sm font-medium text-gray-400">Không có dữ liệu doanh nghiệp.</div>
        ) : (
          <>
            <table className="w-full min-w-[900px] text-left">
              <thead className="bg-gray-50 text-[11px] uppercase tracking-wider text-gray-500 font-extrabold">
                <tr>
                  <th className="px-5 py-3">Doanh nghiệp</th>
                  <th className="px-5 py-3">Mã số thuế</th>
                  <th className="px-5 py-3">Khu vực</th>
                  <th className="px-5 py-3">Gói</th>
                  <th className="px-5 py-3">Trạng thái</th>
                  <th className="px-5 py-3 text-right">Tin đăng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {enterprises.map((enterprise) => (
                  <tr key={enterprise.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <div className="font-extrabold text-gray-900">{enterprise.name}</div>
                      <div className="text-xs font-medium text-gray-500 mt-1">Tham gia {enterprise.joinedAt}</div>
                    </td>
                    <td className="px-5 py-4 font-bold text-gray-700">{enterprise.taxCode}</td>
                    <td className="px-5 py-4 font-bold text-gray-700">{enterprise.location}</td>
                    <td className="px-5 py-4">
                      <StatusBadge tone={enterprise.plan === "Doanh nghiệp" ? "violet" : enterprise.plan === "Chuyên nghiệp" ? "blue" : "gray"}>
                        {enterprise.plan}
                      </StatusBadge>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge tone={enterprise.status === "Đang hoạt động" ? "green" : enterprise.status === "Chờ xác minh" ? "amber" : "red"}>
                        {enterprise.status}
                      </StatusBadge>
                    </td>
                    <td className="px-5 py-4 text-right font-extrabold text-gray-900">{enterprise.listings}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <AdminPagination page={currentPage} totalPages={totalPages} onChange={setCurrentPage} />
          </>
        )}
      </TableShell>
    </AdminPageTemplate>
  );
}
