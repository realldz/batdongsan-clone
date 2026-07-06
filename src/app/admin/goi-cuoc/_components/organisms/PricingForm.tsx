import { Banknote, Info } from "lucide-react";
import { TableShell } from "../../../_components/molecules/TableShell";

export interface PricingData {
  boostBasePrice: number;
  vipSilverMonthlyPrice: number;
  vipGoldMonthlyPrice: number;
  vipDiamondMonthlyPrice: number;
  enabled: boolean;
}

interface PricingFormProps {
  data: PricingData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PricingForm({ data, onChange }: PricingFormProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2 space-y-6">
        <TableShell
          title="Giá trị gói cước"
          description="Thiết lập chi phí cho các loại gói VIP và dịch vụ đẩy tin."
          icon={<Banknote className="w-5 h-5 text-gray-500" />}
        >
          <div className="p-6 space-y-6">
            {/* Dịch vụ đẩy tin */}
            <div>
              <h4 className="text-[13px] font-extrabold text-gray-900 mb-4">Dịch vụ lẻ</h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label htmlFor="boostBasePrice" className="block text-[13px] font-bold text-gray-700">
                    Giá đẩy tin cơ bản (VNĐ)
                  </label>
                  <input
                    id="boostBasePrice"
                    name="boostBasePrice"
                    type="number"
                    min="0"
                    value={data.boostBasePrice}
                    onChange={onChange}
                    className="block w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-[13px] font-bold text-gray-900 outline-none transition-all focus:border-[#e03c31] focus:bg-white focus:ring-4 focus:ring-red-50"
                  />
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Gói VIP */}
            <div>
              <h4 className="text-[13px] font-extrabold text-gray-900 mb-4">Gói VIP theo tháng</h4>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <label htmlFor="vipSilverMonthlyPrice" className="block text-[13px] font-bold text-gray-700">
                    VIP Bạc (VNĐ)
                  </label>
                  <input
                    id="vipSilverMonthlyPrice"
                    name="vipSilverMonthlyPrice"
                    type="number"
                    min="0"
                    value={data.vipSilverMonthlyPrice}
                    onChange={onChange}
                    className="block w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-[13px] font-bold text-gray-900 outline-none transition-all focus:border-[#e03c31] focus:bg-white focus:ring-4 focus:ring-red-50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="vipGoldMonthlyPrice" className="block text-[13px] font-bold text-gray-700">
                    VIP Vàng (VNĐ)
                  </label>
                  <input
                    id="vipGoldMonthlyPrice"
                    name="vipGoldMonthlyPrice"
                    type="number"
                    min="0"
                    value={data.vipGoldMonthlyPrice}
                    onChange={onChange}
                    className="block w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-[13px] font-bold text-gray-900 outline-none transition-all focus:border-[#e03c31] focus:bg-white focus:ring-4 focus:ring-red-50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="vipDiamondMonthlyPrice" className="block text-[13px] font-bold text-gray-700">
                    VIP Kim Cương (VNĐ)
                  </label>
                  <input
                    id="vipDiamondMonthlyPrice"
                    name="vipDiamondMonthlyPrice"
                    type="number"
                    min="0"
                    value={data.vipDiamondMonthlyPrice}
                    onChange={onChange}
                    className="block w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-[13px] font-bold text-gray-900 outline-none transition-all focus:border-[#e03c31] focus:bg-white focus:ring-4 focus:ring-red-50"
                  />
                </div>
              </div>
            </div>
          </div>
        </TableShell>
      </div>

      <div className="space-y-6">
        <TableShell title="Trạng thái dịch vụ" description="Tắt/Bật tính năng mua gói cước.">
          <div className="p-6">
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  name="enabled"
                  checked={data.enabled}
                  onChange={onChange}
                />
                <div className={`block w-10 h-6 rounded-full transition-colors ${data.enabled ? 'bg-[#e03c31]' : 'bg-gray-200'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${data.enabled ? 'transform translate-x-4' : ''}`}></div>
              </div>
              <div className="ml-3 font-bold text-[13px] text-gray-700">
                {data.enabled ? "Đang hoạt động" : "Đã vô hiệu hóa"}
              </div>
            </label>
            
            <div className="mt-4 flex gap-2 items-start bg-blue-50 text-blue-800 p-3 rounded-lg border border-blue-100">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed font-medium">
                Khi vô hiệu hóa, người dùng sẽ không thể mua các gói VIP và dịch vụ đẩy tin trên hệ thống. Dữ liệu các gói đã mua vẫn được giữ nguyên.
              </p>
            </div>
          </div>
        </TableShell>
      </div>
    </div>
  );
}
