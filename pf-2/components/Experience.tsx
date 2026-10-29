"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { Briefcase, Calendar, MapPin, CheckCircle2 } from "lucide-react";
import { experiences } from "@/lib/data";

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
          {/* Top metadata badges */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs text-muted uppercase tracking-wider font-mono">
              <Calendar size={12} className="text-muted/70" />
              {exp.period}
            </span>
            <span className="rounded-full border border-border/80 px-2.5 py-0.5 text-[11px] uppercase tracking-wider text-muted font-mono">
              {exp.type}
            </span>
          </div>

          {/* Role & Company */}
          <h3 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-foreground">
            {exp.role}
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted">
            <span className="flex items-center gap-1.5 font-medium text-foreground/80">
              <Briefcase size={14} className="text-muted/70" />
              {exp.company}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <MapPin size={13} className="text-muted/70" />
              {exp.location}
            </span>
          </div>

          {/* Description */}
          <p className="mt-6 text-base sm:text-lg text-foreground/90 leading-relaxed">
            {exp.description}
          </p>

          {/* Key Achievements */}
          <ul className="mt-6 space-y-3 border-t border-border/60 pt-6">
            {exp.highlights.map((highlight, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 text-sm text-muted leading-relaxed"
              >
                <CheckCircle2
                  size={15}
                  className="mt-1 shrink-0 text-foreground/60 transition-colors"
                />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tech Stack Pills */}
        <div className="mt-8 flex flex-wrap gap-2 pt-4">
          {exp.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted/90 transition-colors hover:border-foreground/40 hover:text-foreground"
            >
              {skill}
            </span>
          ))}
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
  // Each piece takes 1/4th of the scroll range
  const stepStart = index / total;
  const stepEnd = (index + 1) / total;

  // Track progress within this specific piece
  const segmentProgress = useTransform(
    scrollYProgress,
    [stepStart, stepEnd],
    [0, 1]
  );

  // Height of bold fill inside this stick piece
  const fillHeight = useTransform(segmentProgress, [0, 1], ["0%", "100%"]);
  // Opacity of the segment text
  const labelOpacity = useTransform(
    segmentProgress,
    [-0.1, 0, 1, 1.2],
    [0.35, 0.45, 1, 0.75]
  );
  // Scale of the segment text
  const labelScale = useTransform(segmentProgress, [0, 0.5, 1], [0.96, 1.02, 1]);
  // Glow intensity
  const glowOpacity = useTransform(segmentProgress, [0, 0.5, 1], [0, 0.8, 1]);

  return (
    <button
      onClick={() => onSelect(index)}
      className="group relative flex items-start gap-5 text-left w-full transition-all cursor-pointer py-2"
    >
      {/* The Stick Piece Indicator */}
      <div className="relative flex flex-col items-center">
        {/* Background Track of the Piece (starts thin / straight / muted) */}
        <div className="relative h-24 w-1.5 rounded-full bg-white/10 overflow-hidden transition-all duration-300 group-hover:bg-white/20">
          {/* Active Bold Fill (bolds itself as you scroll down) */}
          <motion.div
            style={{ height: fillHeight }}
            className="absolute top-0 inset-x-0 w-full rounded-full bg-foreground shadow-[0_0_12px_rgba(255,255,255,0.7)]"
          />
        </div>

        {/* Node marker at top of piece */}
        <motion.div
          style={{ opacity: glowOpacity }}
          className="absolute -top-1 h-3.5 w-3.5 rounded-full border-2 border-foreground bg-background shadow-[0_0_10px_rgba(255,255,255,0.8)]"
        />
      </div>

      {/* Label and Info for this Piece */}
      <motion.div
        style={{ opacity: labelOpacity, scale: labelScale }}
        className="flex flex-col pt-0.5"
      >
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-muted/80 tracking-wider">
            {exp.index}
          </span>
          <span className="font-mono text-xs tracking-wider text-muted/90">
            {exp.period}
          </span>
        </div>
        <p className="mt-1 text-sm font-medium tracking-tight text-foreground transition-all group-hover:text-white">
          {exp.role}
        </p>
        <p className="text-xs text-muted/70">{exp.company}</p>
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

  return (
    <section
      id="experience"
      ref={containerRef}
      className="relative border-b border-border py-28 md:py-36"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Sticky 4-Piece Stick Rail */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 flex flex-col justify-between">
              <div>
                <p className="text-xs tracking-[0.3em] text-muted uppercase">
                  CAREER & JOURNEY
                </p>
                <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-foreground">
                  Work Experience
                </h2>
                <p className="mt-4 max-w-sm text-sm text-muted leading-relaxed">
                  Track record of building production systems, modern full-stack web applications, and autonomous AI architectures.
                </p>

                {/* The 4-Piece Segmented Stick Track */}
                <div className="mt-10 hidden sm:flex flex-col gap-1 pl-1">
                  <div className="text-[11px] font-mono tracking-[0.2em] text-muted/60 uppercase mb-3">
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
                </div>
              </div>

              {/* Mobile Horizontal Progress Bar (divided in 4 pieces) */}
              <div className="mt-6 flex flex-col gap-2 sm:hidden">
                <div className="flex items-center justify-between text-xs font-mono text-muted">
                  <span>TIMELINE</span>
                  <span>4 MILESTONES</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {experiences.map((_, i) => (
                    <div
                      key={i}
                      className="h-1.5 rounded-full bg-white/15 overflow-hidden"
                    >
                      <motion.div
                        style={{
                          scaleX: useTransform(
                            smoothProgress,
                            [i / 4, (i + 1) / 4],
                            [0, 1]
                          ),
                          transformOrigin: "left",
                        }}
                        className="h-full w-full bg-foreground"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 4 Milestone Cards */}
          <div className="lg:col-span-7 flex flex-col gap-10">
            {experiences.map((exp, idx) => (
              <ExperienceMilestone key={exp.id} exp={exp} index={idx} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
