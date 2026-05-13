"use client";

import { AdminHeader } from "./_components/AdminHeader";
import { AdminStatCard, AdminTableShell, StatusBadge } from "./_components/AdminUi";
import { adminActivities, adminListings, adminUsers, type AdminListing, type AdminUser } from "./_data/mock";
import { propertyToAdminListing, unwrapArray, apiUserToAdminUser } from "@/lib/api-adapters";
import { getAdminStatistics, getAdminUsers, getPendingProperties, type AdminStatistics, type ApiUser } from "@/services/admin";
import type { Property } from "@/services/properties";
import { AlertTriangle, Banknote, Building2, CircleDollarSign, Eye, FileCheck2, TrendingUp, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function AdminDashboardPage() {
  const [dashboardListings, setDashboardListings] = useState<AdminListing[]>(adminListings);
  const [dashboardUsers, setDashboardUsers] = useState<AdminUser[]>(adminUsers);
  const [statistics, setStatistics] = useState<AdminStatistics | null>(null);
  const [dataSource, setDataSource] = useState("mock");

  useEffect(() => {
    let ignore = false;

    async function loadDashboard() {
      try {
        const [statsResponse, pendingResponse, usersResponse] = await Promise.all([
          getAdminStatistics(),
          getPendingProperties({ page: 1, perPage: 20 }),
          getAdminUsers({ page: 1, perPage: 20 }),
        ]);

        if (ignore) return;

        const pending = unwrapArray<Property>(pendingResponse).map(propertyToAdminListing);
        const apiUsers = unwrapArray<ApiUser>(usersResponse).map(apiUserToAdminUser);

        setStatistics(statsResponse);
        if (pending.length > 0) setDashboardListings(pending);
        if (apiUsers.length > 0) setDashboardUsers(apiUsers);
        setDataSource("api");
      } catch {
        if (!ignore) setDataSource("mock");
      }
    }

    loadDashboard();

    return () => {
      ignore = true;
    };
  }, []);

  const pendingListings = useMemo(() => dashboardListings.filter((listing) => listing.status === "Chờ duyệt"), [dashboardListings]);
  const activeListings = useMemo(() => dashboardListings.filter((listing) => listing.status === "Đang hiển thị" || listing.status === "Đã duyệt"), [dashboardListings]);
  const lockedUsers = useMemo(() => dashboardUsers.filter((user) => user.status === "Tạm khóa"), [dashboardUsers]);
  const totalViews = statistics?.totalViews ?? dashboardListings.reduce((sum, listing) => sum + listing.views, 0);
  const totalUsers = statistics?.totalUsers ?? statistics?.users ?? dashboardUsers.length;
  const activeListingCount = statistics?.activeProperties ?? activeListings.length;
  const pendingListingCount = statistics?.pendingProperties ?? pendingListings.length;
  const totalRevenue = statistics?.totalRevenue ?? statistics?.revenue;

  return (
    <>
      <AdminHeader title="Tổng quan admin" description={`Theo dõi vận hành, duyệt tin và sức khỏe dữ liệu toàn hệ thống (${dataSource === "api" ? "API" : "mock"}).`} />
      <main className="flex-1 overflow-y-auto p-5 lg:p-7 space-y-6 pb-12">
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <AdminStatCard title="Tin đang hoạt động" value={`${activeListingCount} tin`} helper="Tăng 12% so với tuần trước" tone="green" icon={<Building2 className="w-5 h-5" />} />
          <AdminStatCard title="Chờ duyệt" value={`${pendingListingCount} tin`} helper="Cần xử lý trong SLA 4 giờ" tone="amber" icon={<FileCheck2 className="w-5 h-5" />} />
          <AdminStatCard title="Người dùng" value={`${totalUsers} tài khoản`} helper={`${lockedUsers.length} tài khoản đang tạm khóa`} tone="blue" icon={<Users className="w-5 h-5" />} />
          <AdminStatCard title="Lượt xem" value={totalViews.toLocaleString("vi-VN")} helper="Tổng lượt xem các tin" tone="red" icon={<Eye className="w-5 h-5" />} />
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-[1fr_0.8fr] gap-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-extrabold text-gray-900">Tổng quan doanh thu</h2>
                <p className="text-xs font-medium text-gray-500 mt-1">
                  {totalRevenue != null ? "Dữ liệu từ API thống kê" : "Chưa có dữ liệu doanh thu từ API"}
                </p>
              </div>
              <StatusBadge tone={totalRevenue != null ? "green" : "gray"}>
                {totalRevenue != null ? "Đã kết nối" : "Đang cập nhật"}
              </StatusBadge>
            </div>
            {totalRevenue != null ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-gradient-to-br from-red-50 to-red-100/50 p-5 border border-red-100">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e03c31] text-white">
                      <CircleDollarSign className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-bold text-gray-600">Tổng doanh thu</span>
                  </div>
                  <div className="text-2xl font-extrabold text-[#e03c31]">
                    {typeof totalRevenue === "number"
                      ? `${new Intl.NumberFormat("vi-VN").format(totalRevenue)} đ`
                      : String(totalRevenue)}
                  </div>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-5 border border-emerald-100">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-bold text-gray-600">Người dùng hoạt động</span>
                  </div>
                  <div className="text-2xl font-extrabold text-emerald-700">
                    {statistics?.activeUsers ?? "--"}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-[120px] flex items-center justify-center text-sm font-medium text-gray-400">
                API chưa trả về dữ liệu doanh thu. Hiển thị khi backend hỗ trợ.
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h2 className="text-lg font-extrabold text-gray-900 mb-1">Hoạt động gần đây</h2>
            <p className="text-xs font-medium text-gray-500 mb-4">Các thao tác vận hành mới nhất</p>
            <div className="space-y-3">
              {adminActivities.map((activity) => (
                <div key={activity.id} className="flex gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
                  <div className="w-9 h-9 rounded-full bg-red-50 text-[#e03c31] flex items-center justify-center shrink-0">
                    <Banknote className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-extrabold text-gray-900">{activity.action}</div>
                    <div className="text-xs font-medium text-gray-500 truncate">{activity.actor} · {activity.target}</div>
                    <div className="text-[11px] font-bold text-gray-400 mt-1">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <AdminTableShell title="Cảnh báo cần xử lý" description="Tin có báo cáo, người dùng bị khóa và nội dung đang chờ duyệt." action={<StatusBadge tone="amber">Ưu tiên cao</StatusBadge>}>
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-gray-50 text-[11px] uppercase tracking-wider text-gray-500 font-extrabold">
              <tr>
                <th className="px-5 py-3">Loại</th>
                <th className="px-5 py-3">Nội dung</th>
                <th className="px-5 py-3">Người phụ trách</th>
                <th className="px-5 py-3">Trạng thái</th>
                <th className="px-5 py-3 text-right">Mức độ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {dashboardListings.filter((listing) => listing.reports > 0 || listing.status === "Chờ duyệt").map((listing) => (
                <tr key={listing.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 font-bold text-gray-700"><AlertTriangle className="w-4 h-4 text-amber-500" /> Tin đăng</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-extrabold text-gray-900 line-clamp-1">{listing.title}</div>
                    <div className="text-xs font-medium text-gray-500 mt-1">{listing.code} · {listing.location}</div>
                  </td>
                  <td className="px-5 py-4 font-bold text-gray-700">{listing.owner}</td>
                  <td className="px-5 py-4"><StatusBadge tone={listing.status === "Chờ duyệt" ? "amber" : "red"}>{listing.status}</StatusBadge></td>
                  <td className="px-5 py-4 text-right font-extrabold text-[#e03c31]">{listing.reports > 0 ? `${listing.reports} báo cáo` : "Chờ duyệt"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </AdminTableShell>
      </main>
    </>
  );
}
