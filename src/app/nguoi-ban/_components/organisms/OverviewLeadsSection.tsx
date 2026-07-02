import React from "react";
import Link from "next/link";
import { ChevronRight, Search } from "lucide-react";
import { SectionHeader } from "../atoms/SectionHeader";
import { EmptyState } from "../atoms/EmptyState";
import { LeadsTable } from "../molecules/LeadsTable";
import type { LeadView } from "@/lib/api-adapters";

interface OverviewLeadsSectionProps {
  recentLeads: LeadView[];
  totalLeads: number;
  leadsLoading: boolean;
}

export function OverviewLeadsSection({
  recentLeads,
  totalLeads,
  leadsLoading,
}: OverviewLeadsSectionProps) {
  return (
    <section>
      <SectionHeader title="Liên hệ từ khách hàng">
        {totalLeads > 10 ? (
          <Link
            href="/nguoi-ban/khach-hang"
            className="flex items-center gap-1 text-sm font-bold text-primary hover:underline"
          >
            Xem tất cả <ChevronRight className="w-4 h-4" />
          </Link>
        ) : null}
      </SectionHeader>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {leadsLoading ? (
          <div className="py-10 text-center text-sm text-gray-500 font-medium">Đang tải...</div>
        ) : recentLeads.length === 0 ? (
          <div className="py-6">
            <EmptyState
              title="Chưa có liên hệ nào"
              description="Liên hệ từ khách hàng cho tin đăng của bạn sẽ hiển thị ở đây"
              icon={<Search className="h-6 w-6 text-gray-500" />}
            />
          </div>
        ) : (
          <LeadsTable leads={recentLeads} showActions={false} />
        )}
      </div>
    </section>
  );
}
