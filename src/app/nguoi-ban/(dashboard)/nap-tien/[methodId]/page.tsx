"use client";

import { SellerHeader } from "../../../_components/SellerHeader";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { createPaymentUrl } from "@/services/wallet";
import { useState, use } from "react";

export default function RechargeDetailPage({ params }: { params: Promise<{ methodId: string }> }) {
  const resolvedParams = use(params);
  const { methodId } = resolvedParams;

  const [amount, setAmount] = useState("");
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

  const handleSubmit = async () => {
    if (!parsedAmount || (methodId === "atm" && !selectedBank)) {
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const { paymentUrl } = await createPaymentUrl(methodId, parsedAmount);
      setSubmitMessage("Đang chuyển hướng tới cổng thanh toán...");
      window.location.href = paymentUrl;
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



            {submitMessage && (
              <div className="mb-6 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-primary">
                {submitMessage}
              </div>
            )}

            {/* Submit Action */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                disabled={isSubmitting || !parsedAmount || (methodId === 'atm' && !selectedBank)}
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
