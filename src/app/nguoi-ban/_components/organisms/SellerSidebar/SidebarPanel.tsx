import React, { ReactNode, RefObject } from "react";

interface SidebarPanelProps {
  isOpen: boolean;
  panelRef: RefObject<HTMLDivElement | null>;
  children: ReactNode;
}

export function SidebarPanel({ isOpen, panelRef, children }: SidebarPanelProps) {
  return (
    <div
      ref={panelRef}
      className={`fixed top-0 left-[100px] h-full w-[260px] bg-white border-r border-gray-200 shadow-[4px_0_24px_rgba(0,0,0,0.1)] z-40 transition-transform duration-200 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {children}
    </div>
  );
}
