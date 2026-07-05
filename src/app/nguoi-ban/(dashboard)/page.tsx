"use client";

import { useEffect, useState } from "react";
import { SellerHeader } from "../_components/SellerHeader";
import { SellerFooter } from "../_components/SellerFooter";
import {
  OverviewAccountSection,
  OverviewInfoSection,
  OverviewLeadsSection,
} from "../_components/organisms";
import { useWalletBalance } from "@/lib/use-wallet-balance";
import { useAuth } from "@/lib/auth-store";
import { searchProperties, type Property } from "@/services/properties";
import { searchLeads } from "@/services/leads";
import { apiLeadToView, unwrapArray, type LeadView } from "@/lib/api-adapters";

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
        const myProps = user?.id
          ? allProps.filter((p) => p.host === user.id || p.user?.id === user.id)
          : [];

        if (myProps.length === 0) {
          if (!ignore) {
            setRecentLeads([]);
            setTotalLeads(0);
          }
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
          setRecentLeads(
            allLeads
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              )
              .slice(0, 10)
          );
          setTotalLeads(total);
        }
      } catch {
        if (!ignore) {
          setRecentLeads([]);
          setTotalLeads(0);
        }
      } finally {
        if (!ignore) setLeadsLoading(false);
      }
    }

    loadLeads();
    return () => {
      ignore = true;
    };
  }, [user?.id]);

  return (
    <>
      <SellerHeader title="Tổng quan" />
      <main className="flex-1 overflow-y-auto p-6 lg:p-8 xl:p-10 space-y-8 pb-20 scroll-smooth bg-gray-50/30">
        <OverviewAccountSection wallet={wallet} />
        <OverviewInfoSection />
        <OverviewLeadsSection
          recentLeads={recentLeads}
          totalLeads={totalLeads}
          leadsLoading={leadsLoading}
        />
      </main>
      {/* <SellerFooter /> */}
    </>
  );
}
