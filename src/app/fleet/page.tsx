"use client";

import React, { useState } from "react";
import { fleetInventory } from "@/data";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, MapPin, Calendar, Compass, Layers, X, Info } from "lucide-react";
import Link from "next/link";

// Expanded dummy specs for the modal
const specsMapping: Record<string, Record<string, string>> = {
  "Forklift": {
    "capacity": "2.5 - 5.0 Tons",
    "engine": "Diesel / Electric Quad-Motor",
    "max lift height": "4.5 Meters",
    "mast type": "Triplex Full Free Lift",
    "tyres": "Solid Pneumatic (Non-marking optional)"
  },
  "JCB": {
    "bucket capacity": "1.0 m³",
    "max digging depth": "4.37 Meters",
    "engine power": "74 HP",
    "transmission": "EasyShift manual sync",
    "steering": "Hydrostatic power steering"
  },
  "DEVELON": {
    "operating weight": "18.5 Tons",
    "bucket capacity": "0.86 m³",
    "max reach": "9.15 Meters",
    "max digging depth": "6.0 Meters",
    "engine model": "DEVELON DL06 Engine"
  },
  "Hyundai": {
    "operating weight": "22.0 Tons",
    "bucket capacity": "1.2 m³",
    "max reach": "9.82 Meters",
    "max digging depth": "6.73 Meters",
    "engine model": "Hyundai HM5.9 Engine"
  }
};

export default function FleetPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeItem, setActiveItem] = useState<typeof fleetInventory[0] | null>(null);

  const categories = ["All", "Forklift", "DEVELON", "JCB", "Hyundai"];

  const filteredInventory = selectedCategory === "All"
    ? fleetInventory
    : fleetInventory.filter(item => item.category === selectedCategory);

  return (
    <main className="min-h-screen pt-36 pb-20 bg-[#F5F2EB] text-[#12131A] relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center lg:text-left"
        >
          <h1 className="text-xs font-black uppercase tracking-widest text-[#A51A1A] font-orbitron mb-3">our equipment</h1>
          <h2 className="text-2xl md:text-4xl lg:text-5xl lg:text-6xl font-black mb-4 text-[#12131A] uppercase tracking-tight font-orbitron">the truxo fleet</h2>
          <p className="text-gray-500 text-lg font-semibold max-w-2xl leading-relaxed">
            Explore our ready-to-deploy, certified fleet of heavy machinery and material handling equipment.
          </p>
        </motion.div>

        {/* Filter Categories Tabs */}
        <div className="flex overflow-x-auto snap-x snap-mandatory lg:flex-wrap gap-3 pb-4 mb-12 lg:pb-0 scrollbar-hide w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 snap-start px-6 py-2.5 rounded-full text-sm font-bold border transition-all duration-200 uppercase tracking-wider cursor-pointer active:scale-95 ${
                selectedCategory === cat
                  ? "bg-[#12131A] text-[#F5F2EB] border-transparent shadow-md"
                  : "bg-white text-[#12131A] border-black/10 hover:bg-[#F5F2EB]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Fleet Grid */}
        <motion.div 
          layout 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredInventory.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                key={item.id}
                onClick={() => setActiveItem(item)}
                className="group rounded-2xl bg-white border border-black/5 shadow-lg hover:shadow-2xl hover:-translate-y-1 active:scale-95 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
              >
                {/* Visual Header */}
                <div className="p-8 pb-4 relative">
                  <div className="absolute top-8 right-8 w-9 h-9 rounded-full bg-[#A51A1A]/10 flex items-center justify-center text-[#A51A1A]">
                    <Info className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-wider text-[#A51A1A] block mb-2 font-orbitron">{item.type}</span>
                  <h3 className="text-2xl font-black text-[#12131A] tracking-tight uppercase font-orbitron">{item.brand}</h3>
                </div>

                {/* Specs Section */}
                <div className="p-8 pt-4 space-y-4 border-t border-black/5 bg-[#F5F2EB]/30 font-semibold text-[#12131A]">
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#C5A059]" />
                      <span className="lowercase">year: {item.year}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#C5A059]" />
                      <span className="lowercase">{item.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Compass className="w-4 h-4 text-[#C5A059]" />
                      <span className="lowercase">plate: {item.plate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#C5A059]" />
                      <span className="lowercase">qty: {item.qty}</span>
                    </div>
                  </div>
                </div>
                
                {/* Card CTA */}
                <div className="p-6 pt-0 border-t border-black/5 bg-[#F5F2EB]/30">
                  <Link href={`/fleet/${item.id}`} className="block text-center w-full py-3.5 rounded-xl bg-gradient-to-r from-[#DFBA73] to-[#C5A059] text-[#12131A] font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-105 transition-all cursor-pointer">view specifications</Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      
    </main>
  );
}
