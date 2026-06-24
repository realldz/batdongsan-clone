import { BriefcaseBusiness, Building2, Eye } from "lucide-react";
import { adminEnterprises } from "../_data/mock";
import { AdminHeader } from "../_components/organisms/AdminHeader";
import { StatusBadge } from "../_components/atoms/StatusBadge";
import { TableShell } from "../_components/molecules/TableShell";
import { StatsGrid } from "../_components/molecules/StatsGrid";
import { StatCard } from "../_components/atoms/StatCard";
import { AdminPageTemplate } from "../_components/templates/AdminPageTemplate";

export default function AdminEnterprisesPage() {
  const header = <AdminHeader title="Quản lý doanh nghiệp" description="Theo dõi hồ sơ doanh nghiệp, gói dịch vụ và trạng thái vận hành." />;

  return (
    <AdminPageTemplate header={header}>
      <StatsGrid cols={3}>
        <StatCard title="Tổng doanh nghiệp" value={`${adminEnterprises.length}`} helper="Doanh nghiệp đã đăng ký" icon={<BriefcaseBusiness className="w-5 h-5" />} />
        <StatCard title="Gói trả phí" value={`${adminEnterprises.filter((enterprise) => enterprise.plan !== "Cơ bản").length}`} helper="Sử dụng dịch vụ cao cấp" tone="blue" icon={<Building2 className="w-5 h-5" />} />
        <StatCard title="Tổng tin đăng" value={`${adminEnterprises.reduce((sum, enterprise) => sum + enterprise.listings, 0)}`} helper="Tin đăng từ doanh nghiệp" tone="green" icon={<Eye className="w-5 h-5" />} />
      </StatsGrid>

      <TableShell title="Danh sách doanh nghiệp" description="Bảng mock phục vụ admin giai đoạn đầu">
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
            {adminEnterprises.map((enterprise) => (
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
      </TableShell>
    </AdminPageTemplate>
  );
}
