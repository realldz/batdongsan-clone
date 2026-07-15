"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import { useCallback, useRef, useState } from "react";

import { uploadArticleImage } from "@/services/upload";
import { RichTextToolbar } from "./RichTextToolbar";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: false,
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-[#e03c31] underline" },
      }),
      ImageExtension.configure({
        HTMLAttributes: { class: "rounded-lg max-w-full my-4" },
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-[200px] px-4 py-3",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
  }, [editor]);

  const handleImageButton = useCallback(() => {
    setUploadError("");
    fileInputRef.current?.click();
  }, []);

  const handleFileSelected = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file || !editor) return;

      if (!file.type.startsWith("image/")) {
        setUploadError("Vui lòng chọn tệp hình ảnh.");
        return;
      }

      setIsUploading(true);
      setUploadError("");
      try {
        const result = await uploadArticleImage(file);
        const url = result.url ?? "";
        if (!url) throw new Error("Không nhận được URL ảnh từ máy chủ.");
        editor.chain().focus().setImage({ src: url }).run();
      } catch (err) {
        const error = err as { message?: string };
        setUploadError(error.message || "Tải ảnh lên thất bại, vui lòng thử lại.");
      } finally {
        setIsUploading(false);
      }
    },
    [editor]
  );

  if (!editor) {
    return (
      <div className="h-[260px] rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center text-sm font-medium text-gray-400">
        Đang tải trình soạn thảo...
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden focus-within:border-[#e03c31] transition-colors">
      <RichTextToolbar
        editor={editor}
        isUploading={isUploading}
        onSetLink={setLink}
        onInsertImage={handleImageButton}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelected}
      />
      {uploadError && (
        <div className="px-3 py-1.5 bg-red-50 border-b border-red-100 text-xs font-bold text-[#e03c31]">
          {uploadError}
        </div>
      )}
      <div className="relative">
        {editor.isEmpty && placeholder && (
          <div className="absolute inset-0 px-4 py-3 pointer-events-none text-sm text-gray-400 select-none">
            {placeholder}
          </div>
        )}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
