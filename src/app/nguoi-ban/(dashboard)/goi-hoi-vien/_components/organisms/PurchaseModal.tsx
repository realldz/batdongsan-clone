import { X, AlertTriangle } from "lucide-react";
import { useState } from "react";

export interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageName: string;
  pricePerMonth: number;
  originalPricePerMonth: number;
  onConfirm: (duration: number, total: number) => void;
}

export function PurchaseModal({
  isOpen,
  onClose,
  packageName,
  pricePerMonth,
  originalPricePerMonth,
  onConfirm
}: PurchaseModalProps) {
  const [duration, setDuration] = useState<number>(1);
  
  if (!isOpen) return null;
  
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " đ";
  };
  
  const getSavings = (months: number) => {
    return (originalPricePerMonth - pricePerMonth) * months;
  };
  
  const getTotal = (months: number) => {
    return pricePerMonth * months;
  };

  const renderOption = (months: number) => {
    const isSelected = duration === months;
    return (
      <div 
        onClick={() => setDuration(months)}
        className={`relative rounded-lg border p-4 cursor-pointer transition-colors ${isSelected ? "border-[#e03c31] bg-red-50" : "border-gray-200 hover:border-gray-300"}`}
      >
        <div className="flex justify-between items-center mb-1">
          <span className={`font-bold text-[13px] ${isSelected ? "text-[#e03c31]" : "text-gray-900"}`}>{months} Tháng</span>
          <span className="text-[10px] font-bold text-[#e03c31] bg-red-100 px-1.5 py-0.5 rounded">-{(1 - pricePerMonth/originalPricePerMonth)*100}% so với mua lẻ</span>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <span className="text-[15px] font-extrabold text-gray-900 mr-2">{formatMoney(getTotal(months))}</span>
            <span className="text-[11px] text-gray-500 line-through">{formatMoney(originalPricePerMonth * months)}</span>
          </div>
          <span className="text-[11px] font-bold text-[#00b2a9]">Tiết kiệm {formatMoney(getSavings(months))}/tháng</span>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-[420px] mx-4 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-[15px] font-extrabold text-gray-900">Mua Gói Hội viên</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-1 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="p-5 overflow-y-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center shrink-0">
              <span className="text-2xl">🏠</span>
            </div>
            <div>
              <h3 className="text-[13px] font-extrabold text-gray-900">{packageName}</h3>
              <p className="text-[11px] text-[#e03c31] font-bold">Từ {formatMoney(pricePerMonth)}/tháng <span className="text-gray-500 font-medium">(chưa bao gồm VAT)</span></p>
            </div>
          </div>
          
          <h4 className="text-[13px] font-bold text-gray-700 mb-3 flex items-center justify-between">
            Chọn thời gian
            <span className="text-[11px] font-medium text-gray-500">Giá bên dưới chưa bao gồm 8% VAT</span>
          </h4>
          
          <div className="space-y-3 mb-6">
            {renderOption(1)}
            {renderOption(3)}
            {renderOption(6)}
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2.5 text-amber-800">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
            <div className="text-[11px] leading-relaxed flex-1">
              <p className="font-bold mb-1.5">Tài khoản Chính của bạn không đủ tiền thanh toán</p>
              <button className="bg-[#e03c31] text-white px-3 py-1.5 rounded-md font-bold hover:bg-[#c9362c] transition-colors shadow-sm">Nạp tiền</button>
            </div>
          </div>
        </div>
        
        <div className="p-5 border-t border-gray-100 bg-white">
          <button className="w-full mb-4 flex items-center justify-between text-[13px] font-bold text-gray-700 border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
            <span className="flex items-center gap-2"><span className="text-red-500">🎟️</span> Khuyến mãi</span>
            <span className="text-gray-400 font-medium flex items-center gap-1">Chọn khuyến mãi <span className="text-[10px]">›</span></span>
          </button>
          
          <div className="flex justify-between items-center mb-4">
            <span className="text-[13px] text-gray-600 font-bold">Tổng tiền</span>
            <span className="text-[20px] font-extrabold text-[#e03c31]">{formatMoney(getTotal(duration))}</span>
          </div>
          <button 
            onClick={() => onConfirm(duration, getTotal(duration))}
            className="w-full py-3.5 rounded-lg bg-[#fca5a5] cursor-not-allowed text-white text-[13px] font-bold transition-colors"
            // Mocking disabled state since balance is insufficient
          >
            Thanh Toán
          </button>
        </div>
      </div>
    </div>
  );
}
