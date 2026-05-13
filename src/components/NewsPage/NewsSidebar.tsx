import Link from "next/link";
import React from "react";

interface SidebarArticle {
  title: string;
  slug: string;
}

interface NewsSidebarProps {
  articles: SidebarArticle[];
  title?: string;
}

export const NewsSidebar = ({ articles, title = "Bài viết được xem nhiều nhất" }: NewsSidebarProps) => {
  return (
    <div className="w-full">
      <div className="bg-white border border-gray-100 rounded-lg p-5 shadow-sm mb-6 sticky top-20">
        <h3 className="text-lg font-bold text-[#1c1f22] mb-5 pb-3 border-b border-gray-100 uppercase tracking-tight">
          {title}
        </h3>

        <div className="flex flex-col gap-4">
          {articles.length > 0 ? (
            articles.map((article, idx) => (
              <Link key={article.slug} href={`/tin-tuc/${article.slug}`} className="flex gap-4 group">
                <div className="w-8 h-8 rounded-full bg-[#f2f2f2] text-gray-600 flex-shrink-0 flex items-center justify-center font-bold text-lg group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  {idx + 1}
                </div>
                <h4 className="text-sm font-medium text-[#1c1f22] group-hover:text-primary transition-colors leading-snug line-clamp-3">
                  {article.title}
                </h4>
              </Link>
            ))
          ) : (
            <p className="text-sm text-gray-400 text-center py-4">Chưa có bài viết</p>
          )}
        </div>
      </div>
    </div>
  );
};
