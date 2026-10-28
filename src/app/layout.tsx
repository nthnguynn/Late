import type { Metadata } from "next";
import { Oswald, Montserrat } from "next/font/google";
import "./globals.css";
import "./overrides.css";

const oswald = Oswald({
  variable: "--oswald",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ngaleader.com"),
  title: "2 buổi miễn phí tìm hiểu Affiliate | Nga Leader",
  description:
    "Khám phá Affiliate từ cơ bản đến thực hành qua 2 buổi hướng dẫn miễn phí dành cho người mới.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="vi"
      className={`${oswald.variable} ${montserrat.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
