import { Suspense } from "react";
import { SellerHeader } from "../../_components/SellerHeader";
import { TaiKhoanContent } from "./_components/TaiKhoanContent";

export const metadata = {
  title: "Quản lý tài khoản | Batdongsan",
  description: "Quản lý thông tin cá nhân và cài đặt tài khoản",
};

export default function TaiKhoanPage() {
  return (
    <>
      <SellerHeader title="Quản lý tài khoản" />
      <Suspense
        fallback={
          <main className="flex-1 overflow-y-auto p-6 lg:p-8 xl:p-10 pb-20">
            <div className="max-w-[720px] mx-auto animate-pulse">
              <div className="flex items-center gap-2 mb-8 border-b border-gray-200 pb-3">
                <div className="w-44 h-10 bg-gray-200 rounded-full" />
                <div className="w-44 h-10 bg-gray-200 rounded-full" />
                <div className="w-56 h-10 bg-gray-200 rounded-full" />
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
                <div className="h-5 bg-gray-200 rounded w-1/3" />
                <div className="h-10 bg-gray-200 rounded" />
                <div className="h-10 bg-gray-200 rounded" />
                <div className="h-10 bg-gray-200 rounded" />
              </div>
            </div>
          </main>
        }
      >
        <TaiKhoanContent />
      </Suspense>
    </>
  );
}
