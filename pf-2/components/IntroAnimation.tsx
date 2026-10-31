"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Jost } from "next/font/google";
import { personalInfo } from "@/lib/data";

// A geometric, Futura-style face. Its O is a true circle, which echoes the moon.
const display = Jost({ subsets: ["latin"], weight: ["300", "400"], display: "swap" });

/* -------------------------------------------------------------------------- */
/*  Tuning                                                                    */
/* -------------------------------------------------------------------------- */

const ROLE = "Full-stack developer";

// Show the intro once per browser session. Set to false to play on every visit.
const ONCE_PER_SESSION = true;
const STORAGE_KEY = "intro-seen";

// 1 = as designed (about 8 seconds). 1.25 is slower, 0.8 is faster.
const SPEED = 1;
const ms = (n: number) => Math.round(n * SPEED);
const sec = (n: number) => n * SPEED;

const FLIGHT = { rocket: sec(1.7), glide: sec(1.15) };

// Milliseconds from page load.
const T = {
  ascent: ms(900), //  the I lifts off from below the screen
  dock: ms(900 + 1700 - 250), // it reaches the moon; the moon becomes the dot
  g: ms(2900), //      the other letters glide in, nearest-first on each side
  hy: ms(3080),
  o: ms(3260),
  y2: ms(3440),
  y: ms(3620),
  a: ms(3800),
  all: ms(5100), //    YOGI-YA is complete: one light sweep, then the name
  fade: ms(6900), //   the word eases out
  exit: ms(7400), //   the overlay fades to reveal the site
};

const E_ASCENT: [number, number, number, number] = [0.22, 0.61, 0.36, 1];
const E_GLIDE: [number, number, number, number] = [0.16, 0.84, 0.3, 1];
const E_MOON: [number, number, number, number] = [0.65, 0, 0.35, 1];

// wakeAt: 1 rocket · 3 G · 4 hyphen · 5 O · 6 Y · 7 Y · 8 A
// side: which edge a letter glides in from (-1 left, 1 right).
const WORD = [
  { char: "Y", wakeAt: 7, side: -1 },
  { char: "O", wakeAt: 5, side: -1 },
  { char: "G", wakeAt: 3, side: -1 },
  { char: "I", wakeAt: 1, side: 0, rocket: true },
  { char: "-", wakeAt: 4, side: 1, hyphen: true },
  { char: "Y", wakeAt: 6, side: 1 },
  { char: "A", wakeAt: 8, side: 1 },
];

// Letters get a soft top-to-bottom falloff instead of a flat fill.
const GLYPH: CSSProperties = {
  background: "linear-gradient(180deg, currentColor 35%, #8b919c 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

/* -------------------------------------------------------------------------- */
/*  Background                                                                */
/* -------------------------------------------------------------------------- */

// Fixed positions so server and client render the same sky.
const STARS = Array.from({ length: 26 }, (_, i) => ({
  x: ((i * 61.803) % 100).toFixed(2),
  y: ((i * 38.197 * 1.7) % 100).toFixed(2),
  dur: 4 + (i % 5),
  lo: 0.12 + (i % 4) * 0.06,
}));

function Sky({ drift, still }: { drift: boolean; still: boolean }) {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      animate={{ y: drift ? 60 : 0 }}
      transition={{ duration: sec(2.2), ease: E_ASCENT }}
    >
      {STARS.map((s, i) => (
        <motion.span
          key={i}
          className="absolute block h-px w-px rounded-full bg-foreground"
          style={{ left: `${s.x}%`, top: `${s.y}%`, opacity: s.lo + 0.15 }}
          animate={still ? undefined : { opacity: [s.lo + 0.15, s.lo * 0.4, s.lo + 0.15] }}
          transition={{ duration: s.dur, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Intro                                                                     */
/* -------------------------------------------------------------------------- */

interface IntroAnimationProps {
  onComplete?: () => void;
}

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const reduce = !!useReducedMotion();
  const rowRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [skipped, setSkipped] = useState(false);
  // 0 sky · 1 ascent · 2 docked · 3 G · 4 hyphen · 5 O · 6 Y · 7 Y · 8 A · 9 complete
  const [wake, setWake] = useState(0);
  const [fadeWord, setFadeWord] = useState(false);
  // Where the baseline and cap height sit, as fractions of the font size.
  const [m, setM] = useState({ floor: 0.15, cap: 0.7 });
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

  // Measure the real font so the dot and hyphen sit exactly right.
  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    let cancelled = false;
    const measure = () => {
      try {
        const cs = getComputedStyle(el);
        const ctx = document.createElement("canvas").getContext("2d");
        if (!ctx) return;
        const size = 200;
        ctx.font = `${cs.fontWeight} ${size}px ${cs.fontFamily}`;
        const t = ctx.measureText("I");
        const fa = t.fontBoundingBoxAscent;
        const fd = t.fontBoundingBoxDescent;
        const cap = t.actualBoundingBoxAscent;
        if (!fa || !fd || !cap) return;
        const baselineFromTop = (size - (fa + fd)) / 2 + fa; // line-height: 1
        if (!cancelled)
          setM({ floor: (size - baselineFromTop) / size, cap: cap / size });
      } catch {}
    };
    document.fonts?.ready.then(measure);
    return () => {
      cancelled = true;
    };
  }, []);

  // Timeline
  useEffect(() => {
    if (skipped) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (t: number, fn: () => void) => timers.push(setTimeout(fn, t));

    if (reduce) {
      setWake(9);
      at(1200, () => setVisible(false));
      return () => timers.forEach(clearTimeout);
    }

    at(T.ascent, () => setWake(1));
    at(T.dock, () => setWake(2));
    (
      [
        [T.g, 3],
        [T.hy, 4],
        [T.o, 5],
        [T.y2, 6],
        [T.y, 7],
        [T.a, 8],
        [T.all, 9],
      ] as const
    ).forEach(([t, w]) => at(t, () => setWake(w)));
    at(T.fade, () => setFadeWord(true));
    at(T.exit, () => setVisible(false));

    return () => timers.forEach(clearTimeout);
  }, [reduce, skipped]);

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

  const complete = wake >= 9;
  const docked = wake >= 2;
  const rowVars = {
    "--floor": `${m.floor}em`,
    "--cap": `${m.cap}em`,
  } as CSSProperties;

  return (
    <AnimatePresence onExitComplete={finish}>
      {visible && (
        <motion.div
          key="intro"
          role="status"
          aria-label={`YOGI-YA, ${personalInfo.name}, ${ROLE}`}
          exit={{
            opacity: 0,
            transition: { duration: reduce ? 0.3 : sec(0.9), ease: "easeInOut" },
          }}
          className="fixed inset-0 z-[100] flex select-none flex-col items-center justify-center overflow-hidden bg-background text-foreground"
        >
          <Sky drift={wake >= 1} still={reduce} />

          {/* Soft light behind the word, and a vignette to hold the edges */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            animate={{ opacity: 0.25 + wake * 0.08 }}
            transition={{ duration: sec(1) }}
          >
            <div className="h-[460px] w-[720px] rounded-full bg-gradient-to-b from-foreground/15 via-foreground/5 to-transparent blur-[130px]" />
          </motion.div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.45)_100%)]"
          />

          <button
            type="button"
            onClick={skip}
            className="absolute right-5 top-5 z-20 rounded-full border border-border bg-foreground/5 px-3.5 py-1.5 text-xs text-muted transition-colors hover:border-foreground hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
          >
            Skip intro <span className="ml-1.5 opacity-50">Esc</span>
          </button>

          {/* The word eases out at the end */}
          <motion.div
            className="relative z-10 px-4"
            animate={fadeWord ? { opacity: 0, scale: 1.05 } : { opacity: 1, scale: 1 }}
            transition={{ duration: sec(0.8), ease: "easeInOut" }}
          >
            {/* The word. Everything inside is sized in em, so it scales as one. */}
            <div
              ref={rowRef}
              aria-hidden="true"
              className={`${display.className} relative flex items-end justify-center gap-[0.14em] text-[15vw] font-light sm:text-8xl md:text-9xl`}
              style={rowVars}
            >
              {/* Floor line appears once the rocket has docked */}
              <motion.div
                className="pointer-events-none absolute -inset-x-[0.3em] h-px bg-gradient-to-r from-transparent via-foreground/25 to-transparent"
                style={{ bottom: "var(--floor)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: docked ? 1 : 0 }}
                transition={{ duration: sec(1.2) }}
              />

              {WORD.map(({ char, wakeAt, side, rocket, hyphen }, idx) => {
                const awake = wake >= wakeAt;
                const glide = sec(1.15);

                /* The hyphen: a fine bar drawn in from the right */
                if (hyphen) {
                  return (
                    <span
                      key={idx}
                      className="relative self-end"
                      style={{
                        width: "0.3em",
                        height: "0.055em",
                        marginBottom: "calc(var(--floor) + var(--cap) * 0.36)",
                      }}
                    >
                      <motion.span
                        className="block h-full w-full rounded-full bg-foreground"
                        style={{ transformOrigin: "100% 50%", willChange: "transform" }}
                        initial={reduce ? false : { x: "10em", scaleX: 4, opacity: 0 }}
                        animate={
                          awake
                            ? { x: 0, scaleX: 1, opacity: 1 }
                            : { x: "10em", scaleX: 4, opacity: 0 }
                        }
                        transition={
                          reduce
                            ? { duration: 0 }
                            : {
                                x: { duration: glide, ease: E_GLIDE },
                                scaleX: { duration: glide, ease: E_GLIDE },
                                opacity: { duration: 0.5 },
                              }
                        }
                      />
                    </span>
                  );
                }

                const start = rocket
                  ? { x: 0, y: "10em", opacity: 1 }
                  : { x: `${side * 10}em`, y: 0, opacity: 0 };
                const home = { x: 0, y: 0, opacity: 1 };
                const transition = reduce
                  ? { duration: 0 }
                  : rocket
                  ? { y: { duration: FLIGHT.rocket, ease: E_ASCENT } }
                  : {
                      x: { duration: glide, ease: E_GLIDE },
                      opacity: { duration: 0.5 },
                    };

                return (
                  <span key={idx} className="relative">
                    <motion.span
                      className="relative block"
                      style={{ willChange: "transform" }}
                      initial={reduce ? false : start}
                      animate={awake ? home : start}
                      transition={transition}
                    >
                      <span className="block leading-none" style={GLYPH}>
                        {char}
                      </span>

                      {/* The rocket leaves a single fine line of light */}
                      {rocket && !reduce && (
                        <motion.span
                          aria-hidden="true"
                          className="pointer-events-none absolute bg-gradient-to-b from-foreground/70 to-transparent"
                          style={{
                            left: "calc(50% - max(1px, 0.006em))",
                            top: "calc(100% - var(--floor))",
                            width: "max(1px, 0.012em)",
                            height: "8em",
                            transformOrigin: "50% 0%",
                          }}
                          initial={{ scaleY: 1, opacity: 0.8 }}
                          animate={awake ? { scaleY: 0.05, opacity: [0.8, 0.8, 0] } : { scaleY: 1, opacity: 0.8 }}
                          transition={{
                            duration: FLIGHT.rocket,
                            ease: "easeOut",
                            times: [0, 0.6, 1],
                          }}
                        />
                      )}

                      {/* The others carry a horizontal streak that fades as they settle */}
                      {!rocket && !reduce && (
                        <motion.span
                          aria-hidden="true"
                          className={`pointer-events-none absolute ${
                            side < 0
                              ? "right-full bg-gradient-to-l"
                              : "left-full bg-gradient-to-r"
                          } from-foreground/70 to-transparent`}
                          style={{
                            top: "calc(100% - var(--floor) - var(--cap) * 0.5)",
                            width: "4em",
                            height: "max(1px, 0.012em)",
                            transformOrigin: side < 0 ? "100% 50%" : "0% 50%",
                          }}
                          initial={{ scaleX: 1, opacity: 0.9 }}
                          animate={awake ? { scaleX: 0.05, opacity: [0.9, 0.9, 0] } : { scaleX: 1, opacity: 0.9 }}
                          transition={{ duration: glide, ease: "easeOut", times: [0, 0.55, 1] }}
                        />
                      )}
                    </motion.span>

                    {/* The moon. It becomes the dot of the I when the rocket docks. */}
                    {rocket && (
                      <span
                        className="absolute left-1/2 -translate-x-1/2"
                        style={{
                          top: "calc(100% - var(--floor) - var(--cap) - 0.26em)",
                          width: "0.16em",
                          height: "0.16em",
                        }}
                      >
                        {docked && !reduce && (
                          <motion.span
                            aria-hidden="true"
                            className="absolute inset-0 rounded-full border border-foreground/40"
                            initial={{ scale: 1, opacity: 0.6 }}
                            animate={{ scale: 18, opacity: 0 }}
                            transition={{ duration: sec(2), ease: E_GLIDE }}
                          />
                        )}
                        <motion.span
                          className="absolute inset-0 rounded-full bg-foreground"
                          style={{
                            boxShadow:
                              "0 0 0.5em 0.04em color-mix(in srgb, currentColor 35%, transparent)",
                            willChange: "transform",
                          }}
                          initial={
                            reduce
                              ? { scale: 1, y: 0, opacity: 1 }
                              : { scale: 6, y: "-2em", opacity: 0 }
                          }
                          animate={
                            docked
                              ? { scale: 1, y: 0, opacity: 1 }
                              : { scale: 6, y: "-2em", opacity: 1 }
                          }
                          transition={
                            reduce
                              ? { duration: 0 }
                              : docked
                              ? { duration: sec(1.3), ease: E_MOON }
                              : { duration: sec(1.4), ease: "easeOut" }
                          }
                        >
                          {/* shading gives the disc a sphere's soft terminator */}
                          <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_32%_28%,transparent_0%,rgba(0,0,0,0.3)_100%)]" />
                        </motion.span>
                      </span>
                    )}
                  </span>
                );
              })}

              {/* One slow light sweep across the finished word */}
              {!reduce && (
                <div className="pointer-events-none absolute -inset-x-[0.1em] inset-y-0 overflow-hidden mix-blend-overlay">
                  <motion.div
                    className="absolute inset-y-[-20%] w-[14%] -skew-x-[18deg] bg-gradient-to-r from-transparent via-white/70 to-transparent"
                    initial={{ x: "-120%", opacity: 0 }}
                    animate={complete ? { x: "850%", opacity: 1 } : { x: "-120%", opacity: 0 }}
                    transition={{ duration: sec(1.6), ease: [0.4, 0, 0.2, 1] }}
                  />
                </div>
              )}
            </div>

            {/* Who is behind the word */}
            <div className="mt-10 flex flex-col items-center gap-3 text-center">
              <motion.span
                aria-hidden="true"
                className="block h-px w-24 bg-foreground/30"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: complete ? 1 : 0 }}
                transition={{ duration: sec(1), ease: E_GLIDE }}
              />
              <motion.p
                className={`${display.className} pl-[0.34em] text-base font-normal tracking-[0.34em] text-foreground sm:text-lg`}
                initial={{ opacity: 0, y: 8 }}
                animate={complete ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                transition={{ duration: sec(1), delay: sec(0.3), ease: E_GLIDE }}
              >
                {personalInfo.name}
              </motion.p>
              <motion.p
                className={`${display.className} pl-[0.24em] text-xs tracking-[0.24em] text-muted sm:text-sm`}
                initial={{ opacity: 0, y: 8 }}
                animate={complete ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                transition={{ duration: sec(1), delay: sec(0.5), ease: E_GLIDE }}
              >
                {ROLE}
              </motion.p>
            </div>
          </motion.div>

          {/* Shows how long the wait is */}
          {!reduce && (
            <motion.div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 z-20 h-px origin-left bg-foreground/40"
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