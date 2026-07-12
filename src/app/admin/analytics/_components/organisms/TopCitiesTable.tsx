"use client";

import { Loader2 } from "lucide-react";
import { TableShell } from "../../../_components/molecules/TableShell";
import type { FeaturedCity } from "@/services/analytics";

export interface TopCitiesTableProps {
  cities: FeaturedCity[];
  loading: boolean;
}

export function TopCitiesTable({ cities, loading }: TopCitiesTableProps) {
  const sorted = [...cities].sort((a, b) => b.score - a.score);

  return (
    <TableShell title="Top tỉnh/thành nổi bật" description="Xếp hạng theo lượt xem và lượt yêu thích">
      <div className="min-w-[400px] border border-gray-200 rounded-xl overflow-hidden bg-white mt-4">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">Tỉnh/Thành</th>
              <th className="px-4 py-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider text-right">Điểm nổi bật</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={2} className="px-4 py-12 text-center">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" />
                </td>
              </tr>
            ) : sorted.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-4 py-8 text-center text-sm font-medium text-gray-400">
                  Chưa có dữ liệu
                </td>
              </tr>
            ) : (
              sorted.map((city) => (
                <tr key={city.cityId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-[13px] font-bold text-gray-900">{city.cityName}</td>
                  <td className="px-4 py-3 text-[13px] font-extrabold text-[#e03c31] text-right">{city.score}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </TableShell>
  );
}
