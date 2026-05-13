"use client";

import { useFavorites } from "@/lib/favorites-store";
import { Heart } from "lucide-react";
import { useState, type MouseEvent } from "react";

interface FavoriteButtonProps {
  propertyId: string;
  className?: string;
  iconClassName?: string;
  activeClassName?: string;
  inactiveClassName?: string;
  stopPropagation?: boolean;
}

export function FavoriteButton({
  propertyId,
  className = "border border-gray-300 text-gray-500 hover:text-primary hover:border-primary p-1.5 rounded transition-all bg-white",
  iconClassName = "h-4 w-4",
  activeClassName = "text-[#e03c31] border-[#e03c31]",
  inactiveClassName = "",
  stopPropagation = true,
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(propertyId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleClick = async (event: MouseEvent<HTMLButtonElement>) => {
    if (stopPropagation) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (isSubmitting) return;

    setIsSubmitting(true);
    setMessage("");

    try {
      const success = await toggleFavorite(propertyId);
      if (!success) {
        setMessage("Cần đăng nhập");
      }
    } catch {
      setMessage("Cần đăng nhập");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={handleClick}
        disabled={isSubmitting}
        aria-label={favorited ? "Bỏ lưu tin" : "Lưu tin"}
        title={message || (favorited ? "Đã lưu" : "Lưu tin")}
        className={`${className} ${favorited ? activeClassName : inactiveClassName} disabled:cursor-not-allowed disabled:opacity-60`}
      >
        <Heart className={iconClassName} fill={favorited ? "currentColor" : "none"} />
      </button>
      {message && (
        <span className="absolute right-0 top-[calc(100%+6px)] z-20 whitespace-nowrap rounded-lg bg-gray-900 px-2 py-1 text-[11px] font-bold text-white shadow-lg">
          {message}
        </span>
      )}
    </span>
  );
}
