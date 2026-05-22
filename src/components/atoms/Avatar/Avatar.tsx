import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface AvatarProps {
  src?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const Avatar = ({ src, name = "User", size = "md", className }: AvatarProps) => {
  const [error, setError] = useState(false);

  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  };

  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg",
  };

  const hasImage = src && !error;

  return (
    <div
      className={cn(
        "relative rounded-full overflow-hidden bg-gray-100 border border-gray-100 flex items-center justify-center font-bold text-gray-600 select-none flex-shrink-0",
        sizes[size],
        className
      )}
    >
      {hasImage ? (
        <Image
          src={src}
          alt={name}
          fill
          sizes="(max-width: 768px) 64px, 128px"
          className="object-cover"
          onError={() => setError(true)}
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
};
