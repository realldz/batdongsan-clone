import { Bell, Download, Search } from "lucide-react";

export interface AdminHeaderProps {
  title: string;
  description: string;
  actions?: React.ReactNode;
}

export function AdminHeader({ title, description, actions }: AdminHeaderProps) {
  return (
    <header className="h-[72px] bg-white border-b border-gray-200 shrink-0 sticky top-0 z-10 flex items-center justify-between px-5 lg:px-7">
      <div className="min-w-0">
        <h1 className="text-[22px] font-extrabold tracking-tight text-gray-900 truncate">{title}</h1>
        <p className="text-xs font-medium text-gray-500 mt-1 truncate">{description}</p>
      </div>

      <div className="hidden md:flex items-center gap-3">
        <div className="relative w-[280px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            aria-label="Tìm nhanh"
            placeholder="Tìm nhanh trong admin"
            className="w-full h-10 rounded-full border border-gray-200 bg-gray-50 pl-9 pr-4 text-sm font-medium outline-none focus:border-[#e03c31] focus:bg-white"
          />
        </div>
        {actions || (
          <button className="h-10 px-4 rounded-full bg-gray-900 text-white text-sm font-bold hover:bg-black transition-colors flex items-center gap-2 cursor-pointer">
            <Download className="w-4 h-4" />
            Xuất báo cáo
          </button>
        )}
        <button className="w-10 h-10 rounded-full border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors relative flex items-center justify-center cursor-pointer">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#e03c31] border border-white" />
        </button>
        <div className="w-10 h-10 rounded-full bg-[#e03c31] text-white flex items-center justify-center font-extrabold shadow-sm select-none">
          A
        </div>
      </div>
    </header>
  );
}
