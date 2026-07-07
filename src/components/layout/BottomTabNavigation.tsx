"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Truck, ShieldAlert, PhoneCall } from "lucide-react";

export default function BottomTabNavigation() {
  const pathname = usePathname();

  const tabs = [
    { href: "/", label: "home", icon: Home },
    { href: "/fleet", label: "fleet", icon: Truck },
    { href: "/services", label: "services", icon: ShieldAlert },
    { href: "/contact", label: "contact", icon: PhoneCall },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full z-50">
      <div className="bg-[#111113]/95 backdrop-blur-xl border-t border-white/10 pt-3 pb-8 px-6 flex justify-around items-center shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-col items-center gap-1.5 group"
            >
              <Icon 
                className={`w-5 h-5 transition-all ${
                  isActive ? "text-[#C5A059] scale-110" : "text-gray-400 group-hover:text-white"
                }`} 
              />
              <span 
                className={`text-[9px] font-black tracking-wider uppercase transition-colors ${
                  isActive ? "text-[#C5A059]" : "text-gray-400 group-hover:text-white"
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
