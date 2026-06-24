"use client";

import { useEffect, useState } from "react";
import type { AdminArticle, AdminArticleStatus } from "../../_data/types";
import { AdminModal } from "../molecules/AdminModal";
import { FormField } from "../molecules/FormField";
import { ActionButton } from "../atoms/ActionButton";
import RichTextEditor from "@/components/RichTextEditor/RichTextEditor";

const editCategoryOptions = ["Thị trường", "Pháp lý", "Phong thủy", "Dự án", "Tổng hợp"] as const;
const editStatusOptions = ["Đã xuất bản", "Bản nháp", "Đã lưu trữ"] as const;

export interface ArticleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    title: string;
    content: string;
    category: typeof editCategoryOptions[number];
    status: AdminArticleStatus;
    summary: string;
    thumbnail: string;
    isFeatured: boolean;
  }) => Promise<void>;
  article?: AdminArticle | null;
}

export function ArticleFormModal({
  isOpen,
  onClose,
  onSave,
  article = null,
}: ArticleFormModalProps) {
  const isEdit = !!article;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<typeof editCategoryOptions[number]>("Tổng hợp");
  const [status, setStatus] = useState<AdminArticleStatus>("Bản nháp");
  const [summary, setSummary] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (article) {
        setTitle(article.title);
        setContent(article.content);
        setCategory(
          editCategoryOptions.includes(article.category as typeof editCategoryOptions[number])
            ? (article.category as typeof editCategoryOptions[number])
            : "Tổng hợp"
        );
        setStatus(article.status);
        setSummary(article.summary ?? "");
        setThumbnail(article.thumbnail ?? "");
        setIsFeatured(article.isFeatured);
      } else {
        setTitle("");
        setContent("");
        setCategory("Tổng hợp");
        setStatus("Bản nháp");
        setSummary("");
        setThumbnail("");
        setIsFeatured(false);
      }
      setErrorMsg("");
      setIsSubmitting(false);
    }
  }, [isOpen, article]);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      setErrorMsg("Vui lòng nhập tiêu đề và nội dung.");
      return;
    }
    setErrorMsg("");
    setIsSubmitting(true);
    try {
      await onSave({
        title,
        content,
        category,
        status,
        summary,
        thumbnail,
        isFeatured,
      });
      onClose();
    } catch (err) {
      const error = err as { message?: string };
      setErrorMsg(error.message || "Đã xảy ra lỗi, vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const footer = (
    <>
      <ActionButton variant="secondary" onClick={onClose}>
        Hủy
      </ActionButton>
      <ActionButton 
        variant="primary" 
        onClick={handleSubmit} 
        disabled={isSubmitting}
      >
        {isSubmitting 
          ? (isEdit ? "Đang lưu..." : "Đang tạo...") 
          : (isEdit ? "Lưu thay đổi" : "Tạo bài viết")}
      </ActionButton>
    </>
  );

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? `Sửa bài viết: ${article.slug}` : "Viết bài mới"}
      footer={footer}
      size="lg"
    >
      <div className="space-y-4">
        {errorMsg && (
          <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm font-bold text-[#e03c31]">
            {errorMsg}
          </div>
        )}

        <FormField label="Tiêu đề *">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full h-11 rounded-lg border border-gray-200 px-3 font-bold outline-none focus:border-[#e03c31] text-sm bg-white"
          />
        </FormField>

        <FormField label="Nội dung *">
          <div className="mt-2">
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Nhập nội dung bài viết..."
            />
          </div>
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Danh mục">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as typeof editCategoryOptions[number])}
              className="w-full h-11 rounded-lg border border-gray-200 px-3 font-bold outline-none focus:border-[#e03c31] text-sm bg-white"
            >
              {editCategoryOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Trạng thái">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as AdminArticleStatus)}
              className="w-full h-11 rounded-lg border border-gray-200 px-3 font-bold outline-none focus:border-[#e03c31] text-sm bg-white"
            >
              {editStatusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <FormField label="Tóm tắt">
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-gray-200 px-3 py-3 font-medium outline-none focus:border-[#e03c31] resize-none text-sm bg-white"
          />
        </FormField>

        <FormField label="Ảnh thumbnail (URL)">
          <input
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            className="w-full h-11 rounded-lg border border-gray-200 px-3 font-bold outline-none focus:border-[#e03c31] text-sm bg-white"
          />
        </FormField>

        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-[#e03c31] focus:ring-[#e03c31]"
          />
          <span className="text-sm font-bold text-gray-700">Đánh dấu bài viết nổi bật</span>
        </label>
      </div>
    </AdminModal>
  );
}
