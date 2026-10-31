"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import {
  Briefcase,
  Calendar,
  MapPin,
  GraduationCap,
} from "lucide-react";
import { experiences, education } from "@/lib/data";

function ExperienceMilestone({
  exp,
  index,
}: {
  exp: (typeof experiences)[number];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start 80%", "center center"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 20,
  });

  const opacity = useTransform(smoothProgress, [0, 1], [0.35, 1]);
  const scale = useTransform(smoothProgress, [0, 1], [0.98, 1]);

  return (
    <motion.div
      id={`experience-${index}`}
      ref={cardRef}
      style={{ opacity, scale }}
      className="relative scroll-mt-36 rounded-3xl border border-border bg-background-soft p-8 sm:p-10 transition-all duration-500 hover:border-white/30 shadow-xl"
    >
      {/* Background watermark index */}
      <span className="pointer-events-none absolute right-8 top-6 select-none font-mono text-7xl sm:text-8xl font-black text-white/[0.03]">
        {exp.index}
      </span>

      <div className="relative z-10 flex flex-col justify-between">
        <div>
          {/* Top metadata badges (Normal, clean neutral styling) */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-300">
              <Calendar size={12} className="text-zinc-400" />
              {exp.period}
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.02] px-2.5 py-0.5 text-xs text-zinc-400">
              {exp.type}
            </span>
          </div>

          {/* Role Title & Company (Normal, crisp typography) */}
          <h3 className="mt-4 text-2xl sm:text-3xl font-semibold tracking-tight text-white">
            {exp.role}
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-2.5 text-sm text-zinc-400">
            <span className="flex items-center gap-1.5 font-medium text-zinc-200">
              <Briefcase size={14} className="text-zinc-400" />
              {exp.company}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <MapPin size={13} className="text-zinc-500" />
              {exp.location}
            </span>
          </div>

          {/* Clean description text */}
          <p className="mt-5 text-sm sm:text-base text-zinc-300 leading-relaxed">
            {exp.description}
          </p>

          {/* Clean bullet points with subtle dots */}
          <ul className="mt-5 space-y-2 border-t border-white/[0.08] pt-5">
            {exp.highlights.map((highlight, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-sm text-zinc-300 leading-relaxed"
              >
                <span className="text-zinc-500 mt-1 select-none leading-none">•</span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Clean skill tags */}
        <div className="mt-7 flex flex-wrap gap-2 pt-2">
          {exp.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-white/[0.03] border border-white/[0.08] px-2.5 py-1 text-xs text-zinc-300 transition-colors hover:border-white/20 hover:text-white"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function EducationMilestone() {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start 80%", "center center"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 20,
  });

  const opacity = useTransform(smoothProgress, [0, 1], [0.35, 1]);
  const scale = useTransform(smoothProgress, [0, 1], [0.98, 1]);

  return (
    <motion.div
      id="education-milestone"
      ref={cardRef}
      style={{ opacity, scale }}
      className="relative scroll-mt-36 rounded-3xl border border-border bg-background-soft p-8 sm:p-10 transition-all duration-500 hover:border-white/30 shadow-xl"
    >
      {/* Background watermark */}
      <span className="pointer-events-none absolute right-8 top-6 select-none font-mono text-7xl sm:text-8xl font-black text-white/[0.03]">
        EDU
      </span>

      <div className="relative z-10 flex flex-col justify-between">
        <div>
          {/* Metadata badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-300">
              <Calendar size={12} className="text-zinc-400" />
              {education.period}
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-200">
              CGPA: {education.cgpa} / 10.0
            </span>
          </div>

          {/* Degree Title & Institution */}
          <h3 className="mt-4 text-2xl sm:text-3xl font-semibold tracking-tight text-white">
            {education.degree}
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-2.5 text-sm text-zinc-400">
            <span className="flex items-center gap-1.5 font-medium text-zinc-200">
              <GraduationCap size={15} className="text-zinc-400" />
              {education.institution}
            </span>
          </div>

          {/* Description */}
          <p className="mt-5 text-sm sm:text-base text-zinc-300 leading-relaxed">
            Graduated with a focus on core computer science foundations, algorithm design, distributed computing, database management, and full-stack software development.
          </p>

          {/* Coursework & Domains */}
          <div className="mt-6 border-t border-white/[0.08] pt-5">
            <p className="text-xs text-zinc-400 uppercase tracking-wider mb-3">
              Core Coursework &amp; Subjects
            </p>
            <div className="flex flex-wrap gap-2">
              {education.coursework.map((course) => (
                <span
                  key={course}
                  className="rounded-full bg-white/[0.03] border border-white/[0.08] px-2.5 py-1 text-xs text-zinc-300 transition-colors hover:border-white/20 hover:text-white"
                >
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
  scrollYProgress: any;
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
  const labelScale = useTransform(segmentProgress, [0, 0.5, 1], [0.98, 1.02, 1]);

  return (
    <button
      onClick={() => onSelect(index)}
      className="group relative flex items-start gap-4 text-left w-full transition-all cursor-pointer py-2"
    >
      {/* Rail Marker */}
      <div className="relative flex flex-col items-center">
        <div className="relative h-20 w-1 rounded-full bg-white/10 overflow-hidden transition-all duration-300 group-hover:bg-white/20">
          <motion.div
            style={{ height: fillHeight }}
            className="absolute top-0 inset-x-0 w-full rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.7)]"
          />
        </div>
      </div>

      {/* Label and Info */}
      <motion.div
        style={{ opacity: labelOpacity, scale: labelScale }}
        className="flex flex-col pt-0.5"
      >
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-zinc-400">
            {exp.index}
          </span>
          <span className="font-mono text-xs text-zinc-500">
            {exp.period}
          </span>
        </div>
        <p className="mt-1 text-sm font-medium tracking-tight text-white transition-all">
          {exp.role}
        </p>
        <p className="text-xs text-zinc-400">{exp.company}</p>
      </motion.div>
    </button>
  );
}

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
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  function scrollToEducation() {
    const el = document.getElementById("education-milestone");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  return (
    <section
      id="experience"
      ref={containerRef}
      className="relative border-b border-border py-28 md:py-36"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Sticky Rail */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 flex flex-col justify-between">
              <div>
                <p className="text-xs tracking-[0.25em] text-zinc-400 uppercase">
                  CAREER &amp; JOURNEY
                </p>
                <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white">
                  Work Experience
                </h2>
                <p className="mt-4 max-w-sm text-sm text-zinc-400 leading-relaxed">
                  Track record of building production systems, modern full-stack web applications, and scalable backend architectures.
                </p>

                {/* Timeline progression links */}
                <div className="mt-10 hidden sm:flex flex-col gap-1 pl-1">
                  <div className="text-[11px] font-mono tracking-[0.2em] text-zinc-500 uppercase mb-3">
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

                  {/* Education Navigation Link */}
                  <button
                    onClick={scrollToEducation}
                    className="group relative flex items-start gap-4 text-left w-full transition-all cursor-pointer py-3 mt-2 border-t border-white/[0.08]"
                  >
                    <div className="relative flex flex-col items-center">
                      <div className="h-10 w-1 rounded-full bg-white/10 group-hover:bg-white/30 transition-all" />
                      <div className="absolute top-1 h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
                    </div>
                    <div className="flex flex-col pt-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-zinc-300">EDU</span>
                        <span className="font-mono text-xs text-zinc-500">{education.period}</span>
                      </div>
                      <p className="mt-1 text-sm font-medium tracking-tight text-white transition-all">
                        {education.degree}
                      </p>
                      <p className="text-xs text-zinc-400">{education.institution}</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Mobile Horizontal Progress Bar */}
              <div className="mt-6 flex flex-col gap-2 sm:hidden">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                  <span>TIMELINE</span>
                  <span>{experiences.length} ROLES</span>
                </div>
                <div
                  className="grid gap-2"
                  style={{ gridTemplateColumns: `repeat(${experiences.length}, minmax(0, 1fr))` }}
                >
                  {experiences.map((_, i) => (
                    <div
                      key={i}
                      className="h-1 rounded-full bg-white/15 overflow-hidden"
                    >
                      <motion.div
                        style={{
                          scaleX: useTransform(
                            smoothProgress,
                            [i / experiences.length, (i + 1) / experiences.length],
                            [0, 1]
                          ),
                          transformOrigin: "left",
                        }}
                        className="h-full w-full bg-white"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Normal, clean cards */}
          <div className="lg:col-span-7 flex flex-col gap-10">
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
