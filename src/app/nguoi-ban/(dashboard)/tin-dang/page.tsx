"use client";

import { SellerHeader } from "../../_components/SellerHeader";
import {
  ArrowRight,
  Calendar,
  ChevronDown,
  CircleDollarSign,
  FileText,
  Filter,
  MapPin,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";
import { formatArea, formatCurrency, formatLocation, unwrapPaginated } from "@/lib/api-adapters";
import { getMyProperties, type Property, type PropertyStatus } from "@/services/properties";
import { payWallet } from "@/services/wallet";
import { useWalletBalance, useRefreshWallet } from "@/lib/use-wallet-balance";
import { useEffect, useMemo, useRef, useState } from "react";

type ListingStatus =
  | "Đang hiển thị"
  | "Chờ duyệt"
  | "Sắp hết hạn"
  | "Hết hạn"
  | "Đã hạ"
  | "Chờ thanh toán";

type ListingCategory = "Bán" | "Thuê";
type ListingPackage = "Tin thường" | "Tin VIP" | "Tin nổi bật";

type Listing = {
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

function mapPropertyStatusToListingStatus(status: PropertyStatus | undefined): ListingStatus {
  if (status === "active") return "Đang hiển thị";
  if (status === "hidden") return "Đã hạ";
  if (status === "sold" || status === "rented") return "Hết hạn";
  if (status === "draft") return "Chờ thanh toán";
  return "Chờ duyệt";
}

function formatDate(value: string | undefined): string {
  if (!value) return "--";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("vi-VN").format(date);
}

function propertyToSellerListing(property: Property): Listing {
  return {
    id: property.id,
    code: property.id.slice(0, 8).toUpperCase(),
    title: property.title,
    category: property.type === "rent" ? "Thuê" : "Bán",
    propertyType: property.type === "rent" ? "Cho thuê bất động sản" : "Bất động sản bán",
    location: formatLocation(property),
    price: formatCurrency(property.price, property.type),
    area: formatArea(property.area),
    postedAt: formatDate(property.createdAt),
    expiresAt: "--",
    status: mapPropertyStatusToListingStatus(property.status),
    packageName: "Tin thường",
    inquiries: 0,
    views: 0,
    image: property.images?.[0] ?? "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
  };
}

const filterSections = {
  categories: ["Tất cả", "Bán", "Thuê"] as const,
  packages: ["Tất cả", "Tin thường", "Tin VIP", "Tin nổi bật"] as const,
  statuses: [
    "Tất cả",
    "Đang hiển thị",
    "Chờ duyệt",
    "Sắp hết hạn",
    "Hết hạn",
    "Đã hạ",
    "Chờ thanh toán",
  ] as const,
};

const statusTone: Record<ListingStatus, string> = {
  "Đang hiển thị": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Chờ duyệt": "bg-amber-50 text-amber-700 border-amber-200",
  "Sắp hết hạn": "bg-orange-50 text-orange-700 border-orange-200",
  "Hết hạn": "bg-rose-50 text-rose-700 border-rose-200",
  "Đã hạ": "bg-slate-100 text-slate-700 border-slate-200",
  "Chờ thanh toán": "bg-violet-50 text-violet-700 border-violet-200",
};

const renewOptions = [
  { days: 7, label: "7 ngày", price: "99.000 đ", helper: "Phù hợp tin sắp hết hạn" },
  { days: 15, label: "15 ngày", price: "169.000 đ", helper: "Tiết kiệm hơn 15%" },
  { days: 30, label: "30 ngày", price: "299.000 đ", helper: "Hiển thị lâu hơn" },
] as const;

function parseVnd(value: string): number {
  return Number(value.replace(/[^\d]/g, ""));
}

const PAGE_SIZE = 3;

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState<(typeof filterSections.statuses)[number]>("Tất cả");
  const [categoryFilter, setCategoryFilter] = useState<(typeof filterSections.categories)[number]>("Tất cả");
  const [packageFilter, setPackageFilter] = useState<(typeof filterSections.packages)[number]>("Tất cả");
  const [draftOnly, setDraftOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [renewListing, setRenewListing] = useState<Listing | null>(null);
  const [selectedRenewDays, setSelectedRenewDays] = useState<(typeof renewOptions)[number]["days"]>(15);
  const [renewSuccessMessage, setRenewSuccessMessage] = useState("");
  const [isRenewSubmitting, setIsRenewSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const wallet = useWalletBalance();
  const refreshWallet = useRefreshWallet();
  const dialogRef = useRef<HTMLDivElement>(null);

  const isAnyDialogOpen = isFilterDialogOpen || renewListing !== null;

  useEffect(() => {
    let ignore = false;

    async function loadListings() {
      setLoading(true);
      try {
        const params: { page: number; perPage: number; title?: string } = { page: currentPage, perPage: PAGE_SIZE };
        if (search.trim()) params.title = search.trim();
        const response = await getMyProperties(params);
        const result = unwrapPaginated<Property>(response);

        if (!ignore) {
          setListings(result.data.map(propertyToSellerListing));
          setTotal(result.pagination.total);
          setTotalPages(result.pagination.totalPages || 1);
          setCurrentPage(result.pagination.page);
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

    loadListings();
    return () => { ignore = true; };
  }, [currentPage, search]);

  useEffect(() => {
    if (!isAnyDialogOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsFilterDialogOpen(false);
        setRenewListing(null);
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAnyDialogOpen]);

  const filteredListings = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return listings.filter((listing) => {
      const matchesSearch =
        keyword.length === 0 ||
        listing.title.toLowerCase().includes(keyword) ||
        listing.code.includes(keyword);
      const matchesStatus = activeStatus === "Tất cả" || listing.status === activeStatus;
      const matchesCategory = categoryFilter === "Tất cả" || listing.category === categoryFilter;
      const matchesPackage = packageFilter === "Tất cả" || listing.packageName === packageFilter;
      const matchesDraft = !draftOnly;

      return matchesSearch && matchesStatus && matchesCategory && matchesPackage && matchesDraft;
    });
  }, [activeStatus, categoryFilter, draftOnly, listings, packageFilter, search]);

  const paginatedListings = filteredListings.slice(0, PAGE_SIZE);
  const paginationStart = filteredListings.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const paginationEnd = Math.min(currentPage * PAGE_SIZE, filteredListings.length);

  const tabs = useMemo(
    () =>
      filterSections.statuses.map((status) => ({
        name: status,
        count: status === "Tất cả" ? total : 0,
      })),
    [total]
  );

  const hasActiveFilters =
    activeStatus !== "Tất cả" || categoryFilter !== "Tất cả" || packageFilter !== "Tất cả" || draftOnly || search.trim().length > 0;

  const resetFilters = () => {
    setActiveStatus("Tất cả");
    setCategoryFilter("Tất cả");
    setPackageFilter("Tất cả");
    setDraftOnly(false);
    setSearch("");
    setCurrentPage(1);
  };

  const openRenewDialog = (listing: Listing) => {
    setRenewSuccessMessage("");
    setSelectedRenewDays(15);
    setRenewListing(listing);
  };

  const selectedRenewOption = renewOptions.find((option) => option.days === selectedRenewDays) ?? renewOptions[1];

  const confirmRenewListing = async () => {
    if (!renewListing) {
      return;
    }

    const amount = parseVnd(selectedRenewOption.price);
    const mainBalance = Number(wallet.main.replace(/[^\d]/g, ""));
    if (mainBalance < amount) {
      setRenewSuccessMessage("Số dư không đủ, vui lòng nạp thêm tiền vào ví.");
      return;
    }

    setIsRenewSubmitting(true);
    setRenewSuccessMessage("");

    try {
      await payWallet({
        amount,
        propertyId: renewListing.id,
        description: `Gia hạn ${selectedRenewOption.label} cho mã tin ${renewListing.code}`,
      });
      setRenewSuccessMessage(`Đã thanh toán gia hạn ${selectedRenewOption.label} cho mã tin ${renewListing.code}.`);
      refreshWallet();
    } catch {
      setRenewSuccessMessage("Chưa thể thanh toán gia hạn, vui lòng kiểm tra số dư hoặc thử lại sau.");
    } finally {
      setIsRenewSubmitting(false);
    }
  };

  return (
    <>
      <SellerHeader title="Quản lý tin" />

      <div className="bg-white border-b border-gray-200 shadow-sm relative">
        <div className="px-6 py-5 flex items-center justify-between gap-6 flex-wrap lg:flex-nowrap">
          <div className="flex items-center gap-3 flex-1 min-w-[300px]">
            <div className="relative w-full max-w-lg">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-500 stroke-[2.5]" />
              <input
                type="text"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Nhập mã tin hoặc tiêu đề tin"
                className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-full text-[14px] font-medium placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-[#e03c31] transition-all bg-white"
              />
            </div>
            <button
              type="button"
              onClick={() => setIsFilterDialogOpen(true)}
              className={`flex items-center gap-2.5 px-5 py-2.5 border rounded-full text-[14px] font-bold transition-colors shadow-sm bg-white shrink-0 ${hasActiveFilters
                  ? "border-primary text-primary hover:bg-red-50"
                  : "border-gray-300 hover:bg-gray-50 text-gray-800"
                }`}
            >
              <Filter className="w-[18px] h-[18px] stroke-[2.5]" /> Lọc
            </button>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <button className="text-[14px] font-bold hover:underline text-gray-800 flex items-center gap-1">
              Xuất file Excel
            </button>
            <button
              type="button"
              onClick={() => {
                setDraftOnly((current) => !current);
                setCurrentPage(1);
              }}
              className={`flex items-center gap-2.5 px-5 py-2.5 border rounded-full text-[14px] font-bold transition-colors shadow-sm bg-white ${draftOnly
                  ? "border-primary text-primary hover:bg-red-50"
                  : "border-gray-300 hover:bg-gray-50 text-gray-800"
                }`}
            >
              <FileText className="w-[18px] h-[18px] stroke-[2.5]" /> Tin nháp
            </button>
          </div>
        </div>

        <div className="px-6 flex overflow-x-auto pb-4 hide-scrollbar">
          <div className="flex gap-2">
            {tabs.map((tab) => {
              const isActive = activeStatus === tab.name;

              return (
                <button
                  key={tab.name}
                  type="button"
                  onClick={() => {
                    setActiveStatus(tab.name);
                    setCurrentPage(1);
                  }}
                  className={`whitespace-nowrap px-5 py-2 rounded-full font-bold border ${isActive
                      ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    } transition-colors`}
                >
                  {tab.name} ({tab.count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto p-6 lg:p-10 bg-[#f6f7f9]">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
          <section className="rounded-3xl border border-[#ffd7d4] bg-[linear-gradient(135deg,#fff7f6_0%,#fff_55%,#fff3f1_100%)] p-6 shadow-sm">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-primary shadow-sm">
                  Gợi ý tối ưu tin đăng
                </div>
                <h2 className="text-[28px] font-extrabold leading-tight text-gray-900">
                  Quản lý danh sách tin rao bán và cho thuê ngay trong một màn hình
                </h2>
                <p className="mt-3 max-w-2xl text-[15px] leading-7 text-gray-600">
                  Theo dõi hiệu suất tin, kiểm tra thời hạn hiển thị và lọc nhanh theo loại tin từ dữ liệu API.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button className="rounded-full border border-gray-300 bg-white px-6 py-3 text-[15px] font-bold text-gray-800 shadow-sm transition-colors hover:bg-gray-50">
                  Xem gói khuyến mãi
                </button>
                <Link
                  href="/nguoi-ban/dang-tin"
                  className="flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-[15px] font-bold text-white shadow-md transition-colors hover:bg-red-700"
                >
                  Đăng tin mới <ArrowRight className="h-5 w-5 stroke-[2.5]" />
                </Link>
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            <SummaryCard label="Tổng tin đang quản lý" value={String(total)} helper="Bao gồm bán và cho thuê" />
            <SummaryCard
              label="Tin đang hiển thị"
              value={String(listings.filter((listing) => listing.status === "Đang hiển thị").length)}
              helper="Ưu tiên gia hạn trước khi hết hạn"
            />
            <SummaryCard label="Lượt xem tích lũy" value={listings.reduce((sum, listing) => sum + listing.views, 0).toLocaleString("vi-VN")} helper="Tổng lượt xem của các tin" />
          </section>

          <section className="rounded-3xl border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-gray-100 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h3 className="text-[20px] font-extrabold text-gray-900">Danh sách tin đăng</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Hiển thị {paginationStart}-{paginationEnd} / {total} tin
                </p>
              </div>
              {hasActiveFilters ? (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 self-start rounded-full border border-gray-300 px-4 py-2 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <SlidersHorizontal className="h-4 w-4" /> Xóa bộ lọc
                </button>
              ) : null}
            </div>

            <div className="flex flex-col gap-4 p-4 lg:p-6">
              {loading ? (
                <div className="p-10 text-center text-gray-500">Đang tải...</div>
              ) : paginatedListings.length > 0 ? (
                paginatedListings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} onRenew={() => openRenewDialog(listing)} />
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-14 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
                    <Search className="h-6 w-6 text-gray-500" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">Không tìm thấy tin phù hợp</h4>
                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    Thử đổi từ khóa, trạng thái hoặc loại tin trong bộ lọc để xem thêm tin.
                  </p>
                </div>
              )}
            </div>

            {totalPages > 1 ? (
              <div className="flex flex-col gap-3 border-t border-gray-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm font-medium text-gray-500">
                  Trang {currentPage} / {totalPages}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="rounded-full border border-gray-300 px-4 py-2 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Trước
                  </button>
                  {(() => {
                    const maxVisible = 7;
                    const pages: (number | "ellipsis-start" | "ellipsis-end")[] = [];
                    if (totalPages <= maxVisible + 2) {
                      for (let i = 1; i <= totalPages; i++) pages.push(i);
                    } else {
                      pages.push(1);
                      if (currentPage > 3) pages.push("ellipsis-start");
                      const start = Math.max(2, currentPage - 1);
                      const end = Math.min(totalPages - 1, currentPage + 1);
                      for (let i = start; i <= end; i++) pages.push(i);
                      if (currentPage < totalPages - 2) pages.push("ellipsis-end");
                      pages.push(totalPages);
                    }
                    return pages.map((page) => {
                      if (typeof page === "string") {
                        return (
                          <span key={page} className="flex h-9 w-9 items-center justify-center text-sm font-bold text-gray-400">
                            ...
                          </span>
                        );
                      }
                      return (
                        <button
                          key={page}
                          type="button"
                          onClick={() => setCurrentPage(page)}
                          className={`h-9 w-9 rounded-full border text-sm font-extrabold transition-colors ${
                            currentPage === page
                              ? "border-gray-900 bg-gray-900 text-white"
                              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    });
                  })()}
                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="rounded-full border border-gray-300 px-4 py-2 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Sau
                  </button>
                </div>
              </div>
            ) : null}
          </section>
        </div>
      </main>

      {isFilterDialogOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-0 sm:items-center sm:p-6">
          <button
            type="button"
            aria-label="Đóng bộ lọc"
            className="absolute inset-0 cursor-default"
            onClick={() => setIsFilterDialogOpen(false)}
          />
          <div
            ref={dialogRef}
            className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[28px] bg-white shadow-2xl sm:rounded-[28px]"
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <div>
                <div className="text-[22px] font-extrabold text-gray-900">Lọc tin đăng</div>
                <p className="mt-1 text-sm text-gray-500">Chọn điều kiện để thu hẹp danh sách tin đăng demo</p>
              </div>
              <button
                type="button"
                onClick={() => setIsFilterDialogOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
              >
                <span className="text-xl leading-none">×</span>
              </button>
            </div>

            <div className="space-y-6 overflow-y-auto px-6 py-6">
              <FilterSection
                title="Nhu cầu"
                value={categoryFilter}
                options={filterSections.categories}
                onSelect={(value) => {
                  setCategoryFilter(value);
                  setCurrentPage(1);
                }}
              />
              <FilterSection
                title="Loại gói tin"
                value={packageFilter}
                options={filterSections.packages}
                onSelect={(value) => {
                  setPackageFilter(value);
                  setCurrentPage(1);
                }}
              />
              <FilterSection
                title="Trạng thái"
                value={activeStatus}
                options={filterSections.statuses}
                onSelect={(value) => {
                  setActiveStatus(value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-gray-100 px-6 py-5">
              <button
                type="button"
                onClick={resetFilters}
                className="rounded-full border border-gray-300 px-5 py-3 text-[15px] font-bold text-gray-800 transition-colors hover:bg-gray-50"
              >
                Đặt lại
              </button>
              <button
                type="button"
                onClick={() => setIsFilterDialogOpen(false)}
                className="rounded-full bg-primary px-5 py-3 text-[15px] font-bold text-white transition-colors hover:bg-red-700"
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {renewListing ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-0 sm:items-center sm:p-6">
          <button
            type="button"
            aria-label="Đóng gia hạn tin"
            className="absolute inset-0 cursor-default"
            onClick={() => setRenewListing(null)}
          />
          <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[28px] bg-white shadow-2xl sm:rounded-[28px]">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <div>
                <div className="text-[22px] font-extrabold text-gray-900">Gia hạn tin</div>
                <p className="mt-1 text-sm text-gray-500">Mã tin {renewListing.code}</p>
              </div>
              <button
                type="button"
                onClick={() => setRenewListing(null)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
              >
                <span className="text-xl leading-none">×</span>
              </button>
            </div>

            <div className="space-y-5 overflow-y-auto px-6 py-6">
              <div className="rounded-2xl bg-gray-50 p-4">
                <div className="line-clamp-2 text-[17px] font-extrabold text-gray-900">{renewListing.title}</div>
                <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-500">
                  <span>Gói hiện tại: <span className="font-bold text-gray-800">{renewListing.packageName}</span></span>
                  <span>Hết hạn: <span className="font-bold text-gray-800">{renewListing.expiresAt}</span></span>
                </div>
              </div>

              <div>
                <div className="mb-3 text-sm font-extrabold uppercase tracking-[0.16em] text-gray-400">Chọn thời hạn gia hạn</div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {renewOptions.map((option) => {
                    const isActive = selectedRenewDays === option.days;

                    return (
                      <button
                        key={option.days}
                        type="button"
                        onClick={() => {
                          setSelectedRenewDays(option.days);
                          setRenewSuccessMessage("");
                        }}
                        className={`rounded-2xl border p-4 text-left transition-colors ${isActive
                            ? "border-primary bg-red-50 text-primary"
                            : "border-gray-200 bg-white text-gray-800 hover:bg-gray-50"
                          }`}
                      >
                        <div className="text-lg font-extrabold">{option.label}</div>
                        <div className="mt-1 text-sm font-bold">{option.price}</div>
                        <div className={`mt-2 text-xs font-medium ${isActive ? "text-red-500" : "text-gray-500"}`}>{option.helper}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
                Khi xác nhận, hệ thống gọi API thanh toán ví để trừ tiền gia hạn tin.
              </div>

              {renewSuccessMessage ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-700">
                  {renewSuccessMessage}
                </div>
              ) : null}
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-gray-100 px-6 py-5">
              <button
                type="button"
                onClick={() => setRenewListing(null)}
                className="rounded-full border border-gray-300 px-5 py-3 text-[15px] font-bold text-gray-800 transition-colors hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={confirmRenewListing}
                disabled={isRenewSubmitting}
                className="rounded-full bg-primary px-5 py-3 text-[15px] font-bold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isRenewSubmitting ? "Đang thanh toán..." : "Xác nhận gia hạn"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <button className="fixed bottom-8 right-8 z-40 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-primary text-white shadow-[0_4px_14px_0_rgba(224,60,49,0.39)] transition-all hover:-translate-y-1 hover:bg-red-600 group">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform group-hover:scale-110"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </button>
    </>
  );
}

function SummaryCard({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="text-sm font-semibold text-gray-500">{label}</div>
      <div className="mt-3 text-[30px] font-extrabold leading-none text-gray-900">{value}</div>
      <div className="mt-2 text-sm text-gray-500">{helper}</div>
    </div>
  );
}

function FilterSection<T extends string>({
  title,
  value,
  options,
  onSelect,
}: {
  title: string;
  value: T;
  options: readonly T[];
  onSelect: (value: T) => void;
}) {
  return (
    <div>
      <div className="mb-3 text-sm font-extrabold uppercase tracking-[0.16em] text-gray-400">{title}</div>
      <div className="flex flex-wrap gap-3">
        {options.map((option) => {
          const isActive = value === option;

          return (
            <button
              key={option}
              type="button"
              onClick={() => onSelect(option)}
              className={`rounded-full border px-4 py-2.5 text-sm font-bold transition-colors ${isActive
                  ? "border-primary bg-red-50 text-primary"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ListingCard({ listing, onRenew }: { listing: Listing; onRenew: () => void }) {
  return (
    <article className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col lg:flex-row">
        <div className="relative h-56 w-full overflow-hidden bg-gray-100 lg:h-auto lg:w-[280px]">
          <img src={listing.image} alt={listing.title} className="h-full w-full object-cover" />
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

        <div className="flex flex-1 flex-col p-5 lg:p-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full border px-3 py-1 text-xs font-bold ${statusTone[listing.status]}`}>
                  {listing.status}
                </span>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
                  {listing.packageName}
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">Mã tin {listing.code}</span>
              </div>
              <h3 className="mt-3 text-[22px] font-extrabold leading-tight text-gray-900">{listing.title}</h3>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-gray-500">
                <span className="flex items-center gap-2">
                  <CircleDollarSign className="h-4 w-4 text-primary" />
                  <span className="font-bold text-primary">{listing.price}</span>
                </span>
                <span className="font-semibold text-gray-700">{listing.area}</span>
                <span className="rounded-full bg-gray-100 px-3 py-1 font-semibold text-gray-700">{listing.propertyType}</span>
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
                Đăng ngày <span className="font-bold text-gray-700">{listing.postedAt}</span>
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                Hết hạn <span className="font-bold text-gray-700">{listing.expiresAt}</span>
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

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#f6f7f9] px-4 py-3 text-center xl:text-left">
      <div className="text-xs font-bold uppercase tracking-[0.14em] text-gray-400">{label}</div>
      <div className="mt-1 text-xl font-extrabold text-gray-900">{value}</div>
    </div>
  );
}
