import React from "react";
import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { cn } from "@/lib/utils";

interface PublicPageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function PublicPageLayout({ children, className }: PublicPageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-white">
      <Header />
      <main className={cn("flex-1 w-full", className)}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
