"use client";

import { useEffect, useState } from "react";
import { Star, UserRoundCheck, Building2, Eye } from "lucide-react";
import { type AdminAgent } from "../_data/types";
import { AdminHeader } from "../_components/organisms/AdminHeader";
import { StatusBadge } from "../_components/atoms/StatusBadge";
import { TableShell } from "../_components/molecules/TableShell";
import { StatsGrid } from "../_components/molecules/StatsGrid";
import { StatCard } from "../_components/atoms/StatCard";
import { AdminPagination } from "../_components/molecules/AdminPagination";
import { AdminPageTemplate } from "../_components/templates/AdminPageTemplate";

const PAGE_SIZE = 2;

export default function AdminAgentsPage() {
  const [agents, setAgents] = useState<AdminAgent[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, verified: 0, totalListings: 0 });

  useEffect(() => {
    let ignore = false;
    async function loadAgents() {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/agents?page=${currentPage}&perPage=${PAGE_SIZE}`);
        const result = await res.json();
        if (!ignore) {
          setAgents(result.data);
          setTotal(result.pagination.total);
          setTotalPages(result.pagination.totalPages || 1);
          setStats(result.stats);
        }
      } catch {
        if (!ignore) {
          setAgents([]);
          setTotal(0);
          setTotalPages(1);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    loadAgents();
    return () => {
      ignore = true;
    };
  }, [currentPage]);

  const header = <AdminHeader title="Quản lý môi giới" description="Theo dõi hồ sơ môi giới, xác minh và hiệu suất tin đăng." />;

  return (
    <AdminPageTemplate header={header}>
      <StatsGrid cols={3}>
        <StatCard title="Tổng môi giới" value={`${stats.total}`} helper="Môi giới đã đăng ký" icon={<UserRoundCheck className="w-5 h-5" />} />
        <StatCard title="Đã xác minh" value={`${stats.verified}`} helper="Hồ sơ được xác minh" tone="green" icon={<Building2 className="w-5 h-5" />} />
        <StatCard title="Tổng tin đăng" value={`${stats.totalListings}`} helper="Tin đăng từ môi giới" tone="blue" icon={<Eye className="w-5 h-5" />} />
      </StatsGrid>

      <TableShell title="Danh sách môi giới" description={`Trang ${currentPage}/${totalPages} · ${total} môi giới`}>
        {loading ? (
          <div className="py-14 text-center text-sm font-medium text-gray-400">Đang tải dữ liệu...</div>
        ) : agents.length === 0 ? (
          <div className="py-14 text-center text-sm font-medium text-gray-400">Không có dữ liệu môi giới.</div>
        ) : (
          <>
            <table className="w-full min-w-[900px] text-left">
              <thead className="bg-gray-50 text-[11px] uppercase tracking-wider text-gray-500 font-extrabold">
                <tr>
                  <th className="px-5 py-3">Môi giới</th>
                  <th className="px-5 py-3">Khu vực</th>
                  <th className="px-5 py-3">Công ty</th>
                  <th className="px-5 py-3">Đánh giá</th>
                  <th className="px-5 py-3">Trạng thái</th>
                  <th className="px-5 py-3 text-right">Tin đăng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {agents.map((agent) => (
                  <tr key={agent.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <div className="font-extrabold text-gray-900">{agent.name}</div>
                      <div className="text-xs font-medium text-gray-500 mt-1">{agent.phone} · {agent.verified ? "Đã xác minh" : "Chưa xác minh"}</div>
                    </td>
                    <td className="px-5 py-4 font-bold text-gray-700">{agent.area}</td>
                    <td className="px-5 py-4 font-bold text-gray-700">{agent.company}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 font-extrabold text-gray-900">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> {agent.rating}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge tone={agent.status === "Đang hoạt động" ? "green" : agent.status === "Chờ xác minh" ? "amber" : "red"}>
                        {agent.status}
                      </StatusBadge>
                    </td>
                    <td className="px-5 py-4 text-right font-extrabold text-gray-900">{agent.listings}</td>
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
