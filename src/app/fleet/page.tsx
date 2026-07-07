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
          <h2 className="text-5xl md:text-6xl font-black mb-4 text-[#12131A] uppercase tracking-tight font-orbitron">the truxo fleet</h2>
          <p className="text-gray-500 text-lg font-semibold max-w-2xl leading-relaxed">
            Explore our ready-to-deploy, certified fleet of heavy machinery and material handling equipment.
          </p>
        </motion.div>

        {/* Filter Categories Tabs */}
        <div className="flex flex-wrap gap-3 mb-16 justify-center lg:justify-start">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold border transition-all duration-200 uppercase tracking-wider cursor-pointer ${
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
                className="group rounded-2xl bg-white border border-black/5 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
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
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveItem(item);
                    }}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#DFBA73] to-[#C5A059] text-[#12131A] font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-105 transition-all cursor-pointer"
                  >
                    view specifications
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Premium Mobile Bottom-Sheet & Desktop Modal */}
      <AnimatePresence>
        {activeItem && (
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6 bg-black/60 backdrop-blur-md">
            {/* Modal backdrop closer */}
            <div className="absolute inset-0" onClick={() => setActiveItem(null)} />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="relative z-10 w-full md:max-w-xl bg-white border-t md:border border-black/10 rounded-t-3xl md:rounded-3xl p-8 shadow-2xl flex flex-col max-h-[85vh] md:max-h-[90vh]"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-6 border-b border-black/5 pb-4">
                <div>
                  <span className="text-xs font-black uppercase text-[#A51A1A] tracking-widest font-orbitron">{activeItem.type}</span>
                  <h3 className="text-2xl font-black text-[#12131A] uppercase tracking-tight font-orbitron">{activeItem.brand}</h3>
                </div>
                <button 
                  onClick={() => setActiveItem(null)}
                  className="w-9 h-9 rounded-full border border-black/10 flex items-center justify-center text-[#12131A] hover:bg-red-600 hover:text-white transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable spec content */}
              <div className="overflow-y-auto pr-2 space-y-6 flex-grow">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3 font-orbitron">standard specifications</h4>
                  <div className="bg-[#F5F2EB]/50 border border-black/5 rounded-2xl p-6 space-y-4">
                    {Object.entries(specsMapping[activeItem.category] || specsMapping["Forklift"]).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center border-b border-black/5 pb-2 last:border-0 last:pb-0 font-semibold text-sm text-[#12131A]">
                        <span className="text-gray-500 lowercase">{key}</span>
                        <span>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-dashed border-black/20">
                    <span className="text-[10px] text-gray-400 block font-black uppercase tracking-wide">operating location</span>
                    <span className="text-sm font-bold text-[#12131A]">{activeItem.location}</span>
                  </div>
                  <div className="p-4 rounded-xl border border-dashed border-black/20">
                    <span className="text-[10px] text-gray-400 block font-black uppercase tracking-wide">vehicle plate</span>
                    <span className="text-sm font-bold text-[#12131A] font-mono">{activeItem.plate}</span>
                  </div>
                </div>
              </div>

              {/* Footer CTA */}
              <div className="mt-8 pt-4 border-t border-black/5">
                <Link 
                  href="/contact" 
                  onClick={() => setActiveItem(null)}
                  className="block w-full py-3.5 text-center rounded-xl bg-gradient-to-r from-[#A51A1A] to-[#800020] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-110 transition-all"
                >
                  rent this equipment
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
