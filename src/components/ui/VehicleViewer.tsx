"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Maximize2, MousePointer2 } from "lucide-react";

export default function VehicleViewer({ imageSrc, title }: { imageSrc: string, title: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  return (
    <div className="relative w-full aspect-[4/3] md:aspect-[16/9] lg:aspect-[21/9] bg-[#111113] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/5 cursor-grab active:cursor-grabbing group">
      
      {/* 360 / Interactive Hint */}
      <div className="absolute top-6 left-6 z-20 flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
        <MousePointer2 className="w-4 h-4 text-[#C5A059]" />
        <span className="text-white text-xs font-bold tracking-widest uppercase">Interactive 3D View</span>
      </div>

      <button className="absolute top-6 right-6 z-20 p-3 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-white hover:text-[#C5A059] transition-colors">
        <Maximize2 className="w-5 h-5" />
      </button>

      {/* Main Draggable Area */}
      <motion.div 
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.1}
        style={{ x, y, rotateX, rotateY }}
        className="w-full h-full relative"
      >
        <Image 
          src={imageSrc} 
          alt={title} 
          width={1920}
          height={1080}
          priority
          className="object-cover w-full h-full scale-110 pointer-events-none" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111113] via-transparent to-transparent opacity-80" />
      </motion.div>

      {/* Instruction overlay (fades out on hover) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-500 group-hover:opacity-0">
        <div className="bg-black/80 backdrop-blur-md px-8 py-4 rounded-full border border-white/10 flex items-center gap-4">
          <div className="w-2 h-2 rounded-full bg-[#C5A059] animate-ping" />
          <span className="text-white text-sm font-bold tracking-widest uppercase">Drag to Inspect</span>
        </div>
      </div>
    </div>
  );
}
