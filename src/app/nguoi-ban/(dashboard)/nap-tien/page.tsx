"use client";

import { useEffect, useState } from "react";
import { SellerHeader } from "../../_components/SellerHeader";
import { QrCode, Building2, CreditCard, Globe, Wallet, CheckCircle2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { getPaymentMethods, type PaymentMethod } from "@/services/wallet";

const methodConfig: Record<string, { icon: React.ReactNode; popular?: boolean }> = {
  vnpay: {
    icon: <QrCode className="w-8 h-8 text-[#009ba1]" strokeWidth={1.5} />,
    popular: true,
  },
  qr: {
    icon: <QrCode className="w-8 h-8 text-[#009ba1]" strokeWidth={1.5} />,
    popular: true,
  },
  bank: {
    icon: <Building2 className="w-8 h-8 text-blue-600" strokeWidth={1.5} />,
    popular: false,
  },
  atm: {
    icon: <CreditCard className="w-8 h-8 text-gray-700" strokeWidth={1.5} />,
    popular: false,
  },
  international: {
    icon: <Globe className="w-8 h-8 text-indigo-600" strokeWidth={1.5} />,
    popular: false,
  },
  momo: {
    icon: <Wallet className="w-8 h-8 text-pink-600" strokeWidth={1.5} />,
    popular: false,
  },
  installment: {
    icon: <CheckCircle2 className="w-8 h-8 text-orange-500" strokeWidth={1.5} />,
    popular: false,
  },
};

function getMethodDetails(code: string, type: string) {
  const normalized = code.toLowerCase();
  const config = methodConfig[normalized];
  if (config) return config;

  if (type === "gateway") {
    return {
      icon: <QrCode className="w-8 h-8 text-[#009ba1]" strokeWidth={1.5} />,
      popular: false,
    };
  }
  return {
    icon: <Wallet className="w-8 h-8 text-gray-600" strokeWidth={1.5} />,
    popular: false,
  };
}

export default function RechargePage() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    async function loadMethods() {
      setLoading(true);
      setError(null);
      try {
        const data = await getPaymentMethods();
        if (!ignore) {
          setMethods(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!ignore) {
          const error = err as { message?: string };
          setError(error.message || "Không thể tải danh sách phương thức thanh toán.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadMethods();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <>
      <SellerHeader title="Nạp tiền" />
      <main className="flex-1 overflow-y-auto p-6 lg:p-8 xl:p-10 pb-20 bg-white">
        <div className="max-w-[720px] mx-auto mt-4">
          <div className="mb-8">
            <h2 className="text-[28px] font-bold text-gray-900 mb-2 tracking-tight">Nạp tiền vào tài khoản</h2>
            <p className="text-gray-600 text-base">Bạn hãy chọn một trong các hình thức thanh toán dưới đây</p>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center justify-between p-5 rounded-xl border border-gray-100 bg-white animate-pulse">
                  <div className="flex items-center gap-5 w-full">
                    <div className="w-14 h-14 rounded-full bg-gray-100 shrink-0"></div>
                    <div className="space-y-2 w-full max-w-[240px]">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="w-6 h-6 bg-gray-100 rounded-full"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-6 text-center rounded-xl border border-red-100 bg-red-50 text-red-600 font-medium">
              {error}
            </div>
          ) : methods.length === 0 ? (
            <div className="p-12 text-center rounded-xl border border-gray-200 bg-gray-50 text-gray-500">
              Không tìm thấy phương thức thanh toán khả dụng.
            </div>
          ) : (
            <div className="space-y-4">
              {methods.map((method) => {
                const details = getMethodDetails(method.code, method.type);
                const title = method.name.toLowerCase().startsWith("thanh toán")
                  ? method.name
                  : `Thanh toán bằng ${method.name}`;

                return (
                  <Link
                    href={`/nguoi-ban/nap-tien/${method.code}`}
                    key={method.code}
                    className="group flex items-center justify-between p-5 rounded-xl border border-gray-200 hover:border-primary hover:shadow-[0_4px_20px_rgba(224,60,49,0.1)] transition-all cursor-pointer bg-white"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        {details.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-bold text-gray-900 text-[17px] group-hover:text-primary transition-colors">{title}</h3>
                          {details.popular && (
                            <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Phổ biến</span>
                          )}
                        </div>
                        {method.description && (
                          <p className="text-gray-500 text-sm">{method.description}</p>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </Link>
                );
              })}
            </div>
          )}

          <div className="mt-12 p-6 bg-[#fff6f6] rounded-xl border border-red-100">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 mt-1 shadow-sm text-red-500">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-base mb-1">Bạn cần hỗ trợ nạp tiền?</h4>
                <p className="text-gray-600 text-sm mb-3">Vui lòng liên hệ với nhân viên tư vấn hoặc gọi hotline để được hỗ trợ nhanh nhất.</p>
                <div className="flex items-center gap-4">
                  <a href="tel:19001881" className="font-bold text-primary flex items-center gap-1.5 hover:underline text-sm">
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
