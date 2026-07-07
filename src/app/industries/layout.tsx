import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Industries We Serve",
  description: "TRUXO provides specialized heavy machinery for civil construction, mining, agriculture, logistics, and marine infrastructure across the UAE."
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
