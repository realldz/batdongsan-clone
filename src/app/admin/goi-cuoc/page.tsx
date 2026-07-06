"use client";

import { useEffect, useState } from "react";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AdminHeader } from "../_components/organisms/AdminHeader";
import { AdminPageTemplate } from "../_components/templates/AdminPageTemplate";
import { PricingForm, type PricingData } from "./_components/organisms/PricingForm";
import { api } from "@/lib/api";

export default function AdminPricingPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<PricingData>({
    boostBasePrice: 0,
    vipSilverMonthlyPrice: 0,
    vipGoldMonthlyPrice: 0,
    vipDiamondMonthlyPrice: 0,
    enabled: true,
  });

  useEffect(() => {
    let ignore = false;
    async function loadPricing() {
      try {
        const result = await api.get<PricingData>("/admin/pricing");
        if (!ignore && result) {
          setData({
            boostBasePrice: result.boostBasePrice || 0,
            vipSilverMonthlyPrice: result.vipSilverMonthlyPrice || 0,
            vipGoldMonthlyPrice: result.vipGoldMonthlyPrice || 0,
            vipDiamondMonthlyPrice: result.vipDiamondMonthlyPrice || 0,
            enabled: result.enabled ?? true,
          });
        }
      } catch (error: any) {
        if (!ignore) {
          toast.error("Không thể tải dữ liệu gói cước: " + (error.message || "Lỗi không xác định"));
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    loadPricing();
    return () => {
      ignore = true;
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : Number(value) || 0,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.patch("/admin/pricing", data);
      toast.success("Đã cập nhật cấu hình gói cước thành công");
    } catch (error: any) {
      toast.error("Cập nhật thất bại: " + (error.message || "Lỗi không xác định"));
    } finally {
      setSaving(false);
    }
  };

  const header = (
    <AdminHeader
      title="Cấu hình Gói cước"
      description="Quản lý giá trị các gói dịch vụ đẩy tin và đăng ký VIP của hệ thống."
      actions={
        <button
          onClick={handleSave}
          disabled={loading || saving}
          className="flex items-center gap-2 rounded-lg bg-[#e03c31] px-4 py-2 text-[13px] font-bold text-white transition-colors hover:bg-[#c9362c] disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Lưu thay đổi
        </button>
      }
    />
  );

  if (loading) {
    return (
      <AdminPageTemplate header={header}>
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </AdminPageTemplate>
    );
  }

  return (
    <AdminPageTemplate header={header}>
      <PricingForm data={data} onChange={handleChange} />
    </AdminPageTemplate>
  );
}
