import { FeatureItem } from "../atoms/FeatureItem";

interface MembershipCardProps {
  name: string;
  description: string;
  pricePerMonth: number;
  originalPricePerMonth?: number;
  savingsPerMonth?: number;
  features: string[];
  vouchers: string[];
  isPopular?: boolean;
  onBuy: () => void;
  icon?: React.ReactNode;
}

export function MembershipCard({
  name,
  description,
  pricePerMonth,
  originalPricePerMonth,
  savingsPerMonth,
  features,
  vouchers,
  isPopular,
  onBuy,
  icon,
}: MembershipCardProps) {
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " đ";
  };

  const discountPercent = originalPricePerMonth 
    ? Math.round((1 - pricePerMonth / originalPricePerMonth) * 100) 
    : 0;

  return (
    <div className={`relative flex flex-col bg-white rounded-xl border ${isPopular ? "border-[#ff9800] shadow-md z-10" : "border-gray-200 shadow-sm"}`}>
      {isPopular && (
        <div className="absolute top-0 left-4 -translate-y-1/2 bg-[#ffb700] text-gray-900 text-[11px] font-extrabold px-3 py-1 rounded-sm shadow-sm">
          Bán chạy nhất
        </div>
      )}
      
      <div className="p-6 pb-5 flex-1">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-[17px] font-extrabold text-gray-900 mb-1">{name}</h3>
            <p className="text-[11px] text-gray-500 font-medium">{description}</p>
          </div>
          {icon && <div className="w-10 h-10 shrink-0 opacity-80 flex items-center justify-center text-3xl">{icon}</div>}
        </div>
        
        <div className="mt-6 mb-5">
          <div className="flex items-baseline gap-1.5 mb-1">
            <span className="text-[13px] text-gray-700 font-medium">từ</span>
            <span className="text-[22px] font-extrabold text-gray-900 tracking-tight">{formatMoney(pricePerMonth)}</span>
            <span className="text-[13px] text-gray-500 font-medium">/tháng</span>
            {discountPercent > 0 && (
              <span className="text-[11px] font-bold text-[#e03c31] ml-1">(-{discountPercent}%)</span>
            )}
          </div>
          {savingsPerMonth ? (
            <p className="text-[11px] font-bold text-[#00b2a9]">Tiết kiệm đến {formatMoney(savingsPerMonth)} mỗi tháng</p>
          ) : (
            <p className="text-[11px] font-medium text-transparent">.</p> // Placeholder
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button 
            onClick={onBuy}
            className="col-span-1 py-2 rounded-lg border border-[#e03c31] bg-[#e03c31] text-white text-[13px] font-bold hover:bg-[#c9362c] transition-colors text-center"
          >
            Mua gói 1 tháng
          </button>
          <button 
            onClick={onBuy}
            className="col-span-1 py-2 rounded-lg border border-gray-300 bg-white text-[#e03c31] text-[13px] font-bold hover:bg-red-50 transition-colors text-center"
          >
            Mua ngay
          </button>
        </div>
        
        <div className="space-y-5 text-[13px]">
          <div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-3">Gói voucher 30 ngày <span className="text-gray-400 font-normal lowercase">(i)</span></p>
            <ul className="space-y-2.5">
              {vouchers.map((v, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-700 font-medium text-[13px]">
                  <span className="w-4 h-4 rounded text-[#e03c31] border border-[#e03c31] flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">-</span>
                  <span dangerouslySetInnerHTML={{ __html: v }}></span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="pt-4 border-t border-gray-100">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-3">Tiện ích</p>
            <ul className="space-y-2.5">
              <FeatureItem label="Bản quyền ảnh" included={features.includes("Bản quyền ảnh")} />
              <FeatureItem label="Hẹn giờ đăng tin" included={features.includes("Hẹn giờ đăng tin")} />
              <FeatureItem label="Báo cáo hiệu suất" included={features.includes("Báo cáo hiệu suất")} />
              <FeatureItem label="Báo cáo thị trường" included={features.includes("Báo cáo thị trường")} />
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
