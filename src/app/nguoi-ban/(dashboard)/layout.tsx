import { SellerSidebar } from "../_components/SellerSidebar";
import { WalletRefreshProvider } from "@/lib/use-wallet-balance";

export const metadata = {
  title: "Trang dành cho người bán | Batdongsan",
  description: "Trang quản lý tin đăng dành cho người bán",
};

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WalletRefreshProvider>
      <div className="flex h-screen bg-[#f2f2f2] text-[13px] font-sans antialiased overflow-hidden selection:bg-red-100 selection:text-red-900">
        <SellerSidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-0">
          {children}
        </div>
      </div>
    </WalletRefreshProvider>
  );
}
