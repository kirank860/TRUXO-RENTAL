import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Equipment Fleet Dubai",
  description: "Browse TRUXO's extensive fleet of heavy equipment including JCB Excavators, Hyundai Trucks, Develon Wheel Excavators, and Industrial Forklifts available for rent across Dubai and the UAE.",
  keywords: ["equipment fleet Dubai", "excavator rental fleet UAE", "forklift inventory Dubai", "heavy machinery fleet", "TRUXO fleet"]
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
