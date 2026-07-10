import React, { useState } from "react";
import { validateCoupon } from "@/services/coupons";
import { X, Tag, Loader2 } from "lucide-react";

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (code: string, discount: number) => void;
}

export function CouponModal({ isOpen, onClose, onApply }: CouponModalProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleApply = async () => {
    if (!code.trim()) return;
    
    setLoading(true);
    setError("");
    try {
      const res = await validateCoupon(code, "all");
      if (res.valid) {
        onApply(code, res.discountValue);
        onClose();
      } else {
        setError(res.message || "Mã khuyến mãi không hợp lệ");
      }
    } catch (err: any) {
      setError(err.message || "Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl w-[400px] max-w-[90vw] overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-lg text-gray-900">Khuyến mãi</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Tag size={16} />
              </div>
              <input
                type="text"
                placeholder="Nhập mã khuyến mãi"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase());
                  setError("");
                }}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary uppercase"
              />
            </div>
            <button
              onClick={handleApply}
              disabled={!code.trim() || loading}
              className="bg-primary text-white px-4 py-2 rounded-lg font-bold disabled:opacity-50 min-w-[80px] flex justify-center items-center"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : "Áp dụng"}
            </button>
          </div>
          {error && <p className="text-primary text-sm mt-2">{error}</p>}
        </div>
      </div>
    </div>
  );
}
