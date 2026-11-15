"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import { personalInfo } from "@/lib/data";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const LINES = ["I build web products", "and AI tools that", "actually ship."];

const META = [
  { label: "Role", value: "Full-stack developer" },
  { label: "Stack", value: "MERN · Next.js · TypeScript" },
  { label: "Studio", value: "thebrainstorm.studio" },
];

interface HeroProps {
  onSayHello: () => void;
}

export default function Hero({ onSayHello }: HeroProps) {
  const reduce = !!useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  // Soft amber glow that follows the cursor
  const x = useSpring(useMotionValue(0), { stiffness: 80, damping: 20 });
  const y = useSpring(useMotionValue(0), { stiffness: 80, damping: 20 });
  const glow = useMotionTemplate`radial-gradient(520px circle at ${x}px ${y}px, rgba(232,176,74,0.13), transparent 65%)`;

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    const r = el.getBoundingClientRect();
    x.set(r.width * 0.7);
    y.set(r.height * 0.35);
    const onMove = (e: PointerEvent) => {
      const b = el.getBoundingClientRect();
      x.set(e.clientX - b.left);
      y.set(e.clientY - b.top);
    };
    el.addEventListener("pointermove", onMove);
    return () => el.removeEventListener("pointermove", onMove);
  }, [reduce, x, y]);

  const focusRing =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground";

  return (
    <section
      ref={ref}
      className="relative flex min-h-svh flex-col justify-end overflow-hidden border-b border-border pt-32"
    >
      {/* Dot grid, faded at the edges */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.12] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        style={{
          backgroundImage:
            "radial-gradient(currentColor 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {!reduce && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: glow }}
        />
      )}

      <div className="relative mx-auto w-full max-w-6xl px-6 pb-14">
        <h1 className="text-[11vw] font-semibold leading-[1.02] tracking-tight sm:text-[8vw] lg:text-[6.2vw]">
          {LINES.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[0.08em]">
              <motion.span
                className={`block ${i === 2 ? "text-[#E8B04A]" : ""}`}
                initial={reduce ? false : { y: "105%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.1 + i * 0.12, ease: EASE }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55, ease: EASE }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <a
            href="#work"
            className={`group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform hover:-translate-y-0.5 ${focusRing}`}
          >
            View my work
            <ArrowUpRight
              size={16}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
          <button
            type="button"
            onClick={onSayHello}
            className={`rounded-full border border-border px-6 py-3 text-sm font-medium transition-colors hover:border-foreground ${focusRing}`}
          >
            Say hello
          </button>
          <a
            href={personalInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className={`ml-1 text-muted transition-colors hover:text-foreground ${focusRing}`}
          >
            <Github size={20} />
          </a>
        </motion.div>

        {/* Quiet fact row */}
        <motion.dl
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 grid grid-cols-1 gap-6 border-t border-border pt-6 sm:grid-cols-3"
        >
          {META.map((m) => (
            <div key={m.label}>
              <dt className="text-[11px] uppercase tracking-[0.2em] text-muted">
                {m.label}
              </dt>
              <dd className="mt-1.5 text-sm text-foreground">{m.value}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}