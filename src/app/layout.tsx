import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import MobileTabBar from "@/components/layout/MobileTabBar";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MANDLE — Style is Presence",
  description:
    "스킨헤드 IT 프로페셔널을 위한 프리미엄 스타일링 플랫폼. 테크와 미학 사이, 당신의 존재감을 디자인하세요.",
  metadataBase: new URL("https://mandle.kr"),
  openGraph: {
    title: "MANDLE — Style is Presence",
    description:
      "스킨헤드 IT 프로페셔널을 위한 프리미엄 스타일링 플랫폼. 테크와 미학 사이, 당신의 존재감을 디자인하세요.",
    url: "https://mandle.kr",
    siteName: "MANDLE",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${inter.variable} ${geist.variable} antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('error', function(e) {
                if (e.filename && (e.filename.includes('chrome-extension://') || e.filename.includes('moz-extension://'))) {
                  e.stopImmediatePropagation();
                  e.preventDefault();
                }
              }, true);
              window.addEventListener('unhandledrejection', function(e) {
                var reason = (e.reason && e.reason.message) || String(e.reason || '');
                if (reason.includes('chrome-extension://') || reason.includes('moz-extension://') || reason.includes('MetaMask')) {
                  e.stopImmediatePropagation();
                  e.preventDefault();
                }
              }, true);
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col pb-14 md:pb-0">
        <NavBar />
        {children}
        <Footer />
        <MobileTabBar />
      </body>
    </html>
  );
}
