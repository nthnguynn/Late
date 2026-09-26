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
  title: "Tạ Thị Nga | Nga Leader",
  description:
    "Website của Tạ Thị Nga – Thử thách 2 ngày Affiliate: xây dòng tiền 100 triệu/tháng chỉ bằng chiếc điện thoại.",
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
