"use client";

import React from "react";
import { industries } from "@/data";
import { motion } from "framer-motion";
import { Shield, Building, Construction, Factory, Landmark } from "lucide-react";

const icons = [Construction, Factory, Shield, Landmark];

export default function IndustriesPage() {
  return (
    <main className="min-h-screen pt-36 pb-20 bg-[#F5F2EB] text-[#12131A]">
      <div className="max-w-7xl mx-auto px-6 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center lg:text-left"
        >
          <h1 className="text-xs font-black uppercase tracking-widest text-[#A51A1A] font-orbitron mb-3">sectors</h1>
          <h2 className="text-2xl md:text-4xl lg:text-5xl lg:text-6xl font-black mb-4 text-[#12131A] uppercase tracking-tight font-orbitron">industries we serve</h2>
          <p className="text-gray-500 text-lg font-semibold max-w-2xl leading-relaxed">
            Supporting projects of every scale across various sectors in the UAE.
          </p>
        </motion.div>
      </div>

      {/* Industries Grid */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {industries.map((ind, i) => {
          const Icon = icons[i % icons.length];
          return (
            <motion.div
              key={ind.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-12 rounded-3xl bg-white border border-black/5 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-8">
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest font-orbitron">sector 0{i + 1}</span>
                  <div className="w-11 h-11 rounded-full bg-[#A51A1A]/10 flex items-center justify-center text-[#A51A1A]">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <h2 className="text-2xl font-black mb-6 text-[#12131A] uppercase tracking-wide font-orbitron">{ind.title}</h2>
                <p className="text-gray-500 leading-relaxed text-base font-semibold mb-8 lowercase">{ind.desc}</p>
              </div>

              {/* Bullet points */}
              <div className="border-t border-black/5 pt-6 space-y-2.5 text-xs text-gray-500 font-bold">
                <span className="block text-[10px] uppercase tracking-wider text-[#A51A1A] mb-2 font-orbitron">supported deployments</span>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                  <span>Heavy earthmoving machinery</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                  <span>Lifting & rigging equipment</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </section>
    </main>
  );
}
