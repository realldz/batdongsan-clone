export function MembershipBanner() {
  return (
    <div className="bg-[#931010] rounded-xl overflow-hidden relative p-8 text-white min-h-[220px] flex flex-col justify-center shadow-sm">
      {/* Decor block to resemble the building graphic on the right */}
      <div className="absolute right-0 bottom-0 opacity-80 pointer-events-none hidden md:block">
        <svg width="300" height="200" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="220" y="80" width="40" height="120" fill="#fca5a5" />
          <rect x="230" y="90" width="6" height="6" fill="#fff" opacity="0.8" />
          <rect x="244" y="90" width="6" height="6" fill="#fff" opacity="0.8" />
          <rect x="230" y="110" width="6" height="6" fill="#fff" opacity="0.8" />
          <rect x="244" y="110" width="6" height="6" fill="#fff" opacity="0.8" />
          <rect x="150" y="120" width="60" height="80" fill="#f87171" />
          <rect x="160" y="130" width="6" height="6" fill="#fff" opacity="0.8" />
          <rect x="170" y="130" width="6" height="6" fill="#fff" opacity="0.8" />
          <rect x="180" y="130" width="6" height="6" fill="#fff" opacity="0.8" />
          <path d="M120 200 L160 140 L200 200 Z" fill="#ef4444" />
        </svg>
      </div>
      
      <div className="relative z-10 max-w-2xl">
        <h1 className="text-[28px] font-extrabold mb-4 tracking-tight text-white">Gói Hội viên - Tiết kiệm đến 39%</h1>
        
        <div className="flex items-center gap-3">
          <span className="bg-[#e03c31] text-white text-[10px] font-bold px-2 py-0.5 rounded border border-[#e03c31] uppercase">Mới</span>
          <span className="text-[13px] font-bold text-white bg-white/10 px-3 py-1 rounded-full">Ra mắt lựa chọn - Gói 1 tháng</span>
        </div>
        
        <ul className="mt-6 space-y-2.5 text-[13px] text-red-50 font-medium">
          <li className="flex items-center gap-2.5">
            <span className="w-1 h-1 rounded-full bg-white opacity-50 shrink-0"></span>
            Bậc càng cao, tin đăng được đẩy càng thường xuyên
          </li>
          <li className="flex items-center gap-2.5">
            <span className="w-1 h-1 rounded-full bg-white opacity-50 shrink-0"></span>
            Ưu tiên hiển thị cao hơn, tiếp cận nhiều khách hàng hơn
          </li>
          <li className="flex items-center gap-2.5">
            <span className="w-1 h-1 rounded-full bg-white opacity-50 shrink-0"></span>
            Ba hạng Bạc, Vàng, Kim cương phù hợp mọi nhu cầu
          </li>
        </ul>
        <p className="mt-6 text-[11px] text-red-200/80 italic font-medium">Giá của các gói bên dưới chưa bao gồm 8% VAT.</p>
      </div>
    </div>
  );
}
