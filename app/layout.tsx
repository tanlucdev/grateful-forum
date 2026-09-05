import type { Metadata } from "next";
import { Manrope, Quicksand } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import { AppShell } from "@/components/app-shell";
import { loadOwnProfileDashboard } from "@/lib/profile/load-own-profile";

const manrope = Manrope({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
});

const quicksand = Quicksand({
  subsets: ["latin", "vietnamese"],
  variable: "--font-quicksand",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "BeGrateful",
  description: "A mobile-first gratitude journal.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const dashboard = await loadOwnProfileDashboard();
  const displayName = dashboard?.profile.displayName || "Minh Trần";
  const slug = displayName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return (
    <html lang="vi">
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${manrope.className} ${quicksand.variable}`}>
        <AppShell
          profile={{
            avatarUrl: dashboard?.profile.avatarUrl || "/stitch/profile/avatar-desktop.jpg",
            displayName,
            email: `${slug.replace(/-/g, ".")}@example.com`,
            streak: dashboard?.streak || 3,
          }}
        >
          {children}
        </AppShell>
      </body>
    </html>
  );
}
