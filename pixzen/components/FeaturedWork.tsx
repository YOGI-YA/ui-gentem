"use client";

import { useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
} from "framer-motion";
import {
  ArrowUpRight,
  Github,
  ExternalLink,
  X,
  Sparkles,
  Layers,
  Terminal,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { projects, type Project } from "@/lib/data";

const categories = [
  { id: "all", label: "All Projects" },
  { id: "ai", label: "AI & Agents" },
  { id: "security", label: "Security & Cloud" },
  { id: "devtools", label: "Dev Architecture" },
] as const;

function ProjectConsolePreview({ project }: { project: Project }) {
  if (project.id === "graa-ai") {
    return (
      <div className="relative h-full w-full bg-[#080808] p-5 font-mono text-xs flex flex-col justify-between overflow-hidden">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
            <span className="ml-2 text-[11px] text-muted font-sans">graa-agent-runtime.ts</span>
          </div>
          <span className="flex items-center gap-1.5 text-[10px] text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
            ONLINE
          </span>
        </div>

        {/* Content stream simulation */}
        <div className="space-y-3 py-4 text-left">
          <div className="rounded border border-emerald-500/20 bg-emerald-950/20 p-2 text-emerald-300">
            <span className="text-muted/60">&gt; </span>
            <span className="font-semibold">Query:</span> &quot;Synthesize vector embeddings across 14 research papers&quot;
          </div>
          <div className="space-y-1 text-muted text-[11px]">
            <p className="flex items-center gap-2">
              <CheckCircle2 size={12} className="text-emerald-400" />
              <span>Hybrid RAG index initialized (cosine sim 0.942)</span>
            </p>
            <p className="flex items-center gap-2">
              <CheckCircle2 size={12} className="text-emerald-400" />
              <span>Sub-agent orchestration: 4 concurrent workers active</span>
            </p>
            <p className="flex items-center gap-2 text-foreground/80">
              <Activity size={12} className="text-teal-400 animate-pulse" />
              <span>Streaming token response: sub-100ms first chunk</span>
            </p>
          </div>
        </div>

        {/* Console status footer */}
        <div className="flex items-center justify-between border-t border-white/10 pt-3 text-[10px] text-muted/60">
          <span>Engine: Next.js 15 Edge</span>
          <span>Latency: 78ms</span>
        </div>
      </div>
    );
  }

  if (project.id === "ai-ebook") {
    return (
      <div className="relative h-full w-full bg-[#09080e] p-5 font-mono text-xs flex flex-col justify-between overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-purple-500/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-indigo-500/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-pink-500/80" />
            <span className="ml-2 text-[11px] text-muted font-sans">synthesis-pipeline.engine</span>
          </div>
          <span className="text-[10px] text-purple-400 font-sans">GEN 3.8</span>
        </div>

        <div className="space-y-3 py-4 text-left">
          <div className="rounded border border-purple-500/20 bg-purple-950/20 p-2 text-purple-300">
            <span className="text-muted/60">&gt; </span>
            <span className="font-semibold">Target:</span> &quot;Complete 12-Chapter Technical Manuscript&quot;
          </div>
          <div className="space-y-1 text-muted text-[11px]">
            <p className="flex items-center gap-2">
              <CheckCircle2 size={12} className="text-purple-400" />
              <span>Context memory linked: 128k token coherent tree</span>
            </p>
            <p className="flex items-center gap-2">
              <CheckCircle2 size={12} className="text-purple-400" />
              <span>Typesetting & typography hierarchy rendered</span>
            </p>
            <p className="flex items-center gap-2 text-foreground/80">
              <Sparkles size={12} className="text-indigo-400" />
              <span>Ready: PDF, ePub & responsive web view</span>
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/10 pt-3 text-[10px] text-muted/60">
          <span>Output: 10,000+ Pages Scaled</span>
          <span>Engine: LLM Memory Chains</span>
        </div>
      </div>
    );
  }

  if (project.id === "photo-vault") {
    return (
      <div className="relative h-full w-full bg-[#070b0e] p-5 font-mono text-xs flex flex-col justify-between overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-cyan-500/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-blue-500/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-teal-500/80" />
            <span className="ml-2 text-[11px] text-muted font-sans">crypto-enclave.worker</span>
          </div>
          <span className="text-[10px] text-cyan-400 font-sans">AES-GCM-256</span>
        </div>

        <div className="space-y-3 py-4 text-left">
          <div className="rounded border border-cyan-500/20 bg-cyan-950/20 p-2 text-cyan-300">
            <span className="text-muted/60">&gt; </span>
            <span className="font-semibold">Security:</span> &quot;Zero-Knowledge Client-Side Key Derivation&quot;
          </div>
          <div className="space-y-1 text-muted text-[11px]">
            <p className="flex items-center gap-2">
              <CheckCircle2 size={12} className="text-cyan-400" />
              <span>Web Crypto PBKDF2 salt generated in memory</span>
            </p>
            <p className="flex items-center gap-2">
              <CheckCircle2 size={12} className="text-cyan-400" />
              <span>Media payload encrypted before outbound request</span>
            </p>
            <p className="flex items-center gap-2 text-foreground/80">
              <CheckCircle2 size={12} className="text-teal-400" />
              <span>Zero server logging • Biometric WebAuthn active</span>
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/10 pt-3 text-[10px] text-muted/60">
          <span>Bandwidth Saved: -45%</span>
          <span>Knowledge: 0% Server-Side</span>
        </div>
      </div>
    );
  }

  // Default: Nexus Core
  return (
    <div className="relative h-full w-full bg-[#0a0805] p-5 font-mono text-xs flex flex-col justify-between overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
          <div className="h-2.5 w-2.5 rounded-full bg-orange-500/80" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
          <span className="ml-2 text-[11px] text-muted font-sans">nexus-architecture.config</span>
        </div>
        <span className="text-[10px] text-amber-400 font-sans">TYPE-SAFE</span>
      </div>

      <div className="space-y-3 py-4 text-left">
        <div className="rounded border border-amber-500/20 bg-amber-950/20 p-2 text-amber-300">
          <span className="text-muted/60">&gt; </span>
          <span className="font-semibold">Module:</span> &quot;Core Component System & Schema Engine&quot;
        </div>
        <div className="space-y-1 text-muted text-[11px]">
          <p className="flex items-center gap-2">
            <CheckCircle2 size={12} className="text-amber-400" />
            <span>Strict TypeScript AST generation (0 any types)</span>
          </p>
          <p className="flex items-center gap-2">
            <CheckCircle2 size={12} className="text-amber-400" />
            <span>WCAG AAA accessibility compliance verified</span>
          </p>
          <p className="flex items-center gap-2 text-foreground/80">
            <CheckCircle2 size={12} className="text-orange-400" />
            <span>Automated OpenAPI & telemetry integration</span>
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-white/10 pt-3 text-[10px] text-muted/60">
        <span>Runtime: 0 kB Overhead</span>
        <span>Velocity: 3x Acceleration</span>
      </div>
    </div>
  );
}

function ProjectCard({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: (project: Project) => void;
}) {
  const [activeTab, setActiveTab] = useState<"visual" | "console">("console");

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-3xl border border-border bg-background-soft p-6 transition-all duration-500 hover:border-white/30 md:p-10 shadow-2xl"
    >
      {/* Dynamic ambient color glow */}
      <div
        className={`pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-gradient-to-br ${project.gradient} blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-700`}
      />

      {/* Large watermark index */}
      <span className="pointer-events-none absolute right-8 top-6 select-none font-mono text-7xl sm:text-8xl font-black text-white/[0.03] transition-colors group-hover:text-white/[0.07]">
        0{index + 1}
      </span>

      <div className="relative z-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12 items-center">
        {/* Left Information Column */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div>
            {/* Badges bar */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-border bg-background px-3 py-1 text-[11px] font-medium tracking-wider uppercase text-muted">
                {project.category}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {project.status}
              </span>
              <span className="text-xs text-muted/60">{project.year}</span>
            </div>

            {/* Title */}
            <h3 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-foreground group-hover:text-white transition-colors">
              {project.title}
            </h3>

            <p className="mt-1 text-sm font-medium text-muted">
              {project.client}
            </p>

            {/* Summary */}
            <p className="mt-5 text-base sm:text-lg leading-relaxed text-muted/90">
              {project.summary}
            </p>

            {/* Technical Metric Cards */}
            <div className="mt-6 grid grid-cols-3 gap-2.5 border-y border-border/80 py-4">
              {project.metrics.map((metric) => (
                <div key={metric.label} className="flex flex-col">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted">
                    {metric.label}
                  </span>
                  <span className="mt-1 text-sm sm:text-base font-semibold tracking-tight text-foreground">
                    {metric.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Tech Stack Pills */}
            <div className="mt-6 flex flex-wrap gap-2">
              {project.stack.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted transition-colors group-hover:border-foreground/30 group-hover:text-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onOpen(project)}
              className="group/btn inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-xs font-semibold tracking-[0.15em] text-background uppercase transition-all hover:scale-105"
            >
              Case Study
              <ArrowUpRight
                size={14}
                className="transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
              />
            </button>

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-5 py-3 text-xs font-medium tracking-[0.15em] text-foreground uppercase backdrop-blur-sm transition-colors hover:border-foreground hover:bg-background"
              >
                <ExternalLink size={13} />
                Live Demo
              </a>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-3 text-xs font-medium tracking-[0.15em] text-muted hover:text-foreground uppercase backdrop-blur-sm transition-colors hover:border-foreground"
                aria-label="GitHub Repository"
              >
                <Github size={15} />
              </a>
            )}
          </div>
        </div>

        {/* Right Interactive Mockup / Visual Window Column */}
        <div className="lg:col-span-6">
          <div className="relative aspect-[16/11] w-full overflow-hidden rounded-2xl border border-white/10 bg-background shadow-2xl">
            {/* View Mode Switcher Header */}
            <div className="absolute top-3 right-3 z-20 flex items-center gap-1 rounded-full border border-white/10 bg-black/70 p-1 backdrop-blur-md">
              <button
                onClick={() => setActiveTab("console")}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-mono transition-colors ${
                  activeTab === "console"
                    ? "bg-white text-black font-semibold"
                    : "text-muted hover:text-white"
                }`}
              >
                <Terminal size={12} />
                Runtime
              </button>
              <button
                onClick={() => setActiveTab("visual")}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-mono transition-colors ${
                  activeTab === "visual"
                    ? "bg-white text-black font-semibold"
                    : "text-muted hover:text-white"
                }`}
              >
                <Layers size={12} />
                Preview
              </button>
            </div>

            {/* Dynamic Content */}
            <AnimatePresence mode="wait">
              {activeTab === "console" ? (
                <motion.div
                  key="console"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="h-full w-full"
                >
                  <ProjectConsolePreview project={project} />
                </motion.div>
              ) : (
                <motion.div
                  key="visual"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative h-full w-full overflow-hidden"
                >
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 text-xs font-mono text-white/80">
                    {project.title} — Visual Surface
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

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
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/85 backdrop-blur-md md:items-center p-0 md:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[92vh] w-full max-w-[960px] overflow-y-auto rounded-t-3xl bg-background border border-border p-8 md:rounded-3xl md:p-14 shadow-2xl"
          >
            <button
              onClick={onClose}
              aria-label="Close case study"
              className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground/80 hover:text-foreground transition-colors bg-background-soft"
            >
              <X size={18} />
            </button>

            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-border bg-background-soft px-3 py-1 text-xs tracking-[0.2em] text-muted uppercase font-mono">
                {project.category}
              </span>
              <span className="text-xs text-muted/60">•</span>
              <span className="text-xs text-muted">{project.year}</span>
              <span className="text-xs text-muted/60">•</span>
              <span className="text-xs text-emerald-400 font-medium">{project.status}</span>
            </div>

            <h3 className="mt-4 text-3xl font-medium sm:text-4xl md:text-5xl tracking-tight text-foreground">
              {project.title}
            </h3>
            <p className="mt-1 text-base text-muted font-medium">{project.client}</p>

            {/* Key Metrics Banner */}
            <div className="mt-6 grid grid-cols-3 gap-4 rounded-2xl border border-border bg-background-soft p-5">
              {project.metrics.map((m) => (
                <div key={m.label}>
                  <p className="text-[11px] font-mono text-muted uppercase tracking-wider">
                    {m.label}
                  </p>
                  <p className="mt-1 text-base sm:text-lg font-semibold text-foreground">
                    {m.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Visual preview */}
            <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border shadow-lg">
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="90vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            {/* Overview */}
            <div className="mt-8">
              <h4 className="text-xs font-mono tracking-[0.2em] text-muted uppercase">
                System Overview & Architecture
              </h4>
              <p className="mt-3 text-lg leading-relaxed text-foreground/90">
                {project.summary}
              </p>
            </div>

            {/* Technical Highlights */}
            <div className="mt-8 border-t border-border pt-8">
              <h4 className="text-xs font-mono tracking-[0.2em] text-muted uppercase mb-4">
                Core Innovations & Technical Feats
              </h4>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {project.details.map((detail) => (
                  <li
                    key={detail}
                    className="flex items-start gap-3 rounded-xl border border-border/60 bg-background-soft/60 p-4 text-sm text-muted leading-relaxed"
                  >
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-400" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Stack */}
            <div className="mt-8 border-t border-border pt-8">
              <h4 className="text-xs font-mono tracking-[0.2em] text-muted uppercase mb-3">
                Technologies & Protocols Used
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.stack.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border bg-background-soft px-3.5 py-1.5 text-xs text-foreground font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-border pt-8">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-xs tracking-[0.15em] text-background uppercase font-semibold transition-transform hover:scale-105"
                >
                  <ExternalLink size={14} />
                  Live Case Study
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background-soft px-6 py-3 text-xs tracking-[0.15em] text-foreground uppercase font-medium transition-colors hover:border-foreground"
                >
                  <Github size={14} />
                  GitHub Repository
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function FeaturedWork() {
  const [openProject, setOpenProject] = useState<Project | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filteredProjects =
    activeFilter === "all"
      ? projects
      : projects.filter((p) => p.filterCategory === activeFilter);

  function handleOpen(project: Project) {
    setOpenProject(project);
    document.body.style.overflow = "hidden";
  }

  function handleClose() {
    setOpenProject(null);
    document.body.style.overflow = "";
  }

  return (
    <section id="work" className="border-b border-border py-28 md:py-36">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        {/* Header Section */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end mb-14">
          <div>
            <p className="text-xs tracking-[0.3em] text-muted uppercase">
              SELECTED PROJECTS & CASE STUDIES
            </p>
            <h2 className="mt-3 text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight">
              Crafted with Precision.
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                className={`rounded-full px-4 py-2 text-xs tracking-wider transition-all uppercase font-medium ${
                  activeFilter === cat.id
                    ? "bg-foreground text-background font-semibold"
                    : "border border-border bg-background-soft text-muted hover:border-foreground/40 hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="flex flex-col gap-10">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onOpen={handleOpen}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      <CaseStudyModal project={openProject} onClose={handleClose} />
    </section>
  );
}
