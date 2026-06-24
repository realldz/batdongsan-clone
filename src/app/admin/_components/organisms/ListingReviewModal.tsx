"use client";

import { useEffect, useState } from "react";
import type { AdminListing } from "../../_data/types";
import { AdminModal } from "../molecules/AdminModal";
import { FormField } from "../molecules/FormField";
import { ActionButton } from "../atoms/ActionButton";

export interface ListingReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (note: string) => Promise<void>;
  listing: AdminListing | null;
  action: "approve" | "reject" | null;
}

export function ListingReviewModal({
  isOpen,
  onClose,
  onConfirm,
  listing,
  action,
}: ListingReviewModalProps) {
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && action) {
      setNote(
        action === "approve"
          ? "Tin đạt yêu cầu hiển thị."
          : "Nội dung chưa đáp ứng quy định đăng tin."
      );
      setIsSubmitting(false);
    }
  }, [isOpen, action]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm(note);
      onClose();
    } catch {
      // handled by parent
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!listing || !action) return null;

  const title = action === "approve" ? "Duyệt tin" : "Từ chối tin";
  
  const footer = (
    <>
      <ActionButton variant="secondary" onClick={onClose}>
        Hủy
      </ActionButton>
      <ActionButton
        variant="primary"
        onClick={handleSubmit}
        disabled={isSubmitting}
        className={action === "reject" ? "bg-[#e03c31] hover:bg-[#c93027] bg-rose-600 hover:bg-rose-700" : ""}
      >
        {isSubmitting
          ? "Đang xử lý..."
          : action === "approve"
          ? "Xác nhận duyệt"
          : "Xác nhận từ chối"}
      </ActionButton>
    </>
  );

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
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
        
        <FormField label="Ghi chú kiểm duyệt">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-gray-200 px-3 py-3 font-medium outline-none focus:border-[#e03c31] resize-none text-sm bg-white"
          />
        </FormField>
      </div>
    </AdminModal>
  );
}
