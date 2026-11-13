import type { Metadata } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/next";

const geist = localFont({
  src: "./fonts/geist.ttf",
  variable: "--font-sans",
  weight: "100 900",
  display: "swap",
});

const manrope = localFont({
  src: "./fonts/manrope.ttf",
  weight: "200 800",
  display: "swap",
});

const quicksand = localFont({
  src: "./fonts/quicksand.ttf",
  variable: "--font-quicksand",
  weight: "300 700",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "http://localhost:3000"),
  ),
  title: "Grateful Forum",
  description: "A mobile-first gratitude journal.",
  twitter: { card: "summary_large_image" },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html data-scroll-behavior="smooth" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body className={`${manrope.className} ${quicksand.variable}`} suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
