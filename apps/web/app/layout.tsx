import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_TITLE = "TrendMap — 사전 알림 신청";
const SITE_DESCRIPTION =
  "인스타·네이버 지도 번갈아 켜지 않아도, 지금 여기 핫한 메뉴와 진짜 후기를 한 번에. 출시 사전 알림을 이메일로 받아보세요.";
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://trendmap.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  applicationName: "TrendMap",
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: "website",
    locale: "ko_KR",
    siteName: "TrendMap",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
