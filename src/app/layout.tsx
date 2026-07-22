import type { Metadata } from "next";
import { Inter, Montserrat, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomTabNavigation from "@/components/layout/BottomTabNavigation";
import FAB from "@/components/layout/FAB";
import SmoothScroller from "@/components/layout/SmoothScroller";
import Script from "next/script";

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
  metadataBase: new URL("https://truxo.ae"),
  title: {
    template: "%s | TRUXO Heavy Equipment Rental",
    default: "TRUXO Heavy Equipment Rental - UAE's Premier Rental Service"
  },
  description: "Reliable Heavy Equipment Solutions for Construction, Industrial and Infrastructure Projects across the UAE. Excavators, Forklifts, Trucks, and more.",
  keywords: ["heavy equipment rental", "construction machinery UAE", "excavator rental", "forklift rental Dubai", "TRUXO rental", "industrial equipment UAE"],
  openGraph: {
    title: "TRUXO Heavy Equipment Rental",
    description: "Reliable Heavy Equipment Solutions for Construction, Industrial and Infrastructure Projects across the UAE.",
    url: "https://truxo.ae",
    siteName: "TRUXO",
    images: [{ url: "/logo.jpeg", width: 800, height: 600, alt: "TRUXO Logo" }],
    locale: "en_AE",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${inter.variable} ${montserrat.variable} ${jetbrainsMono.variable} font-sans bg-[#F5F2EB] text-[#111113] antialiased pb-24 md:pb-0`}>
        {/* Google Analytics */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-KGYX8P199Y" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-KGYX8P199Y');
          `}
        </Script>
        {/* Google Structured Data for Zero-Click & Rich Snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "TRUXO Heavy Equipment Rental",
              "image": "https://truxo.ae/logo.jpeg",
              "@id": "https://truxo.ae",
              "url": "https://truxo.ae",
              "telephone": "+971 54 305 8358",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Dubai",
                "addressCountry": "AE"
              },
              "description": "Reliable Heavy Equipment Solutions for Construction, Industrial and Infrastructure Projects across the UAE."
            })
          }}
        />
        <SmoothScroller>
          <Navbar />
          {children}
          <FAB />
          <BottomTabNavigation />
          <Footer />
        </SmoothScroller>
      </body>
    </html>
  );
}
