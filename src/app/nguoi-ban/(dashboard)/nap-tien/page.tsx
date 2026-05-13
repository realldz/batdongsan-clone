import { SellerHeader } from "../../_components/SellerHeader";
import { QrCode, Building2, CreditCard, Globe, Wallet, CheckCircle2, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function RechargePage() {
  const paymentMethods = [
    {
      id: "qr",
      icon: <QrCode className="w-8 h-8 text-[#009ba1]" strokeWidth={1.5} />,
      title: "Thanh toán bằng mã QR",
      description: "Quét mã QR từ ứng dụng ngân hàng và ví điện tử",
      popular: true,
    },
    {
      id: "bank",
      icon: <Building2 className="w-8 h-8 text-blue-600" strokeWidth={1.5} />,
      title: "Chuyển khoản ngân hàng định danh",
      description: "Tài khoản định danh, nạp tiền nhanh chóng",
      popular: false,
    },
    {
      id: "atm",
      icon: <CreditCard className="w-8 h-8 text-gray-700" strokeWidth={1.5} />,
      title: "Thanh toán bằng thẻ ATM nội địa",
      description: "",
      popular: false,
    },
    {
      id: "international",
      icon: <Globe className="w-8 h-8 text-indigo-600" strokeWidth={1.5} />,
      title: "Thanh toán bằng thẻ quốc tế, Apple Pay, Google Pay",
      description: "",
      popular: false,
    },
    {
      id: "momo",
      icon: <Wallet className="w-8 h-8 text-pink-600" strokeWidth={1.5} />,
      title: "Thanh toán bằng ví MoMo",
      description: "",
      popular: false,
    },
    {
      id: "installment",
      icon: <CheckCircle2 className="w-8 h-8 text-orange-500" strokeWidth={1.5} />,
      title: "Trả góp qua thẻ tín dụng (Visa, Master, JCB)",
      description: "",
      popular: false,
    },
  ];

  return (
    <>
      <SellerHeader title="Nạp tiền" />
      <main className="flex-1 overflow-y-auto p-6 lg:p-8 xl:p-10 pb-20 bg-white">
        <div className="max-w-[720px] mx-auto mt-4">
          <div className="mb-8">
            <h2 className="text-[28px] font-bold text-gray-900 mb-2 tracking-tight">Nạp tiền vào tài khoản</h2>
            <p className="text-gray-600 text-base">Bạn hãy chọn một trong các hình thức thanh toán dưới đây</p>
          </div>

          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <Link 
                href={`/nguoi-ban/nap-tien/${method.id}`} 
                key={method.id}
                className="group flex items-center justify-between p-5 rounded-xl border border-gray-200 hover:border-[#e03c31] hover:shadow-[0_4px_20px_rgba(224,60,49,0.1)] transition-all cursor-pointer bg-white"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    {method.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-gray-900 text-[17px] group-hover:text-[#e03c31] transition-colors">{method.title}</h3>
                      {method.popular && (
                        <span className="bg-[#e03c31] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Phổ biến</span>
                      )}
                    </div>
                    {method.description && (
                      <p className="text-gray-500 text-sm">{method.description}</p>
                    )}
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-[#e03c31] group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>

          <div className="mt-12 p-6 bg-[#fff6f6] rounded-xl border border-red-100">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 mt-1 shadow-sm text-red-500">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-base mb-1">Bạn cần hỗ trợ nạp tiền?</h4>
                <p className="text-gray-600 text-sm mb-3">Vui lòng liên hệ với nhân viên tư vấn hoặc gọi hotline để được hỗ trợ nhanh nhất.</p>
                <div className="flex items-center gap-4">
                  <a href="tel:19001881" className="font-bold text-[#e03c31] flex items-center gap-1.5 hover:underline text-sm">
                    📞 1900 1881
                  </a>
                  <a href="mailto:hotro@batdongsan.com.vn" className="font-bold text-gray-700 flex items-center gap-1.5 hover:underline text-sm">
                    ✉️ hotro@batdongsan.com.vn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
