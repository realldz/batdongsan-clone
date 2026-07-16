"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminPageTemplate } from "../_components/templates/AdminPageTemplate";
import { AdminHeader } from "../_components/organisms/AdminHeader";
import {
  getPieCharts,
  getFeaturedCities,
  getRevenue,
  type PieCharts,
  type FeaturedCity,
  type RevenuePoint,
} from "@/services/analytics";
import { RevenueTrendChart } from "./_components/organisms/RevenueTrendChart";
import { CategoryPieCharts } from "./_components/organisms/CategoryPieCharts";
import { TopCitiesTable } from "./_components/organisms/TopCitiesTable";
import { TrendAnalysisPanel } from "./_components/organisms/TrendAnalysisPanel";

const EMPTY_PIE_CHARTS: PieCharts = { rentChart: [], saleChart: [], trendAnalysis: [] };

export default function AdminAnalyticsPage() {
  const [pieCityRange, setPieCityRange] = useState(30);
  const [revenueRange, setRevenueRange] = useState(12);

  const [pieCharts, setPieCharts] = useState<PieCharts>(EMPTY_PIE_CHARTS);
  const [featuredCities, setFeaturedCities] = useState<FeaturedCity[]>([]);
  const [revenue, setRevenue] = useState<RevenuePoint[]>([]);

  const [loadingPie, setLoadingPie] = useState(true);
  const [loadingRevenue, setLoadingRevenue] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function fetchPieAndCities() {
      setLoadingPie(true);
      try {
        const [pie, cities] = await Promise.all([getPieCharts(pieCityRange), getFeaturedCities(pieCityRange)]);
        if (!ignore) {
          setPieCharts(pie);
          setFeaturedCities(cities);
        }
      } catch {
        if (!ignore) toast.error("Lỗi khi tải dữ liệu phân bố loại BĐS và tỉnh/thành");
      } finally {
        if (!ignore) setLoadingPie(false);
      }
    }

    fetchPieAndCities();

    return () => {
      ignore = true;
    };
  }, [pieCityRange]);

  useEffect(() => {
    let ignore = false;

    async function fetchRevenue() {
      setLoadingRevenue(true);
      try {
        const points = await getRevenue(revenueRange);
        if (!ignore) setRevenue(points);
      } catch {
        if (!ignore) toast.error("Lỗi khi tải dữ liệu doanh thu");
      } finally {
        if (!ignore) setLoadingRevenue(false);
      }
    }

    fetchRevenue();

    return () => {
      ignore = true;
    };
  }, [revenueRange]);

  const header = (
    <AdminHeader title="Thống kê & phân tích" description="Doanh thu, phân bố loại BĐS và các tỉnh/thành nổi bật." />
  );

  return (
    <AdminPageTemplate header={header}>
      <RevenueTrendChart data={revenue} range={revenueRange} onRangeChange={setRevenueRange} loading={loadingRevenue} />

      <CategoryPieCharts
        rentChart={pieCharts.rentChart}
        saleChart={pieCharts.saleChart}
        range={pieCityRange}
        onRangeChange={setPieCityRange}
        loading={loadingPie}
      />

      <TrendAnalysisPanel items={pieCharts.trendAnalysis} loading={loadingPie} />

      <TopCitiesTable cities={featuredCities} loading={loadingPie} />
    </AdminPageTemplate>
  );
}
