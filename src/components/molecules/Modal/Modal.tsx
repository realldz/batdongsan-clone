"use client";

import React, { useRef } from "react";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { useClickOutside } from "@/hooks/useClickOutside";
import { Icon } from "@/components/atoms/Icon";
import { cn } from "@/lib/utils";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closeOnClickOutside?: boolean;
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  closeOnClickOutside = true,
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when modal is open
  useBodyScrollLock(isOpen);

  // Close on ESC key
  useEscapeKey(onClose, isOpen);

  // Close on click outside
  useClickOutside(modalRef, () => {
    if (closeOnClickOutside) {
      onClose();
    }
  });

  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-5xl",
    full: "max-w-full h-full rounded-none",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => {
          if (closeOnClickOutside) onClose();
        }}
      />

      {/* Modal Container */}
      <div
        ref={modalRef}
        className={cn(
          "relative bg-white rounded-2xl shadow-xl w-full flex flex-col overflow-hidden max-h-[90vh] transition-all transform scale-100",
          sizes[size]
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="text-base font-bold text-gray-900">
            {title || <div className="h-4" />}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <Icon name="X" size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {children}
        </div>
      </div>
    </div>
  );
};
