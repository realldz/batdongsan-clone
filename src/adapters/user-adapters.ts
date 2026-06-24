import type { AdminUser, AdminUserRole, AdminUserStatus } from "@/app/admin/_data/types";
import type { ApiUser } from "@/services/admin";
import { formatDate } from "@/lib/formatters/date";
import { formatCompactNumber } from "@/lib/formatters/currency";

export function mapUserRole(role: number | string | undefined): AdminUserRole {
  if (role === 15 || role === "admin" || role === "Admin") return "Admin";
  if (role === 7 || role === "editor" || role === "Biên tập viên") return "Biên tập viên";
  if (role === 3 || role === "agent" || role === "merchant" || role === "Môi giới") return "Môi giới";
  if (role === "enterprise" || role === "Doanh nghiệp") return "Doanh nghiệp";
  return "Người bán";
}

export function mapAdminRoleToApiRole(role: AdminUserRole): number {
  if (role === "Admin") return 15;
  if (role === "Biên tập viên") return 7;
  if (role === "Môi giới" || role === "Doanh nghiệp") return 3;
  return 1;
}

export function mapUserStatus(user: ApiUser): AdminUserStatus {
  if (user.deletedAt) return "Tạm khóa";
  if (user.isBlocked) return "Tạm khóa";
  if (user.status === "pending" || user.status === "Chờ xác minh") return "Chờ xác minh";
  if (user.status === "locked" || user.status === "Tạm khóa") return "Tạm khóa";
  return "Đang hoạt động";
}

export function apiUserToAdminUser(user: ApiUser): AdminUser {
  const revenue = typeof user.revenue === "number" ? `${formatCompactNumber(user.revenue)} đ` : user.revenue ?? "0 đ";

  return {
    id: user.id,
    name: user.fullName ?? user.name ?? user.email ?? "Người dùng",
    phone: user.phone ?? "--",
    email: user.email ?? "--",
    role: mapUserRole(user.role),
    roleNumber: typeof user.role === "number" ? user.role : 1,
    status: mapUserStatus(user),
    isBlocked: !!user.isBlocked || !!user.deletedAt,
    listings: typeof user.listings === "number" ? user.listings : 0,
    revenue: String(revenue),
    joinedAt: formatDate(user.createdAt),
    note: "Dữ liệu từ API",
  };
}
