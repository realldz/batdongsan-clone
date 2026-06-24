"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getPropertyById } from "@/services/properties";
import { propertyToDetailView, type PropertyDetailView } from "@/lib/api-adapters";
import { PropertyGallery } from "@/components/PropertyDetail/PropertyGallery";
import { PropertyInfo } from "@/components/PropertyDetail/PropertyInfo";
import { AdminModal } from "../molecules/AdminModal";

export interface PropertyPreviewModalProps {
  propertyId: string | null;
  onClose: () => void;
}

export function PropertyPreviewModal({
  propertyId,
  onClose,
}: PropertyPreviewModalProps) {
  const [detail, setDetail] = useState<PropertyDetailView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const isOpen = !!propertyId;

  useEffect(() => {
    if (!propertyId) return;

    /* eslint-disable react-hooks/set-state-in-effect */
    let ignore = false;
    setLoading(true);
    setError(false);

    getPropertyById(propertyId)
      .then((property) => {
        if (!ignore) {
          setDetail(propertyToDetailView(property));
          setLoading(false);
        }
      })
      .catch(() => {
        if (!ignore) {
          setError(true);
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [propertyId]);

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title="Xem trước tin đăng"
      size="xl"
    >
      {loading ? (
        <div className="flex items-center justify-center py-20 text-sm text-gray-500">
          Đang tải dữ liệu...
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-20 text-sm text-rose-600">
          Không thể tải thông tin tin đăng.
        </div>
      ) : detail ? (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <PropertyGallery images={detail.images} />
            <PropertyInfo property={detail} />
          </div>

          <div className="w-full lg:w-80 shrink-0">
            <div className="bg-white border border-gray-100 shadow-sm rounded-xl overflow-hidden p-4 sticky top-0">
              <h3 className="text-sm font-extrabold text-gray-500 uppercase tracking-wider mb-4">
                Thông tin chủ tin
              </h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-200 shrink-0">
                  <Image
                    src={detail.owner.avatar || "/images/avatar-default.jpg"}
                    alt={detail.owner.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900">
                    {detail.owner.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {detail.owner.phone}
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-xs text-gray-500 border-t border-gray-100 pt-4">
                <div className="flex justify-between">
                  <span>Mã tin</span>
                  <span className="font-medium text-gray-900">{detail.code}</span>
                </div>
                <div className="flex justify-between">
                  <span>Loại tin</span>
                  <span className="font-medium text-gray-900">
                    {detail.listingType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Ngày đăng</span>
                  <span className="font-medium text-gray-900">
                    {detail.postedAt}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </AdminModal>
  );
}
