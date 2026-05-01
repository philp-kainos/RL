import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://freemanfirewood.co.uk"),
  title: {
    default: "Freeman Firewood — Kiln-Dried Logs & Woodchip",
    template: "%s | Freeman Firewood",
  },
  description:
    "Premium kiln-dried hardwood logs and woodchip delivered across Herefordshire, Gloucestershire and Worcestershire.",
  openGraph: {
    type: "website",
    siteName: "Freeman Firewood",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
          <Header />
          {children}
          <Footer />
        </body>
    </html>
  );
}
