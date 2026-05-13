import { AdminHeader } from "../_components/AdminHeader";
import { AdminTableShell, StatusBadge } from "../_components/AdminUi";
import { adminEnterprises } from "../_data/mock";

export default function AdminEnterprisesPage() {
  return (
    <>
      <AdminHeader title="Quản lý doanh nghiệp" description="Theo dõi hồ sơ doanh nghiệp, gói dịch vụ và trạng thái vận hành." />
      <main className="flex-1 overflow-y-auto p-5 lg:p-7 space-y-5 pb-12">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-5"><div className="text-sm font-bold text-gray-500 mb-2">Tổng doanh nghiệp</div><div className="text-3xl font-extrabold text-gray-900">{adminEnterprises.length}</div></div>
          <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-5"><div className="text-sm font-bold text-gray-500 mb-2">Gói trả phí</div><div className="text-3xl font-extrabold text-gray-900">{adminEnterprises.filter((enterprise) => enterprise.plan !== "Cơ bản").length}</div></div>
          <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-5"><div className="text-sm font-bold text-gray-500 mb-2">Tổng tin đăng</div><div className="text-3xl font-extrabold text-gray-900">{adminEnterprises.reduce((sum, enterprise) => sum + enterprise.listings, 0)}</div></div>
        </section>

        <AdminTableShell title="Danh sách doanh nghiệp" description="Bảng mock phục vụ admin giai đoạn đầu">
          <table className="w-full min-w-[900px] text-left">
            <thead className="bg-gray-50 text-[11px] uppercase tracking-wider text-gray-500 font-extrabold">
              <tr><th className="px-5 py-3">Doanh nghiệp</th><th className="px-5 py-3">Mã số thuế</th><th className="px-5 py-3">Khu vực</th><th className="px-5 py-3">Gói</th><th className="px-5 py-3">Trạng thái</th><th className="px-5 py-3 text-right">Tin đăng</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {adminEnterprises.map((enterprise) => (
                <tr key={enterprise.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4"><div className="font-extrabold text-gray-900">{enterprise.name}</div><div className="text-xs font-medium text-gray-500 mt-1">Tham gia {enterprise.joinedAt}</div></td>
                  <td className="px-5 py-4 font-bold text-gray-700">{enterprise.taxCode}</td>
                  <td className="px-5 py-4 font-bold text-gray-700">{enterprise.location}</td>
                  <td className="px-5 py-4"><StatusBadge tone={enterprise.plan === "Doanh nghiệp" ? "violet" : enterprise.plan === "Chuyên nghiệp" ? "blue" : "gray"}>{enterprise.plan}</StatusBadge></td>
                  <td className="px-5 py-4"><StatusBadge tone={enterprise.status === "Đang hoạt động" ? "green" : enterprise.status === "Chờ xác minh" ? "amber" : "red"}>{enterprise.status}</StatusBadge></td>
                  <td className="px-5 py-4 text-right font-extrabold text-gray-900">{enterprise.listings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </AdminTableShell>
      </main>
    </>
  );
}
