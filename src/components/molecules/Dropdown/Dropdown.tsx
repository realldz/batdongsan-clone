import React from "react";
import { useDropdown } from "@/hooks/useDropdown";
import { cn } from "@/lib/utils";

export interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "left" | "right";
  className?: string;
  panelClassName?: string;
}

export const Dropdown = ({
  trigger,
  children,
  align = "right",
  className,
  panelClassName,
}: DropdownProps) => {
  const { isOpen, toggle, ref } = useDropdown();

  return (
    <div ref={ref} className={cn("relative inline-block text-left", className)}>
      <div onClick={toggle} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={cn(
            "absolute z-30 mt-2 rounded-xl bg-white shadow-lg border border-gray-100 py-2 min-w-[200px] transition-all transform origin-top-right focus:outline-none",
            align === "right" ? "right-0" : "left-0",
            panelClassName
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
};
