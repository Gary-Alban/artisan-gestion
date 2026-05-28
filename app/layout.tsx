import type { Metadata } from "next";
import { RouteLoadingIndicator } from "@/components/route-loading-indicator";
import "./globals.css";

export const metadata: Metadata = {
  title: "Artisan Gestion | Audit pre-acquisition",
  description:
    "Auto-audit pre-acquisition de fonds de commerce par Artisan Gestion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" data-scroll-behavior="smooth">
      <body suppressHydrationWarning>
        <RouteLoadingIndicator />
        {children}
      </body>
    </html>
  );
}
