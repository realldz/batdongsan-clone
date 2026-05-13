import { AdminHeader } from "../_components/AdminHeader";
import { AdminTableShell, StatusBadge } from "../_components/AdminUi";
import { adminSettings } from "../_data/mock";

export default function AdminSettingsPage() {
  return (
    <>
      <AdminHeader title="Cấu hình hệ thống" description="Các thiết lập mock cho duyệt tin, gói dịch vụ, người dùng và nội dung." />
      <main className="flex-1 overflow-y-auto p-5 lg:p-7 space-y-5 pb-12">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-5"><div className="text-sm font-bold text-gray-500 mb-2">Thiết lập</div><div className="text-3xl font-extrabold text-gray-900">{adminSettings.length}</div></div>
          <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-5"><div className="text-sm font-bold text-gray-500 mb-2">Đang áp dụng</div><div className="text-3xl font-extrabold text-gray-900">{adminSettings.filter((setting) => setting.status === "Đang áp dụng").length}</div></div>
          <div className="rounded-xl bg-[#fff6f6] border border-red-100 shadow-sm p-5"><div className="text-sm font-bold text-[#e03c31] mb-2">Cần kiểm tra</div><div className="text-3xl font-extrabold text-gray-900">{adminSettings.filter((setting) => setting.status === "Cần kiểm tra").length}</div></div>
        </section>

        <AdminTableShell title="Danh sách cấu hình" description="Bảng mock phục vụ admin giai đoạn đầu">
          <table className="w-full min-w-[820px] text-left">
            <thead className="bg-gray-50 text-[11px] uppercase tracking-wider text-gray-500 font-extrabold">
              <tr><th className="px-5 py-3">Nhóm</th><th className="px-5 py-3">Tên cấu hình</th><th className="px-5 py-3">Giá trị</th><th className="px-5 py-3">Trạng thái</th><th className="px-5 py-3 text-right">Cập nhật</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {adminSettings.map((setting) => (
                <tr key={setting.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 font-bold text-gray-700">{setting.group}</td>
                  <td className="px-5 py-4 font-extrabold text-gray-900">{setting.name}</td>
                  <td className="px-5 py-4 font-bold text-gray-700">{setting.value}</td>
                  <td className="px-5 py-4"><StatusBadge tone={setting.status === "Đang áp dụng" ? "green" : "amber"}>{setting.status}</StatusBadge></td>
                  <td className="px-5 py-4 text-right font-bold text-gray-700">{setting.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </AdminTableShell>
      </main>
    </>
  );
}
