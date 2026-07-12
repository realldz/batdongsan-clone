"use client";

import { Loader2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { FilterSelect } from "../../../_components/atoms/FilterSelect";
import type { RevenuePoint } from "@/services/analytics";

export interface RevenueTrendChartProps {
  data: RevenuePoint[];
  range: number;
  onRangeChange: (range: number) => void;
  loading: boolean;
}

const RANGE_OPTIONS = [
  { label: "6 tháng", value: "6" },
  { label: "12 tháng", value: "12" },
  { label: "24 tháng", value: "24" },
];

const currencyFormatter = new Intl.NumberFormat("vi-VN");

export function RevenueTrendChart({ data, range, onRangeChange, loading }: RevenueTrendChartProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-extrabold text-gray-900">Doanh thu theo tháng</h2>
          <p className="text-xs font-medium text-gray-500 mt-1">Tổng tiền giao dịch hoàn tất theo từng tháng</p>
        </div>
        <FilterSelect value={String(range)} onChange={(v) => onRangeChange(Number(v))} options={RANGE_OPTIONS} />
      </div>

      {loading ? (
        <div className="h-[280px] flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      ) : data.length === 0 ? (
        <div className="h-[280px] flex items-center justify-center text-sm font-medium text-gray-400">
          Chưa có dữ liệu doanh thu trong khoảng thời gian này
        </div>
      ) : (
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
                tickFormatter={(v: number) => currencyFormatter.format(v)}
              />
              <Tooltip
                formatter={(value) => {
                  const raw = typeof value === "number" ? value : Number(String(value).replace(/[^\d.-]/g, ""));
                  return [`${Number.isFinite(raw) ? currencyFormatter.format(raw) : "—"} đ`, "Doanh thu"];
                }}
                labelFormatter={(label) => `Tháng ${label}`}
              />
              <Line type="monotone" dataKey="revenue" stroke="#e03c31" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
