"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowUpRight, Github, ExternalLink, X } from "lucide-react";
import { projects, type Project } from "@/lib/data";

function StackCard({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: (project: Project) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 0.85, 1], [1, 1, 0.6]);

  return (
    <div
      ref={ref}
      className="sticky top-0 flex h-screen items-center justify-center px-4 md:px-10"
      style={{ zIndex: index + 1 }}
    >
      <motion.div
        style={{ scale, opacity }}
        className="relative aspect-[16/10] w-full max-w-[1200px] overflow-hidden rounded-3xl bg-background-soft shadow-2xl border border-white/10"
      >
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="90vw"
          className="object-cover"
          priority={index === 0}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-8 md:flex-row md:items-end md:justify-between md:p-12">
          <div>
            <p className="mb-2 text-xs tracking-[0.3em] text-white/60 uppercase">
              {project.category} — {project.year}
            </p>
            <h3 className="text-4xl font-medium text-white md:text-6xl tracking-tight">
              {project.title}
            </h3>
            <p className="mt-2 text-sm text-white/70 max-w-xl line-clamp-2">
              {project.summary}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.stack.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/20 bg-black/30 backdrop-blur-sm px-3 py-1 text-xs text-white/90"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpen(project)}
              className="group flex w-fit items-center gap-2 rounded-full border border-white/40 bg-white/10 px-5 py-3 text-sm text-white backdrop-blur-sm transition-all hover:bg-white hover:text-black"
            >
              Case Study
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
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
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 backdrop-blur-md md:items-center p-0 md:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90vh] w-full max-w-[900px] overflow-y-auto rounded-t-3xl bg-background border border-border p-8 md:rounded-3xl md:p-12 shadow-2xl"
          >
            <button
              onClick={onClose}
              aria-label="Close case study"
              className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground/80 hover:text-foreground transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3">
              <span className="text-xs tracking-[0.3em] text-muted uppercase">
                {project.category}
              </span>
              <span className="text-xs text-muted/60">•</span>
              <span className="text-xs text-muted">{project.year}</span>
            </div>

            <h3 className="mt-3 text-3xl font-medium md:text-5xl tracking-tight">
              {project.title}
            </h3>
            <p className="mt-2 text-sm text-muted">{project.client}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {project.stack.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border bg-background-soft px-3 py-1 text-xs text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border">
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="90vw"
                className="object-cover"
              />
            </div>

            <div className="mt-8">
              <h4 className="text-sm font-semibold tracking-[0.15em] text-muted uppercase">
                Overview
              </h4>
              <p className="mt-3 text-lg leading-relaxed text-foreground/90">
                {project.summary}
              </p>
            </div>

            <div className="mt-8 border-t border-border pt-8">
              <h4 className="text-sm font-semibold tracking-[0.15em] text-muted uppercase mb-4">
                Key Technical Highlights & Outcomes
              </h4>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {project.details.map((detail) => (
                  <li
                    key={detail}
                    className="flex items-start gap-2.5 text-sm text-muted leading-relaxed"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-border pt-8">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background-soft px-5 py-2.5 text-xs tracking-[0.15em] text-foreground transition-colors hover:border-foreground uppercase font-medium"
                >
                  <Github size={14} />
                  View GitHub
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-xs tracking-[0.15em] text-background transition-transform hover:scale-105 uppercase font-medium"
                >
                  <ExternalLink size={14} />
                  Case Study Link
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

  function handleOpen(project: Project) {
    setOpenProject(project);
    document.body.style.overflow = "hidden";
  }

  function handleClose() {
    setOpenProject(null);
    document.body.style.overflow = "";
  }

  return (
    <section id="work" className="border-b border-border">
      <div className="mx-auto max-w-[1440px] px-6 pt-28 md:px-10">
        <p className="text-xs tracking-[0.3em] text-muted uppercase">
          SELECTED PROJECTS & CASE STUDIES
        </p>
      </div>

      <div>
        {projects.map((project, index) => (
          <StackCard
            key={project.id}
            project={project}
            index={index}
            onOpen={handleOpen}
          />
        ))}
      </div>

      <CaseStudyModal project={openProject} onClose={handleClose} />
    </section>
  );
}
