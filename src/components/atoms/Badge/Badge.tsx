import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "vip" | "success" | "warning" | "danger" | "neutral" | "info";
  size?: "sm" | "md";
}

export const Badge = ({
  className,
  variant = "neutral",
  size = "md",
  children,
  ...props
}: BadgeProps) => {
  const baseStyles =
    "inline-flex items-center font-bold tracking-wide rounded uppercase shadow-sm";

  const variants = {
    vip: "bg-[#e03c31] text-white",
    success: "bg-green-100 text-green-800 border border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    danger: "bg-red-100 text-red-800 border border-red-200",
    neutral: "bg-gray-100 text-gray-800 border border-gray-200",
    info: "bg-blue-100 text-blue-800 border border-blue-200",
  };

  const sizes = {
    sm: "px-1.5 py-0.5 text-[9px]",
    md: "px-2.5 py-1 text-[10px]",
  };

  return (
    <span
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </span>
  );
};
