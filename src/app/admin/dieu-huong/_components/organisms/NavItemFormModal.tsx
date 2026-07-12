import { X, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  createNavItem,
  updateNavItem,
  type AdminNavItem,
  type NavItemPayload,
} from "@/services/navigation";
import type { NavSearchFilters } from "@/config/search-filters";
import { NavBehaviorField, type NavBehaviorMode } from "./NavBehaviorField";

interface ParentOption {
  id: string;
  label: string;
}

interface NavItemFormModalProps {
  isOpen: boolean;
  initialData: AdminNavItem | null;
  parentOptions: ParentOption[];
  defaultParentId?: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormState {
  label: string;
  href: string;
  parentId: string;
  isActive: boolean;
  openInNewTab: boolean;
  mode: NavBehaviorMode;
  searchFilters: NavSearchFilters;
}

const EMPTY_FORM: FormState = {
  label: "",
  href: "#",
  parentId: "",
  isActive: true,
  openInNewTab: false,
  mode: "link",
  searchFilters: {},
};

export function NavItemFormModal({
  isOpen,
  initialData,
  parentOptions,
  defaultParentId,
  onClose,
  onSuccess,
}: NavItemFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormState>(EMPTY_FORM);

  useEffect(() => {
    if (!isOpen) return;
    if (initialData) {
      const hasFilters = !!initialData.searchFilters;
      setFormData({
        label: initialData.label,
        href: initialData.href ?? "#",
        parentId: initialData.parentId ?? "",
        isActive: initialData.isActive,
        openInNewTab: initialData.openInNewTab,
        mode: hasFilters ? "filter" : "link",
        searchFilters: initialData.searchFilters ?? {},
      });
    } else {
      setFormData({ ...EMPTY_FORM, parentId: defaultParentId ?? "" });
    }
  }, [initialData, defaultParentId, isOpen]);

  if (!isOpen) return null;

  const isEdit = !!initialData;
  // A top-level item cannot become a child (would create 3 levels); hide the
  // parent select when editing an item that already has its own children.
  const excludeSelfId = initialData?.id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.label.trim()) {
      toast.error("Vui lòng nhập nhãn hiển thị");
      return;
    }
    setLoading(true);

    const payload: NavItemPayload = {
      label: formData.label.trim(),
      href: formData.mode === "link" ? formData.href.trim() || "#" : "#",
      parentId: formData.parentId || null,
      isActive: formData.isActive,
      openInNewTab: formData.openInNewTab,
      searchFilters: formData.mode === "filter" ? formData.searchFilters : null,
    };

    try {
      if (isEdit && initialData) {
        await updateNavItem(initialData.id, payload);
        toast.success("Cập nhật mục điều hướng thành công");
      } else {
        await createNavItem(payload);
        toast.success("Thêm mục điều hướng thành công");
      }
      onSuccess();
    } catch (error) {
      toast.error("Lỗi khi lưu mục điều hướng");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-[520px] mx-4 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-[17px] font-extrabold text-gray-900">
            {isEdit ? "Sửa mục điều hướng" : "Thêm mục điều hướng"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-1.5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
          <div className="p-6 overflow-y-auto space-y-5">
            <div className="space-y-1.5">
              <label className="block text-[13px] font-bold text-gray-700">Nhãn hiển thị</label>
              <input
                value={formData.label}
                onChange={(e) => setFormData((p) => ({ ...p, label: e.target.value }))}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-[13px] font-bold text-gray-900 outline-none focus:border-[#e03c31] focus:bg-white"
                placeholder="VD: Nhà đất bán"
              />
            </div>

            <NavBehaviorField
              mode={formData.mode}
              href={formData.href}
              searchFilters={formData.searchFilters}
              onModeChange={(mode) => setFormData((p) => ({ ...p, mode }))}
              onHrefChange={(href) => setFormData((p) => ({ ...p, href }))}
              onFiltersChange={(searchFilters) => setFormData((p) => ({ ...p, searchFilters }))}
            />

            <div className="space-y-1.5">
              <label className="block text-[13px] font-bold text-gray-700">Mục cha</label>
              <select
                value={formData.parentId}
                onChange={(e) => setFormData((p) => ({ ...p, parentId: e.target.value }))}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-[13px] font-bold text-gray-900 outline-none focus:border-[#e03c31] focus:bg-white"
              >
                <option value="">— Mục cấp cao nhất —</option>
                {parentOptions
                  .filter((opt) => opt.id !== excludeSelfId)
                  .map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-[13px] font-bold text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.checked }))}
                  className="w-4 h-4 accent-[#e03c31]"
                />
                Hiển thị
              </label>
              <label className="flex items-center gap-2 text-[13px] font-bold text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.openInNewTab}
                  onChange={(e) => setFormData((p) => ({ ...p, openInNewTab: e.target.checked }))}
                  className="w-4 h-4 accent-[#e03c31]"
                />
                Mở tab mới
              </label>
            </div>
          </div>

          <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 text-[13px] font-bold hover:bg-gray-50 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#e03c31] text-white text-[13px] font-bold hover:bg-[#c9362c] transition-colors disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {isEdit ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
