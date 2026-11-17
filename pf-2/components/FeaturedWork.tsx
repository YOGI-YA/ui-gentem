"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Github,
  Hand,
  X,
} from "lucide-react";
import { projects, type Project } from "@/lib/data";

/* -------------------------------------------------------------------------- */
/*  CaseStudyModal: In-depth project breakdown modal                          */
/* -------------------------------------------------------------------------- */

function CaseStudyModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[150] flex items-end justify-center bg-black/85 backdrop-blur-md md:items-center p-0 md:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90svh] w-full max-w-[920px] overflow-y-auto rounded-t-2xl sm:rounded-t-3xl md:rounded-3xl bg-background border border-border p-5 sm:p-8 md:p-12 shadow-2xl pb-10"
          >
            {/* Sticky close button */}
            <button
              onClick={onClose}
              aria-label="Close case study"
              className="sticky top-0 float-right z-20 -mr-1 -mt-1 sm:mr-0 sm:mt-0 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-border bg-background/90 text-foreground/80 backdrop-blur-md transition-colors hover:border-foreground hover:text-foreground"
            >
              <X size={18} />
            </button>

            {/* Category / Year */}
            <div className="flex items-center gap-2 sm:gap-3 pr-10">
              <span className="font-mono text-xs tracking-[0.2em] text-[#E8B04A] uppercase">
                {project.category}
              </span>
              <span className="text-xs text-muted/60">•</span>
              <span className="font-mono text-xs text-muted">{project.year}</span>
            </div>

            {/* Title */}
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

            {/* Metrics cards if present */}
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
/*  FeaturedWork: Horizontal scroll section pinned to vertical scroll         */
/* -------------------------------------------------------------------------- */

export default function FeaturedWork() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [modalProject, setModalProject] = useState<Project | null>(null);

  // Responsive metrics for centering cards
  const [dims, setDims] = useState({
    cardWidth: 480,
    gap: 32,
    paddingX: 380,
    maxTranslate: 2400,
  });

  useEffect(() => {
    const updateDimensions = () => {
      const w = window.innerWidth;
      const cardWidth = w < 640 ? 300 : w < 1024 ? 400 : 480;
      const gap = w < 640 ? 16 : w < 1024 ? 24 : 32;
      const paddingX = Math.max(20, (w - cardWidth) / 2);
      const maxTranslate = (projects.length - 1) * (cardWidth + gap);
      setDims({ cardWidth, gap, paddingX, maxTranslate });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Framer Motion scroll tracking over the tall pinned container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Map scroll progress to horizontal translation
  const x = useTransform(scrollYProgress, [0, 1], [0, -dims.maxTranslate]);

  // Synchronize active project index based on scroll position
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const raw = latest * (projects.length - 1);
    const clamped = Math.min(projects.length - 1, Math.max(0, Math.round(raw)));
    setActiveIndex(clamped);
  });

  // Jump smoothly to any project index
  const navigateToIndex = (targetIdx: number) => {
    if (!containerRef.current) return;
    const clamped = Math.max(0, Math.min(projects.length - 1, targetIdx));
    const rect = containerRef.current.getBoundingClientRect();
    const currentScrollY = window.scrollY;
    const sectionTop = currentScrollY + rect.top;
    const scrollRange = containerRef.current.offsetHeight - window.innerHeight;
    const targetScrollY =
      sectionTop + (clamped / (projects.length - 1)) * scrollRange;

    window.scrollTo({
      top: targetScrollY,
      behavior: "smooth",
    });
  };

  // Drag-to-browse gesture support (mouse and touch drag drives vertical scroll)
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollYRef = useRef(0);
  const dragDistanceRef = useRef(0);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    startScrollYRef.current = window.scrollY;
    dragDistanceRef.current = 0;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !containerRef.current) return;
    const deltaX = e.clientX - startXRef.current;
    dragDistanceRef.current = Math.abs(deltaX);

    const scrollRange = containerRef.current.offsetHeight - window.innerHeight;
    if (dims.maxTranslate > 0 && scrollRange > 0) {
      const scrollDelta = -(deltaX / dims.maxTranslate) * scrollRange;
      window.scrollTo({
        top: startScrollYRef.current + scrollDelta,
        behavior: "auto",
      });
    }
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  // Manage body scroll when modal is open
  useEffect(() => {
    if (modalProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalProject]);

  const activeProject = projects[activeIndex] || projects[0];

  return (
    <section
      id="work"
      ref={containerRef}
      className="relative border-b border-border"
      style={{ height: `${Math.max(300, projects.length * 65)}vh` }}
    >
      {/* Pinned Viewport Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between select-none">
        {/* Dynamic atmospheric ambient glow matching active project */}
        <div
          className="pointer-events-none absolute inset-0 transition-all duration-700 -z-10 opacity-75"
          style={{
            background: `radial-gradient(ellipse 75% 45% at 50% 28%, ${activeProject.accentColor}22, transparent 70%), #0a0a0a`,
          }}
        />

        {/* ------------------------------------------------------------------ */}
        {/* TOP HEADER BAR                                                      */}
        {/* ------------------------------------------------------------------ */}
        <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-8 md:px-12 pt-6 sm:pt-8 md:pt-10 flex items-center justify-between z-20">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E8B04A] animate-pulse" />
              <p className="font-mono text-xs tracking-[0.3em] text-[#E8B04A] uppercase">
                03 // SELECTED WORK
              </p>
            </div>
            <h2 className="mt-1 text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-white">
              Featured Builds &amp; Case Studies
            </h2>
          </div>

          {/* Project Slide Counter */}
          <div className="hidden sm:flex items-center gap-3">
            <span className="font-mono text-xs text-white/50 tracking-wider">
              PROJECT
            </span>
            <span className="font-mono text-sm sm:text-base font-semibold text-white">
              0{activeIndex + 1}
              <span className="text-white/30 font-normal"> / 0{projects.length}</span>
            </span>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* HORIZONTAL CARDS RIBBON (SCROLLS LEFT TO RIGHT ON SCROLL DOWN)      */}
        {/* ------------------------------------------------------------------ */}
        <div
          className="relative w-full overflow-hidden py-3 sm:py-5 cursor-grab active:cursor-grabbing z-10"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <motion.div
            ref={trackRef}
            style={{ x }}
            className="flex items-center"
          >
            {/* Left padding spacer so first card starts centered */}
            <div
              style={{ width: `${dims.paddingX}px`, flexShrink: 0 }}
              aria-hidden="true"
            />

            {/* Project Cards */}
            {projects.map((project, idx) => {
              const isActive = idx === activeIndex;

              return (
                <div
                  key={project.id}
                  onClick={() => {
                    // Only navigate if not a large drag
                    if (dragDistanceRef.current < 8) {
                      navigateToIndex(idx);
                    }
                  }}
                  style={{
                    width: `${dims.cardWidth}px`,
                    marginRight: `${dims.gap}px`,
                    flexShrink: 0,
                  }}
                  className="group flex flex-col items-center cursor-pointer transition-transform duration-300"
                >
                  {/* Card Shell */}
                  <div
                    className={`relative w-full aspect-[16/10] overflow-hidden rounded-2xl sm:rounded-3xl border transition-all duration-500 ${
                      isActive
                        ? "scale-100 opacity-100 border-white/40 shadow-2xl"
                        : "scale-[0.92] opacity-55 hover:opacity-85 hover:scale-[0.96] border-white/10"
                    }`}
                    style={{
                      boxShadow: isActive
                        ? `0 24px 60px -15px ${project.accentColor}44, 0 0 25px -5px ${project.accentColor}33`
                        : "0 10px 30px rgba(0,0,0,0.5)",
                    }}
                  >
                    {/* Project Image */}
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(max-width: 640px) 300px, (max-width: 1024px) 400px, 500px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      priority={idx === 0 || idx === 1}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/20" />

                    {/* Top inside card badge */}
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-2.5 py-1 text-[10px] sm:text-xs font-mono uppercase tracking-wider text-white/90 backdrop-blur-md">
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: project.accentColor || "#10b981" }}
                      />
                      <span>{project.status}</span>
                    </div>

                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
                      <span className="font-mono text-[10px] sm:text-xs text-white/60 bg-black/50 px-2 py-0.5 rounded-md border border-white/10 backdrop-blur-md">
                        0{idx + 1}
                      </span>
                    </div>
                  </div>

                  {/* Card Title underneath (Direct reference to video design) */}
                  <p
                    className={`mt-3.5 text-center text-sm sm:text-base font-semibold tracking-wide transition-all duration-300 ${
                      isActive
                        ? "text-white scale-105"
                        : "text-white/50 group-hover:text-white/80"
                    }`}
                  >
                    {project.title}
                  </p>
                </div>
              );
            })}

            {/* Right padding spacer so last card ends centered */}
            <div
              style={{ width: `${dims.paddingX}px`, flexShrink: 0 }}
              aria-hidden="true"
            />
          </motion.div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* BOTTOM SYNCHRONIZED DETAILS SHOWCASE                                */}
        {/* ------------------------------------------------------------------ */}
        <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-8 md:px-12 pb-6 sm:pb-8 md:pb-10 z-20">
          <div className="border-t border-white/10 pt-5 sm:pt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProject.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end"
              >
                {/* Left Column: Category, Headline & Buttons */}
                <div className="lg:col-span-7">
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-[10px] sm:text-xs text-white/90 backdrop-blur-md">
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: activeProject.accentColor }}
                      />
                      {activeProject.category}
                    </span>
                    <span className="text-white/40 text-xs hidden sm:inline">•</span>
                    <span className="font-mono text-xs text-white/60">
                      {activeProject.year}
                    </span>
                  </div>

                  <h3 className="mt-2.5 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-white leading-[1.12]">
                    {activeProject.client}
                  </h3>

                  {/* Action buttons */}
                  <div className="mt-4 sm:mt-5 flex items-center gap-3 flex-wrap">
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
                        <span className="hidden xs:inline">Live Demo</span>
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
                  <p className="text-xs sm:text-sm text-white/75 leading-relaxed line-clamp-3">
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

          {/* Bottom Bar: Drag Hint & Navigation Controls */}
          <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.2em] text-white/60 backdrop-blur-md">
              <Hand size={12} className="text-white/70 animate-pulse" />
              <span>DRAG TO BROWSE</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateToIndex(activeIndex - 1)}
                disabled={activeIndex === 0}
                aria-label="Previous project"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-all hover:bg-white/15 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed active:scale-90"
              >
                <ChevronLeft size={15} />
              </button>

              <button
                onClick={() => navigateToIndex(activeIndex + 1)}
                disabled={activeIndex === projects.length - 1}
                aria-label="Next project"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-all hover:bg-white/15 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed active:scale-90"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Case Study Deep Dive Modal */}
      <CaseStudyModal
        project={modalProject}
        onClose={() => setModalProject(null)}
      />
    </section>
  );
}
