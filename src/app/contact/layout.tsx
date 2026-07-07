import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with TRUXO Heavy Equipment Rental for pricing, mobilization schedules, and reliable material handling solutions in the UAE."
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
