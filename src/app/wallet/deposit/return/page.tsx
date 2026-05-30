import { Suspense } from "react";
import ReturnPaymentClient from "./ReturnPaymentClient";
import { PublicPageLayout } from "@/components/templates";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Xử lý thanh toán - Batdongsan.com.vn",
  description: "Trang xử lý kết quả giao dịch nạp tiền vào tài khoản.",
};

export default function ReturnPaymentPage() {
  return (
    <PublicPageLayout className="bg-[#f1f5f9] py-12 flex items-center justify-center min-h-[calc(100vh-160px)]">
      <Suspense
        fallback={
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 max-w-md w-full text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Đang tải thông tin...</h3>
            <p className="text-gray-500 text-sm">Vui lòng chờ trong giây lát.</p>
          </div>
        }
      >
        <ReturnPaymentClient />
      </Suspense>
    </PublicPageLayout>
  );
}
