"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { handleReturnPayment } from "@/services/wallet";
import { Loader2, CheckCircle2, XCircle, History, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

type PaymentStatus = "processing" | "success" | "failure";

export default function ReturnPaymentClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<PaymentStatus>("processing");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [countdown, setCountdown] = useState<number>(2);
  const effectRan = useRef(false);

  // Extract query parameters for displaying receipt details
  const rawAmount = searchParams.get("vnp_Amount") || searchParams.get("amount");
  let displayAmount = "";
  if (rawAmount) {
    let amountVal = parseFloat(rawAmount);
    // VNPay amount is multiplied by 100
    if (searchParams.get("vnp_Amount")) {
      amountVal = amountVal / 100;
    }
    displayAmount = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amountVal);
  }

  const txnRef =
    searchParams.get("vnp_TxnRef") ||
    searchParams.get("txnRef") ||
    searchParams.get("id") ||
    "N/A";

  const bankCode = searchParams.get("vnp_BankCode") || searchParams.get("bankCode");
  const payDateRaw = searchParams.get("vnp_PayDate");
  let displayDate = "";
  if (payDateRaw && payDateRaw.length === 14) {
    // Format VNPay payDate yyyyMMddHHmmss
    const year = payDateRaw.slice(0, 4);
    const month = payDateRaw.slice(4, 6);
    const day = payDateRaw.slice(6, 8);
    const hour = payDateRaw.slice(8, 10);
    const minute = payDateRaw.slice(10, 12);
    const second = payDateRaw.slice(12, 14);
    displayDate = `${day}/${month}/${year} ${hour}:${minute}:${second}`;
  } else {
    displayDate = new Date().toLocaleString("vi-VN");
  }

  useEffect(() => {
    // React strict mode runs effects twice in dev. This ref guard ensures the callback is only processed once.
    if (effectRan.current) return;
    effectRan.current = true;

    const processPayment = async () => {
      try {
        const queryParams = searchParams.toString();
        // Call wallet service return API
        await handleReturnPayment(queryParams);
        setStatus("success");

        // Start countdown to redirect
        const interval = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              router.push("/nguoi-ban/lich-su-giao-dich");
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        return () => clearInterval(interval);
      } catch (err: unknown) {
        console.error("Payment return handler error:", err);
        setStatus("failure");
        const msg = err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định trong quá trình xử lý giao dịch.";
        setErrorMessage(msg);
      }
    };

    processPayment();
  }, [searchParams, router]);

  return (
    <div className="max-w-md w-full mx-auto px-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden transition-all duration-300">

        {/* Processing State */}
        {status === "processing" && (
          <div className="p-8 text-center flex flex-col items-center">
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center animate-pulse">
                <Loader2 className="w-10 h-10 animate-spin text-secondary" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Đang xử lý thanh toán</h3>
            <p className="text-gray-500 text-sm max-w-xs mb-6">
              Vui lòng không đóng trình duyệt hoặc tải lại trang trong khi hệ thống xác nhận giao dịch.
            </p>
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-secondary h-full animate-[loading_2s_infinite_linear] rounded-full w-1/3"></div>
            </div>
          </div>
        )}

        {/* Success State */}
        {status === "success" && (
          <div className="flex flex-col">
            <div className="p-8 text-center flex flex-col items-center border-b border-gray-50 bg-emerald-50/20">
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-5 animate-bounce">
                <CheckCircle2 className="w-12 h-12 text-emerald-500" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Thanh toán thành công!</h3>
              <p className="text-gray-500 text-sm max-w-xs">
                Tài khoản của bạn đã được cộng số tiền tương ứng.
              </p>
              {displayAmount && (
                <div className="mt-4 text-3xl font-extrabold text-emerald-600">
                  {displayAmount}
                </div>
              )}
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-3 text-sm text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex justify-between">
                  <span className="font-medium">Mã giao dịch:</span>
                  <span className="font-bold text-gray-900 break-all">{txnRef}</span>
                </div>
                {bankCode && (
                  <div className="flex justify-between">
                    <span className="font-medium">Ngân hàng:</span>
                    <span className="font-bold text-gray-900">{bankCode}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="font-medium">Thời gian:</span>
                  <span className="text-gray-900">{displayDate}</span>
                </div>
              </div>

              <div className="text-center text-xs text-gray-500 font-medium py-1">
                Tự động chuyển hướng tới Lịch sử giao dịch sau <span className="text-primary font-bold text-sm mx-1">{countdown}</span> giây...
              </div>

              <div className="flex gap-3">
                <Link
                  href="/nguoi-ban/lich-su-giao-dich"
                  className="flex-1 h-11 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  <History className="w-4 h-4" />
                  Xem lịch sử
                </Link>
                <Link
                  href="/"
                  className="h-11 px-4 border border-gray-200 hover:border-gray-300 text-gray-600 rounded-xl font-medium text-sm flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Home className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Failure State */}
        {status === "failure" && (
          <div className="flex flex-col">
            <div className="p-8 text-center flex flex-col items-center border-b border-gray-50 bg-red-50/20">
              <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-5 animate-pulse">
                <XCircle className="w-12 h-12 text-red-500" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Thanh toán thất bại</h3>
              <p className="text-gray-500 text-sm max-w-xs">
                Giao dịch của bạn không được hoàn tất do sự cố.
              </p>
              {displayAmount && (
                <div className="mt-4 text-2xl font-bold text-red-600 line-through">
                  {displayAmount}
                </div>
              )}
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-700">
                <p className="font-bold mb-1">Chi tiết lỗi:</p>
                <p className="font-medium">{errorMessage}</p>
              </div>

              <div className="space-y-3 text-sm text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex justify-between">
                  <span className="font-medium">Mã tham chiếu:</span>
                  <span className="font-mono text-gray-900 break-all">{txnRef}</span>
                </div>
                {bankCode && (
                  <div className="flex justify-between">
                    <span className="font-medium">Phương thức thanh toán:</span>
                    <span className="font-bold text-gray-900">{bankCode}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Link
                  href="/nguoi-ban/nap-tien"
                  className="h-11 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  <RefreshCw className="w-4 h-4" />
                  Thử nạp tiền lại
                </Link>
                <div className="flex gap-2">
                  <Link
                    href="/nguoi-ban/lich-su-giao-dich"
                    className="flex-1 h-11 border border-gray-200 hover:border-gray-300 text-gray-600 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    Xem lịch sử
                  </Link>
                  <Link
                    href="/"
                    className="h-11 px-4 border border-gray-200 hover:border-gray-300 text-gray-600 rounded-xl font-medium text-sm flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Home className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      <style jsx global>{`
        @keyframes loading {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(300%);
          }
        }
      `}</style>
    </div>
  );
}
