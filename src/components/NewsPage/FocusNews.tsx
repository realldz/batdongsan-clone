import Image from "next/image";
import Link from "next/link";
import React from "react";
import type { PublicArticleCard } from "@/lib/api-adapters";

interface FocusNewsProps {
  featuredArticle?: PublicArticleCard;
  secondaryArticles?: PublicArticleCard[];
}

export const FocusNews = ({ featuredArticle, secondaryArticles = [] }: FocusNewsProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-6 mb-8 mt-2">
      <div className="flex-[5] relative h-[360px] md:h-[420px] rounded-lg overflow-hidden group">
        {featuredArticle ? (
          <Link href={`/tin-tuc/${featuredArticle.slug}`} className="block w-full h-full relative">
            <Image
              src={featuredArticle.thumbnail}
              alt={featuredArticle.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            <div className="absolute bottom-0 left-0 p-6 text-white w-full">
              <span className="inline-block px-3 py-1 bg-primary text-white text-xs font-bold rounded-sm uppercase tracking-wider mb-3">
                {featuredArticle.category}
              </span>
              <h2 className="text-xl md:text-2xl lg:text-[28px] font-bold leading-tight mb-2 group-hover:text-gray-200 transition-colors">
                {featuredArticle.title}
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <span className="font-medium">{featuredArticle.publishedAt}</span>
                <span className="w-1 h-1 bg-gray-400 rounded-full" />
                <span>{featuredArticle.viewCount.toLocaleString("vi-VN")} lượt xem</span>
              </div>
            </div>
          </Link>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
            Chưa có bài viết nổi bật
          </div>
        )}
      </div>

      <div className="flex-[3] flex flex-col justify-between gap-4">
        {secondaryArticles.length > 0 ? (
          secondaryArticles.slice(0, 3).map((article) => (
            <div key={article.id} className="flex-1 flex flex-col justify-center border-b border-gray-200 last:border-0 pb-4 last:pb-0 pt-2 first:pt-0 group">
              <Link href={`/tin-tuc/${article.slug}`}>
                <span className="text-xs text-primary font-bold uppercase mb-2 block">{article.category}</span>
                <h3 className="text-base lg:text-lg font-bold text-[#1c1f22] leading-snug group-hover:text-primary transition-colors line-clamp-3 mb-2">
                  {article.title}
                </h3>
                <p className="text-xs text-gray-500 font-medium">{article.publishedAt}</p>
              </Link>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            Chưa có bài viết
          </div>
        )}
      </div>
    </div>
  );
};
