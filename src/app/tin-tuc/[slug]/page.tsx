import { NewsSidebar } from "@/components/NewsPage/NewsSidebar";
import { getArticleBySlug, searchArticles, type Article } from "@/services/articles";
import { apiArticleToPublicCard, unwrapPaginated } from "@/lib/api-adapters";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Icon } from "@/components/atoms";
import { PublicPageLayout, TwoColumnLayout } from "@/components/templates";

interface NewsDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;

  let articleTitle = "Bài viết";
  let articleContent = "";
  let articleThumbnail = "";
  let authorName = "Batdongsan.com.vn";
  let authorAvatar = "";
  let publishedAt = "";
  let viewCount = 0;
  let category = "Tin tức";
  let createdAt = "";

  try {
    const article = await getArticleBySlug(slug);
    if (article) {
      articleTitle = article.title;
      articleContent = article.content ?? "";
      articleThumbnail = article.thumbnail ?? "";
      authorName = article.author?.fullName ?? article.author?.name ?? "Batdongsan.com.vn";
      authorAvatar = article.author?.avatar ?? "";
      publishedAt = article.publishedAt
        ? new Date(article.publishedAt).toLocaleDateString("vi-VN")
        : article.createdAt
          ? new Date(article.createdAt).toLocaleDateString("vi-VN")
          : "";
      viewCount = article.viewCount ?? 0;
      category = article.category ? { market: "Thị trường", legal: "Pháp lý", fengshui: "Phong thủy", project: "Dự án", general: "Tổng hợp" }[article.category] ?? "Tin tức" : "Tin tức";
      createdAt = article.createdAt ?? article.publishedAt ?? "";
    }
  } catch {
    // render skeleton on error
  }

  let sidebarArticles: { title: string; slug: string }[] = [];

  try {
    const sidebarResponse = await searchArticles({ perPage: 10, status: "published" });
    const sidebarResult = unwrapPaginated<Article>(sidebarResponse, 10);
    sidebarArticles = sidebarResult.data
      .map(apiArticleToPublicCard)
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, 5)
      .map((a) => ({ title: a.title, slug: a.slug }));
  } catch {
    // silent
  }

  const readTime = articleContent ? Math.max(1, Math.ceil(articleContent.replace(/<[^>]*>/g, "").split(/\s+/).length / 250)) : 1;

  return (
    <PublicPageLayout>
      <div className="max-w-[1240px] mx-auto px-4 lg:px-0 py-6">
        <div className="text-xs lg:text-sm text-gray-500 mb-6 flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
            <Icon name="Home" size={14} />
          </Link>
          <span className="text-gray-400">/</span>
          <Link href="/tin-tuc" className="hover:text-primary transition-colors">Tin tức</Link>
          <span className="text-gray-400">/</span>
          <span className="text-[#1c1f22] line-clamp-1 w-48 sm:w-auto">{articleTitle}</span>
        </div>

        <TwoColumnLayout
          main={
            <div className="min-w-0">
              <h1 className="text-[28px] md:text-3xl lg:text-[40px] font-bold text-[#1c1f22] mb-6 leading-tight break-words">
                {articleTitle}
              </h1>

              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden relative flex-shrink-0">
                  {authorAvatar ? (
                    <Image src={authorAvatar} alt={authorName} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-bold">
                      {authorName.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-800">Được đăng bởi <span className="font-bold">{authorName}</span></span>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                    <span>Cập nhật lần cuối {publishedAt}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span>{viewCount.toLocaleString("vi-VN")} lượt xem</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span>Đọc trong {readTime} phút</span>
                  </div>
                </div>
              </div>

              {articleContent ? (
                <div
                  className="prose prose-lg max-w-none text-[#2c2c2c] leading-relaxed overflow-hidden break-words [&_*]:max-w-full"
                  dangerouslySetInnerHTML={{ __html: articleContent }}
                />
              ) : (
                <div className="py-16 text-center text-gray-400">
                  <p className="text-lg">Nội dung đang được cập nhật</p>
                </div>
              )}

              <div className="flex items-center gap-2 mt-6">
                <span className="text-sm font-bold text-[#1c1f22]">Danh mục:</span>
                <Link
                  href={`/tin-tuc?category=${encodeURIComponent(category.toLowerCase())}`}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-full font-medium cursor-pointer transition-colors"
                >
                  {category}
                </Link>
                {createdAt && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {new Date(createdAt).getFullYear()}
                  </span>
                )}
              </div>
            </div>
          }
          sidebar={
            <>
              <NewsSidebar articles={sidebarArticles} />
              <div className="mt-6 sticky top-20">
                <div className="w-full h-[400px] bg-gray-100 rounded-lg overflow-hidden flex flex-col items-center justify-center text-center p-6 border border-gray-200">
                  <h4 className="font-bold text-lg mb-2 text-[#1c1f22]">Vay mua nhà lãi suất thấp</h4>
                  <p className="text-gray-500 text-sm mb-6">Giải pháp tài chính tối ưu cho mọi ngôi nhà mơ ước.</p>
                  <Link href="#" className="w-full py-2.5 bg-primary hover:bg-primary-hover text-white font-bold rounded transition-colors shadow-sm">
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            </>
          }
        />
      </div>
    </PublicPageLayout>
  );
}
