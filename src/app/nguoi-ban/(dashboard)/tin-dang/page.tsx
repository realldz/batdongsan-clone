"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  FileText,
  Filter,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { toast } from "sonner";

import { SellerHeader } from "../../_components/SellerHeader";
import { SellerPagination } from "../../_components/SellerPagination";
import { SummaryCard, EmptyState } from "../../_components/atoms";
import { ListingCard, type Listing, type ListingStatus } from "../../_components/molecules";
import { FilterDialog, BoostDialog, type PushType } from "../../_components/organisms";

import { formatArea, formatCurrency, formatLocation, unwrapPaginated } from "@/lib/api-adapters";
import { deleteProperty, getMyProperties, boostProperty, updatePropertyStatus, type Property, type PropertyStatus, type PropertyType } from "@/services/properties";
import { useWalletBalance, useRefreshWallet } from "@/lib/use-wallet-balance";
import { getPricing, type PricingInfo } from "@/services/pricing";

const PAGE_SIZE = 10;

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

function mapPropertyStatusToListingStatus(status: PropertyStatus | undefined): ListingStatus {
  if (status === "active") return "Đang hiển thị";
  if (status === "hidden") return "Đã hạ";
  if (status === "sold" || status === "rented") return "Hết hạn";
  if (status === "draft") return "Chờ thanh toán";
  return "Chờ duyệt";
}

function mapListingStatusToPropertyStatus(status: ListingStatus): PropertyStatus | undefined {
  if (status === "Đang hiển thị") return "active";
  if (status === "Chờ duyệt") return "pending";
  if (status === "Sắp hết hạn") return "expired";
  if (status === "Hết hạn") return "sold";
  if (status === "Đã hạ") return "hidden";
  if (status === "Chờ thanh toán") return "draft";
  return undefined;
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

export default function RechargePage() {
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
  const [boostListing, setBoostListing] = useState<Listing | null>(null);
  const [selectedPushType, setSelectedPushType] = useState<PushType>("pushed");
  const [boostSuccessMessage, setBoostSuccessMessage] = useState("");
  const [isBoostSubmitting, setIsBoostSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pricing, setPricing] = useState<PricingInfo | null>(null);
  const wallet = useWalletBalance();
  const refreshWallet = useRefreshWallet();

  const isAnyDialogOpen = isFilterDialogOpen || boostListing !== null;

  useEffect(() => {
    getPricing()
      .then(setPricing)
      .catch((err) => console.error("Failed to load pricing", err));
  }, []);

  useEffect(() => {
    let ignore = false;

    async function loadListings() {
      setLoading(true);
      try {
        const params: {
          page: number;
          perPage: number;
          title?: string;
          status?: PropertyStatus;
          type?: PropertyType;
        } = { page: currentPage, perPage: PAGE_SIZE };

        if (search.trim()) {
          params.title = search.trim();
        }

        if (categoryFilter === "Bán") {
          params.type = "sale";
        } else if (categoryFilter === "Thuê") {
          params.type = "rent";
        }

        if (draftOnly) {
          params.status = "draft";
        } else if (activeStatus !== "Tất cả") {
          const mappedStatus = mapListingStatusToPropertyStatus(activeStatus);
          if (mappedStatus) {
            params.status = mappedStatus;
          }
        }

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
  }, [currentPage, search, activeStatus, categoryFilter, draftOnly]);

  useEffect(() => {
    if (!isAnyDialogOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsFilterDialogOpen(false);
        setBoostListing(null);
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
    return listings.filter((listing) => {
      const matchesPackage = packageFilter === "Tất cả" || listing.packageName === packageFilter;
      return matchesPackage;
    });
  }, [listings, packageFilter]);

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

  const openBoostDialog = (listing: Listing) => {
    setBoostSuccessMessage("");
    setSelectedPushType("pushed");
    setBoostListing(listing);
  };

  const confirmBoostListing = async () => {
    if (!boostListing) {
      return;
    }

    setIsBoostSubmitting(true);
    setBoostSuccessMessage("");

    try {
      await boostProperty(boostListing.id, selectedPushType);
      toast.success(`Đã đẩy tin ${boostListing.code} thành công.`);
      refreshWallet();
      setBoostListing(null); // Đóng modal ngay khi thành công
    } catch {
      setBoostSuccessMessage("Chưa thể đẩy tin, vui lòng kiểm tra số dư hoặc thử lại sau.");
    } finally {
      setIsBoostSubmitting(false);
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
                  Theo dõi hiệu suất tin, kiểm tra thời hạn hiển thị và lọc nhanh theo loại tin.
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
            <SummaryCard
              label="Lượt xem tích lũy"
              value={listings.reduce((sum, listing) => sum + listing.views, 0).toLocaleString("vi-VN")}
              helper="Tổng lượt xem của các tin"
            />
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
                  <ListingCard 
                    key={listing.id} 
                    listing={listing} 
                    onBoost={() => openBoostDialog(listing)} 
                    onDelete={async () => {
                      if (!window.confirm("Bạn có chắc chắn muốn xóa tin này không?")) return;
                      try {
                        await deleteProperty(listing.id);
                        setListings((prev) => prev.filter((l) => l.id !== listing.id));
                        setTotal((prev) => Math.max(0, prev - 1));
                      } catch {
                        alert("Xóa tin thất bại, vui lòng thử lại sau.");
                      }
                    }}
                    onHide={async () => {
                      if (!window.confirm("Bạn có chắc chắn muốn hạ tin này không? Tin sẽ bị ẩn khỏi kết quả tìm kiếm.")) return;
                      try {
                        await updatePropertyStatus(listing.id, "hidden");
                        setListings((prev) => prev.map((l) => l.id === listing.id ? { ...l, status: "Đã hạ" } : l));
                        toast.success("Đã hạ tin thành công.");
                      } catch {
                        toast.error("Hạ tin thất bại, vui lòng thử lại sau.");
                      }
                    }}
                  />
                ))
              ) : (
                <EmptyState
                  title="Không tìm thấy tin phù hợp"
                  description="Thử đổi từ khóa, trạng thái hoặc loại tin trong bộ lọc để xem thêm tin."
                  icon={<Search className="h-6 w-6 text-gray-500" />}
                />
              )}
            </div>

            <SellerPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={total}
              pageSize={PAGE_SIZE}
              itemsLabel="tin đăng"
            />
          </section>
        </div>
      </main>

      <FilterDialog
        isOpen={isFilterDialogOpen}
        onClose={() => setIsFilterDialogOpen(false)}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        packageFilter={packageFilter}
        setPackageFilter={setPackageFilter}
        activeStatus={activeStatus}
        setActiveStatus={setActiveStatus}
        onReset={resetFilters}
      />

      {boostListing && (
        <BoostDialog
          listing={boostListing}
          onClose={() => setBoostListing(null)}
          selectedPushType={selectedPushType}
          setSelectedPushType={setSelectedPushType}
          boostSuccessMessage={boostSuccessMessage}
          setBoostSuccessMessage={setBoostSuccessMessage}
          isBoostSubmitting={isBoostSubmitting}
          onConfirm={confirmBoostListing}
          pricing={pricing}
        />
      )}

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
