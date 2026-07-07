"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-screen pt-36 pb-20 bg-[#F5F2EB] text-[#12131A]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-xs font-black uppercase tracking-widest text-[#A51A1A] font-orbitron mb-3">get in touch</h1>
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-[#12131A] uppercase tracking-tight font-orbitron">contact us</h2>
            <p className="text-gray-500 text-lg font-semibold mb-12 leading-relaxed lowercase">
              Your trusted partner for reliable heavy equipment and material handling solutions across the UAE.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-6 p-8 rounded-3xl bg-white border border-black/5 shadow-lg">
                <div className="w-12 h-12 rounded-full bg-[#A51A1A]/10 flex items-center justify-center text-[#A51A1A] shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1 uppercase tracking-wider font-orbitron">call us</p>
                  <p className="text-xl font-black text-[#12131A] font-orbitron">+971 50 675 8759</p>
                  <p className="text-gray-500 text-sm font-semibold mt-1">055 598 2149 | 055 854 7497</p>
                </div>
              </div>

              <div className="flex items-center gap-6 p-8 rounded-3xl bg-white border border-black/5 shadow-lg">
                <div className="w-12 h-12 rounded-full bg-[#A51A1A]/10 flex items-center justify-center text-[#A51A1A] shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1 uppercase tracking-wider font-orbitron">email us</p>
                  <p className="text-xl font-black text-[#12131A] font-orbitron">alghazi478@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center gap-6 p-8 rounded-3xl bg-white border border-black/5 shadow-lg">
                <div className="w-12 h-12 rounded-full bg-[#A51A1A]/10 flex items-center justify-center text-[#A51A1A] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1 uppercase tracking-wider font-orbitron">office location</p>
                  <p className="text-lg font-black text-[#12131A] font-orbitron">shop no. 05, sheikh mohammed bin zayed st.</p>
                  <p className="text-gray-500 text-sm font-semibold mt-1 lowercase">al ghail, ras al khaimah, uae</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-10 rounded-3xl border border-black/5 shadow-2xl"
          >
            <h2 className="text-3xl font-black mb-8 text-[#12131A] uppercase tracking-wide font-orbitron">send a message</h2>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-400 mb-2 font-orbitron">first name</label>
                  <input type="text" className="w-full bg-[#F5F2EB]/30 border border-black/10 rounded-xl px-4 py-3 text-[#12131A] font-semibold focus:outline-none focus:border-[#C5A059] focus:bg-white transition" />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-400 mb-2 font-orbitron">last name</label>
                  <input type="text" className="w-full bg-[#F5F2EB]/30 border border-black/10 rounded-xl px-4 py-3 text-[#12131A] font-semibold focus:outline-none focus:border-[#C5A059] focus:bg-white transition" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-400 mb-2 font-orbitron">email address</label>
                <input type="email" className="w-full bg-[#F5F2EB]/30 border border-black/10 rounded-xl px-4 py-3 text-[#12131A] font-semibold focus:outline-none focus:border-[#C5A059] focus:bg-white transition" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-400 mb-2 font-orbitron">message</label>
                <textarea rows={5} className="w-full bg-[#F5F2EB]/30 border border-black/10 rounded-xl px-4 py-3 text-[#12131A] font-semibold focus:outline-none focus:border-[#C5A059] focus:bg-white transition" />
              </div>
              <button type="submit" className="w-full btn-premium-dark font-orbitron">
                submit request
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
