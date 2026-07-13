"use client";

import { Building2, FileCheck2, Users, BadgeCheck } from "lucide-react";
import { StatsGrid } from "../molecules/StatsGrid";
import { StatCard } from "../atoms/StatCard";

export interface DashboardStatsGridProps {
  activeListingCount: number;
  pendingListingCount: number;
  totalUsers: number;
  lockedUsersCount: number;
  soldProperties: number;
  activeGrowthPct: number | null;
}

function growthHelper(pct: number | null): string {
  if (pct == null) return "Chưa có dữ liệu so sánh tuần";
  if (pct > 0) return `Tăng ${pct}% so với tuần trước`;
  if (pct < 0) return `Giảm ${Math.abs(pct)}% so với tuần trước`;
  return "Không đổi so với tuần trước";
}

export function DashboardStatsGrid({
  activeListingCount,
  pendingListingCount,
  totalUsers,
  lockedUsersCount,
  soldProperties,
  activeGrowthPct,
}: DashboardStatsGridProps) {
  return (
    <StatsGrid cols={4}>
      <StatCard
        title="Tin đang hoạt động"
        value={`${activeListingCount} tin`}
        helper={growthHelper(activeGrowthPct)}
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
        title="Giao dịch hoàn tất"
        value={soldProperties.toLocaleString("vi-VN")}
        helper="Tổng giao dịch đã bán"
        tone="red"
        icon={<BadgeCheck className="w-5 h-5" />}
      />
    </StatsGrid>
  );
}
