"use client";

import { AdminHeader } from "../_components/AdminHeader";
import { AdminTableShell, EmptyState, StatusBadge } from "../_components/AdminUi";
import { type AdminArticle, type AdminArticleStatus } from "../_data/mock";
import { apiArticleToAdminArticle, mapAdminStatusToArticleStatus, unwrapArray } from "@/lib/api-adapters";
import { createArticle, deleteArticle, searchArticles, updateArticle, type Article, type ArticleCategory, type CreateArticleRequest } from "@/services/articles";
import { Download, Pencil, Plus, Search, Star, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import RichTextEditor from "@/components/RichTextEditor/RichTextEditor";

const categoryOptions = ["Tất cả", "Thị trường", "Pháp lý", "Phong thủy", "Dự án", "Tổng hợp"] as const;
const statusOptions = ["Tất cả", "Đã xuất bản", "Bản nháp", "Đã lưu trữ"] as const;
const editStatusOptions = ["Đã xuất bản", "Bản nháp", "Đã lưu trữ"] as const;
const editCategoryOptions = ["Thị trường", "Pháp lý", "Phong thủy", "Dự án", "Tổng hợp"] as const;

const categoryToApi: Record<string, ArticleCategory> = {
  "Thị trường": "market",
  "Pháp lý": "legal",
  "Phong thủy": "fengshui",
  "Dự án": "project",
  "Tổng hợp": "general",
};

const initialCreateDraft = {
  title: "",
  content: "",
  category: "Tổng hợp" as (typeof editCategoryOptions)[number],
  summary: "",
  thumbnail: "",
  isFeatured: false,
  status: "Bản nháp" as AdminArticleStatus,
};

function getArticleStatusTone(status: AdminArticleStatus) {
  if (status === "Đã xuất bản") return "green";
  if (status === "Bản nháp") return "amber";
  return "gray";
}

function downloadCsv(rows: AdminArticle[]) {
  const header = ["Tiêu đề", "Slug", "Danh mục", "Tác giả", "Trạng thái", "Ngày xuất bản", "Lượt xem", "Nổi bật"];
  const csvRows = rows.map((row) => [row.title, row.slug, row.category, row.author, row.status, row.publishedAt, String(row.views), row.isFeatured ? "Có" : "Không"]);
  const csv = [header, ...csvRows].map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "admin-tin-tuc.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<AdminArticle[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<(typeof categoryOptions)[number]>("Tất cả");
  const [statusFilter, setStatusFilter] = useState<(typeof statusOptions)[number]>("Tất cả");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createDraft, setCreateDraft] = useState(initialCreateDraft);
  const [createMessage, setCreateMessage] = useState("");

  const [editingArticle, setEditingArticle] = useState<AdminArticle | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editCategory, setEditCategory] = useState<(typeof editCategoryOptions)[number]>("Tổng hợp");
  const [editSummary, setEditSummary] = useState("");
  const [editThumbnail, setEditThumbnail] = useState("");
  const [editFeatured, setEditFeatured] = useState(false);
  const [editStatus, setEditStatus] = useState<AdminArticleStatus>("Bản nháp");

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

  const refreshArticles = async () => {
    try {
      const response = await searchArticles({ page: 1, perPage: 100 });
      const apiArticles = unwrapArray<Article>(response).map(apiArticleToAdminArticle);
      setArticles(apiArticles);
    } catch {
      // silently fail on refresh
    }
  };

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

  const openEdit = (article: AdminArticle) => {
    setEditingArticle(article);
    setEditTitle(article.title);
    setEditContent(article.content);
    setEditCategory(editCategoryOptions.includes(article.category as (typeof editCategoryOptions)[number]) ? (article.category as (typeof editCategoryOptions)[number]) : "Tổng hợp");
    setEditSummary(article.summary ?? "");
    setEditThumbnail(article.thumbnail ?? "");
    setEditFeatured(article.isFeatured);
    setEditStatus(article.status);
  };

  const saveEdit = async () => {
    if (!editingArticle) return;

    setIsSubmitting(true);

    try {
      await updateArticle(editingArticle.id, {
        title: editTitle || undefined,
        content: editContent || undefined,
        category: categoryToApi[editCategory],
        status: mapAdminStatusToArticleStatus(editStatus),
        summary: editSummary || undefined,
        thumbnail: editThumbnail || undefined,
        isFeatured: editFeatured,
      });

      setArticles((current) =>
        current.map((a) =>
          a.id === editingArticle.id
            ? { ...a, title: editTitle || a.title, content: editContent || a.content, category: editCategory, status: editStatus, summary: editSummary, thumbnail: editThumbnail, isFeatured: editFeatured }
            : a,
        ),
      );
      setEditingArticle(null);
    } finally {
      setIsSubmitting(false);
    }
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

  const handleCreate = async () => {
    if (!createDraft.title || !createDraft.content) {
      setCreateMessage("Vui lòng nhập tiêu đề và nội dung.");
      return;
    }

    setIsSubmitting(true);
    setCreateMessage("");

    try {
      const payload: CreateArticleRequest = {
        title: createDraft.title,
        content: createDraft.content,
        category: categoryToApi[createDraft.category],
      };
      if (createDraft.summary) payload.summary = createDraft.summary;
      if (createDraft.thumbnail) payload.thumbnail = createDraft.thumbnail;
      if (createDraft.isFeatured) payload.isFeatured = true;
      if (createDraft.status !== "Bản nháp") payload.status = mapAdminStatusToArticleStatus(createDraft.status);

      const created = await createArticle(payload);
      setArticles((current) => [apiArticleToAdminArticle(created), ...current]);

      setCreateDraft(initialCreateDraft);
      setIsCreateOpen(false);
    } catch {
      setCreateMessage("Chưa thể tạo bài viết, vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <AdminHeader title="Quản lý tin tức" description="Quản lý nội dung tin tức, trạng thái xuất bản và lượt xem." />
      <main className="flex-1 overflow-y-auto p-5 lg:p-7 space-y-5 pb-12">
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-5"><div className="text-sm font-bold text-gray-500 mb-2">Tổng bài viết</div><div className="text-3xl font-extrabold text-gray-900">{articles.length}</div></div>
          <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-5"><div className="text-sm font-bold text-gray-500 mb-2">Đã xuất bản</div><div className="text-3xl font-extrabold text-gray-900">{articles.filter((a) => a.status === "Đã xuất bản").length}</div></div>
          <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-5"><div className="text-sm font-bold text-gray-500 mb-2">Bản nháp</div><div className="text-3xl font-extrabold text-gray-900">{articles.filter((a) => a.status === "Bản nháp").length}</div></div>
          <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-5"><div className="text-sm font-bold text-gray-500 mb-2">Tổng lượt xem</div><div className="text-3xl font-extrabold text-gray-900">{totalViews.toLocaleString("vi-VN")}</div></div>
        </section>

        <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col xl:flex-row gap-3 xl:items-center xl:justify-between">
          <div className="relative w-full xl:max-w-[420px]">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm theo tiêu đề, slug, tác giả" className="w-full h-11 rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-4 text-sm font-medium outline-none focus:border-[#e03c31] focus:bg-white" />
          </div>
          <div className="flex flex-wrap gap-3">
            <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value as (typeof categoryOptions)[number])} className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm font-bold text-gray-700 outline-none focus:border-[#e03c31]">
              {categoryOptions.map((c) => <option key={c}>{c === "Tất cả" ? "Tất cả danh mục" : c}</option>)}
            </select>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as (typeof statusOptions)[number])} className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm font-bold text-gray-700 outline-none focus:border-[#e03c31]">
              {statusOptions.map((s) => <option key={s}>{s === "Tất cả" ? "Tất cả trạng thái" : s}</option>)}
            </select>
            <button onClick={() => setIsCreateOpen(true)} className="h-11 rounded-lg border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"><Plus className="w-4 h-4" /> Viết bài</button>
            <button onClick={() => downloadCsv(filteredArticles)} className="h-11 rounded-lg bg-gray-900 px-4 text-white text-sm font-bold hover:bg-black transition-colors flex items-center gap-2"><Download className="w-4 h-4" /> Xuất CSV</button>
          </div>
        </section>

        <AdminTableShell title="Danh sách bài viết" description={`${filteredArticles.length} bài viết phù hợp bộ lọc hiện tại`}>
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
                        <button onClick={() => openEdit(article)} className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-extrabold text-gray-700 hover:bg-white hover:border-gray-300 flex items-center gap-1.5"><Pencil className="w-3.5 h-3.5" /> Sửa</button>
                        <button onClick={() => removeArticle(article.id)} className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-extrabold text-rose-600 hover:bg-rose-50 flex items-center gap-1.5"><Trash2 className="w-3.5 h-3.5" /> Xóa</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </AdminTableShell>
      </main>

      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
          <div className="w-full max-w-[640px] max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl border border-gray-100">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
              <div><h2 className="text-lg font-extrabold text-gray-900">Viết bài mới</h2><p className="text-xs font-medium text-gray-500 mt-1">Tạo bài viết và lưu dưới dạng bản nháp hoặc xuất bản ngay</p></div>
              <button onClick={() => setIsCreateOpen(false)} className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              {createMessage && <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm font-bold text-[#e03c31]">{createMessage}</div>}
              <label className="block">
                <span className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Tiêu đề *</span>
                <input value={createDraft.title} onChange={(event) => setCreateDraft((d) => ({ ...d, title: event.target.value }))} className="mt-2 w-full h-11 rounded-lg border border-gray-200 px-3 font-bold outline-none focus:border-[#e03c31]" />
              </label>
              <label className="block">
                <span className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Nội dung *</span>
                <div className="mt-2">
                  <RichTextEditor value={createDraft.content} onChange={(html) => setCreateDraft((d) => ({ ...d, content: html }))} placeholder="Nhập nội dung bài viết..." />
                </div>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Danh mục</span>
                  <select value={createDraft.category} onChange={(event) => setCreateDraft((d) => ({ ...d, category: event.target.value as (typeof editCategoryOptions)[number] }))} className="mt-2 w-full h-11 rounded-lg border border-gray-200 px-3 font-bold outline-none focus:border-[#e03c31]">
                    {editCategoryOptions.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Trạng thái</span>
                  <select value={createDraft.status} onChange={(event) => setCreateDraft((d) => ({ ...d, status: event.target.value as AdminArticleStatus }))} className="mt-2 w-full h-11 rounded-lg border border-gray-200 px-3 font-bold outline-none focus:border-[#e03c31]">
                    {editStatusOptions.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </label>
              </div>
              <label className="block">
                <span className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Tóm tắt</span>
                <textarea value={createDraft.summary} onChange={(event) => setCreateDraft((d) => ({ ...d, summary: event.target.value }))} rows={2} className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-3 font-medium outline-none focus:border-[#e03c31] resize-none" />
              </label>
              <label className="block">
                <span className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Ảnh thumbnail (URL)</span>
                <input value={createDraft.thumbnail} onChange={(event) => setCreateDraft((d) => ({ ...d, thumbnail: event.target.value }))} className="mt-2 w-full h-11 rounded-lg border border-gray-200 px-3 font-bold outline-none focus:border-[#e03c31]" />
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={createDraft.isFeatured} onChange={(event) => setCreateDraft((d) => ({ ...d, isFeatured: event.target.checked }))} className="w-4 h-4 rounded border-gray-300 text-[#e03c31] focus:ring-[#e03c31]" />
                <span className="text-sm font-bold text-gray-700">Đánh dấu bài viết nổi bật</span>
              </label>
            </div>
            <div className="px-5 py-4 bg-gray-50 flex justify-end gap-3 sticky bottom-0 rounded-b-2xl">
              <button onClick={() => setIsCreateOpen(false)} className="h-10 px-4 rounded-lg border border-gray-200 bg-white text-sm font-bold text-gray-700 hover:bg-gray-50">Hủy</button>
              <button onClick={handleCreate} disabled={isSubmitting} className="h-10 px-4 rounded-lg bg-[#e03c31] text-white text-sm font-extrabold hover:bg-[#c43329] disabled:opacity-60 disabled:cursor-not-allowed">{isSubmitting ? "Đang tạo..." : "Tạo bài viết"}</button>
            </div>
          </div>
        </div>
      )}

      {editingArticle && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
          <div className="w-full max-w-[640px] max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl border border-gray-100">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
              <div><h2 className="text-lg font-extrabold text-gray-900">Sửa bài viết</h2><p className="text-xs font-medium text-gray-500 mt-1">/{editingArticle.slug}</p></div>
              <button onClick={() => setEditingArticle(null)} className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <label className="block">
                <span className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Tiêu đề</span>
                <input value={editTitle} onChange={(event) => setEditTitle(event.target.value)} className="mt-2 w-full h-11 rounded-lg border border-gray-200 px-3 font-bold outline-none focus:border-[#e03c31]" />
              </label>
              <label className="block">
                <span className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Nội dung (để trống nếu không đổi)</span>
                <div className="mt-2">
                  <RichTextEditor value={editContent} onChange={(html) => setEditContent(html)} placeholder="Nhập nội dung bài viết..." />
                </div>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Danh mục</span>
                  <select value={editCategory} onChange={(event) => setEditCategory(event.target.value as (typeof editCategoryOptions)[number])} className="mt-2 w-full h-11 rounded-lg border border-gray-200 px-3 font-bold outline-none focus:border-[#e03c31]">
                    {editCategoryOptions.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Trạng thái</span>
                  <select value={editStatus} onChange={(event) => setEditStatus(event.target.value as AdminArticleStatus)} className="mt-2 w-full h-11 rounded-lg border border-gray-200 px-3 font-bold outline-none focus:border-[#e03c31]">
                    {editStatusOptions.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </label>
              </div>
              <label className="block">
                <span className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Tóm tắt</span>
                <textarea value={editSummary} onChange={(event) => setEditSummary(event.target.value)} rows={2} className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-3 font-medium outline-none focus:border-[#e03c31] resize-none" />
              </label>
              <label className="block">
                <span className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Ảnh thumbnail (URL)</span>
                <input value={editThumbnail} onChange={(event) => setEditThumbnail(event.target.value)} className="mt-2 w-full h-11 rounded-lg border border-gray-200 px-3 font-bold outline-none focus:border-[#e03c31]" />
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={editFeatured} onChange={(event) => setEditFeatured(event.target.checked)} className="w-4 h-4 rounded border-gray-300 text-[#e03c31] focus:ring-[#e03c31]" />
                <span className="text-sm font-bold text-gray-700">Đánh dấu bài viết nổi bật</span>
              </label>
            </div>
            <div className="px-5 py-4 bg-gray-50 flex justify-end gap-3 sticky bottom-0 rounded-b-2xl">
              <button onClick={() => setEditingArticle(null)} className="h-10 px-4 rounded-lg border border-gray-200 bg-white text-sm font-bold text-gray-700 hover:bg-gray-50">Hủy</button>
              <button onClick={saveEdit} disabled={isSubmitting} className="h-10 px-4 rounded-lg bg-[#e03c31] text-white text-sm font-extrabold hover:bg-[#c43329] disabled:opacity-60 disabled:cursor-not-allowed">{isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
