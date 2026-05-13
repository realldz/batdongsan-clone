import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { PublicArticleCard } from "@/lib/api-adapters";

interface NewsSectionProps {
  articles: PublicArticleCard[];
}

export const NewsSection = ({ articles }: NewsSectionProps) => {
  return (
    <section className="max-w-[1240px] mx-auto px-4 lg:px-0 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#2c2c2c]">Tin tức bất động sản dành cho bạn</h2>
        <Link href="/tin-tuc" className="hidden sm:flex text-primary font-medium hover:underline items-center gap-1 text-sm">
          Xem thêm tin tức
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {articles.length === 0 ? (
        <p className="text-center text-gray-400 py-12">Chưa có bài viết nào</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.slice(0, 3).map((article) => (
            <Link href={`/tin-tuc/${article.slug}`} key={article.id} className="group flex flex-col bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
              <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
                <Image
                  src={article.thumbnail}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-bold text-[#2c2c2c] group-hover:text-primary transition-colors text-lg leading-tight mb-2 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-3 mb-4">
                  {article.summary}
                </p>
                <div className="mt-auto text-xs text-gray-400">
                  {article.relativeTime}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};
