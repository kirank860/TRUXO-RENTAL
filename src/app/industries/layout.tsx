import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Industries Served Dubai",
  description: "TRUXO provides specialized heavy machinery for civil construction, mining, agriculture, logistics, and marine infrastructure across Dubai and the UAE.",
  keywords: ["construction machinery UAE", "mining equipment rental Dubai", "agriculture machinery UAE", "logistics equipment rental", "civil construction equipment"]
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
