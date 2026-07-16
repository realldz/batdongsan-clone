import { Loader2, TrendingUp, TrendingDown } from "lucide-react";

export interface TrendAnalysisPanelProps {
  items: string[];
  loading: boolean;
}

export function TrendAnalysisPanel({ items, loading }: TrendAnalysisPanelProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <h2 className="text-lg font-extrabold text-gray-900">Xu hướng biến động</h2>
      <p className="text-xs font-medium text-gray-500 mt-1">So sánh tỷ trọng loại BĐS với kỳ trước</p>

      {loading ? (
        <div className="h-[120px] flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      ) : items.length === 0 ? (
        <div className="h-[120px] flex items-center justify-center text-sm font-medium text-gray-400">
          Chưa đủ dữ liệu so sánh xu hướng
        </div>
      ) : (
        <ul className="mt-4 space-y-2">
          {items.map((item, index) => {
            const up = item.includes("tăng");
            const Icon = up ? TrendingUp : TrendingDown;
            const color = up ? "text-emerald-600" : "text-red-600";
            return (
              <li key={index} className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Icon className={`w-4 h-4 shrink-0 ${color}`} />
                <span>{item}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
