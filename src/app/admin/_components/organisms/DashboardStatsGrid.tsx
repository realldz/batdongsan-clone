"use client";

import { Building2, FileCheck2, Users, Eye } from "lucide-react";
import { StatsGrid } from "../molecules/StatsGrid";
import { StatCard } from "../atoms/StatCard";

export interface DashboardStatsGridProps {
  activeListingCount: number;
  pendingListingCount: number;
  totalUsers: number;
  lockedUsersCount: number;
  totalViews: number;
}

export function DashboardStatsGrid({
  activeListingCount,
  pendingListingCount,
  totalUsers,
  lockedUsersCount,
  totalViews,
}: DashboardStatsGridProps) {
  return (
    <StatsGrid cols={4}>
      <StatCard
        title="Tin đang hoạt động"
        value={`${activeListingCount} tin`}
        helper="Tăng 12% so với tuần trước"
        tone="green"
        icon={<Building2 className="w-5 h-5" />}
      />
      <StatCard
        title="Chờ duyệt"
        value={`${pendingListingCount} tin`}
        helper="Cần xử lý trong SLA 4 giờ"
        tone="amber"
        icon={<FileCheck2 className="w-5 h-5" />}
      />
      <StatCard
        title="Người dùng"
        value={`${totalUsers} tài khoản`}
        helper={`${lockedUsersCount} tài khoản đang tạm khóa`}
        tone="blue"
        icon={<Users className="w-5 h-5" />}
      />
      <StatCard
        title="Lượt xem"
        value={totalViews.toLocaleString("vi-VN")}
        helper="Tổng lượt xem các tin"
        tone="red"
        icon={<Eye className="w-5 h-5" />}
      />
    </StatsGrid>
  );
}
