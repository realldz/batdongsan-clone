"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-store";
import { ListingCard, type ListingData } from "@/components/ListingCard/ListingCard";
import { getFavorites } from "@/services/interactions";
import { propertyToListingData } from "@/lib/api-adapters";
import type { Property } from "@/services/properties";
import { Icon } from "@/components/atoms";
import { Pagination } from "@/components/molecules";
import { PublicPageLayout } from "@/components/templates";

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

  if (authLoading) return null;

  return (
    <PublicPageLayout className="bg-[#f1f5f9] py-6">
      <div className="max-w-[1240px] mx-auto px-4 lg:px-0">
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
          <div className="text-center py-20 bg-white border border-gray-100 rounded-xl shadow-sm">
            <div className="mb-4">
              <Icon name="Heart" size={64} className="mx-auto text-gray-300" />
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
              <div className="mt-8 mb-12 flex justify-center">
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </PublicPageLayout>
  );
}
