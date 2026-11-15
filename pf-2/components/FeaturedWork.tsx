"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowUpRight, Github, ExternalLink, X } from "lucide-react";
import { projects, type Project } from "@/lib/data";

/* -------------------------------------------------------------------------- */
/*  StackCard: Sticky stacked project card with mobile-first responsiveness    */
/* -------------------------------------------------------------------------- */

function StackCard({
  project,
  index,
  total,
  onOpen,
}: {
  project: Project;
  index: number;
  total: number;
  onOpen: (project: Project) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const opacity = useTransform(scrollYProgress, [0, 0.85, 1], [1, 1, 0.65]);

  return (
    <div
      ref={ref}
      className="sticky top-16 sm:top-20 md:top-0 flex h-[calc(100svh-4rem)] md:h-screen items-center justify-center px-3 sm:px-6 md:px-10"
      style={{ zIndex: index + 1 }}
    >
      <motion.div
        style={{ scale, opacity }}
        className="relative flex h-[490px] sm:h-[540px] max-h-[calc(100svh-5.5rem)] md:h-auto md:max-h-none md:aspect-[16/10] w-full max-w-[1200px] flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-[#090C12] shadow-2xl"
      >
        {/* Background Image */}
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, 90vw"
          className="object-cover object-center"
          priority={index === 0}
        />

        {/* Adaptive contrast scrim: stronger on mobile for absolute readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/35 md:from-black/90 md:via-black/40 md:to-transparent" />

        {/* Top bar inside card */}
        <div className="relative z-10 flex items-center justify-between p-4 sm:p-6 md:p-12 pb-0 sm:pb-0 md:pb-0">
          <p className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#E8B04A]">
            {project.category} · {project.year}
          </p>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/50 px-2.5 py-1 text-[10px] sm:text-xs font-mono uppercase tracking-wider text-white/90 backdrop-blur-md">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: project.accentColor || "#10b981" }}
              />
              <span className="hidden xs:inline">{project.status}</span>
              <span className="xs:hidden font-mono">0{index + 1}/0{total}</span>
            </span>
          </div>
        </div>

        {/* Bottom content area */}
        <div className="relative z-10 flex flex-col justify-end p-4 sm:p-6 md:p-12 pt-0 sm:pt-0 md:pt-0">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 sm:gap-6">
            <div className="max-w-2xl">
              <h3 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white leading-[1.1]">
                {project.title}
              </h3>

              <p className="mt-2 text-xs sm:text-sm text-white/80 line-clamp-2 md:line-clamp-3 leading-relaxed">
                {project.summary}
              </p>

              {/* Tech stack tags: capped on mobile to prevent overflow */}
              <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2">
                {project.stack.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/15 bg-black/40 px-2.5 sm:px-3 py-0.5 sm:py-1 font-mono text-[10px] sm:text-xs text-white/90 backdrop-blur-sm"
                  >
                    {tag}
                  </span>
                ))}
                {project.stack.length > 4 && (
                  <span className="rounded-full border border-white/10 bg-black/30 px-2 py-0.5 font-mono text-[10px] sm:text-xs text-white/60 backdrop-blur-sm">
                    +{project.stack.length - 4}
                  </span>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0 pt-1 md:pt-0">
              <button
                onClick={() => onOpen(project)}
                className="group inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/15 px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-white backdrop-blur-md transition-all hover:bg-white hover:text-black active:scale-95"
              >
                <span>Case Study</span>
                <ArrowUpRight
                  size={15}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </button>

              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View live deployment"
                  className="inline-flex h-9 sm:h-11 items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-3 sm:px-4 text-xs font-medium text-white/85 backdrop-blur-md transition-all hover:border-white/50 hover:text-white active:scale-95"
                >
                  <ExternalLink size={13} />
                  <span className="hidden sm:inline">Live Demo</span>
                </a>
              )}

              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View source on GitHub"
                  className="inline-flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white/85 backdrop-blur-md transition-all hover:border-white/50 hover:text-white active:scale-95"
                >
                  <Github size={15} />
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  CaseStudyModal: Mobile-first sliding drawer & desktop modal                */
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
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 backdrop-blur-md md:items-center p-0 md:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90svh] w-full max-w-[900px] overflow-y-auto rounded-t-2xl sm:rounded-t-3xl md:rounded-3xl bg-background border border-border p-5 sm:p-8 md:p-12 shadow-2xl pb-10"
          >
            {/* Sticky close button so user never loses it while scrolling */}
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
            <h3 className="mt-3 text-2xl sm:text-4xl md:text-5xl font-medium tracking-tight pr-10">
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
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E8B04A]" />
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
/*  Main Section                                                              */
/* -------------------------------------------------------------------------- */

export default function FeaturedWork() {
  const [openProject, setOpenProject] = useState<Project | null>(null);

  // Safely manage body overflow when modal opens/closes
  useEffect(() => {
    if (openProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [openProject]);

  return (
    <section id="work" className="border-b border-border">
      {/* Section Header */}
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 pt-20 sm:pt-28 md:px-10 pb-4 sm:pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs tracking-[0.3em] text-[#E8B04A] uppercase">
              03 // SELECTED WORK
            </p>
            <h2 className="mt-2 text-3xl font-medium tracking-tight sm:text-4xl md:text-5xl text-foreground">
              Featured Builds &amp; Case Studies
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-muted max-w-md leading-relaxed">
            Production web applications, autonomous AI agents, and developer tooling engineered for scale.
          </p>
        </div>
      </div>

      {/* Stacked Cards */}
      <div className="pb-12 sm:pb-20">
        {projects.map((project, index) => (
          <StackCard
            key={project.id}
            project={project}
            index={index}
            total={projects.length}
            onOpen={setOpenProject}
          />
        ))}
      </div>

      {/* Case Study Modal */}
      <CaseStudyModal
        project={openProject}
        onClose={() => setOpenProject(null)}
      />
    </section>
  );
}
