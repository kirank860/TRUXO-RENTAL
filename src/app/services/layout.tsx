import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rental Services Dubai",
  description: "Explore TRUXO's wide range of heavy equipment rental services in Dubai, including short and long-term leasing, maintenance, and rapid transport across the UAE.",
  keywords: ["heavy equipment rental services", "construction leasing Dubai", "equipment maintenance UAE", "machinery transport Dubai"]
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
