import type { Metadata } from "next";
import { Inter, Montserrat, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomTabNavigation from "@/components/layout/BottomTabNavigation";
import FAB from "@/components/layout/FAB";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-outfit",
  preload: false
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-orbitron",
  preload: false
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  preload: false
});

export const metadata: Metadata = {
  title: "TRUXO Heavy Equipment Rental",
  description: "Reliable Heavy Equipment Solutions for Construction, Industrial and Infrastructure Projects across the UAE.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body suppressHydrationWarning className={`${inter.variable} ${montserrat.variable} ${jetbrainsMono.variable} font-sans bg-[#F5F2EB] text-[#111113] antialiased pb-24 md:pb-0`}>
        <Navbar />
        {children}
        <FAB />
        <BottomTabNavigation />
        <Footer />
      </body>
    </html>
  );
}
