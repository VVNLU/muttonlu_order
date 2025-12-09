import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "羊肉盧冷凍包訂購網",
  description: "羊肉爐冷凍包訂購網",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex h-screen flex-col font-sans dark:bg-black bg-zinc-300">
          <Header />

          <div className="flex-1 overflow-y-auto">
            <main className="w-full mx-auto max-w-screen-md p-3 dark:bg-black bg-white sm:p-8 sm:h-full">
              {children}
            </main>
          </div>

          <Footer />
        </div>
      </body>
    </html>
  );
}
