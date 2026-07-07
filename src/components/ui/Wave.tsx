import React from "react";

interface WaveProps {
  className?: string;
  fill?: string;
  flipped?: boolean;
}

export function WaveTop({ className = "", fill = "#111113", flipped = false }: WaveProps) {
  return (
    <div className={`w-full overflow-hidden leading-[0] ${flipped ? "rotate-180" : ""} ${className}`}>
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="relative block w-full h-[60px]"
      >
        <path
          d="M0,0 C90,110 320,10 600,60 C880,110 1110,10 1200,0 L1200,120 L0,120 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}

export function WaveBottom({ className = "", fill = "#111113", flipped = false }: WaveProps) {
  return (
    <div className={`w-full overflow-hidden leading-[0] ${flipped ? "rotate-180" : ""} ${className}`}>
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="relative block w-full h-[60px]"
      >
        <path
          d="M0,60 C150,100 350,20 500,60 C650,100 850,20 1200,60 L1200,120 L0,120 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}
