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
  title: "Grateful Forum",
  description: "A mobile-first gratitude journal.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const dashboard = await loadOwnProfileDashboard();
  const authenticated = Boolean(dashboard);
  return (
    <html data-scroll-behavior="smooth" lang="vi" suppressHydrationWarning>
      <body className={`${manrope.className} ${quicksand.variable}`} suppressHydrationWarning>
        <AppShell
          authenticated={authenticated}
          profile={{
            avatarUrl: dashboard?.profile.avatarUrl || "/stitch/profile/avatar-desktop.jpg",
            displayName: dashboard?.profile.displayName || "Tài khoản",
            email: dashboard?.profile.email || "",
            signedIn: authenticated,
            streak: dashboard?.streak || 0,
          }}
        >
          {children}
        </AppShell>
      </body>
    </html>
  );
}
