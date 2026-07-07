"use client";

import React, { useEffect } from 'react';
import { ReactLenis } from 'lenis/react';

export default function SmoothScroller({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Force browser to start at the top on every refresh
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <ReactLenis root options={{ lerp: 0.08, duration: 1.5, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
