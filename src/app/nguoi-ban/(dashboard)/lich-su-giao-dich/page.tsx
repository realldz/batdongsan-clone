"use client";

import { SellerHeader } from "../../_components/SellerHeader";
import { getWalletHistory, type WalletTransaction } from "@/services/wallet";
import { ArrowDownCircle, ArrowUpCircle, ChevronLeft, ChevronRight, Filter, Receipt } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

function formatAmount(value: number | string) {
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number)) return String(value);

  return `${new Intl.NumberFormat("vi-VN").format(number)} đ`;
}

function formatDate(value: string | undefined) {
  if (!value) return "--";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(date);
}

function getTransactionTone(type: string | undefined) {
  return type === "deposit" || type === "credit" ? "text-emerald-600 bg-emerald-50" : "text-primary bg-red-50";
}

const PAGE_SIZE = 10;

const TYPE_OPTIONS = [
  { label: "Tất cả", value: "" },
  { label: "Nạp tiền", value: "deposit" },
  { label: "Thanh toán", value: "payment" },
] as const;

export default function WalletHistoryPage() {
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [source, setSource] = useState("api");
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let ignore = false;

    async function loadHistory() {
      setLoading(true);
      try {
        const history = await getWalletHistory();
        if (!ignore) {
          setTransactions(Array.isArray(history) ? history : []);
          setSource("api");
        }
      } catch {
        if (!ignore) {
          setTransactions([]);
          setSource("mock");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadHistory();

    return () => {
      ignore = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!typeFilter) return transactions;
    return transactions.filter((item) => {
      if (typeFilter === "deposit") return item.type === "deposit" || item.type === "credit";
      return item.type !== "deposit" && item.type !== "credit";
    });
  }, [transactions, typeFilter]);

  const totalIn = useMemo(
    () => filtered.filter((item) => item.type === "deposit" || item.type === "credit").reduce((sum, item) => sum + Number(item.amount || 0), 0),
    [filtered],
  );
  const totalOut = useMemo(
    () => filtered.filter((item) => item.type !== "deposit" && item.type !== "credit").reduce((sum, item) => sum + Number(item.amount || 0), 0),
    [filtered],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleFilterChange = (value: string) => {
    setTypeFilter(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.min(page, totalPages));
  };

  return (
    <>
      <SellerHeader title="Lịch sử giao dịch" />
      <main className="flex-1 overflow-y-auto p-6 lg:p-8 xl:p-10 pb-20 bg-[#f6f7f9]">
        <div className="mx-auto max-w-6xl space-y-6">
          <section className="grid gap-4 md:grid-cols-3">
            <SummaryCard label="Tổng giao dịch" value={`${filtered.length}`} />
            <SummaryCard label="Tiền vào" value={formatAmount(totalIn)} />
            <SummaryCard label="Tiền ra" value={formatAmount(totalOut)} />
          </section>

          <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <div>
                <h2 className="text-xl font-extrabold text-gray-900">Giao dịch ví</h2>
                <p className="mt-1 text-sm font-medium text-gray-500">Nguồn dữ liệu: {source === "api" ? "API ví" : "fallback rỗng"}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <select
                    value={typeFilter}
                    onChange={(e) => handleFilterChange(e.target.value)}
                    className="appearance-none bg-gray-50 border border-gray-200 text-sm font-bold text-gray-700 rounded-xl pl-4 pr-10 py-2.5 cursor-pointer hover:border-gray-300 focus:outline-none focus:border-primary"
                  >
                    {TYPE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {loading ? (
              <div className="px-6 py-16 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-50 text-gray-400">
                  <Receipt className="h-6 w-6 animate-pulse" />
                </div>
                <h3 className="text-lg font-extrabold text-gray-900">Đang tải dữ liệu...</h3>
              </div>
            ) : filtered.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-50 text-gray-400">
                  <Receipt className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-extrabold text-gray-900">Chưa có giao dịch</h3>
                <p className="mt-2 text-sm font-medium text-gray-500">Lịch sử sẽ xuất hiện sau khi có giao dịch trên ví.</p>
              </div>
            ) : (
              <>
                <div className="divide-y divide-gray-100">
                  {paginated.map((item) => {
                    const tone = getTransactionTone(item.type);
                    const isIn = item.type === "deposit" || item.type === "credit";

                    return (
                      <div key={item.id} className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tone}`}>
                            {isIn ? <ArrowDownCircle className="h-5 w-5" /> : <ArrowUpCircle className="h-5 w-5" />}
                          </div>
                          <div>
                            <div className="font-extrabold text-gray-900">{isIn ? "Nạp tiền" : "Thanh toán"}</div>
                            <div className="mt-1 text-xs font-medium text-gray-500">{formatDate(item.createdAt)} · {item.status ?? "--"}</div>
                            {item.description ? <div className="mt-1 text-xs text-gray-400 line-clamp-1">{item.description}</div> : null}
                          </div>
                        </div>
                        <div className={`text-right font-extrabold ${isIn ? "text-emerald-600" : "text-primary"}`}>
                          {isIn ? "+" : "-"}{formatAmount(item.amount)}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
                    <span className="text-sm font-medium text-gray-500">
                      Hiển thị {(safePage - 1) * PAGE_SIZE + 1}-{Math.min(safePage * PAGE_SIZE, filtered.length)} trên {filtered.length} giao dịch
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        disabled={safePage <= 1}
                        onClick={() => handlePageChange(safePage - 1)}
                        className="flex items-center justify-center h-9 w-9 rounded-lg border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                        .reduce<(number | "...")[]>((acc, p, i, arr) => {
                          if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
                          acc.push(p);
                          return acc;
                        }, [])
                        .map((item, i) =>
                          item === "..." ? (
                            <span key={`dot-${i}`} className="text-sm text-gray-400 px-1">...</span>
                          ) : (
                            <button
                              key={item}
                              onClick={() => handlePageChange(item)}
                              className={`flex items-center justify-center h-9 w-9 rounded-lg text-sm font-bold transition-colors ${item === safePage ? "bg-primary text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                            >
                              {item}
                            </button>
                          ),
                        )}
                      <button
                        disabled={safePage >= totalPages}
                        onClick={() => handlePageChange(safePage + 1)}
                        className="flex items-center justify-center h-9 w-9 rounded-lg border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>
    </>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="text-sm font-bold text-gray-500">{label}</div>
      <div className="mt-2 text-2xl font-extrabold text-gray-900">{value}</div>
    </div>
  );
}
