export function formatDate(value: string | Date | undefined): string {
  if (!value) return "--";

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return typeof value === "string" ? value : "--";

  return new Intl.DateTimeFormat("vi-VN").format(date);
}

export function formatPostedTime(value: string | undefined): string {
  if (!value) return "Đăng gần đây";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Đăng gần đây";

  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.max(0, Math.floor(diffMs / 86_400_000));

  if (diffDays === 0) return "Đăng hôm nay";
  if (diffDays === 1) return "Đăng hôm qua";
  if (diffDays < 7) return `Đăng ${diffDays} ngày trước`;
  if (diffDays < 30) return `Đăng ${Math.floor(diffDays / 7)} tuần trước`;

  return `Đăng ${Math.floor(diffDays / 30)} tháng trước`;
}

export function formatRelativeTime(value: string | undefined): string {
  if (!value) return "Gần đây";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Gần đây";

  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.max(0, Math.floor(diffMs / 60_000));
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 7) return `${diffDays} ngày trước`;

  return new Intl.DateTimeFormat("vi-VN").format(date);
}
