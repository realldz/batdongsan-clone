import { AdminSidebar } from "./_components/organisms/AdminSidebar";

export const metadata = {
  title: "Admin | Batdongsan",
  description: "Giao diện quản trị mock cho Batdongsan clone",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#f2f2f2] text-[13px] font-sans antialiased selection:bg-red-100 selection:text-red-900">
      <AdminSidebar />
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">{children}</div>
    </div>
  );
}
