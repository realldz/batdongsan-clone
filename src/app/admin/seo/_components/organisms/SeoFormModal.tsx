import { X, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { updateSeoConfig, type SeoConfig, type UpsertSeoDto } from "@/services/seo";

interface SeoFormModalProps {
  isOpen: boolean;
  page: string;
  label: string;
  initialData: SeoConfig | null;
  onClose: () => void;
  onSuccess: () => void;
}

const EMPTY_FORM: UpsertSeoDto = { title: "", description: "", keywords: "", ogImage: "" };

export function SeoFormModal({ isOpen, page, label, initialData, onClose, onSuccess }: SeoFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UpsertSeoDto>(EMPTY_FORM);

  useEffect(() => {
    if (!isOpen) return;
    if (initialData) {
      setFormData({
        title: initialData.title ?? "",
        description: initialData.description ?? "",
        keywords: initialData.keywords ?? "",
        ogImage: initialData.ogImage ?? "",
      });
    } else {
      setFormData(EMPTY_FORM);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!page) {
      toast.error("Thiếu thông tin trang, vui lòng thử lại");
      return;
    }
    setLoading(true);

    try {
      const dto: UpsertSeoDto = {
        title: formData.title?.trim() || undefined,
        description: formData.description?.trim() || undefined,
        keywords: formData.keywords?.trim() || undefined,
        ogImage: formData.ogImage?.trim() || undefined,
      };
      await updateSeoConfig(page, dto);
      toast.success("Cập nhật SEO thành công");
      onSuccess();
    } catch (error) {
      toast.error("Lỗi khi cập nhật SEO");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const showOgPreview = !!formData.ogImage?.trim() && /^https?:\/\//.test(formData.ogImage.trim());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-[560px] mx-4 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-[17px] font-extrabold text-gray-900">Cấu hình SEO — {label}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-1.5 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
          <div className="p-6 overflow-y-auto space-y-5">
            <div className="space-y-1.5">
              <label className="block text-[13px] font-bold text-gray-700">Tiêu đề (title)</label>
              <input
                name="title"
                value={formData.title ?? ""}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-[13px] font-bold text-gray-900 outline-none focus:border-[#e03c31] focus:bg-white"
                placeholder="VD: Batdongsan.com.vn - Mua bán, cho thuê BĐS"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[13px] font-bold text-gray-700">Mô tả (description)</label>
              <textarea
                name="description"
                value={formData.description ?? ""}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-[13px] font-medium text-gray-900 outline-none focus:border-[#e03c31] focus:bg-white resize-none"
                placeholder="Mô tả ngắn hiển thị trên kết quả tìm kiếm..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[13px] font-bold text-gray-700">Từ khóa (keywords)</label>
              <input
                name="keywords"
                value={formData.keywords ?? ""}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-[13px] font-bold text-gray-900 outline-none focus:border-[#e03c31] focus:bg-white"
                placeholder="VD: bất động sản, nhà đất, mua bán"
              />
              <p className="text-[11px] text-gray-400">Phân tách bằng dấu phẩy</p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[13px] font-bold text-gray-700">Ảnh OG (ogImage)</label>
              <input
                name="ogImage"
                value={formData.ogImage ?? ""}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-[13px] font-bold text-gray-900 outline-none focus:border-[#e03c31] focus:bg-white"
                placeholder="https://..."
              />
              {showOgPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={formData.ogImage?.trim()}
                  alt="Xem trước ảnh OG"
                  className="mt-2 h-24 rounded border border-gray-200 object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : null}
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
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
