import type { ReactNode } from "react";

export interface AdminPageTemplateProps {
  header: ReactNode;
  children: ReactNode;
}

export function AdminPageTemplate({ header, children }: AdminPageTemplateProps) {
  return (
    <>
      {header}
      <main className="flex-1 overflow-y-auto p-5 lg:p-7 space-y-5 pb-12">
        {children}
      </main>
    </>
  );
}
