import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth-store";
import { FavoritesProvider } from "@/lib/favorites-store";
import { NotificationsProvider } from "@/lib/notifications-store";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Batdongsan.com.vn",
  description: "A visually stunning clone of batdongsan.com.vn",
};

const roboto = Roboto({
  subsets: ["vietnamese"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body
        className={`${roboto.variable} antialiased selection:bg-primary selection:text-white`}
      >
        <AuthProvider>
          <FavoritesProvider>
            <NotificationsProvider>
              {children}
              <Toaster position="top-center" richColors />
            </NotificationsProvider>
          </FavoritesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
