import { ProtectedRoute } from "@/components/ProtectedRoute/ProtectedRoute";

export default function NguoiBanRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute requireAuth={true}>{children}</ProtectedRoute>;
}
