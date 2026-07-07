"use client";

import React, { useState } from "react";
import { productivityComparison, operationTrends, workBreakdown } from "@/data";
import { motion } from "framer-motion";

// Slide 7: Table Style Comparison - Premium Luxury Re-design
export function ProductivityChart() {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-black/5 bg-white shadow-xl">
      <table className="w-full border-collapse text-left font-sans">
        <thead>
          <tr className="bg-gradient-to-r from-[#12131A] to-[#1E202C] text-[#F5F2EB]">
            <th className="p-5 font-orbitron uppercase text-xs tracking-wider">Task</th>
            <th className="p-5 font-orbitron uppercase text-xs tracking-wider border-l border-white/5">Manual Work</th>
            <th className="p-5 font-orbitron uppercase text-xs tracking-wider border-l border-white/5 text-[#C5A059]">Heavy Equipment</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/5 font-semibold text-[#12131A]">
          {productivityComparison.map((item, idx) => (
            <motion.tr 
              key={idx} 
              className="hover:bg-[#F5F2EB]/40 transition-colors"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <td className="p-5 lowercase text-base font-bold text-[#12131A]">{item.task}</td>
              <td className="p-5 border-l border-black/5 text-gray-400 text-base">
                {item.manual} {item.unit}
              </td>
              <td className="p-5 border-l border-black/5 text-[#A51A1A] text-lg font-extrabold bg-[#C5A059]/5">
                {item.heavy} {item.unit}
                <span className="block text-[10px] font-black text-[#C5A059] uppercase tracking-wider mt-1">
                  ({Math.round(item.heavy / item.manual)}x faster)
                </span>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Slide 10: Heavy Equipment Operation Trends - Premium Glowing SVG Chart
export function OperationTrendsChart({ dark = false }: { dark?: boolean }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const maxVal = 100;
  const chartHeight = 220;
  const chartWidth = 600;
  const paddingX = 60;
  const paddingY = 40;
  
  // Calculate points
  const points = operationTrends.map((t, idx) => {
    const x = paddingX + (idx / (operationTrends.length - 1)) * (chartWidth - paddingX * 2);
    const y = chartHeight - paddingY - (t.value / maxVal) * (chartHeight - paddingY * 2);
    return { x, y, ...t };
  });

  const pathD = points.reduce((acc, p, idx) => {
    return acc + `${idx === 0 ? "M" : "L"} ${p.x} ${p.y}`;
  }, "");

  // Y-axis grid labels
  const yTicks = [0, 20, 40, 60, 80, 100];

  return (
    <div className={`w-full font-sans ${dark ? "text-white" : "text-[#12131A]"}`}>
      <div className="text-center mb-4">
        <h4 className={`text-xs font-black uppercase tracking-widest ${dark ? "text-[#C5A059]" : "text-[#A51A1A]"}`}>
          Usage levels change during project phases
        </h4>
      </div>
      
      <div className={`relative border border-white/5 rounded-3xl p-6 overflow-hidden shadow-2xl ${dark ? "bg-[#1E202C]/60 backdrop-blur-md" : "bg-white"}`}>
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto">
          {/* Defs for glowing filter and gradients */}
          <defs>
            <linearGradient id="trendGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#A51A1A" />
              <stop offset="50%" stopColor="#C5A059" />
              <stop offset="100%" stopColor="#A51A1A" />
            </linearGradient>
            
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Grid lines */}
          {yTicks.map((tick) => {
            const y = chartHeight - paddingY - (tick / maxVal) * (chartHeight - paddingY * 2);
            return (
              <g key={tick}>
                <line 
                  x1={paddingX} 
                  y1={y} 
                  x2={chartWidth - paddingX} 
                  y2={y} 
                  stroke={dark ? "rgba(255, 255, 255, 0.1)" : "rgba(18, 19, 26, 0.08)"} 
                  strokeWidth="1" 
                  strokeDasharray="4 4" 
                />
                <text 
                  x={paddingX - 15} 
                  y={y + 4} 
                  fontSize="10" 
                  fontWeight="bold" 
                  textAnchor="end" 
                  fill={dark ? "#888990" : "#7b7c85"}
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Connection Line */}
          <motion.path 
            d={pathD} 
            fill="none" 
            stroke="url(#trendGradient)" 
            strokeWidth="4" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            filter="url(#glow)"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />

          {/* Trend Points */}
          {points.map((p, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <g 
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="cursor-pointer"
              >
                {/* Invisible hover area */}
                <circle cx={p.x} cy={p.y} r="22" fill="transparent" />
                
                {/* Outer halo */}
                <motion.circle 
                  cx={p.x} 
                  cy={p.y} 
                  r={isHovered ? 13 : 8} 
                  fill={isHovered ? "#C5A059" : "#A51A1A"} 
                  opacity={isHovered ? 0.35 : 0.15}
                  className="transition-all duration-200"
                />
                
                {/* Core Point */}
                <circle 
                  cx={p.x} 
                  cy={p.y} 
                  r="5.5" 
                  fill={isHovered ? "#C5A059" : "#A51A1A"} 
                  stroke={dark ? "#1E202C" : "#ffffff"} 
                  strokeWidth="2.5" 
                />

                {/* X Axis Label */}
                <text 
                  x={p.x} 
                  y={chartHeight - 12} 
                  fontSize="9" 
                  fontWeight="black" 
                  textAnchor="middle" 
                  fill={dark ? "#a1a1aa" : "#4b5563"}
                  className="uppercase tracking-wider font-orbitron"
                >
                  {p.phase}
                </text>

                {/* Tooltip on Hover */}
                {(isHovered || hoveredIdx === null) && (
                  <g>
                    <rect 
                      x={p.x - 22} 
                      y={p.y - 32} 
                      width="44" 
                      height="22" 
                      rx="6" 
                      fill="#12131A" 
                      stroke="#C5A059" 
                      strokeWidth="1"
                      opacity={isHovered ? 1 : 0}
                      className="transition-opacity duration-200"
                    />
                    <text 
                      x={p.x} 
                      y={p.y - 17} 
                      fontSize="10" 
                      fontWeight="black" 
                      textAnchor="middle" 
                      fill="#F5F2EB"
                      opacity={isHovered ? 1 : 0}
                      className="transition-opacity duration-200"
                    >
                      {p.value}%
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

// Slide 9: Donut Chart breakdown - Premium Luxury Re-design
export function WorkBreakdownChart() {
  const [activeSegment, setActiveSegment] = useState<number | null>(null);

  // SVG dimensions
  const size = 260;
  const center = size / 2;
  const radius = 80;
  const strokeWidth = 24;
  const circumference = 2 * Math.PI * radius;

  // Premium colors to match slide 9
  const colors = ["#A51A1A", "#C5A059", "#1E202C", "#8A1515"];

  let accumulatedPercentage = 0;

  const segments = workBreakdown.map((item, idx) => {
    const percentage = item.percentage;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    const rotationAngle = (accumulatedPercentage / 100) * 360;
    accumulatedPercentage += percentage;

    return {
      ...item,
      strokeDashoffset,
      rotationAngle,
      color: colors[idx % colors.length]
    };
  });

  return (
    <div className="w-full font-sans text-[#12131A]">
      <div className="text-center mb-4">
        <h4 className="text-xs font-black uppercase tracking-widest text-[#A51A1A]">
          A simple breakdown of construction activities
        </h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 bg-white border border-black/5 p-8 rounded-3xl shadow-xl">
        
        {/* SVG Interactive Donut */}
        <div className="relative flex justify-center items-center">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
            {segments.map((seg, idx) => {
              const isSelected = activeSegment === idx;
              return (
                <motion.circle
                  key={idx}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="transparent"
                  stroke={seg.color}
                  strokeWidth={isSelected ? strokeWidth + 6 : strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={seg.strokeDashoffset}
                  transform={`rotate(${seg.rotationAngle} ${center} ${center})`}
                  className="transition-all duration-300 cursor-pointer origin-center"
                  style={{ transformOrigin: "50% 50%" }}
                  onMouseEnter={() => setActiveSegment(idx)}
                  onMouseLeave={() => setActiveSegment(null)}
                  whileHover={{ scale: 1.03 }}
                />
              );
            })}
          </svg>

          {/* Central content */}
          <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none bg-white rounded-full m-[75px] border border-black/10 shadow-inner text-center p-3">
            {activeSegment !== null ? (
              <>
                <span className="text-2xl font-black text-[#A51A1A] leading-none">
                  {segments[activeSegment].percentage}%
                </span>
                <span className="text-[9px] font-black uppercase tracking-wider text-gray-400 mt-1 leading-tight">
                  {segments[activeSegment].label}
                </span>
              </>
            ) : (
              <>
                <span className="text-2xl font-black text-[#12131A] font-orbitron">100%</span>
                <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 mt-1 leading-none">
                  total work
                </span>
              </>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-3">
          {segments.map((seg, idx) => {
            const isSelected = activeSegment === idx;
            return (
              <div 
                key={idx}
                className={`p-3 rounded-2xl border transition-all flex items-center gap-4 ${
                  isSelected ? "bg-[#F5F2EB]/50 border-black/10 shadow-sm" : "border-transparent bg-transparent"
                }`}
                onMouseEnter={() => setActiveSegment(idx)}
                onMouseLeave={() => setActiveSegment(null)}
              >
                <span 
                  className="w-4 h-4 rounded-md shrink-0" 
                  style={{ backgroundColor: seg.color }}
                />
                <div>
                  <span className="block font-black text-sm lowercase leading-none text-[#12131A]">
                    {seg.label}
                  </span>
                  <span className="block text-[11px] font-semibold text-gray-400 mt-1">
                    {seg.percentage}% of project tasks
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        
      </div>
    </div>
  );
}
