import React from "react";
import { FilterSection } from "../molecules/FilterSection";

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

interface FilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  categoryFilter: (typeof filterSections.categories)[number];
  setCategoryFilter: (value: (typeof filterSections.categories)[number]) => void;
  packageFilter: (typeof filterSections.packages)[number];
  setPackageFilter: (value: (typeof filterSections.packages)[number]) => void;
  activeStatus: (typeof filterSections.statuses)[number];
  setActiveStatus: (value: (typeof filterSections.statuses)[number]) => void;
  onReset: () => void;
}

export function FilterDialog({
  isOpen,
  onClose,
  categoryFilter,
  setCategoryFilter,
  packageFilter,
  setPackageFilter,
  activeStatus,
  setActiveStatus,
  onReset,
}: FilterDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-0 sm:items-center sm:p-6 animate-in fade-in duration-200">
      <button
        type="button"
        aria-label="Đóng bộ lọc"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[28px] bg-white shadow-2xl sm:rounded-[28px] animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <div className="text-[22px] font-extrabold text-gray-900">Lọc tin đăng</div>
            <p className="mt-1 text-sm text-gray-500 font-medium">
              Chọn điều kiện để thu hẹp danh sách tin đăng
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700 font-bold"
          >
            ×
          </button>
        </div>

        <div className="space-y-6 overflow-y-auto px-6 py-6">
          <FilterSection
            title="Nhu cầu"
            value={categoryFilter}
            options={filterSections.categories}
            onSelect={setCategoryFilter}
          />
          <FilterSection
            title="Loại gói tin"
            value={packageFilter}
            options={filterSections.packages}
            onSelect={setPackageFilter}
          />
          <FilterSection
            title="Trạng thái"
            value={activeStatus}
            options={filterSections.statuses}
            onSelect={setActiveStatus}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-gray-100 px-6 py-5">
          <button
            type="button"
            onClick={onReset}
            className="rounded-full border border-gray-300 px-5 py-3 text-[15px] font-bold text-gray-800 transition-colors hover:bg-gray-50"
          >
            Đặt lại
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-primary px-5 py-3 text-[15px] font-bold text-white transition-colors hover:bg-red-700"
          >
            Áp dụng
          </button>
        </div>
      </div>
    </div>
  );
}
