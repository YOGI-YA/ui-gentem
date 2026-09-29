"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
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
        className="relative aspect-[16/10] w-full max-w-[1200px] overflow-hidden rounded-3xl bg-background-soft shadow-2xl"
      >
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="90vw"
          className="object-cover"
          priority={index === 0}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-8 md:flex-row md:items-end md:justify-between md:p-12">
          <div>
            <p className="mb-2 text-xs tracking-[0.3em] text-white/60">
              {project.category} — {project.year}
            </p>
            <h3 className="text-4xl font-medium text-white md:text-6xl">
              {project.title}
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.stack.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/30 px-3 py-1 text-xs text-white/80"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={() => onOpen(project)}
            className="group flex w-fit items-center gap-2 rounded-full border border-white/40 px-5 py-3 text-sm text-white transition-colors hover:bg-white hover:text-black"
          >
            View Case
            <ArrowUpRight
              size={16}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </button>
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
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 md:items-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90vh] w-full max-w-[900px] overflow-y-auto rounded-t-3xl bg-background p-8 md:rounded-3xl md:p-14"
          >
            <button
              onClick={onClose}
              aria-label="Close case study"
              className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-border"
            >
              <X size={18} />
            </button>

            <p className="text-xs tracking-[0.3em] text-muted">
              {project.category} — {project.year}
            </p>
            <h3 className="mt-4 text-4xl font-medium md:text-5xl">
              {project.title}
            </h3>
            <p className="mt-2 text-muted">{project.client}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {project.stack.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border px-3 py-1 text-xs text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl">
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="90vw"
                className="object-cover"
              />
            </div>

            <p className="mt-8 max-w-xl text-lg leading-relaxed">
              {project.summary}
            </p>

            <ul className="mt-8 grid grid-cols-1 gap-3 border-t border-border pt-8 sm:grid-cols-2">
              {project.details.map((detail) => (
                <li
                  key={detail}
                  className="flex items-start gap-2 text-sm text-muted"
                >
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-foreground" />
                  {detail}
                </li>
              ))}
            </ul>
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
        <p className="text-xs tracking-[0.3em] text-muted">SELECTED WORK</p>
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
