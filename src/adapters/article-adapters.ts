import type { AdminArticle } from "@/app/admin/_data/types";
import type { Article } from "@/services/articles";
import type { PublicArticleCard } from "@/types";
import { formatDate, formatRelativeTime } from "@/lib/formatters/date";

const categoryLabelMap: Record<string, string> = {
  market: "Thị trường",
  legal: "Pháp lý",
  fengshui: "Phong thủy",
  project: "Dự án",
  general: "Tổng hợp",
};

const fallbackThumbnail = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=2000";

export function mapArticleStatus(status: string): AdminArticle["status"] {
  if (status === "published") return "Đã xuất bản";
  if (status === "archived") return "Đã lưu trữ";
  return "Bản nháp";
}

export function mapArticleCategory(category: string): string {
  return categoryLabelMap[category] ?? category;
}

export function mapAdminStatusToArticleStatus(status: AdminArticle["status"]): "published" | "archived" | "draft" {
  if (status === "Đã xuất bản") return "published";
  if (status === "Đã lưu trữ") return "archived";
  return "draft";
}

export function apiArticleToPublicCard(article: Article): PublicArticleCard {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    summary: article.summary ?? "",
    thumbnail: article.thumbnail || fallbackThumbnail,
    category: mapArticleCategory(article.category),
    author: article.author?.fullName ?? article.author?.name ?? "Batdongsan.com.vn",
    publishedAt: article.publishedAt ? formatDate(article.publishedAt) : formatDate(article.createdAt),
    viewCount: article.viewCount ?? 0,
    relativeTime: formatRelativeTime(article.publishedAt ?? article.createdAt),
    isFeatured: article.isFeatured ?? false,
  };
}

export function apiArticleToAdminArticle(article: Article): AdminArticle {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    content: article.content,
    category: mapArticleCategory(article.category),
    author: article.author?.fullName ?? article.author?.name ?? "Không rõ",
    status: mapArticleStatus(article.status),
    views: article.viewCount ?? 0,
    publishedAt: article.publishedAt ? formatDate(article.publishedAt) : "--",
    summary: article.summary,
    thumbnail: article.thumbnail,
    isFeatured: article.isFeatured,
  };
}
