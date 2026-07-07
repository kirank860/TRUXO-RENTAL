"use client";

import React, { useState } from "react";
import { services } from "@/data";
import { motion, AnimatePresence } from "framer-motion";
import { Truck, HardHat, Settings, Shield, ChevronRight, Check } from "lucide-react";
import Link from "next/link";

const icons = [Truck, HardHat, Settings, Shield];

const steps = [
  { step: "01", title: "choose machinery", desc: "Select the equipment you need from our extensive catalog of forklifts, cranes, and excavators." },
  { step: "02", title: "inspection & prep", desc: "We perform a comprehensive multi-point safety check before any machinery leaves our depot." },
  { step: "03", title: "rapid delivery", desc: "Our transport team delivers the machinery directly to your project site anywhere in the UAE." }
];

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <main className="min-h-screen pt-36 pb-20 bg-[#F5F2EB] text-[#12131A]">
      <div className="max-w-7xl mx-auto px-6 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center lg:text-left"
        >
          <h1 className="text-xs font-black uppercase tracking-widest text-[#A51A1A] font-orbitron mb-3">our offerings</h1>
          <h2 className="text-5xl md:text-6xl font-black mb-4 text-[#12131A] uppercase tracking-tight font-orbitron">rental services</h2>
          <p className="text-gray-500 text-lg font-semibold max-w-2xl leading-relaxed">
            Reliable and certified heavy machinery solutions tailored for specific industrial tasks.
          </p>
        </motion.div>
      </div>

      {/* Dynamic Tab Switcher - Premium layout */}
      <section className="max-w-7xl mx-auto px-6 mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tabs Menu */}
          <div className="flex flex-col gap-3 lg:col-span-1">
            {services.map((service, idx) => {
              const Icon = icons[idx % icons.length];
              return (
                <button
                  key={idx}
                  onClick={() => setActiveTab(idx)}
                  className={`p-6 rounded-2xl border text-left transition-all flex items-center gap-4 cursor-pointer ${activeTab === idx
                      ? "bg-[#12131A] text-[#F5F2EB] border-transparent shadow-lg"
                      : "bg-white text-[#12131A] border-black/5 hover:bg-white/50"
                    }`}
                >
                  <Icon className={`w-5 h-5 ${activeTab === idx ? "text-[#C5A059]" : "text-[#A51A1A]"}`} />
                  <span className="font-bold text-base uppercase tracking-wider font-orbitron">{service.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Tab Panel */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="p-10 rounded-3xl bg-white border border-black/5 shadow-2xl h-full flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-black uppercase text-[#A51A1A] tracking-wider block mb-4 font-orbitron">service highlights</span>
                  <h3 className="text-3xl font-black text-[#12131A] mb-6 uppercase font-orbitron">{services[activeTab].title}</h3>
                  <p className="text-gray-500 text-base font-semibold leading-relaxed mb-8 lowercase">{services[activeTab].desc}</p>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3 font-semibold text-sm">
                      <Check className="w-5 h-5 text-[#C5A059] stroke-[3]" />
                      <span className="lowercase text-gray-700">Compliant with UAE Federal safety regulations</span>
                    </div>
                    <div className="flex items-center gap-3 font-semibold text-sm">
                      <Check className="w-5 h-5 text-[#C5A059] stroke-[3]" />
                      <span className="lowercase text-gray-700">Operator and rigging support available</span>
                    </div>
                    <div className="flex items-center gap-3 font-semibold text-sm">
                      <Check className="w-5 h-5 text-[#C5A059] stroke-[3]" />
                      <span className="lowercase text-gray-700">Mobilized directly to your site</span>
                    </div>
                  </div>
                </div>

                <Link href="/contact" className="btn-premium-gold w-fit font-orbitron">
                  request service quote
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Rent Process Section */}
      <section className="bg-[#12131A] text-[#F5F2EB] py-32 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-xs font-black uppercase tracking-widest text-[#C5A059] font-orbitron mb-3">how it works</h2>
            <h3 className="text-5xl font-black text-white uppercase tracking-tight font-orbitron">our deployment process</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden shadow-lg hover:shadow-xl transition-all"
              >
                <div className="text-5xl font-black text-[#C5A059]/10 font-orbitron absolute right-6 top-6">{step.step}</div>
                <h4 className="text-xl font-bold text-white mb-4 uppercase tracking-wider font-orbitron">{step.title}</h4>
                <p className="text-gray-400 font-semibold text-sm leading-relaxed lowercase">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
