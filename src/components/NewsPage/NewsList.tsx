import Image from "next/image";
import Link from "next/link";
import React from "react";
import type { PaginationMeta, PublicArticleCard } from "@/lib/api-adapters";

interface NewsListProps {
  articles: PublicArticleCard[];
  pagination: PaginationMeta;
  baseUrl?: string;
}

export const NewsList = ({ articles, pagination, baseUrl = "/tin-tuc" }: NewsListProps) => {
  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <p className="text-lg">Chưa có bài viết nào</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {articles.map((article) => (
        <div key={article.id} className="flex gap-4 md:gap-6 group border-b border-gray-100 pb-8 last:border-0 last:pb-0">
          <Link href={`/tin-tuc/${article.slug}`} className="flex-shrink-0 w-[120px] h-[90px] md:w-[240px] md:h-[160px] relative rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={article.thumbnail}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 120px, 240px"
            />
          </Link>

          <div className="flex flex-col flex-1">
            <Link href={`/tin-tuc/${article.slug}`}>
              <span className="text-xs text-gray-500 uppercase tracking-widest mb-1.5 md:mb-2 block font-medium">
                {article.category}
              </span>
              <h3 className="text-[15px] md:text-xl font-bold text-[#1c1f22] group-hover:text-primary transition-colors leading-snug line-clamp-2 mb-2 md:mb-3">
                {article.title}
              </h3>
              <p className="hidden md:block text-sm text-[#505050] line-clamp-2 leading-relaxed mb-3">
                {article.summary}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-400 mt-auto">
                <span className="font-medium text-gray-500">{article.author}</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                <span>{article.publishedAt}</span>
              </div>
            </Link>
          </div>
        </div>
      ))}

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8 py-8 border-t border-gray-100">
          {pagination.page > 1 && (
            <Link
              href={`${baseUrl}?page=${pagination.page - 1}`}
              className="w-8 h-8 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center font-bold font-lexend transition-colors"
            >
              &lt;
            </Link>
          )}

          {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
            let pageNum: number;
            if (pagination.totalPages <= 5) {
              pageNum = i + 1;
            } else if (pagination.page <= 3) {
              pageNum = i + 1;
            } else if (pagination.page >= pagination.totalPages - 2) {
              pageNum = pagination.totalPages - 4 + i;
            } else {
              pageNum = pagination.page - 2 + i;
            }

            if (pagination.totalPages > 5 && i === 4 && pagination.page < pagination.totalPages - 2) {
              return <span key="ellipsis" className="text-gray-400">...</span>;
            }

            return (
              <Link
                key={pageNum}
                href={`${baseUrl}?page=${pageNum}`}
                className={`w-8 h-8 rounded flex items-center justify-center font-bold font-lexend transition-colors ${
                  pageNum === pagination.page
                    ? "bg-primary text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                }`}
              >
                {pageNum}
              </Link>
            );
          })}

          {pagination.page < pagination.totalPages && (
            <Link
              href={`${baseUrl}?page=${pagination.page + 1}`}
              className="w-8 h-8 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center font-bold font-lexend transition-colors"
            >
              &gt;
            </Link>
          )}
        </div>
      )}
    </div>
  );
};
