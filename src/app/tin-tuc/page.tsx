import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { FocusNews } from "@/components/NewsPage/FocusNews";
import { NewsList } from "@/components/NewsPage/NewsList";
import { NewsSidebar } from "@/components/NewsPage/NewsSidebar";
import { searchArticles, type Article, type ArticleCategory } from "@/services/articles";
import { apiArticleToPublicCard, unwrapPaginated, type PublicArticleCard } from "@/lib/api-adapters";
import React from "react";
import Link from "next/link";

interface NewsPageProps {
  searchParams: Promise<{ page?: string; category?: string; keyword?: string }>;
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const category = params.category ?? "";
  const keyword = params.keyword ?? "";
  const categoryFilter = (["market", "legal", "fengshui", "project", "general"] as const).includes(category as ArticleCategory) ? (category as ArticleCategory) : undefined;

  let articles: PublicArticleCard[] = [];
  let pagination = { page: 1, totalPages: 1, total: 0, perPage: 10 };

  try {
    const response = await searchArticles({
      page,
      perPage: 10,
      status: "published",
      keyword: keyword || undefined,
      category: categoryFilter,
    });
    const result = unwrapPaginated<Article>(response, 10);
    articles = result.data.map(apiArticleToPublicCard);
    pagination = result.pagination;
  } catch {
    // render empty state on error
  }

  const featuredArticle = articles.length > 0 ? articles[0] : undefined;
  const secondaryArticles = articles.slice(1, 4);
  const listArticles = articles.slice(4);

  let sidebarArticles: { title: string; slug: string }[] = [];

  try {
    const sidebarResponse = await searchArticles({
      perPage: 10,
      status: "published",
    });
    const sidebarResult = unwrapPaginated<Article>(sidebarResponse, 10);
    sidebarArticles = sidebarResult.data
      .map(apiArticleToPublicCard)
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, 5)
      .map((a) => ({ title: a.title, slug: a.slug }));
  } catch {
    // silent
  }

  const baseQuery = [category && `category=${encodeURIComponent(category)}`, keyword && `keyword=${encodeURIComponent(keyword)}`].filter(Boolean).join("&");
  const baseUrl = baseQuery ? `/tin-tuc?${baseQuery}` : "/tin-tuc";

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white">
      <Header />
      <main className="flex-1 w-full max-w-[1140px] xl:max-w-[1240px] mx-auto px-4 lg:px-0 py-6">
        <div className="text-xs lg:text-sm text-gray-500 mb-2 flex items-center gap-1.5 flex-wrap">
          <span className="hover:text-primary cursor-pointer transition-colors">Batdongsan.com</span>
          <span className="text-gray-400">/</span>
          <span className="text-[#1c1f22]">Tin tức</span>
        </div>
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl lg:text-[40px] font-bold text-[#1c1f22] mb-3 tracking-tight">
            Thông tin bất động sản Việt Nam cập nhật mới nhất
          </h1>
          <p className="text-[#505050] text-sm md:text-base leading-relaxed">
            Tin tức thị trường bất động sản, chính sách, quy hoạch và dữ liệu phân tích, định giá liên tục cập nhật, chính xác và nhanh nhất...
          </p>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-[3] lg:w-[70%] min-w-0">
            <FocusNews featuredArticle={featuredArticle} secondaryArticles={secondaryArticles} />
            <NewsList articles={listArticles} pagination={pagination} baseUrl={baseUrl} />
          </div>
          <div className="w-full lg:w-[30%]">
            <NewsSidebar articles={sidebarArticles} />
            <div className="mt-6 sticky top-[300px]">
              <div className="w-full h-[500px] bg-gray-100 rounded-lg overflow-hidden flex flex-col items-center justify-center text-center p-6 border border-gray-200">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                </div>
                <h4 className="font-bold text-lg mb-2 text-[#1c1f22]">Đăng tin bất động sản</h4>
                <p className="text-gray-500 text-sm mb-6">Tiếp cận hàng triệu khách hàng tiềm năng mỗi ngày trên Batdongsan.com.vn</p>
                <Link href="#" className="w-full py-2.5 bg-primary hover:bg-primary-hover text-white font-bold rounded transition-colors shadow-sm">
                  Đăng tin ngay
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
