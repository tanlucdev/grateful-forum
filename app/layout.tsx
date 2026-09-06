import type { Metadata } from "next";
import { Manrope, Quicksand } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import { AppShell } from "@/components/app-shell";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${manrope.className} ${quicksand.variable}`}>
        <AppShell
          profile={{
            avatarUrl: "",
            displayName: "Tài khoản",
            email: "",
            signedIn: false,
            streak: 0,
          }}
        >
          {children}
        </AppShell>
      </body>
    </html>
  );
}
