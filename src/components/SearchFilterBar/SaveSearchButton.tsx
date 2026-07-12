"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Bell } from "lucide-react";
import { Button, Input } from "@/components/atoms";
import { Modal } from "@/components/molecules";
import { useAuth } from "@/lib/auth-store";
import { createSearchAlert, type SearchAlertCriteria } from "@/services/search-alerts";

function buildCriteriaFromParams(searchParams: URLSearchParams): SearchAlertCriteria {
  const criteria: SearchAlertCriteria = {};

  const type = searchParams.get("type");
  if (type === "sale" || type === "rent") criteria.type = type;

  const minPrice = searchParams.get("minPrice");
  if (minPrice) criteria.minPrice = Number(minPrice);

  const maxPrice = searchParams.get("maxPrice");
  if (maxPrice) criteria.maxPrice = Number(maxPrice);

  const minArea = searchParams.get("minArea");
  if (minArea) criteria.minArea = Number(minArea);

  const maxArea = searchParams.get("maxArea");
  if (maxArea) criteria.maxArea = Number(maxArea);

  const province = searchParams.get("province");
  if (province) criteria.province = province;

  const district = searchParams.get("district");
  if (district) criteria.district = district;

  return criteria;
}

export function SaveSearchButton() {
  const { isAuthenticated } = useAuth();
  const searchParams = useSearchParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isAuthenticated) return null;

  const criteria = buildCriteriaFromParams(searchParams);
  const hasCriteria = Object.keys(criteria).length > 0;

  const handleOpen = () => {
    if (!hasCriteria) {
      toast.info("Vui lòng chọn ít nhất một tiêu chí tìm kiếm trước khi lưu.");
      return;
    }
    setName("");
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Vui lòng đặt tên cho tìm kiếm.");
      return;
    }
    setSubmitting(true);
    try {
      await createSearchAlert({ name: name.trim(), criteria, frequency: "INSTANT" });
      toast.success("Đã lưu tìm kiếm. Bạn sẽ nhận thông báo khi có tin mới phù hợp.");
      setModalOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể lưu tìm kiếm.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="border border-gray-300 rounded px-3 py-1.5 flex items-center gap-1.5 hover:bg-gray-50 transition-colors bg-white text-[#2c2c2c] cursor-pointer"
      >
        <Bell className="h-3.5 w-3.5" />
        Lưu tìm kiếm
      </button>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Lưu tìm kiếm này" size="sm">
        <div className="space-y-4">
          <Input
            label="Tên tìm kiếm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ví dụ: Căn hộ Quận 1 dưới 3 tỷ"
          />
          <p className="text-xs text-gray-400">
            Bạn sẽ nhận thông báo ngay khi có tin đăng mới phù hợp với tiêu chí tìm kiếm hiện tại.
          </p>
          <Button fullWidth isLoading={submitting} onClick={handleSave}>
            Lưu tìm kiếm
          </Button>
        </div>
      </Modal>
    </>
  );
}
