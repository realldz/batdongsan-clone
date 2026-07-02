import React from "react";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import type { WalletTransaction } from "@/services/wallet";

export function formatAmount(value: number | string) {
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number)) return String(value);

  return `${new Intl.NumberFormat("vi-VN").format(number)} đ`;
}

export function formatDate(value: string | undefined) {
  if (!value) return "--";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export function getTransactionTone(type: string | undefined) {
  return type === "deposit" || type === "credit"
    ? "text-emerald-600 bg-emerald-50"
    : "text-primary bg-red-50";
}

export function getStatusLabelAndColor(status: string | undefined) {
  if (!status) return { label: "--", color: "text-gray-400" };
  const s = status.toLowerCase();
  if (s === "success" || s === "thành công" || s === "completed") {
    return { label: "Thành công", color: "text-emerald-600 font-semibold" };
  }
  if (s === "failed" || s === "thất bại" || s === "error" || s === "failure") {
    return { label: "Thất bại", color: "text-red-600 font-semibold" };
  }
  if (s === "pending" || s === "đang xử lý" || s === "processing") {
    return { label: "Đang xử lý", color: "text-amber-600 font-semibold" };
  }
  if (s === "cancelled" || s === "hủy" || s === "cancel") {
    return { label: "Đã hủy", color: "text-gray-600 font-semibold" };
  }
  return { label: status, color: "text-gray-600 font-semibold" };
}

interface TransactionRowProps {
  item: WalletTransaction;
}

export function TransactionRow({ item }: TransactionRowProps) {
  const statusLower = item.status?.toLowerCase();
  const isFailed =
    statusLower === "failed" ||
    statusLower === "thất bại" ||
    statusLower === "error";
  const isCancelled =
    statusLower === "cancelled" ||
    statusLower === "hủy" ||
    statusLower === "cancel";

  let tone = getTransactionTone(item.type);
  if (isFailed) {
    tone = "text-red-600 bg-red-50";
  } else if (isCancelled) {
    tone = "text-gray-500 bg-gray-100";
  }

  const isIn = item.type === "deposit" || item.type === "credit";
  const statusInfo = getStatusLabelAndColor(item.status);

  return (
    <div className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tone}`}
        >
          {isIn ? (
            <ArrowDownCircle className="h-5 w-5" />
          ) : (
            <ArrowUpCircle className="h-5 w-5" />
          )}
        </div>
        <div>
          <div className="font-extrabold text-gray-900">
            {isIn ? "Nạp tiền" : "Thanh toán"}
          </div>
          <div className="mt-1 text-xs font-medium text-gray-500 flex items-center gap-1.5">
            <span>{formatDate(item.createdAt)}</span>
            <span>·</span>
            <span className={statusInfo.color}>{statusInfo.label}</span>
          </div>
          {item.description ? (
            <div className="mt-1 text-xs text-gray-400 line-clamp-1">
              {item.description}
            </div>
          ) : null}
        </div>
      </div>
      <div
        className={`text-right font-extrabold ${
          isFailed || isCancelled
            ? "text-gray-400 line-through"
            : isIn
            ? "text-emerald-600"
            : "text-primary"
        }`}
      >
        {isIn ? "+" : "-"}
        {formatAmount(item.amount)}
      </div>
    </div>
  );
}
