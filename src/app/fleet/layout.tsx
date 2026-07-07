import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Fleet",
  description: "Browse TRUXO's extensive fleet of heavy equipment including JCB Excavators, Hyundai Trucks, Develon Wheel Excavators, and Industrial Forklifts."
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
