import { ProtectedRoute } from "@/components/ProtectedRoute/ProtectedRoute";

export default function WalletRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute requireAuth={true}>{children}</ProtectedRoute>;
}
