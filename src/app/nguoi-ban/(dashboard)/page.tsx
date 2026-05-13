"use client";

import { SellerHeader } from "../_components/SellerHeader";
import {
  LayoutList,
  Crown,
  EyeOff,
  AlertCircle,
  Info,
  Lightbulb,
  ChevronRight,
  Image as ImageIcon,
  User,
  Plus,
  PhoneCall,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useWalletBalance } from "@/lib/use-wallet-balance";
import { useAuth } from "@/lib/auth-store";
import { searchProperties, type Property } from "@/services/properties";
import { searchLeads } from "@/services/leads";
import { apiLeadToView, unwrapArray, type LeadView } from "@/lib/api-adapters";
import { StatusBadge } from "@/app/admin/_components/AdminUi";

const leadStatusTone = (status: string) => {
  if (status === "new") return "blue" as const;
  if (status === "contacted") return "amber" as const;
  if (status === "qualified") return "green" as const;
  return "gray" as const;
};

export default function OverviewPage() {
  const wallet = useWalletBalance();
  const { user } = useAuth();
  const [recentLeads, setRecentLeads] = useState<LeadView[]>([]);
  const [totalLeads, setTotalLeads] = useState(0);
  const [leadsLoading, setLeadsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadLeads() {
      setLeadsLoading(true);
      try {
        const propsResp = await searchProperties({ page: 1, perPage: 100 });
        const allProps = unwrapArray<Property>(propsResp);
        const myProps = user?.id ? allProps.filter((p) => p.host === user.id || p.user?.id === user.id) : [];

        if (myProps.length === 0) {
          if (!ignore) { setRecentLeads([]); setTotalLeads(0); }
          return;
        }

        const leadResults = await Promise.all(
          myProps.map((p) =>
            searchLeads({ propertyId: p.id, page: 1, perPage: 10 }).catch(() => ({
              leads: [],
              pagination: { page: 1, totalPages: 0, total: 0, perPage: 10 },
            }))
          )
        );

        const allLeads = leadResults.flatMap((r) => r.leads.map(apiLeadToView));
        const total = leadResults.reduce((sum, r) => sum + r.pagination.total, 0);

        if (!ignore) {
          setRecentLeads(allLeads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 10));
          setTotalLeads(total);
        }
      } catch {
        if (!ignore) { setRecentLeads([]); setTotalLeads(0); }
      } finally {
        if (!ignore) setLeadsLoading(false);
      }
    }

    loadLeads();
    return () => { ignore = true; };
  }, [user?.id]);

  const statusLabel = (s: string) => ({ new: "Mới", contacted: "Đã liên hệ", qualified: "Tiềm năng", lost: "Mất" } as const)[s] ?? s;

  return (
    <>
      <SellerHeader title="Tổng quan" />
      <main className="flex-1 overflow-y-auto p-6 lg:p-8 xl:p-10 space-y-8 pb-20 scroll-smooth">
        {/* Tổng quan tài khoản */}
        <section>
          <h2 className="text-[22px] font-bold text-gray-900 mb-5 tracking-tight">Tổng quan tài khoản</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Box Số dư */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between hover:border-gray-300 transition-colors h-[180px]">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-gray-500 font-medium text-sm">Số dư</div>
                  <div className="text-2xl font-extrabold text-gray-900">{wallet.total}</div>
                </div>
                <div className="space-y-1.5 mt-4 text-sm">
                  <div className="flex justify-between items-center text-gray-600">
                    <span>Tài khoản chính</span>
                    <span className="font-bold text-gray-900">{wallet.main}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-600">
                    <span>Tài khoản khuyến mãi</span>
                    <span className="font-bold text-gray-900">{wallet.promotion}</span>
                  </div>
                </div>
              </div>
              <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                <Link href="#" className="text-gray-600 font-medium hover:text-gray-900 transition-colors text-sm">
                  Mã nạp tiền: <span className="font-bold">{wallet.code}</span>
                </Link>
                <Link href="/nguoi-ban/nap-tien" className="bg-red-50 text-[#e03c31] px-4 py-1.5 rounded-full font-bold hover:bg-red-100 transition-colors text-sm">
                  Nạp tiền
                </Link>
              </div>
            </div>

            {/* Tin đăng card */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between hover:border-gray-300 transition-colors h-[180px]">
              <div>
                <div className="flex items-center gap-2 text-gray-800 mb-3 font-bold">
                  <LayoutList className="w-[18px] h-[18px] stroke-[2.5]" />
                  <span>Tin đăng</span>
                </div>
                <div className="text-[28px] font-extrabold text-gray-900 leading-none">0 tin</div>
                <div className="text-gray-500 font-medium mt-1.5">Đang hiển thị</div>
              </div>
              <Link href="/nguoi-ban/tin-dang" className="text-[#e03c31] font-bold mt-auto hover:underline flex items-center gap-1 group w-max">
                Đăng tin <ChevronRight className="w-[14px] h-[14px] group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Gói Hội viên card */}
            <div className="bg-[#fff6f6] p-6 rounded-xl border border-red-100 shadow-sm flex flex-col justify-between h-[180px] hover:border-red-200 transition-colors">
              <div>
                <div className="flex items-center gap-2 font-bold mb-3 text-gray-900 flex-wrap">
                  <Crown className="w-[18px] h-[18px] text-gray-800" />
                  <span>Gói Hội Viên</span>
                  <span className="bg-[#e03c31] text-white text-[10px] px-2 py-0.5 rounded-[4px] flex items-center shadow-sm whitespace-nowrap">
                    <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                    Tiết kiệm đến 39%
                  </span>
                </div>
                <div className="text-gray-700 font-medium">
                  Thảnh thơi đăng tin/đẩy tin không lo biến động giá
                </div>
              </div>
              <div className="mt-auto">
                <button className="bg-white border border-gray-300 px-5 py-2 rounded-full font-bold hover:bg-gray-50 transition-colors text-gray-800 shadow-sm">
                  Tìm hiểu ngay
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Thông tin dành riêng cho bạn */}
        <section>
          <h2 className="text-[22px] font-bold text-gray-900 mb-5 tracking-tight">Thông tin dành riêng cho bạn</h2>

          {/* Filters */}
          <div className="flex items-center gap-3 mb-6">
            <button className="bg-gray-900 text-white px-5 py-2 rounded-full font-bold flex items-center gap-2 shadow-sm">
              <LayoutList className="w-4 h-4 stroke-[2.5]" /> Tất cả
            </button>
            <button className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 px-5 py-2 rounded-full font-bold flex items-center gap-2 transition-colors shadow-sm">
              <EyeOff className="w-4 h-4 stroke-[2.5]" /> Đã tạm ẩn
            </button>
          </div>

          {/* 3 Columns Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Col 1: Quan trọng */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#e03c31] font-bold">
                  <AlertCircle className="w-5 h-5 fill-red-100" /> Quan trọng
                </div>
                <div className="w-6 h-6 rounded-full bg-[#e03c31] text-white flex items-center justify-center text-xs font-bold shadow-sm">1</div>
              </div>

              <div className="bg-[#e03c31] text-white p-8 rounded-xl text-center flex flex-col items-center shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full translate-y-8 -translate-x-8"></div>

                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-6 z-10">
                  {/* Decorative house icon placeholder */}
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-90"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                </div>
                <h3 className="font-extrabold text-[22px] mb-3 z-10 leading-tight">Quà tặng 1 tin thường 15 ngày</h3>
                <p className="text-red-50 mb-8 font-medium leading-relaxed z-10 px-2">
                  Tin đăng của bạn sẽ được tiếp cận hơn 6 triệu người tìm mua/thuê bất động sản mỗi tháng
                </p>
                <button className="bg-white text-[#e03c31] font-bold px-6 py-3.5 rounded-full hover:bg-red-50 transition-colors w-full shadow-sm z-10">
                  + Tạo tin đăng đầu tiên
                </button>
              </div>
            </div>

            {/* Col 2: Thông tin */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-600 font-bold">
                  <Info className="w-5 h-5 fill-emerald-100" /> Thông tin
                </div>
                <div className="w-6 h-6 rounded-full bg-[#e03c31] text-white flex items-center justify-center text-xs font-bold shadow-sm">0</div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-200 flex items-start gap-4 shadow-sm hover:border-gray-300 transition-colors">
                <div className="text-3xl leading-none">👏</div>
                <div className="text-gray-900 font-bold leading-snug">Bạn đã cập nhật tất cả thông tin của ngày hôm nay</div>
              </div>
            </div>

            {/* Col 3: Gợi ý */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-teal-600 font-bold">
                  <Lightbulb className="w-5 h-5 fill-teal-100" /> Gợi ý
                </div>
                <div className="w-6 h-6 rounded-full bg-[#e03c31] text-white flex items-center justify-center text-xs font-bold shadow-sm">2</div>
              </div>

              {/* Suggestion 1 */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-gray-300 transition-colors">
                <div className="text-xs text-teal-600 font-extrabold flex items-center gap-1.5 mb-3 uppercase tracking-wide">
                  <div className="w-2 h-2 rounded-full bg-teal-600"></div> Gợi ý
                </div>
                <h3 className="font-extrabold text-lg mb-2 text-gray-900 leading-tight">Làm quen với trang Tổng quan!</h3>
                <p className="text-gray-600 mb-5 font-medium leading-relaxed">
                  Hướng dẫn bạn làm quen và thao tác với một số nội dung chính, giúp bạn có trải nghiệm tốt hơn.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-3 text-gray-800 font-medium">
                    <LayoutList className="w-5 h-5 text-gray-400 shrink-0 stroke-[2]" /> Thông tin tổng quan về tài khoản của bạn
                  </li>
                  <li className="flex items-start gap-3 text-gray-800 font-medium">
                    <User className="w-5 h-5 text-gray-400 shrink-0 stroke-[2]" /> Thông tin cá nhân hoá dành riêng cho bạn
                  </li>
                  <li className="flex items-start gap-3 text-gray-800 font-medium">
                    <EyeOff className="w-5 h-5 text-gray-400 shrink-0 stroke-[2]" /> Ẩn những thông tin mà bạn thấy không hữu ích
                  </li>
                </ul>
                <button className="w-full py-2.5 border border-gray-300 rounded-lg font-bold hover:bg-gray-50 transition-colors text-gray-800">
                  Xem hướng dẫn
                </button>
              </div>

              {/* Suggestion 2 */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-gray-300 transition-colors">
                <div className="text-xs text-teal-600 font-extrabold flex items-center gap-1.5 mb-3 uppercase tracking-wide">
                  <div className="w-2 h-2 rounded-full bg-teal-600"></div> Gợi ý
                </div>
                <h3 className="font-extrabold text-lg mb-5 text-gray-900">Làm quen với Batdongsan.com.vn</h3>

                <div className="space-y-0">
                  <div className="flex items-start justify-between cursor-pointer group py-4 border-b border-gray-100 first:pt-0">
                    <div className="flex gap-4">
                      <ImageIcon className="w-[22px] h-[22px] text-gray-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-gray-900 mb-1 group-hover:text-[#e03c31] transition-colors leading-tight">Cập nhật tên và hình ảnh đại diện</div>
                        <div className="text-gray-500 font-medium leading-relaxed pr-2">Tên và hình ảnh sẽ xuất hiện ở tất cả các tin đăng của bạn, điều đó sẽ giúp bạn cận người mua dễ dàng hơn.</div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
                  </div>

                  <div className="flex items-center justify-between cursor-pointer group py-4 border-b border-gray-100">
                    <div className="flex gap-4 items-center">
                      <LayoutList className="w-[22px] h-[22px] text-gray-500 shrink-0" />
                      <div className="font-bold text-gray-900 group-hover:text-[#e03c31] transition-colors">Khám phá sổ tay đăng tin</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
                  </div>

                  <div className="flex items-start justify-between cursor-pointer group py-4 border-b border-gray-100">
                    <div className="flex gap-4">
                      <div className="w-[22px] h-[22px] rounded-full border-2 border-gray-400 flex items-center justify-center shrink-0 text-gray-500 mt-0.5">
                        <Plus className="w-3 h-3 stroke-[3]" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 mb-1 group-hover:text-[#e03c31] transition-colors leading-tight">Và bạn đã sẵn sàng để đăng tin đầu tiên. Bắt đầu ngay!</div>
                        <div className="text-gray-500 font-medium leading-relaxed pr-2">Batdongsan.com.vn tặng bạn một tin thường 15 ngày để bắt đầu đăng tin.</div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Liên hệ từ khách hàng */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[22px] font-bold text-gray-900 tracking-tight">Liên hệ từ khách hàng</h2>
            {totalLeads > 10 ? (
              <Link
                href="/nguoi-ban/khach-hang"
                className="flex items-center gap-1 text-sm font-bold text-[#e03c31] hover:underline"
              >
                Xem tất cả <ChevronRight className="w-4 h-4" />
              </Link>
            ) : null}
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {leadsLoading ? (
              <div className="py-10 text-center text-sm text-gray-500">Đang tải...</div>
            ) : recentLeads.length === 0 ? (
              <div className="py-10 text-center">
                <div className="text-sm font-bold text-gray-900 mb-1">Chưa có liên hệ nào</div>
                <div className="text-xs text-gray-500">Liên hệ từ khách hàng cho tin đăng của bạn sẽ hiển thị ở đây</div>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left px-4 py-3 text-xs font-extrabold text-gray-500 uppercase tracking-wider">Tên</th>
                    <th className="text-left px-4 py-3 text-xs font-extrabold text-gray-500 uppercase tracking-wider">SĐT</th>
                    <th className="text-left px-4 py-3 text-xs font-extrabold text-gray-500 uppercase tracking-wider">BĐS</th>
                    <th className="text-left px-4 py-3 text-xs font-extrabold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                    <th className="text-left px-4 py-3 text-xs font-extrabold text-gray-500 uppercase tracking-wider">Thời gian</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLeads.map((lead) => (
                    <tr key={lead.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3 font-bold text-gray-900">{lead.name}</td>
                      <td className="px-4 py-3 text-gray-700 font-medium">{lead.phone}</td>
                      <td className="px-4 py-3 text-xs text-gray-600 max-w-[200px] truncate">{lead.propertyTitle}</td>
                      <td className="px-4 py-3">
                        <StatusBadge tone={leadStatusTone(lead.status)}>{statusLabel(lead.status)}</StatusBadge>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">{lead.createdTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200 text-gray-500 text-xs sm:text-sm font-medium">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="xl:col-span-1">
              <div className="flex items-center gap-2 font-bold text-gray-400 mb-4">
                <div className="w-8 h-8 flex items-center justify-center font-bold text-gray-400 border-2 border-gray-300 rounded text-[8px]">
                  BĐS
                </div>
              </div>
              <p className="font-bold text-gray-700 mb-1.5 uppercase tracking-wide text-xs">CÔNG TY CỔ PHẦN PROPERTYGURU VIỆT NAM</p>
              <p className="leading-relaxed mb-1">Tầng 31, Keangnam Hanoi Landmark, Phạm Hùng, Yên Hòa, Cầu Giấy, Hà Nội</p>
              <p className="leading-relaxed mb-4">(024) 3562 5939 - (024) 3562 5940</p>
              <div className="flex gap-4 items-center">
                <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">QR</div>
                <div>
                  <p className="font-bold text-gray-700 mb-1">Trải nghiệm trên ứng dụng</p>
                  <p className="text-xs text-gray-500">Quét mã QR bằng điện thoại để tải ứng dụng.</p>
                </div>
              </div>
            </div>

            {/* Links Group 1 */}
            <div>
              <p className="font-bold text-gray-900 mb-4 uppercase tracking-wide">Hướng dẫn</p>
              <div className="flex flex-col gap-3">
                <Link href="#" className="hover:text-gray-800 transition-colors">Về chúng tôi</Link>
                <Link href="#" className="hover:text-gray-800 transition-colors">Báo giá & hỗ trợ</Link>
                <Link href="#" className="hover:text-gray-800 transition-colors">Câu hỏi thường gặp</Link>
                <Link href="#" className="hover:text-gray-800 transition-colors">Góp ý báo lỗi</Link>
                <Link href="#" className="hover:text-gray-800 transition-colors">Sitemap</Link>
              </div>
            </div>

            {/* Links Group 2 */}
            <div>
              <p className="font-bold text-gray-900 mb-4 uppercase tracking-wide">Quy định</p>
              <div className="flex flex-col gap-3">
                <Link href="#" className="hover:text-gray-800 transition-colors">Quy định đăng tin</Link>
                <Link href="#" className="hover:text-gray-800 transition-colors">Quy chế hoạt động</Link>
                <Link href="#" className="hover:text-gray-800 transition-colors">Điều khoản thỏa thuận</Link>
                <Link href="#" className="hover:text-gray-800 transition-colors">Chính sách bảo mật</Link>
                <Link href="#" className="hover:text-gray-800 transition-colors">Giải quyết khiếu nại</Link>
              </div>
            </div>

            {/* Contact */}
            <div>
              <p className="font-bold text-gray-900 mb-4 uppercase tracking-wide">Liên hệ</p>
              <div className="flex flex-col gap-4">
                <a href="tel:19001881" className="flex items-center gap-2 hover:text-gray-800 transition-colors font-bold text-base">
                  <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">📞</span>
                  1900 1881
                </a>
                <a href="https://trogiup.batdongsan.com.vn/" className="flex items-center gap-2 hover:text-gray-800 transition-colors">
                  <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">🌐</span>
                  trogiup.batdongsan.com.vn
                </a>
                <a href="mailto:hotro@batdongsan.com.vn" className="flex items-center gap-2 hover:text-gray-800 transition-colors">
                  <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">✉️</span>
                  hotro@batdongsan.com.vn
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <p>Copyright © 2007 - 2026 Batdongsan.com.vn</p>
            <div className="flex gap-4">
               {/* Social Icons Placeholder */}
               <div className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer"></div>
               <div className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer"></div>
               <div className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer"></div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
