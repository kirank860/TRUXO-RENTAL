"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Shield } from "lucide-react";

export default function Template({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  // Reset and trigger loading sequence on every route change
  useEffect(() => {
    setLoading(true);
    // Give it a fast 600ms premium feel
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4, ease: "easeInOut" } }}
            className="fixed inset-0 z-[9999] bg-[#050505] flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center gap-6"
            >
              {/* Premium Gold Spinner with Logo */}
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-white/5" />
                <div className="w-20 h-20 rounded-full border-4 border-transparent border-t-[#C5A059] border-r-[#C5A059] animate-spin" />
                <Shield className="absolute w-8 h-8 text-[#C5A059]" />
              </div>
              <span className="font-orbitron font-black text-white text-xs tracking-[0.3em] uppercase animate-pulse">
                Truxo Rental
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        key="content"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: loading ? 0 : 1, y: loading ? 15 : 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </>
  );
}
