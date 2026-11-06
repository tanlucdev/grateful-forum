import type { Metadata } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import "./globals.css";
import { cn } from "@/lib/utils";

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
  title: "Grateful Forum",
  description: "A mobile-first gratitude journal.",
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
      </body>
    </html>
  );
}
