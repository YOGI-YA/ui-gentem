"use client";

import { useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Sparkles, Compass, Cpu, Layers } from "lucide-react";
import { personalInfo } from "@/lib/data";

const clamp = (val: number, min: number, max: number) =>
  val < min ? min : val > max ? max : val;

const smoothstep = (min: number, max: number, val: number) => {
  const n = clamp((val - min) / (max - min || 1e-6), 0, 1);
  return n * n * (3 - 2 * n);
};

export default function PhilosophySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const startWidth = 50;
  const startHeight = 60;
  const startRadius = 26;
  const endRadius = 0;
  const mediaZoom = 1.35;
  const overlayScrim = 0.75;
  const scrollDistance = 1.2;

  const updateProgress = useCallback(
    (progress: number) => {
      const frame = frameRef.current;
      const media = mediaRef.current;
      if (!frame || !media) return;

      const isMobile = window.innerWidth < 640;
      const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;

      const w = isMobile ? 86 : isTablet ? 70 : startWidth;
      const h = isMobile ? 58 : isTablet ? 60 : startHeight;
      const r = isMobile ? 18 : isTablet ? 22 : startRadius;

      // Primary expansion progress mapped to 0..0.85 of scroll track
      const p = clamp(progress / 0.85, 0, 1);
      const f = smoothstep(0, 1, p);

      const marginX = Math.max(0, (100 - (w + (100 - w) * f)) / 2);
      const marginY = Math.max(0, (100 - (h + (100 - h) * f)) / 2);
      const radius = r + (endRadius - r) * f;

      frame.style.clipPath = `inset(${marginY.toFixed(3)}% ${marginX.toFixed(3)}% ${marginY.toFixed(3)}% ${marginX.toFixed(3)}% round ${radius.toFixed(1)}px)`;

      // Background media scale and blur
      const scale = mediaZoom + (1 - mediaZoom) * f;
      const blur = (8 * (1 - f)).toFixed(1);
      media.style.transform = `scale(${scale.toFixed(4)})`;
      media.style.filter = `blur(${blur}px)`;

      // Title fade and subtle elevation
      if (titleRef.current) {
        const titleProgress = smoothstep(0.08, 0.45, p);
        titleRef.current.style.opacity = `${(1 - titleProgress).toFixed(3)}`;
        titleRef.current.style.transform = `translate3d(0, ${(-28 * titleProgress).toFixed(1)}px, 0) scale(${(1 + 0.04 * titleProgress).toFixed(3)})`;
      }

      // Scroll hint fade and descent
      if (hintRef.current) {
        const hintProgress = smoothstep(0, 0.22, p);
        hintRef.current.style.opacity = `${(1 - hintProgress).toFixed(3)}`;
        hintRef.current.style.transform = `translate3d(0, ${(10 * hintProgress).toFixed(1)}px, 0)`;
      }

      // Dark radial scrim darkening
      if (scrimRef.current) {
        const scrimOpacity = 0.25 + (overlayScrim - 0.25) * f;
        scrimRef.current.style.opacity = `${scrimOpacity.toFixed(3)}`;
      }

      // Philosophy content overlay reveal
      if (overlayRef.current) {
        const overlayProgress = smoothstep(0.42, 0.85, progress);
        overlayRef.current.style.opacity = `${overlayProgress.toFixed(3)}`;
        overlayRef.current.style.transform = `translate3d(0, ${(24 * (1 - overlayProgress)).toFixed(1)}px, 0)`;
        overlayRef.current.style.pointerEvents = overlayProgress > 0.75 ? "auto" : "none";
      }
    },
    [startWidth, startHeight, startRadius, endRadius, mediaZoom, overlayScrim]
  );

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!container || !track || !stage) return;

    let rafId = 0;
    let winHeight = 0;
    let scrollRange = 0;

    const measure = () => {
      winHeight = window.innerHeight;
      if (winHeight <= 0) return;
      const totalTrackHeight = winHeight * (1 + Math.max(0.6, scrollDistance));
      track.style.height = `${totalTrackHeight}px`;
      stage.style.height = `${winHeight}px`;
      scrollRange = totalTrackHeight - winHeight;
    };

    const handleScroll = () => {
      if (scrollRange <= 0) {
        updateProgress(0);
        return;
      }
      const top = track.getBoundingClientRect().top;
      const progress = clamp(-top / scrollRange, 0, 1);
      updateProgress(progress);
    };

    const onScroll = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          rafId = 0;
          handleScroll();
        });
      }
    };

    const onResize = () => {
      measure();
      handleScroll();
    };

    measure();
    handleScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    const ro = new ResizeObserver(onResize);
    ro.observe(container);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
    };
  }, [updateProgress, scrollDistance]);

  return (
    <section id="philosophy" ref={containerRef} className="scroll-expand relative w-full">
      <div ref={trackRef} className="scroll-expand__track">
        <div ref={stageRef} className="scroll-expand__stage">
          {/* Framed card that dynamically expands on scroll */}
          <div ref={frameRef} className="scroll-expand__frame">
            {/* Background cinematic media */}
            <div ref={mediaRef} className="scroll-expand__media absolute inset-0">
              <Image
                src="/images/philosophy-bg.jpg"
                alt="Atmospheric dark cinematic background"
                fill
                priority
                className="object-cover"
              />
            </div>

            {/* Dark Scrim */}
            <div ref={scrimRef} className="scroll-expand__scrim" />

            {/* Expanded Philosophy Content Overlay */}
            <div ref={overlayRef} className="scroll-expand__overlay">
              <div className="flex flex-col items-center justify-center gap-6 max-w-4xl mx-auto px-6 select-none">
                {/* Ember Badge */}
                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/60 border border-red-500/30 backdrop-blur-md shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-red-400 text-xs font-semibold tracking-[0.3em] uppercase">
                    The Philosophy
                  </span>
                </div>

                {/* The Philosophy Quote */}
                <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium text-white leading-[1.35] tracking-tight text-center max-w-3xl drop-shadow-xl">
                  &ldquo;I believe great software is born at the intersection of engineering precision and design intuition. Every pixel, every interaction, every line of code is an opportunity to create something that moves people.&rdquo;
                </p>

                {/* Three Pillars */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mt-4 max-w-3xl">
                  <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-4 text-left hover:border-white/20 transition-colors">
                    <div className="flex items-center gap-2 text-xs font-mono text-red-400 mb-1">
                      <Cpu size={14} />
                      <span>01. PRECISION</span>
                    </div>
                    <p className="text-xs text-white/70 leading-relaxed">
                      Type-safe, resilient backend & agentic architecture built for high throughput.
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-4 text-left hover:border-white/20 transition-colors">
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-300 mb-1">
                      <Layers size={14} />
                      <span>02. INTUITION</span>
                    </div>
                    <p className="text-xs text-white/70 leading-relaxed">
                      Fluid 60fps micro-interactions, tactile motion, and uncompromised aesthetic taste.
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-4 text-left hover:border-white/20 transition-colors">
                    <div className="flex items-center gap-2 text-xs font-mono text-amber-300 mb-1">
                      <Compass size={14} />
                      <span>03. HUMAN-CENTRIC</span>
                    </div>
                    <p className="text-xs text-white/70 leading-relaxed">
                      Designing AI and software tools that empower human curiosity and execution.
                    </p>
                  </div>
                </div>

                <div className="mt-2 text-xs font-mono tracking-[0.25em] text-white/50 uppercase">
                  {personalInfo.name} &bull; {personalInfo.location}
                </div>
              </div>
            </div>
          </div>

          {/* Initial Headline (before expansion) */}
          <h2 ref={titleRef} className="scroll-expand__title">
            The Philosophy
          </h2>

          {/* Scroll Hint */}
          <div ref={hintRef} className="scroll-expand__hint">
            <span className="scroll-expand__hint-dot" />
            <span>Scroll to expand</span>
          </div>
        </div>
      </div>
    </section>
  );
}
