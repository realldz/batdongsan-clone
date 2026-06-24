import { Settings, CheckCircle2, AlertCircle } from "lucide-react";
import { adminSettings } from "../_data/mock";
import { AdminHeader } from "../_components/organisms/AdminHeader";
import { StatusBadge } from "../_components/atoms/StatusBadge";
import { TableShell } from "../_components/molecules/TableShell";
import { StatsGrid } from "../_components/molecules/StatsGrid";
import { StatCard } from "../_components/atoms/StatCard";
import { AdminPageTemplate } from "../_components/templates/AdminPageTemplate";

export default function AdminSettingsPage() {
  const header = <AdminHeader title="Cấu hình hệ thống" description="Các thiết lập thiết lập cho duyệt tin, gói dịch vụ, người dùng và nội dung." />;

  return (
    <AdminPageTemplate header={header}>
      <StatsGrid cols={3}>
        <StatCard title="Thiết lập" value={`${adminSettings.length}`} helper="Tổng số cấu hình" icon={<Settings className="w-5 h-5" />} />
        <StatCard title="Đang áp dụng" value={`${adminSettings.filter((setting) => setting.status === "Đang áp dụng").length}`} helper="Hoạt động bình thường" tone="green" icon={<CheckCircle2 className="w-5 h-5" />} />
        <StatCard title="Cần kiểm tra" value={`${adminSettings.filter((setting) => setting.status === "Cần kiểm tra").length}`} helper="Yêu cầu kiểm tra thủ công" tone="red" icon={<AlertCircle className="w-5 h-5" />} />
      </StatsGrid>

      <TableShell title="Danh sách cấu hình" description="Bảng mock phục vụ admin giai đoạn đầu">
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
            {adminSettings.map((setting) => (
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
      </TableShell>
    </AdminPageTemplate>
  );
}
