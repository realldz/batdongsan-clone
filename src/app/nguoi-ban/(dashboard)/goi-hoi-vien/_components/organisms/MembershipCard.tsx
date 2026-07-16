interface MembershipCardProps {
  name: string;
  description: string;
  pricePerMonth: number;
  originalPricePerMonth?: number;
  savingsPerMonth?: number;
  benefits: string[];
  isPopular?: boolean;
  isCurrent?: boolean;
  buyLabel?: string;
  onBuy: () => void;
  icon?: React.ReactNode;
}

export function MembershipCard({
  name,
  description,
  pricePerMonth,
  originalPricePerMonth,
  savingsPerMonth,
  benefits,
  isPopular,
  isCurrent,
  buyLabel = "Mua gói 1 tháng",
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
      {isCurrent ? (
        <div className="absolute top-0 left-4 -translate-y-1/2 bg-[#00b2a9] text-white text-[11px] font-extrabold px-3 py-1 rounded-sm shadow-sm">
          Gói hiện tại
        </div>
      ) : isPopular ? (
        <div className="absolute top-0 left-4 -translate-y-1/2 bg-[#ffb700] text-gray-900 text-[11px] font-extrabold px-3 py-1 rounded-sm shadow-sm">
          Bán chạy nhất
        </div>
      ) : null}
      
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
        
        <div className="mb-6">
          <button
            onClick={onBuy}
            disabled={isCurrent}
            className={`w-full py-2.5 rounded-lg text-[13px] font-bold transition-colors text-center ${
              isCurrent
                ? "border border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                : "border border-[#e03c31] bg-[#e03c31] text-white hover:bg-[#c9362c]"
            }`}
          >
            {isCurrent ? "Đang sử dụng" : buyLabel}
          </button>
        </div>
        
        <div className="text-[13px]">
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-3">Quyền lợi</p>
          <ul className="space-y-2.5">
            {benefits.map((b, idx) => (
              <li key={idx} className="flex items-start gap-2 text-gray-700 font-medium text-[13px]">
                <span className="w-4 h-4 rounded text-[#00b2a9] border border-[#00b2a9] flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">✓</span>
                <span dangerouslySetInnerHTML={{ __html: b }}></span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
