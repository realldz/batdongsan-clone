"use client";

import { useEffect, useState } from "react";
import { Settings, CheckCircle2, AlertCircle } from "lucide-react";
import { type AdminSetting } from "../_data/types";
import { AdminHeader } from "../_components/organisms/AdminHeader";
import { StatusBadge } from "../_components/atoms/StatusBadge";
import { TableShell } from "../_components/molecules/TableShell";
import { StatsGrid } from "../_components/molecules/StatsGrid";
import { StatCard } from "../_components/atoms/StatCard";
import { AdminPagination } from "../_components/molecules/AdminPagination";
import { AdminPageTemplate } from "../_components/templates/AdminPageTemplate";

const PAGE_SIZE = 2;

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<AdminSetting[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, active: 0, checking: 0 });

  useEffect(() => {
    let ignore = false;
    async function loadSettings() {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/settings?page=${currentPage}&perPage=${PAGE_SIZE}`);
        const result = await res.json();
        if (!ignore) {
          setSettings(result.data);
          setTotal(result.pagination.total);
          setTotalPages(result.pagination.totalPages || 1);
          setStats(result.stats);
        }
      } catch {
        if (!ignore) {
          setSettings([]);
          setTotal(0);
          setTotalPages(1);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    loadSettings();
    return () => {
      ignore = true;
    };
  }, [currentPage]);

  const header = <AdminHeader title="Cấu hình hệ thống" description="Các thiết lập thiết lập cho duyệt tin, gói dịch vụ, người dùng và nội dung." />;

  return (
    <AdminPageTemplate header={header}>
      <StatsGrid cols={3}>
        <StatCard title="Thiết lập" value={`${stats.total}`} helper="Tổng số cấu hình" icon={<Settings className="w-5 h-5" />} />
        <StatCard title="Đang áp dụng" value={`${stats.active}`} helper="Hoạt động bình thường" tone="green" icon={<CheckCircle2 className="w-5 h-5" />} />
        <StatCard title="Cần kiểm tra" value={`${stats.checking}`} helper="Yêu cầu kiểm tra thủ công" tone="red" icon={<AlertCircle className="w-5 h-5" />} />
      </StatsGrid>

      <TableShell title="Danh sách cấu hình" description={`Trang ${currentPage}/${totalPages} · ${total} cấu hình`}>
        {loading ? (
          <div className="py-14 text-center text-sm font-medium text-gray-400">Đang tải dữ liệu...</div>
        ) : settings.length === 0 ? (
          <div className="py-14 text-center text-sm font-medium text-gray-400">Không có dữ liệu cấu hình.</div>
        ) : (
          <>
            <table className="w-full min-w-[820px] text-left">
              <thead className="bg-gray-50 text-[11px] uppercase tracking-wider text-gray-500 font-extrabold">
                <tr>
                  <th className="px-5 py-3">Nhóm</th>
                  <th className="px-5 py-3">Tên cấu hình</th>
                  <th className="px-5 py-3">Giá trị</th>
                  <th className="px-5 py-3">Trạng thái</th>
                  <th className="px-5 py-3 text-right">Cập nhật</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {settings.map((setting) => (
                  <tr key={setting.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 font-bold text-gray-700">{setting.group}</td>
                    <td className="px-5 py-4 font-extrabold text-gray-900">{setting.name}</td>
                    <td className="px-5 py-4 font-bold text-gray-700">{setting.value}</td>
                    <td className="px-5 py-4">
                      <StatusBadge tone={setting.status === "Đang áp dụng" ? "green" : "amber"}>
                        {setting.status}
                      </StatusBadge>
                    </td>
                    <td className="px-5 py-4 text-right font-bold text-gray-700">{setting.updatedAt}</td>
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
