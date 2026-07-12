"use client";

import { useEffect, useState } from "react";
import { Modal, FormField } from "@/components/molecules";
import { Input, Select, Button } from "@/components/atoms";
import { CATEGORIES } from "@/config/categories";
import type {
  CreateSearchAlertRequest,
  SearchAlert,
  SearchAlertCriteria,
} from "@/services/search-alerts";

interface SearchAlertFormModalProps {
  isOpen: boolean;
  editing: SearchAlert | null;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSearchAlertRequest) => Promise<boolean>;
}

const emptyCriteria: SearchAlertCriteria = {};

function hasAnyCriteria(criteria: SearchAlertCriteria): boolean {
  return Object.values(criteria).some((v) => v !== undefined && v !== "");
}

export function SearchAlertFormModal({
  isOpen,
  editing,
  submitting,
  onClose,
  onSubmit,
}: SearchAlertFormModalProps) {
  const [name, setName] = useState("");
  const [criteria, setCriteria] = useState<SearchAlertCriteria>(emptyCriteria);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    if (isOpen) {
      setName(editing?.name ?? "");
      setCriteria(editing?.criteria ?? {});
      setError(null);
    }
  }, [isOpen, editing]);

  const updateCriteria = <K extends keyof SearchAlertCriteria>(key: K, value: SearchAlertCriteria[K]) => {
    setCriteria((prev) => ({ ...prev, [key]: value || undefined }));
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Vui lòng đặt tên cho tìm kiếm.");
      return;
    }
    if (!hasAnyCriteria(criteria)) {
      setError("Vui lòng chọn ít nhất một tiêu chí lọc.");
      return;
    }
    setError(null);
    const ok = await onSubmit({ name: name.trim(), criteria, frequency: "INSTANT" });
    if (ok) onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editing ? "Sửa tìm kiếm đã lưu" : "Tạo tìm kiếm mới"}
      size="md"
    >
      <div className="space-y-4">
        <FormField label="Tên tìm kiếm" required>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ví dụ: Căn hộ Quận 1 dưới 3 tỷ"
          />
        </FormField>

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Loại giao dịch"
            options={[
              { label: "Tất cả", value: "" },
              { label: "Bán", value: "sale" },
              { label: "Cho thuê", value: "rent" },
            ]}
            value={criteria.type ?? ""}
            onChange={(e) => updateCriteria("type", e.target.value as SearchAlertCriteria["type"])}
          />
          <Select
            label="Loại BĐS"
            options={[{ label: "Tất cả", value: "" }, ...CATEGORIES.map((c) => ({ label: c.label, value: c.slug }))]}
            value={criteria.category ?? ""}
            onChange={(e) => updateCriteria("category", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Giá từ (đ)">
            <Input
              type="number"
              min={0}
              value={criteria.minPrice ?? ""}
              onChange={(e) => updateCriteria("minPrice", e.target.value ? Number(e.target.value) : undefined)}
            />
          </FormField>
          <FormField label="Giá đến (đ)">
            <Input
              type="number"
              min={0}
              value={criteria.maxPrice ?? ""}
              onChange={(e) => updateCriteria("maxPrice", e.target.value ? Number(e.target.value) : undefined)}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Diện tích từ (m²)">
            <Input
              type="number"
              min={0}
              value={criteria.minArea ?? ""}
              onChange={(e) => updateCriteria("minArea", e.target.value ? Number(e.target.value) : undefined)}
            />
          </FormField>
          <FormField label="Diện tích đến (m²)">
            <Input
              type="number"
              min={0}
              value={criteria.maxArea ?? ""}
              onChange={(e) => updateCriteria("maxArea", e.target.value ? Number(e.target.value) : undefined)}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Tỉnh/thành">
            <Input
              value={criteria.province ?? ""}
              onChange={(e) => updateCriteria("province", e.target.value)}
              placeholder="Ví dụ: Hà Nội"
            />
          </FormField>
          <FormField label="Quận/huyện">
            <Input
              value={criteria.district ?? ""}
              onChange={(e) => updateCriteria("district", e.target.value)}
              placeholder="Ví dụ: Quận 1"
            />
          </FormField>
        </div>

        {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

        <p className="text-xs text-gray-400">
          Tần suất thông báo: <span className="font-medium">Ngay khi có tin mới</span>. Thông báo theo ngày/tuần sẽ ra mắt sau.
        </p>

        <Button fullWidth isLoading={submitting} onClick={handleSubmit}>
          {editing ? "Lưu thay đổi" : "Tạo tìm kiếm"}
        </Button>
      </div>
    </Modal>
  );
}
