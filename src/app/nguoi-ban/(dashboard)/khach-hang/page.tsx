"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, Filter, Info, Eye } from "lucide-react";
import { SellerHeader } from "@/app/nguoi-ban/_components/SellerHeader";
import { useAuth } from "@/lib/auth-store";
import { apiLeadToView, unwrapArray, type LeadView } from "@/lib/api-adapters";
import { searchProperties, type Property } from "@/services/properties";
import { searchLeads, updateLeadStatus, updateLeadNotes, type LeadStatus } from "@/services/leads";
import { StatusBadge } from "@/app/nguoi-ban/_components/atoms/StatusBadge";
import Link from "next/link";

const statusLabelMap: Record<string, string> = {
  new: "Mới",
  contacted: "Đã liên hệ",
  qualified: "Tiềm năng",
  lost: "Mất",
};

export function leadStatusTone(status: string) {
  if (status === "new") return "blue" as const;
  if (status === "contacted") return "amber" as const;
  if (status === "qualified") return "green" as const;
  return "gray" as const;
}

export default function KhachHangPage() {
  const { user } = useAuth();
  const [allLeads, setAllLeads] = useState<LeadView[]>([]);
  const [myProperties, setMyProperties] = useState<Property[]>([]);
  const [search, setSearch] = useState("");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [localNotes, setLocalNotes] = useState("");
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  
  const [showFilter, setShowFilter] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | LeadStatus>("all");
  const [propertyFilter, setPropertyFilter] = useState<string>("all");

  const fetchLeads = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const propsResp = await searchProperties({ page: 1, perPage: 100 });
      const allProps = unwrapArray<Property>(propsResp);
      const myProps = allProps.filter(
        (p) => p.host === user.id || p.user?.id === user.id
      );

      setMyProperties(myProps);

      if (myProps.length === 0) {
        setAllLeads([]);
        return;
      }

      const leadResults = await Promise.all(
        myProps.map((p) =>
          searchLeads({ propertyId: p.id, page: 1, perPage: 50 }).catch(() => ({
            leads: [],
            pagination: { page: 1, totalPages: 0, total: 0, perPage: 10 },
          }))
        )
      );

      const merged = leadResults
        .flatMap((r) => r.leads.map(apiLeadToView))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setAllLeads(merged);
    } catch {
      setAllLeads([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const filtered = useMemo(() => {
    let result = allLeads;
    if (unreadOnly) result = result.filter((l) => l.status === "new");
    if (statusFilter !== "all") result = result.filter((l) => l.status === statusFilter);
    if (propertyFilter !== "all") result = result.filter((l) => l.propertyId === propertyFilter);
    
    const q = search.toLowerCase();
    if (q) {
      result = result.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.phone.includes(q) ||
          l.propertyTitle.toLowerCase().includes(q)
      );
    }
    return result;
  }, [allLeads, unreadOnly, statusFilter, propertyFilter, search]);

  const selectedLead = useMemo(() => {
    return allLeads.find(l => l.id === selectedLeadId) || null;
  }, [allLeads, selectedLeadId]);

  useEffect(() => {
    if (selectedLead) {
      setLocalNotes(selectedLead.notes || "");
    } else {
      setLocalNotes("");
    }
  }, [selectedLead?.id]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white">
      <SellerHeader 
        title="Quản lý khách hàng" 
        subtitle={
          <div className="flex items-center gap-1.5 text-sm text-gray-500 font-normal mt-1">
            {allLeads.length > 0 ? `Có ${allLeads.length} khách hàng` : "Chưa có khách hàng"}
            <Info className="w-4 h-4" />
          </div>
        }
      />
      
      <div className="flex-1 flex overflow-hidden border-t border-gray-100">
        {/* Left Sidebar */}
        <div className="w-[360px] flex-shrink-0 flex flex-col border-r border-gray-200 bg-white z-10">
          <div className="p-4 border-b border-gray-100 space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm theo tên, email, số điện thoại"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-gray-100 border border-transparent rounded-full text-sm outline-none focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
              <button 
                onClick={() => setShowFilter(!showFilter)}
                className={`p-2 border rounded-full transition-colors flex-shrink-0 ${showFilter ? 'bg-primary/10 border-primary text-primary' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
              >
                <Filter className="h-4 w-4" />
              </button>
            </div>
            
            {showFilter && (
              <div className="space-y-3 pt-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary"
                >
                  <option value="all">Tất cả trạng thái</option>
                  {(Object.keys(statusLabelMap) as LeadStatus[]).map((s) => (
                    <option key={s} value={s}>
                      {statusLabelMap[s]}
                    </option>
                  ))}
                </select>
                <select
                  value={propertyFilter}
                  onChange={(e) => setPropertyFilter(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary truncate"
                >
                  <option value="all">Tất cả tin đăng</option>
                  {myProperties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex items-center justify-between px-1">
              <span className="text-sm text-gray-600 font-medium">Chỉ chưa đọc</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={unreadOnly} onChange={e => setUnreadOnly(e.target.checked)} />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-sm text-gray-500">Đang tải...</div>
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center text-sm text-gray-500">Chưa có khách hàng nào</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filtered.map(lead => (
                  <button
                    key={lead.id}
                    onClick={() => setSelectedLeadId(lead.id)}
                    className={`w-full text-left p-4 hover:bg-gray-50 transition-colors flex flex-col gap-1.5 ${selectedLeadId === lead.id ? 'bg-red-50/50 hover:bg-red-50/50' : ''}`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <h4 className={`text-[15px] truncate ${lead.status === 'new' ? 'font-bold text-gray-900' : 'font-medium text-gray-800'}`}>{lead.name}</h4>
                      <span className="text-xs text-gray-400 flex-shrink-0 font-medium">{lead.createdTime || new Date(lead.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className={`text-sm ${lead.status === 'new' ? 'font-medium text-gray-800' : 'text-gray-600'}`}>{lead.phone}</p>
                    <p className="text-xs text-gray-500 truncate leading-relaxed">{lead.propertyTitle}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <StatusBadge tone={leadStatusTone(lead.status)}>
                         {statusLabelMap[lead.status] || lead.status}
                      </StatusBadge>
                      {lead.status === 'new' && <span className="w-2 h-2 rounded-full bg-primary ml-auto shadow-sm" />}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 flex flex-col bg-[#f8f9fa] overflow-y-auto relative">
          {selectedLead ? (
            <div className="max-w-4xl mx-auto w-full p-8 pb-20">
              <h2 className="text-[22px] font-bold text-gray-900 mb-6 tracking-tight">Chi tiết khách hàng</h2>
              
              <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
                <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1.5">Tên khách hàng</p>
                    <p className="font-semibold text-gray-900 text-base">{selectedLead.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1.5">Số điện thoại</p>
                    <p className="font-semibold text-gray-900 text-base">{selectedLead.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1.5">Email</p>
                    <p className="font-semibold text-gray-900 text-base">{selectedLead.email || "Không có"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1.5">Nguồn</p>
                    <p className="font-semibold text-gray-900 text-base">{selectedLead.sourceLabel || selectedLead.source}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Thông tin bất động sản</h3>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="font-medium text-gray-900 line-clamp-2 pr-4">{selectedLead.propertyTitle}</p>
                  <Link href={`/properties/${selectedLead.propertyId}`} target="_blank" className="flex items-center gap-1 text-sm font-bold text-primary hover:underline flex-shrink-0 bg-red-50 px-3 py-1.5 rounded-lg">
                    <Eye className="w-4 h-4" />
                    Xem tin
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Ghi chú & Trạng thái</h3>
                <div className="space-y-5">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Cập nhật trạng thái</p>
                    <div className="flex flex-wrap gap-2">
                      {(Object.keys(statusLabelMap) as LeadStatus[]).map((s) => {
                        const isActive = selectedLead.status === s;
                        return (
                          <button
                            key={s}
                            onClick={async () => {
                              if (isActive) return;
                              await updateLeadStatus(selectedLead.id, s);
                              setAllLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, status: s } : l));
                            }}
                            className={`px-4 py-2 rounded-xl text-sm font-bold border transition-colors shadow-sm ${
                              isActive 
                                ? 'bg-primary text-white border-primary' 
                                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            {statusLabelMap[s]}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Ghi chú</p>
                    <textarea
                      value={localNotes}
                      onChange={(e) => setLocalNotes(e.target.value)}
                      placeholder="Thêm ghi chú về khách hàng này..."
                      className="w-full rounded-xl border border-gray-200 p-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none h-32 shadow-sm bg-gray-50 focus:bg-white transition-colors"
                    ></textarea>
                    <div className="mt-3 flex justify-end">
                      <button 
                        disabled={isSavingNotes || localNotes === (selectedLead.notes || "")}
                        onClick={async () => {
                          setIsSavingNotes(true);
                          try {
                            await updateLeadNotes(selectedLead.id, localNotes);
                            setAllLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, notes: localNotes } : l));
                          } finally {
                            setIsSavingNotes(false);
                          }
                        }}
                        className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-black transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSavingNotes ? "Đang lưu..." : "Lưu ghi chú"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 mt-[-10vh]">
              {/* Using a custom illustration to mimic the binocular guy */}
              <div className="w-64 h-48 mb-6 relative flex items-center justify-center">
                 <div className="absolute inset-0 bg-gray-100 rounded-3xl transform rotate-3 scale-105"></div>
                 <div className="absolute inset-0 bg-white rounded-3xl border border-gray-100 flex items-center justify-center shadow-sm">
                   <div className="flex gap-2">
                     <div className="w-16 h-16 rounded-full border-4 border-red-500 flex items-center justify-center relative overflow-hidden bg-gray-800">
                        <div className="w-8 h-8 rounded-full bg-white/20 blur-sm absolute top-1 left-1"></div>
                     </div>
                     <div className="w-16 h-16 rounded-full border-4 border-red-500 flex items-center justify-center relative overflow-hidden bg-gray-800">
                        <div className="w-8 h-8 rounded-full bg-white/20 blur-sm absolute top-1 left-1"></div>
                     </div>
                   </div>
                 </div>
              </div>
              <h3 className="text-[22px] font-bold text-gray-900 mb-2 tracking-tight">Chưa có khách hàng nào</h3>
              <p className="text-gray-500">Hiện tại chưa có khách hàng nào</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
