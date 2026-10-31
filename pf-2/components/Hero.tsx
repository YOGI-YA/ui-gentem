"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import { heroPhrases, heroPrefix, personalInfo } from "@/lib/data";

const TYPING_SPEED = 65;
const DELETING_SPEED = 35;
const HOLD_MS = 1400;

const ACCENT = "#E8B04A"; // same amber as the About section's progress bar
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

/* -------------------------------------------------------------------------- */
/*  The living loop: Build → Connect → Store → Add AI → Ship → (repeat)       */
/* -------------------------------------------------------------------------- */

const CX = 260;
const CY = 260;
const R = 190;

const STAGES = [
  { title: "Build", sub: "React, Next.js", note: "Interfaces in React and Next.js." },
  { title: "Connect", sub: "Node.js, Express", note: "APIs in Node.js and Express." },
  { title: "Store", sub: "MongoDB, PostgreSQL", note: "Data in MongoDB and PostgreSQL." },
  { title: "Add AI", sub: "RAG, embeddings", note: "Retrieval and workflow automation." },
  { title: "Ship", sub: "CI/CD, Vercel", note: "GitHub Actions to Vercel, Render, Railway." },
].map((s, i) => {
  const a = (i * 72 * Math.PI) / 180; // clockwise from the top
  return {
    ...s,
    x: +(CX + R * Math.sin(a)).toFixed(1),
    y: +(CY - R * Math.cos(a)).toFixed(1),
  };
});

// Clockwise circle starting at the top; packets travel along it.
const LOOP = `M${CX},${CY - R} A${R},${R} 0 0 1 ${CX},${CY + R} A${R},${R} 0 0 1 ${CX},${CY - R}`;

function LivingLoop({ reduce }: { reduce: boolean }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // Walk through the stages on its own until the visitor takes over.
  useEffect(() => {
    if (paused || reduce) return;
    const id = setInterval(() => setActive((a) => (a + 1) % STAGES.length), 2400);
    return () => clearInterval(id);
  }, [paused, reduce]);

  return (
    <div className="relative mx-auto w-full max-w-[540px]">
      <div
        aria-hidden="true"
        className="absolute inset-10 rounded-full blur-3xl"
        style={{ background: `${ACCENT}1A` }}
      />
      <svg
        viewBox="0 0 520 520"
        role="group"
        aria-label="Build, Ship, Repeat: Build, Connect, Store, Add AI, then Ship"
        className="relative h-auto w-full"
        onPointerLeave={() => setPaused(false)}
      >
        {/* The ring draws itself once */}
        <motion.circle
          cx={CX}
          cy={CY}
          r={R}
          fill="none"
          strokeWidth={1}
          className="stroke-border"
          style={{ rotate: -90, transformOrigin: "260px 260px" }}
          initial={reduce ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, ease: EASE }}
        />

        {/* Data packets circling the loop. Skipped for reduced motion. */}
        {!reduce &&
          [0, -3, -6].map((begin) => (
            <g key={begin}>
              <animateMotion
                dur="9s"
                begin={`${begin}s`}
                repeatCount="indefinite"
                path={LOOP}
              />
              <circle r={10} fill={ACCENT} opacity={0.18} />
              <circle r={4} fill={ACCENT} />
            </g>
          ))}

        {/* Stages */}
        {STAGES.map((s, i) => {
          const on = i === active;
          return (
            <g
              key={s.title}
              transform={`translate(${s.x} ${s.y})`}
              tabIndex={0}
              role="img"
              aria-label={`${s.title}: ${s.sub}`}
              className="cursor-default outline-none"
              onPointerEnter={() => {
                setPaused(true);
                setActive(i);
              }}
              onFocus={() => {
                setPaused(true);
                setActive(i);
              }}
              onBlur={() => setPaused(false)}
            >
              <motion.g
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
                initial={reduce ? false : { opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: on ? 1.06 : 1 }}
                transition={
                  reduce
                    ? { duration: 0 }
                    : { duration: 0.5, delay: on ? 0 : 0.7 + i * 0.12, ease: EASE }
                }
              >
                <rect
                  x={-70}
                  y={-27}
                  width={140}
                  height={54}
                  rx={14}
                  strokeWidth={on ? 1.6 : 1}
                  className={`fill-background transition-colors duration-300 ${
                    on ? "stroke-[#E8B04A]" : "stroke-border"
                  }`}
                />
                <text
                  y={-3}
                  textAnchor="middle"
                  className="fill-foreground text-[17px] font-semibold sm:text-[15px]"
                >
                  {s.title}
                </text>
                <text
                  y={14}
                  textAnchor="middle"
                  className="fill-muted hidden text-[10.5px] sm:inline"
                >
                  {s.sub}
                </text>
              </motion.g>
            </g>
          );
        })}

        {/* Centre: the idea, plus what the active stage does */}
        <text
          x={CX}
          y={CY - 8}
          textAnchor="middle"
          className="fill-foreground text-[24px] font-semibold tracking-tight"
        >
          Build, Ship, Repeat
        </text>
        <motion.text
          key={active}
          x={CX}
          y={CY + 22}
          textAnchor="middle"
          className="fill-muted text-[13px]"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {STAGES[active].note}
        </motion.text>
      </svg>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Hero                                                                      */
/* -------------------------------------------------------------------------- */

interface HeroProps {
  onSayHello: () => void;
}

export default function Hero({ onSayHello }: HeroProps) {
  const reduce = !!useReducedMotion();

  const [text, setText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = heroPhrases[phraseIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && text === current) {
      timeout = setTimeout(() => setDeleting(true), HOLD_MS);
    } else if (deleting && text === "") {
      setDeleting(false);
      setPhraseIndex((i) => (i + 1) % heroPhrases.length);
    } else {
      timeout = setTimeout(
        () => {
          setText((t) =>
            deleting ? current.slice(0, t.length - 1) : current.slice(0, t.length + 1)
          );
        },
        deleting ? DELETING_SPEED : TYPING_SPEED
      );
    }
    return () => clearTimeout(timeout);
  }, [text, deleting, phraseIndex]);

  const focusRing =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground";

  return (
    <section className="relative flex min-h-svh items-center overflow-hidden border-b border-border pt-28 pb-16">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 lg:grid-cols-[1fr_1fr] lg:gap-8">
        {/* Left: the pitch */}
        <motion.div
          variants={container}
          initial={reduce ? false : "hidden"}
          animate="show"
          className="flex flex-col items-start"
        >
          <motion.h1 variants={item}>
            <span className="block text-lg text-muted sm:text-xl">{heroPrefix}</span>

            {/* Full phrases for screen readers; the typed text is decoration */}
            <span className="sr-only">{heroPhrases.join(", ")}</span>
            <span
              aria-hidden="true"
              className="mt-3 block min-h-[2.1em] text-[9vw] font-semibold leading-[1.04] tracking-tight text-foreground sm:text-[6vw] lg:text-[3.6vw]"
            >
              {text}
              <span className="type-cursor ml-1.5 inline-block h-[0.8em] w-[3px] translate-y-[-0.04em] bg-foreground align-middle" />
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-5 max-w-md text-base leading-relaxed text-muted sm:text-lg"
          >
            {personalInfo.bio}
          </motion.p>

          <motion.div
            variants={item}
            className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-4"
          >
            <a
              href="#work"
              className={`group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform hover:-translate-y-0.5 ${focusRing}`}
            >
              Explore my work
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
            <button
              type="button"
              onClick={onSayHello}
              className={`rounded-full border border-border bg-background/60 px-6 py-3 text-sm font-medium text-foreground backdrop-blur-sm transition-colors hover:border-foreground ${focusRing}`}
            >
              Say hello
            </button>
            <a
              href="#about"
              className={`text-sm text-muted underline-offset-4 transition-colors hover:text-foreground hover:underline ${focusRing}`}
            >
              About me
            </a>
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className={`text-muted transition-colors hover:text-foreground ${focusRing}`}
            >
              <Github size={18} />
            </a>
          </motion.div>
        </motion.div>

        {/* Right: the signature moment */}
        <LivingLoop reduce={reduce} />
      </div>
    </section>
  );
}