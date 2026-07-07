import { X, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";

export interface CouponData {
  id?: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderAmount?: number;
  maxUses?: number;
  validFrom: string;
  validUntil?: string;
  appliesTo: "boost" | "vip" | "all";
  description?: string;
  isActive?: boolean;
}

interface CouponFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: CouponData | null;
  onSuccess: () => void;
}

export function CouponFormModal({ isOpen, onClose, initialData, onSuccess }: CouponFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CouponData>({
    code: "",
    discountType: "percentage",
    discountValue: 0,
    minOrderAmount: undefined,
    maxUses: undefined,
    validFrom: new Date().toISOString().slice(0, 10),
    validUntil: "",
    appliesTo: "all",
    description: "",
  });

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        ...initialData,
        validFrom: initialData.validFrom ? new Date(initialData.validFrom).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
        validUntil: initialData.validUntil ? new Date(initialData.validUntil).toISOString().slice(0, 10) : "",
      });
    } else if (isOpen) {
      setFormData({
        code: "",
        discountType: "percentage",
        discountValue: 0,
        minOrderAmount: undefined,
        maxUses: undefined,
        validFrom: new Date().toISOString().slice(0, 10),
        validUntil: "",
        appliesTo: "all",
        description: "",
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "number") {
      setFormData(prev => ({ ...prev, [name]: value ? Number(value) : undefined }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate dates
      if (formData.validUntil && new Date(formData.validUntil) <= new Date(formData.validFrom)) {
        toast.error("Ngày hết hạn phải sau ngày bắt đầu");
        setLoading(false);
        return;
      }

      if (initialData?.id) {
        const payload = {
          discountValue: formData.discountValue,
          minOrderAmount: formData.minOrderAmount || undefined,
          maxUses: formData.maxUses || undefined,
          validFrom: new Date(formData.validFrom).toISOString(),
          validUntil: formData.validUntil ? new Date(formData.validUntil).toISOString() : undefined,
          description: formData.description || undefined,
        };
        await api.patch(`/admin/coupons/${initialData.id}`, payload);
        toast.success("Cập nhật khuyến mãi thành công");
      } else {
        const payload = {
          code: formData.code.toUpperCase(),
          discountType: formData.discountType,
          discountValue: formData.discountValue,
          minOrderAmount: formData.minOrderAmount || undefined,
          maxUses: formData.maxUses || undefined,
          validFrom: new Date(formData.validFrom).toISOString(),
          validUntil: formData.validUntil ? new Date(formData.validUntil).toISOString() : undefined,
          appliesTo: formData.appliesTo,
          description: formData.description || undefined,
        };
        await api.post("/admin/coupons", payload);
        toast.success("Tạo khuyến mãi thành công");
      }
      
      onSuccess();
    } catch (error: any) {
      toast.error(initialData?.id ? "Lỗi khi cập nhật khuyến mãi" : "Lỗi khi tạo khuyến mãi");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-[600px] mx-4 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-[17px] font-extrabold text-gray-900">
            {initialData?.id ? "Chỉnh sửa mã khuyến mãi" : "Tạo mã khuyến mãi mới"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-1.5 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
          <div className="p-6 overflow-y-auto space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <label className="block text-[13px] font-bold text-gray-700">Mã (Code) *</label>
                <input
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  required
                  disabled={!!initialData?.id}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-[13px] font-bold text-gray-900 outline-none focus:border-[#e03c31] focus:bg-white disabled:opacity-60"
                  placeholder="VD: SUMMER2024"
                />
              </div>

              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <label className="block text-[13px] font-bold text-gray-700">Áp dụng cho *</label>
                <select
                  name="appliesTo"
                  value={formData.appliesTo}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-[13px] font-bold text-gray-900 outline-none focus:border-[#e03c31] focus:bg-white"
                >
                  <option value="all">Tất cả dịch vụ</option>
                  <option value="vip">Chỉ mua Gói Hội viên (VIP)</option>
                  <option value="boost">Chỉ dịch vụ Đẩy tin</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <label className="block text-[13px] font-bold text-gray-700">Loại giảm giá *</label>
                <select
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-[13px] font-bold text-gray-900 outline-none focus:border-[#e03c31] focus:bg-white"
                >
                  <option value="percentage">Phần trăm (%)</option>
                  <option value="fixed">Số tiền cố định (VNĐ)</option>
                </select>
              </div>

              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <label className="block text-[13px] font-bold text-gray-700">Giá trị giảm *</label>
                <input
                  name="discountValue"
                  type="number"
                  min="0"
                  value={formData.discountValue || ""}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-[13px] font-bold text-gray-900 outline-none focus:border-[#e03c31] focus:bg-white"
                  placeholder={formData.discountType === "percentage" ? "VD: 10" : "VD: 50000"}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <label className="block text-[13px] font-bold text-gray-700">Đơn hàng tối thiểu (Tùy chọn)</label>
                <input
                  name="minOrderAmount"
                  type="number"
                  min="0"
                  value={formData.minOrderAmount || ""}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-[13px] font-bold text-gray-900 outline-none focus:border-[#e03c31] focus:bg-white"
                  placeholder="Để trống nếu không yêu cầu"
                />
              </div>

              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <label className="block text-[13px] font-bold text-gray-700">Giới hạn số lần dùng (Tùy chọn)</label>
                <input
                  name="maxUses"
                  type="number"
                  min="1"
                  value={formData.maxUses || ""}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-[13px] font-bold text-gray-900 outline-none focus:border-[#e03c31] focus:bg-white"
                  placeholder="Để trống nếu vô hạn"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <label className="block text-[13px] font-bold text-gray-700">Có hiệu lực từ *</label>
                <input
                  name="validFrom"
                  type="date"
                  value={formData.validFrom}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-[13px] font-bold text-gray-900 outline-none focus:border-[#e03c31] focus:bg-white"
                />
              </div>

              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <label className="block text-[13px] font-bold text-gray-700">Hết hạn vào (Tùy chọn)</label>
                <input
                  name="validUntil"
                  type="date"
                  value={formData.validUntil || ""}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-[13px] font-bold text-gray-900 outline-none focus:border-[#e03c31] focus:bg-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[13px] font-bold text-gray-700">Mô tả chi tiết</label>
              <textarea
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-[13px] font-medium text-gray-900 outline-none focus:border-[#e03c31] focus:bg-white resize-none"
                placeholder="Ghi chú về mã khuyến mãi này..."
              />
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
              {initialData?.id ? "Cập nhật" : "Tạo mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
