"use client";

import { useEffect, useState } from "react";
import type { AdminListing, AdminListingStatus } from "../../_data/types";
import { AdminModal } from "../molecules/AdminModal";
import { FormField } from "../molecules/FormField";
import { ActionButton } from "../atoms/ActionButton";

const statusOptions = ["Đang hiển thị", "Chờ duyệt", "Đã duyệt", "Từ chối", "Đã ẩn", "Hết hạn"] as const;
const packageOptions = ["Tin thường", "Tin VIP", "Tin nổi bật"] as const;

export interface ListingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { status: AdminListingStatus; packageName: typeof packageOptions[number] }) => Promise<void>;
  listing: AdminListing | null;
}

export function ListingFormModal({
  isOpen,
  onClose,
  onSave,
  listing,
}: ListingFormModalProps) {
  const [draftStatus, setDraftStatus] = useState<AdminListingStatus>("Đang hiển thị");
  const [draftPackage, setDraftPackage] = useState<typeof packageOptions[number]>("Tin thường");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && listing) {
      setDraftStatus(listing.status);
      setDraftPackage(listing.packageName);
      setIsSubmitting(false);
    }
  }, [isOpen, listing]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSave({ status: draftStatus, packageName: draftPackage });
      onClose();
    } catch {
      // handled by parent
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!listing) return null;

  const footer = (
    <>
      <ActionButton variant="secondary" onClick={onClose}>
        Hủy
      </ActionButton>
      <ActionButton variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
      </ActionButton>
    </>
  );

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title="Sửa nhanh tin đăng"
      footer={footer}
      size="sm"
    >
      <div className="space-y-4">
        <div className="-mx-5 -mt-5 px-5 py-3 border-b border-gray-100 text-sm mb-4 bg-gray-50/50">
          <span className="text-gray-500">Mã tin: </span>
          <span className="font-bold text-gray-900">{listing.code}</span>
        </div>

        <div className="font-bold text-gray-900 leading-relaxed text-sm">
          {listing.title}
        </div>

        <FormField label="Trạng thái">
          <select
            value={draftStatus}
            onChange={(e) => setDraftStatus(e.target.value as AdminListingStatus)}
            className="w-full h-11 rounded-lg border border-gray-200 px-3 font-bold outline-none focus:border-[#e03c31] text-sm bg-white"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Gói hiển thị">
          <select
            value={draftPackage}
            onChange={(e) => setDraftPackage(e.target.value as typeof packageOptions[number])}
            className="w-full h-11 rounded-lg border border-gray-200 px-3 font-bold outline-none focus:border-[#e03c31] text-sm bg-white"
          >
            {packageOptions.map((pkg) => (
              <option key={pkg} value={pkg}>
                {pkg}
              </option>
            ))}
          </select>
        </FormField>
      </div>
    </AdminModal>
  );
}
