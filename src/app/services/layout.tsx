import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Services",
  description: "Explore TRUXO's wide range of heavy equipment rental services, including short and long-term leasing, maintenance, and rapid transport."
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
