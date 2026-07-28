import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Industry Insights Dubai",
  description: "Read the latest news, case studies, and insights from TRUXO Heavy Equipment Rental on the UAE construction and industrial sectors.",
  keywords: ["construction news Dubai", "heavy equipment insights UAE", "TRUXO news", "UAE industrial projects", "machinery case studies"]
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
