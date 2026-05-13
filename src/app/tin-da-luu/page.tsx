"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-store";
import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { ListingCard, type ListingData } from "@/components/ListingCard/ListingCard";
import { getFavorites } from "@/services/interactions";
import { propertyToListingData } from "@/lib/api-adapters";
import type { Property } from "@/services/properties";

function unwrapFavorites(value: unknown): Property[] {
  if (Array.isArray(value)) return value as Property[];

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const candidates = [record.data, record.items, record.results, record.docs, record.rows];
    const found = candidates.find(Array.isArray);
    if (found) return found as Property[];
  }

  return [];
}

export default function SavedListingsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [listings, setListings] = useState<ListingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 20;

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      router.push("/");
      return;
    }

    let cancelled = false;

    async function fetchFavorites() {
      setLoading(true);
      try {
        const data = await getFavorites({ page, perPage });
        if (cancelled) return;

        const properties = unwrapFavorites(data);

        if (data && typeof data === "object" && !Array.isArray(data)) {
          const meta = data as Record<string, unknown>;
          const total = Number(meta.total ?? meta.totalPages ?? meta.totalCount ?? properties.length);
          setTotalPages(Math.max(1, Math.ceil(total / perPage)));
        } else {
          setTotalPages(1);
        }

        setListings(properties.map(propertyToListingData));
      } catch {
        if (!cancelled) {
          setListings([]);
          setTotalPages(1);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchFavorites();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, authLoading, page, router]);

  const pageNumbers = (() => {
    const maxVisible = 7;

    if (totalPages <= maxVisible + 2) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | "ellipsis-start" | "ellipsis-end")[] = [];

    if (page <= Math.ceil(maxVisible / 2) + 1) {
      for (let i = 1; i <= maxVisible; i += 1) pages.push(i);
      pages.push("ellipsis-end");
      pages.push(totalPages);
    } else if (page >= totalPages - Math.ceil(maxVisible / 2)) {
      pages.push(1);
      pages.push("ellipsis-start");
      for (let i = totalPages - maxVisible + 1; i <= totalPages; i += 1) pages.push(i);
    } else {
      pages.push(1);
      pages.push("ellipsis-start");
      const half = Math.floor(maxVisible / 2);
      for (let i = page - half; i <= page + half; i += 1) pages.push(i);
      pages.push("ellipsis-end");
      pages.push(totalPages);
    }

    return pages;
  })();

  if (authLoading) return null;

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#f1f5f9]">
      <Header />

      <main className="flex-1 w-full max-w-[1140px] xl:max-w-[1240px] mx-auto px-4 lg:px-0 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#2c2c2c] mb-1">Tin đã lưu</h1>
          <p className="text-sm text-gray-500">
            Danh sách các bất động sản bạn đã lưu để theo dõi
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-[280px] h-[200px] bg-gray-200 rounded" />
                  <div className="flex-1 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20">
            <div className="mb-4">
              <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Chưa có tin đã lưu</h2>
            <p className="text-gray-500 mb-6">
              Nhấn vào biểu tượng trái tim trên các tin đăng để lưu lại và theo dõi.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-0">
              {listings.map((listing) => (
                <ListingCard key={listing.id} data={listing} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 mt-6 mb-12">
                {pageNumbers.map((p) => {
                  if (p === "ellipsis-start" || p === "ellipsis-end") {
                    return (
                      <span key={p} className="w-8 h-8 flex items-center justify-center text-gray-500">
                        ...
                      </span>
                    );
                  }

                  const isActive = p === page;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 flex items-center justify-center font-medium rounded transition-colors ${
                        isActive
                          ? "bg-[#2c2c2c] text-white"
                          : "text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
