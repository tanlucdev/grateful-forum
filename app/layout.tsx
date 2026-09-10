import type { Metadata } from "next";
import { Manrope, Quicksand } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import { AppShell } from "@/components/app-shell";
import { loadOwnShellProfile } from "@/lib/profile/load-own-profile";

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
  const profile = await loadOwnShellProfile();
  const authenticated = Boolean(profile);
  return (
    <html data-scroll-behavior="smooth" lang="vi" suppressHydrationWarning>
      <body className={`${manrope.className} ${quicksand.variable}`} suppressHydrationWarning>
        <AppShell
          profile={{
            avatarUrl: profile?.avatarUrl || "",
            displayName: profile?.displayName || "Tài khoản",
            email: profile?.email || "",
            signedIn: authenticated,
            streak: profile?.streak || 0,
          }}
        >
          {children}
        </AppShell>
      </body>
    </html>
  );
}
