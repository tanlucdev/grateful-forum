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
  title: "BeGrateful",
  description: "A mobile-first gratitude journal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
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
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
