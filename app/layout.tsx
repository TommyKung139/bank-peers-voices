import type { Metadata } from "next";
import { Noto_Sans_TC } from "next/font/google";
import "./globals.css";

const notoSansTC = Noto_Sans_TC({
  variable: "--font-noto-sans-tc",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "競品訪查、資訊整理及用戶評分彙整 Dashboard",
  description: "監控國泰、玉山、中信、富邦、台新、LineBank 六家銀行 App 的用戶評論與競品功能更新，並提供 AI 摘要。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-TW" className={`${notoSansTC.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)] font-[family-name:var(--font-noto-sans-tc)]">
        {children}
      </body>
    </html>
  );
}
