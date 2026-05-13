import { AdminHeader } from "../_components/AdminHeader";
import { AdminTableShell, StatusBadge } from "../_components/AdminUi";
import { adminAgents } from "../_data/mock";
import { Star } from "lucide-react";

export default function AdminAgentsPage() {
  return (
    <>
      <AdminHeader title="Quản lý môi giới" description="Theo dõi hồ sơ môi giới, xác minh và hiệu suất tin đăng." />
      <main className="flex-1 overflow-y-auto p-5 lg:p-7 space-y-5 pb-12">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-5"><div className="text-sm font-bold text-gray-500 mb-2">Tổng môi giới</div><div className="text-3xl font-extrabold text-gray-900">{adminAgents.length}</div></div>
          <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-5"><div className="text-sm font-bold text-gray-500 mb-2">Đã xác minh</div><div className="text-3xl font-extrabold text-gray-900">{adminAgents.filter((agent) => agent.verified).length}</div></div>
          <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-5"><div className="text-sm font-bold text-gray-500 mb-2">Tổng tin đăng</div><div className="text-3xl font-extrabold text-gray-900">{adminAgents.reduce((sum, agent) => sum + agent.listings, 0)}</div></div>
        </section>

        <AdminTableShell title="Danh sách môi giới" description="Bảng mock phục vụ admin giai đoạn đầu">
          <table className="w-full min-w-[900px] text-left">
            <thead className="bg-gray-50 text-[11px] uppercase tracking-wider text-gray-500 font-extrabold">
              <tr><th className="px-5 py-3">Môi giới</th><th className="px-5 py-3">Khu vực</th><th className="px-5 py-3">Công ty</th><th className="px-5 py-3">Đánh giá</th><th className="px-5 py-3">Trạng thái</th><th className="px-5 py-3 text-right">Tin đăng</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {adminAgents.map((agent) => (
                <tr key={agent.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4"><div className="font-extrabold text-gray-900">{agent.name}</div><div className="text-xs font-medium text-gray-500 mt-1">{agent.phone} · {agent.verified ? "Đã xác minh" : "Chưa xác minh"}</div></td>
                  <td className="px-5 py-4 font-bold text-gray-700">{agent.area}</td>
                  <td className="px-5 py-4 font-bold text-gray-700">{agent.company}</td>
                  <td className="px-5 py-4"><span className="inline-flex items-center gap-1 font-extrabold text-gray-900"><Star className="w-4 h-4 text-amber-400 fill-amber-400" /> {agent.rating}</span></td>
                  <td className="px-5 py-4"><StatusBadge tone={agent.status === "Đang hoạt động" ? "green" : agent.status === "Chờ xác minh" ? "amber" : "red"}>{agent.status}</StatusBadge></td>
                  <td className="px-5 py-4 text-right font-extrabold text-gray-900">{agent.listings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </AdminTableShell>
      </main>
    </>
  );
}
