import type { Metadata } from "next";
import { Oswald, Montserrat } from "next/font/google";
import "./globals.css";

const oswald = Oswald({
  variable: "--oswald",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Anh Pham Leader",
  description: "Anh Pham Leader Funnel Clone",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${oswald.variable} ${montserrat.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
