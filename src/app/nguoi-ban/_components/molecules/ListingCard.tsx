import React from "react";
import Link from "next/link";
import { CircleDollarSign, MapPin, Calendar, ChevronDown, Trash2 } from "lucide-react";
import { MetricCard } from "../atoms/MetricCard";

export type ListingStatus =
  | "Đang hiển thị"
  | "Chờ duyệt"
  | "Sắp hết hạn"
  | "Hết hạn"
  | "Đã hạ"
  | "Chờ thanh toán";

export type ListingCategory = "Bán" | "Thuê";
export type ListingPackage = "Tin thường" | "Tin VIP" | "Tin nổi bật";

export type Listing = {
  id: string;
  title: string;
  code: string;
  category: ListingCategory;
  propertyType: string;
  location: string;
  price: string;
  area: string;
  postedAt: string;
  expiresAt: string;
  status: ListingStatus;
  packageName: ListingPackage;
  inquiries: number;
  views: number;
  image: string;
  badge?: string;
};

export const statusTone: Record<ListingStatus, string> = {
  "Đang hiển thị": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Chờ duyệt": "bg-amber-50 text-amber-700 border-amber-200",
  "Sắp hết hạn": "bg-orange-50 text-orange-700 border-orange-200",
  "Hết hạn": "bg-rose-50 text-rose-700 border-rose-200",
  "Đã hạ": "bg-slate-100 text-slate-700 border-slate-200",
  "Chờ thanh toán": "bg-violet-50 text-violet-700 border-violet-200",
};

interface ListingCardProps {
  listing: Listing;
  onRenew: () => void;
  onDelete?: () => void;
}

export function ListingCard({ listing, onRenew, onDelete }: ListingCardProps) {
  return (
    <article className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col lg:flex-row">
        <div className="relative h-56 w-full shrink-0 overflow-hidden bg-gray-100 lg:h-[220px] lg:w-[280px]">
          <img
            src={listing.image}
            alt={listing.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute left-4 top-4 flex items-center gap-2">
            <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.14em] text-gray-700 shadow-sm">
              {listing.category}
            </span>
            {listing.badge ? (
              <span className="rounded-full bg-primary px-3 py-1 text-xs font-extrabold text-white shadow-sm">
                {listing.badge}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col p-5 lg:p-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-bold ${
                    statusTone[listing.status]
                  }`}
                >
                  {listing.status}
                </span>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
                  {listing.packageName}
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">
                  Mã tin {listing.code}
                </span>
              </div>
              <h3 className="mt-3 line-clamp-2 break-all text-[22px] font-extrabold leading-tight text-gray-900">
                {listing.title}
              </h3>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-gray-500">
                <span className="flex items-center gap-2">
                  <CircleDollarSign className="h-4 w-4 text-primary" />
                  <span className="font-bold text-primary">{listing.price}</span>
                </span>
                <span className="font-semibold text-gray-700">
                  {listing.area}
                </span>
                <span className="rounded-full bg-gray-100 px-3 py-1 font-semibold text-gray-700">
                  {listing.propertyType}
                </span>
              </div>
              <div className="mt-4 flex items-start gap-2 text-sm leading-6 text-gray-500">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                <span>{listing.location}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 xl:min-w-[250px] xl:grid-cols-1">
              <MetricCard label="Lượt xem" value={String(listing.views)} />
              <MetricCard label="Liên hệ" value={String(listing.inquiries)} />
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-4 border-t border-gray-100 pt-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                Đăng ngày{" "}
                <span className="font-bold text-gray-700">{listing.postedAt}</span>
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                Hết hạn{" "}
                <span className="font-bold text-gray-700">
                  {listing.expiresAt}
                </span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/properties/${listing.id}`}
                className="rounded-full border border-gray-300 px-4 py-2.5 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50"
              >
                Xem chi tiết
              </Link>
              <Link
                href={`/nguoi-ban/dang-tin?edit=${listing.id}`}
                className="rounded-full border border-gray-300 px-4 py-2.5 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50"
              >
                Chỉnh sửa
              </Link>
              <button
                type="button"
                onClick={onDelete}
                className="inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2.5 text-sm font-bold text-red-600 transition-colors hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" /> Xóa
              </button>
              <button
                type="button"
                onClick={onRenew}
                className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-black"
              >
                Gia hạn tin <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
