"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import {
  Briefcase,
  Calendar,
  MapPin,
  GraduationCap,
} from "lucide-react";
import { experiences, education } from "@/lib/data";

/* -------------------------------------------------------------------------- */
/*  Shared reveal hook: light, finishes early so cards are never dim to read  */
/* -------------------------------------------------------------------------- */
function useCardReveal(ref: React.RefObject<HTMLElement | null>) {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 92%", "start 60%"],
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [reduce ? 1 : 0.5, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 16, 0]);
  return { opacity, y };
}

const cardClass =
  "relative scroll-mt-28 rounded-2xl sm:rounded-3xl border border-border bg-background-soft p-5 sm:p-8 lg:p-10 transition-colors duration-300 lg:hover:border-white/30 shadow-xl";

const watermarkClass =
  "pointer-events-none absolute right-4 top-3 sm:right-8 sm:top-6 select-none font-mono text-5xl sm:text-7xl lg:text-8xl font-black text-white/[0.03]";

const chipClass =
  "rounded-full bg-white/[0.03] border border-white/[0.08] px-2 py-0.5 sm:px-2.5 sm:py-1 text-xs text-zinc-300 transition-colors lg:hover:border-white/20 lg:hover:text-white";

/* -------------------------------------------------------------------------- */
/*  Experience card                                                           */
/* -------------------------------------------------------------------------- */
function ExperienceMilestone({
  exp,
  index,
}: {
  exp: (typeof experiences)[number];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { opacity, y } = useCardReveal(cardRef);

  return (
    <motion.div
      id={`experience-${index}`}
      ref={cardRef}
      style={{ opacity, y }}
      className={cardClass}
    >
      {/* Background watermark index */}
      <span className={watermarkClass}>{exp.index}</span>

      <div className="relative z-10 flex flex-col justify-between">
        <div>
          {/* Top metadata badges */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-300">
              <Calendar size={12} className="text-zinc-400" />
              {exp.period}
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.02] px-2.5 py-0.5 text-xs text-zinc-400">
              {exp.type}
            </span>
          </div>

          {/* Role title */}
          <h3 className="mt-4 text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight text-white">
            {exp.role}
          </h3>

          {/* Company and location */}
          <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2.5 text-sm text-zinc-400">
            <span className="flex items-center gap-1.5 font-medium text-zinc-200">
              <Briefcase size={14} className="shrink-0 text-zinc-400" />
              {exp.company}
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <MapPin size={13} className="shrink-0 text-zinc-500" />
              {exp.location}
            </span>
          </div>

          {/* Description */}
          <p className="mt-4 sm:mt-5 text-sm sm:text-base text-zinc-300 leading-relaxed">
            {exp.description}
          </p>

          {/* Highlights */}
          <ul className="mt-4 sm:mt-5 space-y-2 border-t border-white/[0.08] pt-4 sm:pt-5">
            {exp.highlights.map((highlight, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-sm text-zinc-300 leading-relaxed"
              >
                <span className="mt-1 select-none leading-none text-zinc-500">
                  •
                </span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Skill tags */}
        <div className="mt-6 sm:mt-7 flex flex-wrap gap-1.5 sm:gap-2 pt-2">
          {exp.skills.map((skill) => (
            <span key={skill} className={chipClass}>
              {skill}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Education card                                                            */
/* -------------------------------------------------------------------------- */
function EducationMilestone() {
  const cardRef = useRef<HTMLDivElement>(null);
  const { opacity, y } = useCardReveal(cardRef);

  return (
    <motion.div
      id="education-milestone"
      ref={cardRef}
      style={{ opacity, y }}
      className={cardClass}
    >
      {/* Background watermark */}
      <span className={watermarkClass}>EDU</span>

      <div className="relative z-10 flex flex-col justify-between">
        <div>
          {/* Metadata badges */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-300">
              <Calendar size={12} className="text-zinc-400" />
              {education.period}
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-200">
              CGPA: {education.cgpa} / 10.0
            </span>
          </div>

          {/* Degree and institution */}
          <h3 className="mt-4 text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight text-white">
            {education.degree}
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-2.5 text-sm text-zinc-400">
            <span className="flex items-center gap-1.5 font-medium text-zinc-200">
              <GraduationCap size={15} className="shrink-0 text-zinc-400" />
              {education.institution}
            </span>
          </div>

          {/* Description */}
          <p className="mt-4 sm:mt-5 text-sm sm:text-base text-zinc-300 leading-relaxed">
            Graduated with a focus on core computer science foundations,
            algorithm design, distributed computing, database management, and
            full-stack software development.
          </p>

          {/* Coursework */}
          <div className="mt-5 sm:mt-6 border-t border-white/[0.08] pt-4 sm:pt-5">
            <p className="mb-3 text-xs uppercase tracking-wider text-zinc-400">
              Core Coursework &amp; Subjects
            </p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {education.coursework.map((course) => (
                <span key={course} className={chipClass}>
                  {course}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Desktop rail item (lg and up only)                                        */
/* -------------------------------------------------------------------------- */
function SegmentPiece({
  exp,
  index,
  total,
  scrollYProgress,
  onSelect,
}: {
  exp: (typeof experiences)[number];
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
  onSelect: (index: number) => void;
}) {
  const stepStart = index / total;
  const stepEnd = (index + 1) / total;

  const segmentProgress = useTransform(
    scrollYProgress,
    [stepStart, stepEnd],
    [0, 1]
  );

  const fillHeight = useTransform(segmentProgress, [0, 1], ["0%", "100%"]);
  const labelOpacity = useTransform(
    segmentProgress,
    [-0.1, 0, 1, 1.2],
    [0.4, 0.5, 1, 0.75]
  );

  return (
    <button
      type="button"
      onClick={() => onSelect(index)}
      className="group relative flex w-full cursor-pointer items-start gap-4 py-2 text-left transition-all"
    >
      {/* Rail marker */}
      <div className="relative flex flex-col items-center">
        <div className="relative h-20 w-1 overflow-hidden rounded-full bg-white/10 transition-all duration-300 group-hover:bg-white/20">
          <motion.div
            style={{ height: fillHeight }}
            className="absolute inset-x-0 top-0 w-full rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.7)]"
          />
        </div>
      </div>

      {/* Label and info */}
      <motion.div style={{ opacity: labelOpacity }} className="flex flex-col pt-0.5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-zinc-400">{exp.index}</span>
          <span className="font-mono text-xs text-zinc-500">{exp.period}</span>
        </div>
        <p className="mt-1 text-sm font-medium tracking-tight text-white">
          {exp.role}
        </p>
        <p className="text-xs text-zinc-400">{exp.company}</p>
      </motion.div>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Mobile / tablet progress segment (no hooks inside .map)                   */
/* -------------------------------------------------------------------------- */
function MobileSegment({
  i,
  total,
  progress,
}: {
  i: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const scaleX = useTransform(progress, [i / total, (i + 1) / total], [0, 1]);
  return (
    <div className="h-1 overflow-hidden rounded-full bg-white/15">
      <motion.div
        style={{ scaleX, transformOrigin: "left" }}
        className="h-full w-full bg-white"
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section                                                                   */
/* -------------------------------------------------------------------------- */
export default function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 25,
  });

  function scrollToMilestone(index: number) {
    const el = document.getElementById(`experience-${index}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function scrollToEducation() {
    const el = document.getElementById("education-milestone");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <section
      id="experience"
      ref={containerRef}
      className="relative border-b border-border py-16 md:py-28 lg:py-36"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        {/* Sticky mobile/tablet progress bar. Change top-16 to your navbar height. */}
        <div className="lg:hidden sticky top-16 z-30 -mx-6 md:-mx-10 mb-8 border-b border-white/[0.08] bg-background/80 px-6 md:px-10 py-3 backdrop-blur-md">
          <div className="mb-2 flex justify-between font-mono text-[11px] text-zinc-400">
            <span>TIMELINE</span>
            <span>{experiences.length} ROLES</span>
          </div>
          <div
            className="grid gap-2"
            style={{
              gridTemplateColumns: `repeat(${experiences.length}, minmax(0, 1fr))`,
            }}
          >
            {experiences.map((exp, i) => (
              <MobileSegment
                key={exp.id}
                i={i}
                total={experiences.length}
                progress={smoothProgress}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-16">
          {/* Left column: heading + desktop sticky rail */}
          <div className="lg:col-span-5">
            <div className="flex flex-col lg:sticky lg:top-28">
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">
                CAREER &amp; JOURNEY
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Work Experience
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-400">
                Track record of building production systems, modern full-stack
                web applications, and scalable backend architectures.
              </p>

              {/* Timeline rail: desktop only */}
              <div className="mt-10 hidden flex-col gap-1 pl-1 lg:flex">
                <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                  TIMELINE PROGRESSION
                </div>
                {experiences.map((exp, idx) => (
                  <SegmentPiece
                    key={exp.id}
                    exp={exp}
                    index={idx}
                    total={experiences.length}
                    scrollYProgress={smoothProgress}
                    onSelect={scrollToMilestone}
                  />
                ))}

                {/* Education navigation link */}
                <button
                  type="button"
                  onClick={scrollToEducation}
                  className="group relative mt-2 flex w-full cursor-pointer items-start gap-4 border-t border-white/[0.08] py-3 text-left transition-all"
                >
                  <div className="relative flex flex-col items-center">
                    <div className="h-10 w-1 rounded-full bg-white/10 transition-all group-hover:bg-white/30" />
                    <div className="absolute top-1 h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
                  </div>
                  <div className="flex flex-col pt-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-zinc-300">EDU</span>
                      <span className="font-mono text-xs text-zinc-500">
                        {education.period}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-medium tracking-tight text-white">
                      {education.degree}
                    </p>
                    <p className="text-xs text-zinc-400">
                      {education.institution}
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Right column: cards */}
          <div className="flex flex-col gap-6 sm:gap-8 lg:col-span-7 lg:gap-10">
            {experiences.map((exp, idx) => (
              <ExperienceMilestone key={exp.id} exp={exp} index={idx} />
            ))}
            <EducationMilestone />
          </div>
        </div>
      </div>
    </section>
  );
}