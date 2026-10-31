"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useAnimation,
  useReducedMotion,
} from "framer-motion";
import { personalInfo } from "@/lib/data";

/* -------------------------------------------------------------------------- */
/*  Tuning                                                                    */
/* -------------------------------------------------------------------------- */

const ROLE = "Full-stack developer";
const ACCENT = "#E8B04A"; // same amber used in Hero and About

// Show the intro once per browser session. Set to false to play on every visit.
const ONCE_PER_SESSION = true;
const STORAGE_KEY = "intro-seen";

// Milliseconds from page load. The wake-ups speed up on purpose: a build-up.
const T = {
  impact: 340, // the dot hits the floor for the first time
  i: 800, //     the I stands up
  g: 1100,
  o: 1350,
  y: 1600,
  hy: 1850, //   the hyphen fires
  y2: 2050,
  a: 2250,
  all: 2650, //  YOGI-YA is complete: glitch, sweep, name decodes
  zoom: 3750, // camera flies through the word
  exit: 4250, // curtain lifts
};

// Glyph metrics, in em of the letter size. Adjust if your font sits differently.
const DOT_TOP = "-0.1em"; //    where the dot rests above the I
const DOT_LAND = "0.72em"; //   how far it falls to reach the floor
const FLOOR = "0.135em"; //     baseline offset from the bottom of the line box
const HYPHEN_RISE = "0.27em"; // height of the hyphen above the baseline

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const SLEEP = {
  rotate: -90,
  opacity: 0.3,
  filter: "drop-shadow(0 0 0em rgba(255,255,255,0))",
};
const AWAKE = {
  rotate: 0,
  opacity: 1,
  filter: "drop-shadow(0 0 0.25em rgba(255,255,255,0.7))",
};

// The word wakes from the dotted I outwards, then the hyphen, then "YA".
const WORD = [
  { char: "Y", wakeAt: 4 },
  { char: "O", wakeAt: 3 },
  { char: "G", wakeAt: 2 },
  { char: "I", wakeAt: 1, dot: true },
  { char: "-", wakeAt: 5, hyphen: true },
  { char: "Y", wakeAt: 6, bouncy: true },
  { char: "A", wakeAt: 7, bouncy: true },
];

const GLITCH_REST =
  "drop-shadow(0em 0 0 rgba(255,0,90,0)) drop-shadow(0em 0 0 rgba(0,220,255,0))";
const GLITCH_SPLIT =
  "drop-shadow(-0.04em 0 0 rgba(255,0,90,0.85)) drop-shadow(0.04em 0 0 rgba(0,220,255,0.85))";

/* -------------------------------------------------------------------------- */
/*  Small pieces                                                              */
/* -------------------------------------------------------------------------- */

// Sparks and a floor ring, fired when a letter hits the ground.
const SPARKS = Array.from({ length: 9 }, (_, i) => {
  const a = ((-165 + i * (150 / 8)) * Math.PI) / 180; // an upward fan
  const d = 0.55 + (((i * 37) % 10) / 10) * 0.6;
  return { x: Math.cos(a) * d, y: Math.sin(a) * d, hot: i % 2 === 0 };
});

function Slam({ big = false }: { big?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 z-10 h-0 w-0"
      style={{ bottom: FLOOR }}
    >
      <motion.span
        className="absolute block rounded-[50%] border"
        style={{
          left: "-0.2em",
          top: "-0.04em",
          width: "0.4em",
          height: "0.08em",
          borderColor: ACCENT,
        }}
        initial={{ scale: 0.2, opacity: 0.9 }}
        animate={{ scale: big ? 9 : 6, opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
      {SPARKS.map((s, i) => (
        <motion.span
          key={i}
          className="absolute block rounded-full"
          style={{
            width: "0.035em",
            height: "0.035em",
            background: s.hot ? ACCENT : "#fff",
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: `${s.x * (big ? 1.4 : 1)}em`,
            y: `${s.y * (big ? 1.4 : 1)}em`,
            opacity: 0,
            scale: 0.2,
          }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        />
      ))}
    </span>
  );
}

// Text that scrambles and then locks in, left to right.
const SCRAMBLE = "!<>-_/[]{}=+*^?#%&";
function Decode({ text, run, instant }: { text: string; run: boolean; instant: boolean }) {
  const [out, setOut] = useState(() => (instant ? text : text.replace(/\S/g, " ")));

  useEffect(() => {
    if (instant) {
      setOut(text);
      return;
    }
    if (!run) return;
    let step = 0;
    const steps = 18;
    const id = setInterval(() => {
      step++;
      const locked = Math.floor((step / steps) * text.length);
      setOut(
        text
          .split("")
          .map((c, i) =>
            c === " " || i < locked
              ? c
              : SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)]
          )
          .join("")
      );
      if (step >= steps) {
        clearInterval(id);
        setOut(text);
      }
    }, 38);
    return () => clearInterval(id);
  }, [run, text, instant]);

  return <>{out}</>;
}

/* -------------------------------------------------------------------------- */
/*  Intro                                                                     */
/* -------------------------------------------------------------------------- */

interface IntroAnimationProps {
  onComplete?: () => void;
}

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const reduce = !!useReducedMotion();
  const shake = useAnimation();
  const [visible, setVisible] = useState(true);
  const [skipped, setSkipped] = useState(false);
  // 0 asleep · 1 I · 2 G · 3 O · 4 Y · 5 hyphen · 6 Y · 7 A · 8 all awake
  const [wake, setWake] = useState(0);
  const [impact, setImpact] = useState(false);
  const [zoom, setZoom] = useState(false);
  const finished = useRef(false);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {}
    onComplete?.();
  }, [onComplete]);

  // Returning visitors in the same session go straight to the site.
  useEffect(() => {
    if (!ONCE_PER_SESSION) return;
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) {
        setSkipped(true);
        setVisible(false);
        finish();
      }
    } catch {}
  }, [finish]);

  // Timeline
  useEffect(() => {
    if (skipped) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));

    if (reduce) {
      setWake(8);
      at(900, () => setVisible(false));
      return () => timers.forEach(clearTimeout);
    }

    // The whole word jolts when something lands.
    const kick = (amp: number) =>
      shake.start({
        x: [0, -8 * amp, 7 * amp, -4 * amp, 2 * amp, 0],
        y: [0, 5 * amp, -4 * amp, 2 * amp, 0, 0],
        transition: { duration: 0.36 },
      });

    at(T.impact, () => {
      setImpact(true);
      kick(1.4);
    });
    (
      [
        [T.i, 1, 0.5],
        [T.g, 2, 0.5],
        [T.o, 3, 0.6],
        [T.y, 4, 0.7],
        [T.hy, 5, 0.9],
        [T.y2, 6, 1],
        [T.a, 7, 1.3],
        [T.all, 8, 1.8],
      ] as const
    ).forEach(([ms, w, amp]) =>
      at(ms, () => {
        setWake(w);
        kick(amp);
      })
    );
    at(T.zoom, () => setZoom(true));
    at(T.exit, () => setVisible(false));

    return () => timers.forEach(clearTimeout);
  }, [reduce, skipped, shake]);

  // Keep the page from scrolling behind the intro.
  useEffect(() => {
    if (!visible) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [visible]);

  const skip = useCallback(() => setVisible(false), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && skip();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [skip]);

  if (skipped) return null;

  const springFor = (bouncy?: boolean) =>
    reduce
      ? { duration: 0 }
      : {
          type: "spring" as const,
          stiffness: bouncy ? 300 : 240,
          damping: bouncy ? 9 : 15,
          mass: 0.8,
        };

  const complete = wake >= 8;

  return (
    <AnimatePresence onExitComplete={finish}>
      {visible && (
        <motion.div
          key="intro"
          role="status"
          aria-label={`YOGI-YA, ${personalInfo.name}, ${ROLE}`}
          initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{
            clipPath: "inset(0% 0% 100% 0%)",
            transition: { duration: reduce ? 0.3 : 0.85, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-[100] flex select-none flex-col items-center justify-center overflow-hidden bg-[#070708]"
        >
          {/* The room lights up as the letters wake */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            animate={{ opacity: 0.1 + wake * 0.1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="h-[460px] w-[720px] rounded-full bg-gradient-to-b from-white/15 via-slate-400/5 to-transparent blur-[130px]" />
          </motion.div>

          <button
            type="button"
            onClick={skip}
            className="absolute right-5 top-5 z-20 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs text-white/60 transition-colors hover:border-white/30 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Skip intro <span className="ml-1.5 text-white/30">Esc</span>
          </button>

          {/* Fly-through: the camera dives into the finished word */}
          <motion.div
            className="relative px-4"
            animate={
              zoom
                ? { scale: 5, opacity: 0, filter: "blur(14px)" }
                : { scale: 1, opacity: 1, filter: "blur(0px)" }
            }
            transition={{ duration: 0.5, ease: [0.6, 0, 0.9, 0.4] }}
          >
            {/* Screen shake */}
            <motion.div animate={shake}>
              {/* RGB glitch when the word completes */}
              <motion.div
                animate={
                  complete && !reduce
                    ? {
                        filter: [GLITCH_REST, GLITCH_SPLIT, GLITCH_REST, GLITCH_SPLIT, GLITCH_REST],
                        x: [0, -6, 5, -3, 0],
                      }
                    : { filter: GLITCH_REST, x: 0 }
                }
                transition={{ duration: 0.45 }}
              >
                {/* The word. Everything inside is sized in em, so it scales as one. */}
                <div
                  aria-hidden="true"
                  className="relative flex items-end justify-center gap-[0.05em] text-[15vw] sm:text-8xl md:text-9xl"
                  style={{
                    WebkitBoxReflect:
                      "below 0.02em linear-gradient(transparent 62%, rgba(255,255,255,0.14))",
                  }}
                >
                  {/* Floor line */}
                  <div
                    className="pointer-events-none absolute -inset-x-[0.3em] h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
                    style={{ bottom: FLOOR }}
                  />

                  {WORD.map(({ char, wakeAt, dot, hyphen, bouncy }, idx) => {
                    const awake = wake >= wakeAt;

                    /* The hyphen is a bar that fires out of the I */
                    if (hyphen) {
                      return (
                        <span
                          key={idx}
                          className="relative mx-[0.03em] self-end"
                          style={{
                            width: "0.36em",
                            height: "0.11em",
                            marginBottom: `calc(${FLOOR} + ${HYPHEN_RISE})`,
                          }}
                        >
                          <motion.span
                            className="block h-full w-full rounded-full"
                            style={{
                              background: ACCENT,
                              boxShadow: `0 0 0.3em ${ACCENT}`,
                              transformOrigin: "0% 50%",
                            }}
                            initial={{ scaleX: 0, opacity: 0 }}
                            animate={awake ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
                            transition={springFor(true)}
                          />
                        </span>
                      );
                    }

                    return (
                      <span key={idx} className="relative">
                        <motion.span
                          initial={SLEEP}
                          animate={awake ? AWAKE : SLEEP}
                          transition={springFor(bouncy)}
                          style={{ transformOrigin: "0% 88%" }}
                          className="metallic-chrome block font-black leading-none tracking-tight"
                        >
                          {char}
                        </motion.span>

                        {awake && !reduce && <Slam big={bouncy} />}

                        {/* The dot that makes the I a person */}
                        {dot && (
                          <>
                            {impact && !reduce && wake === 0 && <Slam big />}
                            <span
                              className="absolute left-1/2 -translate-x-1/2"
                              style={{ top: DOT_TOP }}
                            >
                              <motion.span
                                className="block rounded-full"
                                style={{
                                  width: "0.17em",
                                  height: "0.17em",
                                  background: ACCENT,
                                  boxShadow: `0 0 0.3em ${ACCENT}`,
                                  transformOrigin: "50% 100%",
                                }}
                                initial={{ y: "-3.5em", opacity: 0 }}
                                animate={
                                  reduce
                                    ? { y: 0, opacity: 1 }
                                    : wake === 0
                                    ? {
                                        y: ["-3.5em", DOT_LAND, "0.25em", DOT_LAND, "0.5em", DOT_LAND],
                                        scaleX: [0.85, 1.45, 0.95, 1.25, 0.98, 1],
                                        scaleY: [1.15, 0.55, 1.05, 0.75, 1.02, 1],
                                        opacity: 1,
                                      }
                                    : {
                                        y: 0,
                                        scaleX: 1,
                                        scaleY: 1,
                                        opacity: 1,
                                        transition: { type: "spring", stiffness: 280, damping: 14 },
                                      }
                                }
                                transition={
                                  wake === 0 && !reduce
                                    ? {
                                        duration: T.i / 1000,
                                        times: [0, 0.42, 0.65, 0.82, 0.92, 1],
                                        ease: "easeOut",
                                      }
                                    : undefined
                                }
                              />
                            </span>
                          </>
                        )}
                      </span>
                    );
                  })}

                  {/* One light sweep across the finished word */}
                  {!reduce && (
                    <div className="pointer-events-none absolute -inset-x-[0.1em] inset-y-0 overflow-hidden mix-blend-overlay">
                      <motion.div
                        className="absolute inset-y-[-20%] w-[16%] -skew-x-[18deg] bg-gradient-to-r from-transparent via-white to-transparent"
                        initial={{ x: "-120%", opacity: 0 }}
                        animate={complete ? { x: "800%", opacity: 1 } : { x: "-120%", opacity: 0 }}
                        transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>

            {/* Who is behind the word: the name decodes, the role fades in */}
            <motion.div
              className="mt-8 flex flex-col items-center gap-1 text-center"
              initial={{ opacity: 0, y: 8 }}
              animate={complete ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <p className="font-mono text-base tracking-wider text-zinc-100 sm:text-lg">
                <Decode text={personalInfo.name} run={complete} instant={reduce} />
              </p>
              <p className="text-sm text-zinc-500">{ROLE}</p>
            </motion.div>
          </motion.div>

          {/* Shows how short the wait is */}
          {!reduce && (
            <motion.div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-[2px] origin-left"
              style={{ background: ACCENT }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: T.exit / 1000, ease: "linear" }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}