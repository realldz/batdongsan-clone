import React from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/atoms/Icon";
import type { VipBadge as VipBadgeLevel } from "@/services/properties";

const VIP_LABELS: Record<Exclude<VipBadgeLevel, "none">, string> = {
  diamond: "VIP Kim Cương",
  gold: "VIP Vàng",
  silver: "VIP Bạc",
};

const VIP_STYLES: Record<Exclude<VipBadgeLevel, "none">, string> = {
  diamond: "bg-gradient-to-r from-[#e03c31] to-[#f0653b] text-white",
  gold: "bg-gradient-to-r from-[#d4a017] to-[#e8c14a] text-white",
  silver: "bg-[#8a9199] text-white",
};

export interface VipBadgeProps {
  vipBadge: VipBadgeLevel;
  isPushed?: boolean;
  className?: string;
}

export const VipBadge = ({ vipBadge, isPushed = false, className }: VipBadgeProps) => {
  if (vipBadge === "none" && !isPushed) {
    return null;
  }

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {vipBadge !== "none" && (
        <span
          className={cn(
            "inline-flex items-center font-bold tracking-wide rounded uppercase shadow-sm px-2.5 py-1 text-[10px]",
            VIP_STYLES[vipBadge],
          )}
        >
          {VIP_LABELS[vipBadge]}
        </span>
      )}
      {isPushed && (
        <span className="inline-flex items-center gap-1 font-bold tracking-wide rounded uppercase shadow-sm px-2 py-1 text-[10px] bg-[#f0653b] text-white">
          <Icon name="TrendingUp" size={12} />
          Đẩy tin
        </span>
      )}
    </div>
  );
};
