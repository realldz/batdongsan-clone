"use client";

import { SellerHeader } from "../../../_components/SellerHeader";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { depositWallet } from "@/services/wallet";
import { useRefreshWallet } from "@/lib/use-wallet-balance";
import { useState, use } from "react";

export default function RechargeDetailPage({ params }: { params: Promise<{ methodId: string }> }) {
  const resolvedParams = use(params);
  const { methodId } = resolvedParams;

  const [amount, setAmount] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [needInvoice, setNeedInvoice] = useState(false);
  const [selectedBank, setSelectedBank] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const quickAmounts = [
    { value: 500000, label: "500.000 đ", bonus: 0 },
    { value: 1000000, label: "1.000.000 đ", bonus: 0 },
    { value: 2000000, label: "2.000.000 đ", bonus: 185185 },
    { value: 3000000, label: "3.000.000 đ", bonus: 277778 },
    { value: 5000000, label: "5.000.000 đ", bonus: 601851 },
    { value: 10000000, label: "10.000.000 đ", bonus: 1203704 },
  ];

  const banks = [
    "Vietcombank", "TechcomBank", "ACB", "BIDV", "Vietinbank", "VPBank",
    "SacomBank", "Agribank", "TPBank", "Đông Á", "VIB", "HDBank", "MBBank"
  ];

  // Map methodId to Title
  const methodTitles: Record<string, string> = {
    qr: "Thanh toán bằng mã QR",
    bank: "Chuyển khoản ngân hàng định danh",
    atm: "Thẻ ATM nội địa",
    international: "Thẻ quốc tế",
    momo: "Ví MoMo",
    installment: "Trả góp qua thẻ tín dụng"
  };

  const currentTitle = methodTitles[methodId] || "Nạp tiền";
  const parsedAmount = Number(amount.replace(/[^\d]/g, ""));
  const refreshWallet = useRefreshWallet();

  const handleSubmit = async () => {
    if (!agreed || !parsedAmount || (methodId === "atm" && !selectedBank)) {
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      await depositWallet({ amount: parsedAmount, method: methodId });
      setSubmitMessage("Đã gửi yêu cầu nạp tiền tới API.");
      refreshWallet();
    } catch {
      setSubmitMessage("Chưa thể gửi API, vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SellerHeader title="Nạp tiền" />
      <main className="flex-1 overflow-y-auto p-6 lg:p-8 xl:p-10 pb-20 bg-[#f2f2f2]">
        <div className="max-w-[720px] mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center gap-4 p-6 border-b border-gray-200">
            <Link href="/nguoi-ban/nap-tien" className="p-2 hover:bg-gray-100 rounded-full transition-colors -ml-2 text-gray-500">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h2 className="text-xl font-bold text-gray-900">{currentTitle}</h2>
          </div>

          <div className="p-6 md:p-8">
            {/* Amount Input */}
            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-900 mb-2">Nhập số tiền bạn muốn nạp (đ) *</label>
              <div className="relative">
                <input 
                  type="text" 
                  className="w-full h-12 px-4 rounded border border-gray-300 focus:outline-none focus:border-primary text-base transition-colors font-medium"
                  placeholder="Vd: 2,000,000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="flex items-start gap-2 mt-3 p-3 bg-red-50 rounded text-sm text-primary">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="font-medium">Nạp từ 2.000.000 đ để được nhận khuyến mãi</span>
              </div>
            </div>

            {/* Quick Amounts */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600 font-medium">Hoặc chọn nhanh</span>
                <Link href="#" className="text-sm text-primary font-bold hover:underline">Xem tất cả ưu đãi</Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {quickAmounts.map((q) => (
                  <button 
                    key={q.value}
                    onClick={() => setAmount(q.value.toString())}
                    className="flex flex-col items-center justify-center py-3 px-2 rounded-lg border border-gray-200 hover:border-primary hover:bg-red-50 transition-colors"
                  >
                    <span className="font-bold text-gray-900 mb-0.5">{q.label}</span>
                    {q.bonus > 0 && (
                      <span className="text-[11px] font-bold text-primary">Tặng: {q.bonus.toLocaleString('vi-VN')} đ</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Bank Selection - Only for ATM */}
            {methodId === 'atm' && (
              <div className="mb-8 border-t border-gray-100 pt-8">
                <h3 className="font-bold text-gray-900 mb-1">Chọn ngân hàng</h3>
                <p className="text-sm text-gray-500 mb-4">Thẻ ATM nội địa của bạn phải có hỗ trợ Internet Banking</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {banks.map((bank) => (
                    <button 
                      key={bank}
                      onClick={() => setSelectedBank(bank)}
                      className={`h-12 border rounded flex items-center justify-center text-xs font-bold transition-colors ${selectedBank === bank ? 'border-primary text-primary bg-red-50' : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'}`}
                    >
                      {bank}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Invoice Toggle */}
            <div className="mb-8 border-t border-gray-100 pt-8">
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="font-bold text-gray-900">Xuất hóa đơn cho giao dịch</span>
                <div className={`relative w-11 h-6 rounded-full transition-colors ${needInvoice ? 'bg-primary' : 'bg-gray-300'}`} onClick={() => setNeedInvoice(!needInvoice)}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${needInvoice ? 'left-6' : 'left-1'}`}></div>
                </div>
              </label>
              
              {needInvoice && (
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Họ tên người mua hàng</label>
                    <input type="text" className="w-full h-10 px-3 rounded border border-gray-300 focus:border-primary focus:outline-none text-sm" defaultValue="Long Ngô Tiến" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Email nhận hóa đơn</label>
                    <input type="email" className="w-full h-10 px-3 rounded border border-gray-300 focus:border-primary focus:outline-none text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Tên đơn vị (Tên công ty)</label>
                    <input type="text" className="w-full h-10 px-3 rounded border border-gray-300 focus:border-primary focus:outline-none text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Mã số thuế</label>
                    <input type="text" className="w-full h-10 px-3 rounded border border-gray-300 focus:border-primary focus:outline-none text-sm" />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Địa chỉ</label>
                    <input type="text" className="w-full h-10 px-3 rounded border border-gray-300 focus:border-primary focus:outline-none text-sm" defaultValue="Việt Nam" />
                  </div>
                </div>
              )}
            </div>

            {/* Terms and Info */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg text-xs text-gray-600 leading-relaxed space-y-2 border border-gray-100">
              <p>• Batdongsan.com.vn sẽ xuất Hóa đơn điện tử tự động theo thông tin khách hàng cung cấp và gửi về Email nhận hóa đơn. Quý khách vui lòng nhập đầy đủ, chính xác và chịu trách nhiệm về những thông tin đã cung cấp.</p>
              <p>• Hoá đơn GTGT sẽ được xuất trong ngày và cho tất cả các giao dịch nộp tiền.</p>
              <p>• Nội dung dịch vụ được thể hiện trên hoá đơn là Phí dịch vụ quảng cáo trên website batdongsan.com.vn.</p>
              <p>• Mọi vấn đề cần hỗ trợ về hoá đơn của giao dịch nộp tiền trong ngày, vui lòng liên hệ hotline <span className="font-bold text-primary">1900 1881</span> trước 18h.</p>
              
              <div className="pt-2 mt-2 border-t border-gray-200">
                <p className="font-bold text-gray-900 mb-1">Thời hạn sử dụng tiền trong tài khoản:</p>
                <p>• Tài khoản chính: 12 tháng</p>
                <p>• Tài khoản khuyến mãi: Tối đa 6 tháng</p>
                <Link href="#" className="text-[#009ba1] hover:underline inline-block mt-1 font-medium">Thông tin chi tiết xem tại Quy định về tiền trong tài khoản</Link>
              </div>
            </div>

            {submitMessage && (
              <div className="mb-6 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-primary">
                {submitMessage}
              </div>
            )}

            {/* Submit Action */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
              <label className="flex items-center gap-2 cursor-pointer group w-full sm:w-auto">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-[#e03c31]"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Tôi đã đọc và đồng ý</span>
              </label>
              
              <button 
                disabled={isSubmitting || !agreed || !parsedAmount || (methodId === 'atm' && !selectedBank)}
                onClick={handleSubmit}
                className="w-full sm:w-auto min-w-[160px] h-[44px] rounded font-bold text-white transition-colors flex items-center justify-center px-8 disabled:bg-gray-300 disabled:cursor-not-allowed bg-primary hover:bg-primary-hover"
              >
                {isSubmitting ? "Đang gửi..." : "Tiếp tục"}
              </button>
            </div>

          </div>
        </div>
      </main>
    </>
  );
}
