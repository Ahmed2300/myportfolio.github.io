import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yourportfolio.dev"),
  title: "Ahmed's Mobile App Portfolio",
  description: "Professional mobile app portfolio showcasing Flutter, Android, and iOS applications with detailed case studies and project insights.",
  openGraph: {
    title: "Ahmed's Mobile App Portfolio",
    description: "Explore a showcase of innovative mobile applications built with Flutter, Firebase, and modern development practices.",
    url: "https://yourportfolio.dev",
    images: [{ url: "images/portfolio-preview.jpg" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SmoothScrollProvider } from "@/components/providers/SmoothScroll";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body
        className={`${inter.variable} ${outfit.variable} bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-200 font-sans antialiased transition-colors duration-300 selection:bg-brand-500 selection:text-white flex min-h-screen flex-col`}
        suppressHydrationWarning
      >
        <SmoothScrollProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
