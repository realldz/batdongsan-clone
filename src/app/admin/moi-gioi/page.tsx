import { Star, UserRoundCheck, Building2, Eye } from "lucide-react";
import { adminAgents } from "../_data/mock";
import { AdminHeader } from "../_components/organisms/AdminHeader";
import { StatusBadge } from "../_components/atoms/StatusBadge";
import { TableShell } from "../_components/molecules/TableShell";
import { StatsGrid } from "../_components/molecules/StatsGrid";
import { StatCard } from "../_components/atoms/StatCard";
import { AdminPageTemplate } from "../_components/templates/AdminPageTemplate";

export default function AdminAgentsPage() {
  const header = <AdminHeader title="Quản lý môi giới" description="Theo dõi hồ sơ môi giới, xác minh và hiệu suất tin đăng." />;

  return (
    <AdminPageTemplate header={header}>
      <StatsGrid cols={3}>
        <StatCard title="Tổng môi giới" value={`${adminAgents.length}`} helper="Môi giới đã đăng ký" icon={<UserRoundCheck className="w-5 h-5" />} />
        <StatCard title="Đã xác minh" value={`${adminAgents.filter((agent) => agent.verified).length}`} helper="Hồ sơ được xác minh" tone="green" icon={<Building2 className="w-5 h-5" />} />
        <StatCard title="Tổng tin đăng" value={`${adminAgents.reduce((sum, agent) => sum + agent.listings, 0)}`} helper="Tin đăng từ môi giới" tone="blue" icon={<Eye className="w-5 h-5" />} />
      </StatsGrid>

      <TableShell title="Danh sách môi giới" description="Bảng mock phục vụ admin giai đoạn đầu">
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
            {adminAgents.map((agent) => (
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
      </TableShell>
    </AdminPageTemplate>
  );
}
