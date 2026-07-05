"use client";

import { useEffect, useMemo, useState } from "react";
import { Filter, Receipt } from "lucide-react";
import { SellerHeader } from "../../_components/SellerHeader";
import { SellerPagination } from "../../_components/SellerPagination";
import { SummaryCard, EmptyState } from "../../_components/atoms";
import { TransactionRow, formatAmount } from "../../_components/molecules/TransactionRow";
import { getWalletHistory, type WalletTransaction } from "@/services/wallet";

const PAGE_SIZE = 10;

const TYPE_OPTIONS = [
  { label: "Tất cả", value: "" },
  { label: "Nạp tiền", value: "deposit" },
  { label: "Thanh toán", value: "payment" },
] as const;

export default function WalletHistoryPage() {
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
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
        }
      } catch {
        if (!ignore) {
          setTransactions([]);
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
    () =>
      filtered
        .filter((item) => item.type === "deposit" || item.type === "credit")
        .reduce((sum, item) => sum + Number(item.amount || 0), 0),
    [filtered]
  );

  const totalOut = useMemo(
    () =>
      filtered
        .filter((item) => item.type !== "deposit" && item.type !== "credit")
        .reduce((sum, item) => sum + Number(item.amount || 0), 0),
    [filtered]
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
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <select
                    value={typeFilter}
                    onChange={(e) => handleFilterChange(e.target.value)}
                    className="appearance-none bg-gray-50 border border-gray-200 text-sm font-bold text-gray-700 rounded-xl pl-4 pr-10 py-2.5 cursor-pointer hover:border-gray-300 focus:outline-none focus:border-primary"
                  >
                    {TYPE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
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
                <h3 className="text-lg font-extrabold text-gray-900">
                  Đang tải dữ liệu...
                </h3>
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-6">
                <EmptyState
                  title="Chưa có giao dịch"
                  description="Lịch sử sẽ xuất hiện sau khi có giao dịch trên ví."
                  icon={<Receipt className="h-6 w-6 text-gray-500" />}
                />
              </div>
            ) : (
              <>
                <div className="divide-y divide-gray-100">
                  {paginated.map((item) => (
                    <TransactionRow key={item.id} item={item} />
                  ))}
                </div>

                <SellerPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  totalItems={filtered.length}
                  pageSize={PAGE_SIZE}
                  itemsLabel="giao dịch"
                />
              </>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
