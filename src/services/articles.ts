import { api } from "@/lib/api";

export type ArticleCategory = "market" | "legal" | "fengshui" | "project" | "general";
export type ArticleStatus = "draft" | "published" | "archived";

export interface ArticleAuthor {
  id?: string;
  fullName?: string;
  name?: string;
  email?: string;
  avatar?: string;
}

export interface Article {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  _deleted?: boolean;
  title: string;
  slug: string;
  content: string;
  summary?: string;
  thumbnail?: string;
  category: ArticleCategory;
  status: ArticleStatus;
  author?: ArticleAuthor;
  publishedAt?: string | null;
  viewCount: number;
  isFeatured: boolean;
}

export interface ArticleSearchParams {
  page?: number;
  perPage?: number;
  keyword?: string;
  category?: ArticleCategory;
  status?: ArticleStatus;
}

export interface CreateArticleRequest {
  title: string;
  content: string;
  category: ArticleCategory;
  summary?: string;
  thumbnail?: string;
  isFeatured?: boolean;
  status?: ArticleStatus;
}

export interface UpdateArticleRequest {
  title?: string;
  content?: string;
  category?: ArticleCategory;
  status?: ArticleStatus;
  summary?: string;
  thumbnail?: string;
  isFeatured?: boolean;
}

function buildQuery(params: object) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if ((typeof value === "string" || typeof value === "number") && value !== "") {
      query.set(key, String(value));
    }
  });

  const text = query.toString();
  return text ? `?${text}` : "";
}

export async function searchArticles(params: ArticleSearchParams = {}) {
  return api.get<Article[]>(`/articles${buildQuery(params)}`, { cache: "no-store" });
}

export async function createArticle(data: CreateArticleRequest) {
  return api.post<Article>("/articles", data);
}

export async function getArticleBySlug(slug: string) {
  return api.get<Article>(`/articles/${slug}`, { cache: "no-store" });
}

export async function updateArticle(id: string, data: UpdateArticleRequest) {
  return api.patch<Article>(`/articles/${id}`, data);
}

export async function deleteArticle(id: string) {
  return api.delete<{ message?: string }>(`/articles/${id}`);
}
