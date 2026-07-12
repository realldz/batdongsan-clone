"use client";

import { Loader2 } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { FilterSelect } from "../../../_components/atoms/FilterSelect";
import type { PieChartSlice } from "@/services/analytics";

export interface CategoryPieChartsProps {
  rentChart: PieChartSlice[];
  saleChart: PieChartSlice[];
  range: number;
  onRangeChange: (range: number) => void;
  loading: boolean;
}

const RANGE_OPTIONS = [
  { label: "7 ngày", value: "7" },
  { label: "30 ngày", value: "30" },
  { label: "90 ngày", value: "90" },
];

const COLORS = ["#e03c31", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"];

function PieCard({ title, data }: { title: string; data: PieChartSlice[] }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <h3 className="text-sm font-extrabold text-gray-900 mb-3">{title}</h3>
      {data.length === 0 ? (
        <div className="h-[240px] flex items-center justify-center text-sm font-medium text-gray-400">
          Chưa có dữ liệu
        </div>
      ) : (
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="pct"
                nameKey="subcategory"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={(entry: { payload?: PieChartSlice }) => `${entry.payload?.pct ?? 0}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={entry.subcategory} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export function CategoryPieCharts({ rentChart, saleChart, range, onRangeChange, loading }: CategoryPieChartsProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-lg font-extrabold text-gray-900">Phân bố loại BĐS</h2>
          <p className="text-xs font-medium text-gray-500 mt-1">Theo lượt xem và lượt yêu thích</p>
        </div>
        <FilterSelect value={String(range)} onChange={(v) => onRangeChange(Number(v))} options={RANGE_OPTIONS} />
      </div>

      {loading ? (
        <div className="h-[240px] flex items-center justify-center bg-white rounded-xl border border-gray-200">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <PieCard title="Cho thuê" data={rentChart} />
          <PieCard title="Bán" data={saleChart} />
        </div>
      )}
    </div>
  );
}
