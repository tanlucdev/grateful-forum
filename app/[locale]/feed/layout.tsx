import localFont from "next/font/local";
import type { ReactNode } from "react";

const plusJakartaSans = localFont({
  src: "../../fonts/plus-jakarta-sans.ttf",
  weight: "200 800",
  display: "swap",
});

export default function FeedLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <div className={plusJakartaSans.className}>{children}</div>;
}
