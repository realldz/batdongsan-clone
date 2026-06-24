"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Eye, MapPin, MessageSquareText, Search, XCircle } from "lucide-react";

import { propertyToAdminListing, unwrapPaginated } from "@/lib/api-adapters";
import { approveProperty, getPendingProperties, rejectProperty } from "@/services/admin";
import type { Property } from "@/services/properties";

import { type AdminListing } from "../_data/types";
import { AdminHeader } from "../_components/organisms/AdminHeader";
import { StatusBadge } from "../_components/atoms/StatusBadge";
import { EmptyState } from "../_components/atoms/EmptyState";
import { AdminPagination } from "../_components/molecules/AdminPagination";
import { ListingReviewModal } from "../_components/organisms/ListingReviewModal";
import { PropertyPreviewModal } from "../_components/organisms/PropertyPreviewModal";
import { AdminPageTemplate } from "../_components/templates/AdminPageTemplate";

type ReviewAction = "approve" | "reject";
const PAGE_SIZE = 12;

export default function AdminReviewListingsPage() {
  const [listings, setListings] = useState<AdminListing[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [reviewTarget, setReviewTarget] = useState<{ listing: AdminListing; action: ReviewAction } | null>(null);
  const [loading, setLoading] = useState(true);
  const [previewId, setPreviewId] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadPendingListings() {
      setLoading(true);
      try {
        const params: Record<string, string | number> = { page: currentPage, perPage: PAGE_SIZE };
        if (search.trim()) params.title = search.trim();
        const response = await getPendingProperties(params as unknown as Parameters<typeof getPendingProperties>[0]);
        const result = unwrapPaginated<Property>(response, PAGE_SIZE);
        const pendingListings = result.data.map(propertyToAdminListing);

        if (!ignore) {
          setListings(pendingListings);
          setTotal(result.pagination.total);
          setTotalPages(result.pagination.totalPages || 1);
        }
      } catch {
        if (!ignore) {
          setListings([]);
          setTotal(0);
          setTotalPages(1);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadPendingListings();

    return () => {
      ignore = true;
    };
  }, [currentPage, search]);

  const confirmReview = async () => {
    if (!reviewTarget) return;

    if (reviewTarget.action === "approve") {
      await approveProperty(reviewTarget.listing.id);
    } else {
      await rejectProperty(reviewTarget.listing.id);
    }

    setListings((current) => current.filter((listing) => listing.id !== reviewTarget.listing.id));
    setReviewTarget(null);
    setTotal((current) => current - 1);
  };

  const header = <AdminHeader title="Duyệt tin" description="Xem hàng chờ, phê duyệt hoặc từ chối tin." />;

  return (
    <AdminPageTemplate header={header}>
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-5">
          <div className="text-sm font-bold text-gray-500 mb-2">Đang chờ</div>
          <div className="text-3xl font-extrabold text-gray-900">{total}</div>
        </div>
        <div className="rounded-xl bg-[#fff6f6] border border-red-100 shadow-sm p-5">
          <div className="text-sm font-bold text-[#e03c31] mb-2">SLA duyệt tin</div>
          <div className="text-3xl font-extrabold text-gray-900">4 giờ</div>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="relative max-w-[520px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input value={search} onChange={(event) => { setSearch(event.target.value); setCurrentPage(1); }} placeholder="Tìm trong hàng chờ duyệt" className="w-full h-11 rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-4 text-sm font-medium outline-none focus:border-[#e03c31] focus:bg-white" />
        </div>
      </section>

      {listings.length === 0 && !loading ? (
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <EmptyState title="Không còn tin cần duyệt" description="Hàng chờ đang trống hoặc không khớp từ khóa." />
        </section>
      ) : null}

      {listings.length > 0 ? (
        <>
          <section className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {listings.map((listing) => (
              <article key={listing.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:border-gray-300 transition-colors">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <StatusBadge tone={listing.status === "Chờ duyệt" ? "amber" : "red"}>{listing.status}</StatusBadge>
                    <h2 className="text-lg font-extrabold text-gray-900 mt-3 leading-snug">{listing.title}</h2>
                  </div>
                  <div className="text-right text-xs font-bold text-gray-400 whitespace-nowrap">{listing.code}</div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-5 text-sm">
                  <div className="rounded-lg bg-gray-50 p-3"><div className="text-xs font-bold text-gray-400 mb-1">Chủ tin</div><div className="font-extrabold text-gray-900">{listing.owner}</div></div>
                  <div className="rounded-lg bg-gray-50 p-3"><div className="text-xs font-bold text-gray-400 mb-1">Loại tin</div><div className="font-extrabold text-gray-900">{listing.type} · {listing.category}</div></div>
                  <div className="rounded-lg bg-gray-50 p-3"><div className="text-xs font-bold text-gray-400 mb-1">Giá</div><div className="font-extrabold text-gray-900">{listing.price}</div></div>
                  <div className="rounded-lg bg-gray-50 p-3"><div className="text-xs font-bold text-gray-400 mb-1">Diện tích</div><div className="font-extrabold text-gray-900">{listing.area}</div></div>
                </div>

                <div className="flex items-center gap-2 text-sm font-bold text-gray-600 mb-5">
                  <MapPin className="w-4 h-4 text-gray-400" /> {listing.location}
                </div>

                <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 flex gap-3 mb-5">
                  <MessageSquareText className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-extrabold text-gray-900 mb-1">Gợi ý kiểm duyệt</div>
                    <div className="text-xs font-medium leading-relaxed text-gray-600">Kiểm tra tiêu đề, ảnh đại diện, thông tin pháp lý, số điện thoại và dấu hiệu trùng tin trước khi duyệt.</div>
                  </div>
                </div>

                <div className="flex flex-wrap justify-end gap-3">
                  <button onClick={() => setPreviewId(listing.id)} className="h-10 px-4 rounded-lg border border-gray-200 text-gray-700 text-sm font-extrabold hover:bg-gray-50 flex items-center gap-2 cursor-pointer"><Eye className="w-4 h-4" /> Xem tin</button>
                  <button onClick={() => setReviewTarget({ listing, action: "reject" })} className="h-10 px-4 rounded-lg border border-rose-200 text-rose-600 text-sm font-extrabold hover:bg-rose-50 flex items-center gap-2 cursor-pointer"><XCircle className="w-4 h-4" /> Từ chối</button>
                  <button onClick={() => setReviewTarget({ listing, action: "approve" })} className="h-10 px-4 rounded-lg bg-[#e03c31] text-white text-sm font-extrabold hover:bg-[#c43329] flex items-center gap-2 cursor-pointer"><CheckCircle2 className="w-4 h-4" strokeWidth={2.5} /> Duyệt tin</button>
                </div>
              </article>
            ))}
          </section>

          <AdminPagination page={currentPage} totalPages={totalPages} onChange={setCurrentPage} />
        </>
      ) : null}

      <ListingReviewModal
        isOpen={!!reviewTarget}
        onClose={() => setReviewTarget(null)}
        listing={reviewTarget?.listing || null}
        action={reviewTarget?.action || null}
        onConfirm={confirmReview}
      />

      <PropertyPreviewModal propertyId={previewId} onClose={() => setPreviewId(null)} />
    </AdminPageTemplate>
  );
}
