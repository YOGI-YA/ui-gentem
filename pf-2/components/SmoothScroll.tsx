"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      lerp: 0.05,
      smoothWheel: true,
    });

    (window as unknown as { lenis?: Lenis }).lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      delete (window as unknown as { lenis?: Lenis }).lenis;
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
