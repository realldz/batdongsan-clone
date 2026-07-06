"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-store";
import { Role, hasAnyPermission } from "@/lib/role.constant";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: Role[];
  requireAuth?: boolean;
}

export function ProtectedRoute({
  children,
  requiredRoles,
  requireAuth = false,
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (requireAuth && !isAuthenticated) {
      router.push("/");
      return;
    }

    if (requiredRoles && requiredRoles.length > 0) {
      if (!isAuthenticated || !hasAnyPermission(user?.role, requiredRoles)) {
        router.push("/");
        return;
      }
    }
  }, [isLoading, isAuthenticated, user, requiredRoles, requireAuth, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-[#e03c31]" />
          <p className="text-sm font-medium text-slate-500">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Ngăn hiển thị nội dung trước khi quá trình chuyển hướng bắt đầu/hoàn tất
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  if (requiredRoles && requiredRoles.length > 0) {
    if (!isAuthenticated || !hasAnyPermission(user?.role, requiredRoles)) {
      return null;
    }
  }

  return <>{children}</>;
}
