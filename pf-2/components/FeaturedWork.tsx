"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useScroll,
} from "framer-motion";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Github,
  Hand,
  Pause,
  Play,
  RotateCw,
  X,
} from "lucide-react";
import { projects, type Project } from "@/lib/data";

/* -------------------------------------------------------------------------- */
/*  CaseStudyModal: Clean project breakdown modal (no release/numeric clutter)*/
/* -------------------------------------------------------------------------- */

function CaseStudyModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  // Close on Escape key
  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          data-lenis-prevent
          data-lenis-prevent-wheel
          data-lenis-prevent-touch
          onWheel={(e) => e.stopPropagation()}
          className="fixed inset-0 z-[150] flex items-end justify-center bg-black/85 backdrop-blur-md md:items-center p-0 md:p-6"
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            data-lenis-prevent
            data-lenis-prevent-wheel
            data-lenis-prevent-touch
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            className="relative max-h-[90svh] w-full max-w-[920px] overflow-y-auto overscroll-contain rounded-t-2xl sm:rounded-t-3xl md:rounded-3xl bg-[#0b0d14] border border-border p-5 sm:p-8 md:p-12 shadow-2xl pb-12"
            style={{ touchAction: "pan-y", WebkitOverflowScrolling: "touch" }}
          >
            {/* Sticky close button */}
            <button
              onClick={onClose}
              aria-label="Close case study"
              className="sticky top-0 float-right z-20 -mr-1 -mt-1 sm:mr-0 sm:mt-0 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-border bg-background/90 text-foreground/80 backdrop-blur-md transition-colors hover:border-foreground hover:text-foreground"
            >
              <X size={18} />
            </button>

            {/* Category */}
            <div className="flex items-center gap-2 pr-10">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: project.accentColor || "#E8B04A" }}
              />
              <span className="font-mono text-xs tracking-[0.2em] text-[#E8B04A] uppercase">
                {project.category}
              </span>
            </div>

            {/* Title & Client */}
            <h3 className="mt-3 text-2xl sm:text-4xl md:text-5xl font-medium tracking-tight pr-10 text-white">
              {project.title}
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm text-muted">{project.client}</p>

            {/* Tech stack badges */}
            <div className="mt-4 flex flex-wrap gap-1.5 sm:gap-2">
              {project.stack.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border bg-background-soft px-2.5 sm:px-3 py-1 font-mono text-[11px] sm:text-xs text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Metrics cards */}
            {project.metrics && project.metrics.length > 0 && (
              <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-4 rounded-xl border border-border bg-background-soft p-3 sm:p-4">
                {project.metrics.map((m) => (
                  <div key={m.label} className="text-center sm:text-left">
                    <p className="font-mono text-[10px] sm:text-xs text-muted uppercase">
                      {m.label}
                    </p>
                    <p className="mt-0.5 font-mono text-xs sm:text-base font-semibold text-foreground">
                      {m.value}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Preview image */}
            <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-xl sm:rounded-2xl border border-border">
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, 850px"
                className="object-cover"
              />
            </div>

            {/* Overview */}
            <div className="mt-6 sm:mt-8">
              <h4 className="font-mono text-xs font-semibold tracking-[0.2em] text-muted uppercase">
                Overview
              </h4>
              <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-foreground/90">
                {project.summary}
              </p>
            </div>

            {/* Key Technical Highlights */}
            <div className="mt-6 sm:mt-8 border-t border-border pt-6 sm:pt-8">
              <h4 className="font-mono text-xs font-semibold tracking-[0.2em] text-muted uppercase mb-3 sm:mb-4">
                Key Technical Highlights &amp; Outcomes
              </h4>
              <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
                {project.details.map((detail) => (
                  <li
                    key={detail}
                    className="flex items-start gap-2.5 text-xs sm:text-sm text-muted leading-relaxed"
                  >
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: project.accentColor || "#E8B04A" }}
                    />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Modal Actions */}
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 border-t border-border pt-6 sm:pt-8">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-5 py-3 text-xs tracking-[0.15em] text-background uppercase font-semibold transition-transform hover:scale-[1.02] active:scale-95"
                >
                  <ExternalLink size={14} />
                  <span>Open Live Project</span>
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background-soft px-5 py-3 text-xs tracking-[0.15em] text-foreground uppercase font-medium transition-colors hover:border-foreground active:scale-95"
                >
                  <Github size={14} />
                  <span>View GitHub Repository</span>
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* -------------------------------------------------------------------------- */
/*  Desktop Infinite Repeat Constants                                         */
/* -------------------------------------------------------------------------- */
const REPEAT_COUNT = 4;
const REPEATED_PROJECTS = Array.from({ length: REPEAT_COUNT }, () => projects).flat();

export default function FeaturedWork() {
  const [modalProject, setModalProject] = useState<Project | null>(null);

  /* ------------------------------------------------------------------------ */
  /*  MOBILE VIEW STATE & HANDLERS (< 768px)                                   */
  /* ------------------------------------------------------------------------ */
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);

  const handleMobileScroll = useCallback(() => {
    if (!mobileScrollRef.current) return;
    const { scrollLeft, clientWidth } = mobileScrollRef.current;
    if (clientWidth === 0) return;
    const cardEl = mobileScrollRef.current.firstElementChild as HTMLElement | null;
    const cardWidth = cardEl ? cardEl.offsetWidth + 16 : clientWidth * 0.85 + 16;
    const index = Math.round(scrollLeft / cardWidth);
    setMobileActiveIndex(Math.max(0, Math.min(projects.length - 1, index)));
  }, []);

  const scrollMobileTo = (index: number) => {
    if (!mobileScrollRef.current) return;
    const targetIdx = Math.max(0, Math.min(projects.length - 1, index));
    const cards = mobileScrollRef.current.children;
    if (cards[targetIdx]) {
      (cards[targetIdx] as HTMLElement).scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  };

  /* ------------------------------------------------------------------------ */
  /*  DESKTOP VIEW STATE & 3D CURVE PHYSICS (>= 768px)                        */
  /* ------------------------------------------------------------------------ */
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);

  const [dims, setDims] = useState({
    cardWidth: 460,
    gap: 28,
    unitWidth: 488,
    singleSetWidth: 488 * projects.length,
    maxArcY: 42,
    maxTilt: 5.5,
  });

  const updateDims = useCallback(() => {
    if (typeof window === "undefined") return;
    const w = window.innerWidth;
    const cardWidth = w < 1024 ? 360 : 460;
    const gap = w < 1024 ? 20 : 28;
    const unitWidth = cardWidth + gap;
    const singleSetWidth = unitWidth * projects.length;
    const maxArcY = w < 1024 ? 32 : 42;
    const maxTilt = w < 1024 ? 4.5 : 5.5;
    setDims({ cardWidth, gap, unitWidth, singleSetWidth, maxArcY, maxTilt });
  }, []);

  useEffect(() => {
    updateDims();
    window.addEventListener("resize", updateDims);
    return () => window.removeEventListener("resize", updateDims);
  }, [updateDims]);

  const offsetRef = useRef(0);
  const targetOffsetRef = useRef(0);
  const lastActiveIndexRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);

  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const dragDistanceRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const prevScrollYProgressRef = useRef(0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const delta = latest - prevScrollYProgressRef.current;
      prevScrollYProgressRef.current = latest;

      if (Math.abs(delta) > 0.0001 && dims.singleSetWidth > 0) {
        const scrollRotationDelta = delta * dims.singleSetWidth * 2.2;
        targetOffsetRef.current += scrollRotationDelta;
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress, dims.singleSetWidth]);

  useEffect(() => {
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min(32, currentTime - lastTime);
      lastTime = currentTime;

      if (!isDraggingRef.current && autoPlay && !isHovered) {
        targetOffsetRef.current += (dt / 16.667) * 0.45;
      }

      const diff = targetOffsetRef.current - offsetRef.current;
      if (Math.abs(diff) > 0.05) {
        offsetRef.current += diff * 0.12;
      } else {
        offsetRef.current = targetOffsetRef.current;
      }

      if (trackRef.current && dims.singleSetWidth > 0 && typeof window !== "undefined") {
        const singleSet = dims.singleSetWidth;
        const wrapped = ((offsetRef.current % singleSet) + singleSet) % singleSet;

        const viewportCenter = window.innerWidth / 2;
        const baseOffset = viewportCenter - dims.cardWidth / 2 - 1 * singleSet;
        const translateX = baseOffset - wrapped;

        trackRef.current.style.transform = `translate3d(${translateX}px, 0, 0)`;

        cardRefs.current.forEach((cardEl, idx) => {
          if (!cardEl) return;
          const cardCenterX = translateX + idx * dims.unitWidth + dims.cardWidth / 2;
          const normDist = (cardCenterX - viewportCenter) / (viewportCenter || 1);

          const yShift = Math.pow(normDist, 2) * dims.maxArcY;
          const tiltZ = normDist * dims.maxTilt;
          const rotateY = -normDist * 6.0;
          const scale = 1.04 - Math.min(0.2, Math.pow(normDist, 2) * 0.12);
          const opacity = 1.0 - Math.min(0.5, Math.abs(normDist) * 0.28);

          cardEl.style.transform = `translate3d(0, ${yShift}px, 0) rotateZ(${tiltZ}deg) rotateY(${rotateY}deg) scale(${scale})`;
          cardEl.style.opacity = `${opacity}`;
        });

        const rawIndex = Math.round(wrapped / dims.unitWidth) % projects.length;
        const activeIdx = (rawIndex + projects.length) % projects.length;

        if (activeIdx !== lastActiveIndexRef.current) {
          lastActiveIndexRef.current = activeIdx;
          setActiveIndex(activeIdx);
        }
      }

      rafIdRef.current = requestAnimationFrame(loop);
    };

    rafIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [autoPlay, isHovered, dims]);

  const rotateToProject = useCallback(
    (targetProjectIdx: number) => {
      const currentIdx = lastActiveIndexRef.current;
      let diff = targetProjectIdx - currentIdx;

      if (diff > projects.length / 2) diff -= projects.length;
      if (diff < -projects.length / 2) diff += projects.length;

      targetOffsetRef.current += diff * dims.unitWidth;
    },
    [dims.unitWidth]
  );

  const stepNext = useCallback(() => {
    targetOffsetRef.current += dims.unitWidth;
  }, [dims.unitWidth]);

  const stepPrev = useCallback(() => {
    targetOffsetRef.current -= dims.unitWidth;
  }, [dims.unitWidth]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    dragStartOffsetRef.current = targetOffsetRef.current;
    dragDistanceRef.current = 0;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - startXRef.current;
    dragDistanceRef.current = Math.abs(deltaX);
    targetOffsetRef.current = dragStartOffsetRef.current - deltaX * 1.15;
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  useEffect(() => {
    const lenis = (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis;
    if (modalProject) {
      document.body.style.overflow = "hidden";
      lenis?.stop();
    } else {
      document.body.style.overflow = "";
      lenis?.start();
    }
    return () => {
      document.body.style.overflow = "";
      lenis?.start();
    };
  }, [modalProject]);

  const activeProject = projects[activeIndex] || projects[0];
  const activeMobileProject = projects[mobileActiveIndex] || projects[0];

  return (
    <>
      {/* Persistent global anchor for both mobile and desktop navigation */}
      <div id="work" className="scroll-mt-24 pointer-events-none" />
      {/* ================================================================== */}
      {/* 1. MOBILE-OPTIMIZED LAYOUT (< 768px: Native Touch Slider, No Pin)   */}
      {/* ================================================================== */}
      <section
        id="work-mobile"
        className="block md:hidden border-b border-border py-14 px-4 bg-background relative overflow-hidden"
      >
        {/* Ambient background glow */}
        <div
          className="pointer-events-none absolute inset-0 transition-all duration-700 -z-10 opacity-70"
          style={{
            background: `radial-gradient(circle 80vw at 50% 25%, ${activeMobileProject.accentColor}25, transparent 70%), #0a0a0a`,
          }}
        />

        {/* Section Header */}
        <div className="mb-6 px-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E8B04A] animate-pulse" />
              <p className="font-mono text-xs tracking-[0.25em] text-[#E8B04A] uppercase">
                SELECTED WORK
              </p>
            </div>
           
          </div>
          <h2 className="mt-2 text-2xl font-medium tracking-tight text-white">
            Featured Builds &amp; Case Studies
          </h2>
          <p className="mt-1 text-xs text-white/60 leading-relaxed">
            Swipe horizontally to explore production applications and AI systems.
          </p>
        </div>

        {/* Native Touch Swipeable Project Rails */}
        <div
          ref={mobileScrollRef}
          onScroll={handleMobileScroll}
          data-lenis-prevent
          data-lenis-prevent-wheel
          data-lenis-prevent-touch
          className="flex overflow-x-auto snap-x snap-mandatory gap-4 px-1 pb-4 no-scrollbar scroll-smooth"
          style={{ touchAction: "pan-x" }}
        >
          {projects.map((project, idx) => {
            const isCardActive = idx === mobileActiveIndex;

            return (
              <div
                key={`mobile-${project.id}`}
                className={`snap-center shrink-0 w-[86vw] max-w-[340px] rounded-2xl border transition-all duration-300 bg-[#0e1017]/95 backdrop-blur-md overflow-hidden flex flex-col justify-between shadow-xl ${
                  isCardActive
                    ? "border-white/35 shadow-2xl ring-1 ring-white/20"
                    : "border-white/10 opacity-80"
                }`}
                style={{
                  boxShadow: isCardActive
                    ? `0 16px 36px -10px ${project.accentColor}33`
                    : "0 8px 24px rgba(0,0,0,0.6)",
                }}
              >
                {/* Card Image Banner - completely clean, no overlay labels */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/40">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="340px"
                    className="object-cover"
                    priority={idx < 2}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e1017] via-black/30 to-black/10" />
                </div>

                {/* Card Content Body */}
                <div className="p-4 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-white tracking-tight leading-snug">
                      {project.title}
                    </h3>
                    <p className="mt-1 text-xs text-[#E8B04A] font-mono">
                      {project.client}
                    </p>

                    <p className="mt-2.5 text-xs text-white/70 leading-relaxed line-clamp-3">
                      {project.summary}
                    </p>
                  </div>

                  {/* Metrics grid */}
                  {project.metrics && project.metrics.length > 0 && (
                    <div className="mt-3.5 grid grid-cols-3 gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] p-2.5">
                      {project.metrics.map((m) => (
                        <div key={m.label} className="text-left">
                          <p className="font-mono text-[9px] text-white/50 uppercase truncate">
                            {m.label}
                          </p>
                          <p className="mt-0.5 font-mono text-xs font-semibold text-white truncate">
                            {m.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tech stack badges */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {project.stack.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-white/70"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.stack.length > 3 && (
                      <span className="rounded-full border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-white/40">
                        +{project.stack.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2">
                    <button
                      onClick={() => setModalProject(project)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-white px-3.5 py-2.5 text-xs font-semibold text-black transition-all active:scale-95"
                    >
                      <span>Case Study</span>
                      <ArrowUpRight size={14} />
                    </button>

                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Live Demo"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-white/5 text-white/90 transition-colors active:scale-95"
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}

                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub Repository"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-white/5 text-white/80 transition-colors active:scale-95"
                      >
                        <Github size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Navigation Controller: Dots + Prev/Next Buttons */}
        <div className="mt-4 flex items-center justify-between px-1">
          {/* Indicator Dots */}
          <div className="flex items-center gap-1.5">
            {projects.map((p, idx) => (
              <button
                key={`dot-${p.id}`}
                onClick={() => scrollMobileTo(idx)}
                aria-label={`Go to ${p.title}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === mobileActiveIndex
                    ? "w-5 bg-white"
                    : "w-1.5 bg-white/25"
                }`}
                style={{
                  backgroundColor:
                    idx === mobileActiveIndex ? p.accentColor : undefined,
                }}
              />
            ))}
          </div>

          {/* Prev / Next Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollMobileTo(mobileActiveIndex - 1)}
              disabled={mobileActiveIndex === 0}
              aria-label="Previous project"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 disabled:opacity-30 disabled:cursor-not-allowed active:scale-90"
            >
              <ChevronLeft size={15} />
            </button>
            <button
              onClick={() => scrollMobileTo(mobileActiveIndex + 1)}
              disabled={mobileActiveIndex === projects.length - 1}
              aria-label="Next project"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 disabled:opacity-30 disabled:cursor-not-allowed active:scale-90"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 2. DESKTOP & TABLET VIEW (>= 768px: 3D Curvy Infinite Ribbon)       */}
      {/* ================================================================== */}
      <section
        id="work-desktop"
        ref={containerRef}
        className="hidden md:block relative border-b border-border"
        style={{ height: "420vh" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Pinned Viewport Container */}
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between select-none">
          {/* Dynamic atmospheric ambient glow matching active project */}
          <div
            className="pointer-events-none absolute inset-0 transition-all duration-700 -z-10 opacity-75"
            style={{
              background: `radial-gradient(ellipse 75% 45% at 50% 28%, ${activeProject.accentColor}24, transparent 70%), #0a0a0a`,
            }}
          />

          {/* ---------------------------------------------------------------- */}
          {/* TOP HEADER BAR (CLEAN, NO NUMERIC LABELS)                         */}
          {/* ---------------------------------------------------------------- */}
          <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-12 pt-6 lg:pt-8 flex items-center justify-between z-20">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#E8B04A] animate-pulse" />
                <p className="font-mono text-xs tracking-[0.3em] text-[#E8B04A] uppercase">
                  SELECTED WORK
                </p>
              </div>
              <h2 className="mt-1 text-2xl lg:text-4xl font-medium tracking-tight text-white">
                Featured Builds &amp; Case Studies
              </h2>
            </div>

            {/* Quick jump dots (Clean visual indicator, no numbers) */}
            <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md">
              {projects.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => rotateToProject(idx)}
                  aria-label={`Jump to ${p.title}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === activeIndex
                      ? "w-6 bg-white"
                      : "w-2 bg-white/25 hover:bg-white/60"
                  }`}
                  style={{
                    backgroundColor:
                      idx === activeIndex ? p.accentColor : undefined,
                  }}
                />
              ))}
            </div>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* CURVY HORIZONTAL CARDS TRACK (ARCHED, NO LABELS/NUMBERS)         */}
          {/* ---------------------------------------------------------------- */}
          <div
            className="relative w-full overflow-hidden py-4 lg:py-8 cursor-grab active:cursor-grabbing z-10"
            style={{ perspective: "1400px" }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            <div
              ref={trackRef}
              className="flex items-center will-change-transform"
              style={{ transformStyle: "preserve-3d" }}
            >
              {REPEATED_PROJECTS.map((project, idx) => {
                const projectIndexInCatalog = idx % projects.length;
                const isCenterActive = projectIndexInCatalog === activeIndex;

                return (
                  <div
                    key={`${project.id}-${idx}`}
                    ref={(el) => {
                      cardRefs.current[idx] = el;
                    }}
                    onClick={() => {
                      if (dragDistanceRef.current < 8) {
                        if (isCenterActive) {
                          setModalProject(project);
                        } else {
                          rotateToProject(projectIndexInCatalog);
                        }
                      }
                    }}
                    style={{
                      width: `${dims.cardWidth}px`,
                      marginRight: `${dims.gap}px`,
                      flexShrink: 0,
                      transformOrigin: "center 85%",
                      willChange: "transform, opacity",
                    }}
                    className="group flex flex-col items-center cursor-pointer select-none transition-shadow duration-300"
                  >
                    {/* Card Shell - Clean rounded visual: NO release tags, NO numbers */}
                    <div
                      className={`relative w-full aspect-[16/10] overflow-hidden rounded-2xl lg:rounded-3xl border transition-colors duration-500 ${
                        isCenterActive
                          ? "border-white/40 shadow-2xl"
                          : "border-white/10 group-hover:border-white/25"
                      }`}
                      style={{
                        boxShadow: isCenterActive
                          ? `0 24px 60px -15px ${project.accentColor}44, 0 0 25px -5px ${project.accentColor}33`
                          : "0 10px 30px rgba(0,0,0,0.5)",
                      }}
                    >
                      {/* Project Image */}
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="(max-width: 1024px) 360px, 460px"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        priority={idx < 8}
                      />

                      {/* Gradient Overlay for high-contrast presentation */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
                    </div>

                    {/* Card Title underneath */}
                    <p
                      className={`mt-3 text-center text-sm lg:text-base font-semibold tracking-wide transition-all duration-300 ${
                        isCenterActive
                          ? "text-white"
                          : "text-white/50 group-hover:text-white/80"
                      }`}
                    >
                      {project.title}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* BOTTOM SYNCHRONIZED DETAILS SHOWCASE                              */}
          {/* ---------------------------------------------------------------- */}
          <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-12 pb-6 lg:pb-8 z-20">
            <div className="border-t border-white/10 pt-4 lg:pt-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProject.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-end"
                >
                  {/* Left Column: Category, Headline & Buttons */}
                  <div className="lg:col-span-7">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-[10px] sm:text-xs text-white/90 backdrop-blur-md">
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: activeProject.accentColor }}
                        />
                        {activeProject.category}
                      </span>
                    </div>

                    <h3 className="mt-2 text-xl sm:text-2xl lg:text-4xl font-medium tracking-tight text-white leading-[1.15]">
                      {activeProject.client}
                    </h3>

                    {/* Action buttons */}
                    <div className="mt-3.5 sm:mt-4 flex items-center gap-3 flex-wrap">
                      <button
                        onClick={() => setModalProject(activeProject)}
                        className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-black transition-all hover:bg-white/90 active:scale-95"
                      >
                        <span>Case Study</span>
                        <ArrowUpRight
                          size={15}
                          className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </button>

                      {activeProject.liveUrl && (
                        <a
                          href={activeProject.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2.5 text-xs sm:text-sm font-medium text-white/90 backdrop-blur-md transition-all hover:border-white/50 hover:text-white active:scale-95"
                        >
                          <ExternalLink size={14} />
                          <span>Live Demo</span>
                        </a>
                      )}

                      {activeProject.githubUrl && (
                        <a
                          href={activeProject.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="View on GitHub"
                          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/80 backdrop-blur-md transition-all hover:border-white/50 hover:text-white active:scale-95"
                        >
                          <Github size={15} />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Summary, Metrics & Tech Stack */}
                  <div className="lg:col-span-5 flex flex-col justify-end">
                    <p className="text-xs sm:text-sm text-white/75 leading-relaxed line-clamp-2 lg:line-clamp-3">
                      {activeProject.summary}
                    </p>

                    {/* Metrics Row */}
                    {activeProject.metrics && activeProject.metrics.length > 0 && (
                      <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-2.5 backdrop-blur-sm">
                        {activeProject.metrics.map((m) => (
                          <div key={m.label} className="text-left">
                            <p className="font-mono text-[9px] sm:text-[10px] text-white/50 uppercase truncate">
                              {m.label}
                            </p>
                            <p className="mt-0.5 font-mono text-xs sm:text-sm font-semibold text-white truncate">
                              {m.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Stack Badges */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {activeProject.stack.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] sm:text-xs text-white/70"
                        >
                          {tag}
                        </span>
                      ))}
                      {activeProject.stack.length > 4 && (
                        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] sm:text-xs text-white/40">
                          +{activeProject.stack.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom Bar: Infinite Controls, AutoPlay Toggle & Drag Hint */}
            <div className="mt-3.5 flex items-center justify-between border-t border-white/5 pt-3">
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.2em] text-white/60 backdrop-blur-md">
                  <Hand size={12} className="text-white/70 animate-pulse" />
                  <span>DRAG TO BROWSE</span>
                </div>

                {/* Auto-Rotation Toggle */}
                <button
                  onClick={() => setAutoPlay((prev) => !prev)}
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-white/60 hover:text-white transition-colors backdrop-blur-md"
                >
                  <RotateCw
                    size={10}
                    className={autoPlay && !isHovered ? "animate-spin text-emerald-400" : ""}
                    style={{ animationDuration: "4s" }}
                  />
                  {autoPlay ? <Pause size={10} /> : <Play size={10} />}
                  <span>{autoPlay ? "Auto-Flow" : "Paused"}</span>
                </button>
              </div>

              {/* Infinite Prev / Next Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={stepPrev}
                  aria-label="Previous project"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-all hover:bg-white/15 hover:text-white active:scale-90"
                >
                  <ChevronLeft size={15} />
                </button>

                <button
                  onClick={stepNext}
                  aria-label="Next project"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-all hover:bg-white/15 hover:text-white active:scale-90"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Study Deep Dive Modal (Shared across Mobile & Desktop) */}
      <CaseStudyModal
        project={modalProject}
        onClose={() => setModalProject(null)}
      />
    </>
  );
}
