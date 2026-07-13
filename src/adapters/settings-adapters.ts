import type { AdminSetting } from "@/app/admin/_data/types";
import type { ApiSettings } from "@/services/admin";
import { formatDate } from "@/lib/formatters/date";

// Backend admin/settings returns a single Settings object; the admin UI renders
// a per-field table, so flatten known fields into individual rows.
export function apiSettingsToRows(settings: ApiSettings | null): AdminSetting[] {
  if (!settings) return [];

  const updatedAt = formatDate(settings.updatedAt);

  const fields: Array<{ group: string; name: string; value: unknown }> = [
    { group: "Chung", name: "Tên website", value: settings.siteName },
    { group: "Chung", name: "Mô tả website", value: settings.siteDescription },
    { group: "Thương hiệu", name: "Logo", value: settings.logoUrl },
    { group: "Thương hiệu", name: "Favicon", value: settings.faviconUrl },
    { group: "Liên hệ", name: "Số điện thoại", value: settings.contactPhone },
    { group: "Liên hệ", name: "Email", value: settings.contactEmail },
    { group: "Liên hệ", name: "Địa chỉ", value: settings.address },
    { group: "Hệ thống", name: "Kích hoạt", value: settings.isActive ? "Bật" : "Tắt" },
  ];

  return fields.map((field, index) => {
    const hasValue = field.value !== undefined && field.value !== null && field.value !== "";
    return {
      id: `${field.group}-${index}`,
      group: field.group,
      name: field.name,
      value: hasValue ? String(field.value) : "--",
      updatedAt,
      status: hasValue ? "Đang áp dụng" : "Cần kiểm tra",
    };
  });
}
