"use client";

import { Pencil, Trash2, Bell, BellOff } from "lucide-react";
import { Button, Badge } from "@/components/atoms";
import { formatDate } from "@/lib/formatters/date";
import { formatCurrency } from "@/lib/formatters/currency";
import { CATEGORIES_BY_SLUG } from "@/config/categories";
import type { SearchAlert } from "@/services/search-alerts";

interface SearchAlertCardProps {
  alert: SearchAlert;
  onEdit: (alert: SearchAlert) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
}

function summarizeCriteria(alert: SearchAlert): string {
  const { criteria } = alert;
  const parts: string[] = [];

  if (criteria.type) parts.push(criteria.type === "sale" ? "Bán" : "Cho thuê");
  if (criteria.category) parts.push(CATEGORIES_BY_SLUG[criteria.category]?.label ?? criteria.category);
  if (criteria.minPrice || criteria.maxPrice) {
    const min = criteria.minPrice ? formatCurrency(criteria.minPrice) : "0";
    const max = criteria.maxPrice ? formatCurrency(criteria.maxPrice) : "∞";
    parts.push(`${min} - ${max}`);
  }
  if (criteria.minArea || criteria.maxArea) {
    parts.push(`${criteria.minArea ?? 0} - ${criteria.maxArea ?? "∞"} m²`);
  }
  if (criteria.district) parts.push(criteria.district);
  if (criteria.province) parts.push(criteria.province);

  return parts.length > 0 ? parts.join(" · ") : "Không có tiêu chí";
}

export function SearchAlertCard({ alert, onEdit, onDelete, onToggleActive }: SearchAlertCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 truncate">{alert.name}</h3>
            <Badge variant={alert.isActive ? "success" : "neutral"}>
              {alert.isActive ? "Đang hoạt động" : "Đã tạm dừng"}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-gray-500">{summarizeCriteria(alert)}</p>
          <p className="mt-1 text-xs text-gray-400">
            {alert.lastMatchedAt
              ? `Lần khớp gần nhất: ${formatDate(alert.lastMatchedAt)}`
              : "Chưa có tin nào khớp"}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleActive(alert.id, !alert.isActive)}
            title={alert.isActive ? "Tạm dừng" : "Bật lại"}
          >
            {alert.isActive ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onEdit(alert)} title="Sửa">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(alert.id)} title="Xóa">
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </div>
    </div>
  );
}
