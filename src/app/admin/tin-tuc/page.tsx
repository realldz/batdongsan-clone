"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Pencil, Plus, Star, Trash2 } from "lucide-react";

import { apiArticleToAdminArticle, mapAdminStatusToArticleStatus, unwrapArray } from "@/lib/api-adapters";
import { createArticle, deleteArticle, searchArticles, updateArticle, type Article, type ArticleCategory, type CreateArticleRequest } from "@/services/articles";

import { type AdminArticle, type AdminArticleStatus } from "../_data/types";
import { AdminHeader } from "../_components/organisms/AdminHeader";
import { StatusBadge } from "../_components/atoms/StatusBadge";
import { SearchInput } from "../_components/atoms/SearchInput";
import { FilterSelect } from "../_components/atoms/FilterSelect";
import { ActionButton } from "../_components/atoms/ActionButton";
import { TableShell } from "../_components/molecules/TableShell";
import { EmptyState } from "../_components/atoms/EmptyState";
import { FilterBar } from "../_components/molecules/FilterBar";
import { AdminPageTemplate } from "../_components/templates/AdminPageTemplate";
import { ArticleFormModal } from "../_components/organisms/ArticleFormModal";
import { downloadCsv } from "../_components/utils/csv-export";
import { StatsGrid } from "../_components/molecules/StatsGrid";
import { StatCard } from "../_components/atoms/StatCard";
import { Building2, FileCheck2, Users, Eye } from "lucide-react";

const categoryOptions = ["Tất cả", "Thị trường", "Pháp lý", "Phong thủy", "Dự án", "Tổng hợp"] as const;
const statusOptions = ["Tất cả", "Đã xuất bản", "Bản nháp", "Đã lưu trữ"] as const;

const categoryToApi: Record<string, ArticleCategory> = {
  "Thị trường": "market",
  "Pháp lý": "legal",
  "Phong thủy": "fengshui",
  "Dự án": "project",
  "Tổng hợp": "general",
};

const categoryFilterOptions = categoryOptions.map((c) => ({
  label: c === "Tất cả" ? "Tất cả danh mục" : c,
  value: c,
}));

const statusFilterOptions = statusOptions.map((s) => ({
  label: s === "Tất cả" ? "Tất cả trạng thái" : s,
  value: s,
}));

function getArticleStatusTone(status: AdminArticleStatus) {
  if (status === "Đã xuất bản") return "green";
  if (status === "Bản nháp") return "amber";
  return "gray";
}

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<AdminArticle[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<(typeof categoryOptions)[number]>("Tất cả");
  const [statusFilter, setStatusFilter] = useState<(typeof statusOptions)[number]>("Tất cả");
  const [isLoading, setIsLoading] = useState(true);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<AdminArticle | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadArticles() {
      try {
        const response = await searchArticles({ page: 1, perPage: 100 });
        const apiArticles = unwrapArray<Article>(response).map(apiArticleToAdminArticle);

        if (!ignore) {
          setArticles(apiArticles);
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadArticles();

    return () => {
      ignore = true;
    };
  }, []);

  const filteredArticles = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return articles.filter((article) => {
      const matchesSearch = keyword.length === 0 || article.title.toLowerCase().includes(keyword) || article.slug.toLowerCase().includes(keyword) || article.author.toLowerCase().includes(keyword);
      const matchesCategory = categoryFilter === "Tất cả" || article.category === categoryFilter;
      const matchesStatus = statusFilter === "Tất cả" || article.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [articles, search, categoryFilter, statusFilter]);

  const totalViews = useMemo(() => articles.reduce((sum, a) => sum + a.views, 0), [articles]);

  const saveEdit = async (data: {
    title: string;
    content: string;
    category: string;
    status: AdminArticleStatus;
    summary: string;
    thumbnail: string;
    isFeatured: boolean;
  }) => {
    if (!editingArticle) return;

    await updateArticle(editingArticle.id, {
      title: data.title || undefined,
      content: data.content || undefined,
      category: categoryToApi[data.category],
      status: mapAdminStatusToArticleStatus(data.status),
      summary: data.summary || undefined,
      thumbnail: data.thumbnail || undefined,
      isFeatured: data.isFeatured,
    });

    setArticles((current) =>
      current.map((a) =>
        a.id === editingArticle.id
          ? {
              ...a,
              title: data.title || a.title,
              content: data.content || a.content,
              category: data.category,
              status: data.status,
              summary: data.summary,
              thumbnail: data.thumbnail,
              isFeatured: data.isFeatured,
            }
          : a
      )
    );
    setEditingArticle(null);
  };

  const removeArticle = async (id: string) => {
    const previous = articles;
    setArticles((current) => current.filter((a) => a.id !== id));

    try {
      await deleteArticle(id);
    } catch {
      setArticles(previous);
    }
  };

  const handleCreate = async (data: {
    title: string;
    content: string;
    category: string;
    status: AdminArticleStatus;
    summary: string;
    thumbnail: string;
    isFeatured: boolean;
  }) => {
    const payload: CreateArticleRequest = {
      title: data.title,
      content: data.content,
      category: categoryToApi[data.category],
    };
    if (data.summary) payload.summary = data.summary;
    if (data.thumbnail) payload.thumbnail = data.thumbnail;
    if (data.isFeatured) payload.isFeatured = true;
    if (data.status !== "Bản nháp") payload.status = mapAdminStatusToArticleStatus(data.status);

    const created = await createArticle(payload);
    setArticles((current) => [apiArticleToAdminArticle(created), ...current]);
    setIsCreateOpen(false);
  };

  const handleExportCsv = () => {
    downloadCsv(
      "admin-tin-tuc.csv",
      ["Tiêu đề", "Slug", "Danh mục", "Tác giả", "Trạng thái", "Ngày xuất bản", "Lượt xem", "Nổi bật"],
      filteredArticles,
      (row) => [
        row.title,
        row.slug,
        row.category,
        row.author,
        row.status,
        row.publishedAt,
        String(row.views),
        row.isFeatured ? "Có" : "Không",
      ]
    );
  };

  const header = <AdminHeader title="Quản lý tin tức" description="Quản lý nội dung tin tức, trạng thái xuất bản và lượt xem." />;

  return (
    <AdminPageTemplate header={header}>
      <StatsGrid cols={4}>
        <StatCard title="Tổng bài viết" value={`${articles.length}`} helper="Tất cả bài viết trong hệ thống" icon={<Building2 className="w-5 h-5" />} />
        <StatCard title="Đã xuất bản" value={`${articles.filter((a) => a.status === "Đã xuất bản").length}`} helper="Tin hiển thị công khai" tone="green" icon={<FileCheck2 className="w-5 h-5" />} />
        <StatCard title="Bản nháp" value={`${articles.filter((a) => a.status === "Bản nháp").length}`} helper="Tin chưa xuất bản" tone="amber" icon={<Users className="w-5 h-5" />} />
        <StatCard title="Tổng lượt xem" value={totalViews.toLocaleString("vi-VN")} helper="Tương tác người dùng" tone="red" icon={<Eye className="w-5 h-5" />} />
      </StatsGrid>

      <FilterBar
        actions={
          <>
            <ActionButton variant="secondary" icon={<Plus className="w-4 h-4" />} onClick={() => setIsCreateOpen(true)}>
              Viết bài
            </ActionButton>
            <ActionButton variant="primary" icon={<Download className="w-4 h-4" />} onClick={handleExportCsv}>
              Xuất CSV
            </ActionButton>
          </>
        }
      >
        <SearchInput
          placeholder="Tìm theo tiêu đề, slug, tác giả"
          value={search}
          onChange={setSearch}
          className="flex-1 min-w-[240px] max-w-md"
        />
        <FilterSelect
          value={categoryFilter}
          onChange={(val) => setCategoryFilter(val as (typeof categoryOptions)[number])}
          options={categoryFilterOptions}
        />
        <FilterSelect
          value={statusFilter}
          onChange={(val) => setStatusFilter(val as (typeof statusOptions)[number])}
          options={statusFilterOptions}
        />
      </FilterBar>

      <TableShell title="Danh sách bài viết" description={`${filteredArticles.length} bài viết phù hợp bộ lọc hiện tại`}>
        {isLoading ? (
          <div className="py-14 text-center text-sm font-medium text-gray-400">Đang tải dữ liệu...</div>
        ) : filteredArticles.length === 0 ? (
          <EmptyState title="Không có bài viết" description="Thử đổi từ khóa hoặc bộ lọc khác." />
        ) : (
          <table className="w-full min-w-[1000px] text-left">
            <thead className="bg-gray-50 text-[11px] uppercase tracking-wider text-gray-500 font-extrabold">
              <tr>
                <th className="px-5 py-3">Bài viết</th>
                <th className="px-5 py-3">Danh mục</th>
                <th className="px-5 py-3">Tác giả</th>
                <th className="px-5 py-3">Trạng thái</th>
                <th className="px-5 py-3">Ngày xuất bản</th>
                <th className="px-5 py-3 text-right">Lượt xem</th>
                <th className="px-5 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredArticles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50 align-top">
                  <td className="px-5 py-4 max-w-[400px]">
                    <div className="flex items-center gap-2">
                      {article.isFeatured && <Star className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />}
                      <div>
                        <div className="font-extrabold text-gray-900 line-clamp-2">{article.title}</div>
                        <div className="text-xs font-medium text-gray-400 mt-1">/{article.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-bold text-gray-700">{article.category}</td>
                  <td className="px-5 py-4 font-bold text-gray-700">{article.author}</td>
                  <td className="px-5 py-4"><StatusBadge tone={getArticleStatusTone(article.status)}>{article.status}</StatusBadge></td>
                  <td className="px-5 py-4 font-bold text-gray-700">{article.publishedAt}</td>
                  <td className="px-5 py-4 text-right font-extrabold text-gray-900">{article.views.toLocaleString("vi-VN")}</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setEditingArticle(article)} className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-extrabold text-gray-700 hover:bg-white hover:border-gray-300 flex items-center gap-1.5 cursor-pointer"><Pencil className="w-3.5 h-3.5" /> Sửa</button>
                      <button onClick={() => removeArticle(article.id)} className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-extrabold text-rose-600 hover:bg-rose-50 flex items-center gap-1.5 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /> Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </TableShell>

      <ArticleFormModal
        isOpen={isCreateOpen || !!editingArticle}
        onClose={() => {
          setIsCreateOpen(false);
          setEditingArticle(null);
        }}
        article={editingArticle}
        onSave={async (data) => {
          if (editingArticle) {
            await saveEdit(data);
          } else {
            await handleCreate(data);
          }
        }}
      />
    </AdminPageTemplate>
  );
}
