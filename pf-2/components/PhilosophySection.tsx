"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/* -------------------------------------------------------------------------- */
/*  Content: four words, one line each                                        */
/* -------------------------------------------------------------------------- */

const PRINCIPLES = [
  { num: "01", word: "Simple", line: "Easy to read. Easy to delete." },
  { num: "02", word: "Fast", line: "Speed is respect." },
  { num: "03", word: "Useful", line: "AI only where it solves something." },
  { num: "04", word: "Crafted", line: "Care lives in the small things." },
];

/* -------------------------------------------------------------------------- */
/*  Scroll maths                                                              */
/* -------------------------------------------------------------------------- */

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a || 1e-6), 0, 1);
  return t * t * (3 - 2 * t);
};

const PIN_DISTANCE = 4; // extra scroll, in viewport heights
const WORDS_START = 0.24; // scroll progress where the first word begins
const SEG = (1 - WORDS_START) / PRINCIPLES.length;

export default function PhilosophySection() {
  const [reduced, setReduced] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const teaserRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const countNumRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      return;
    }

    const track = trackRef.current;
    const frame = frameRef.current;
    const media = mediaRef.current;
    const scrim = scrimRef.current;
    const teaser = teaserRef.current;
    const words = wordsRef.current;
    if (!track || !frame || !media || !scrim || !teaser || !words) return;

    const wordEls = Array.from(
      words.querySelectorAll<HTMLElement>("[data-word]")
    );

    const render = () => {
      const range = track.offsetHeight - window.innerHeight;
      const p =
        range > 0 ? clamp(-track.getBoundingClientRect().top / range, 0, 1) : 0;
      const vw = window.innerWidth;

      // Aperture opens to full-bleed
      const [insetX, insetY, radius] =
        vw < 640 ? [7, 22, 20] : vw < 1024 ? [14, 20, 28] : [27, 18, 32];
      const open = smooth(0, 0.2, p);
      frame.style.clipPath = `inset(${(insetY * (1 - open)).toFixed(2)}% ${(
        insetX *
        (1 - open)
      ).toFixed(2)}% round ${(radius * (1 - open)).toFixed(1)}px)`;
      media.style.transform = `scale(${(1.22 - 0.22 * open).toFixed(4)})`;
      scrim.style.opacity = (0.4 + 0.45 * open).toFixed(3);

      const t = 1 - smooth(0.02, 0.12, p);
      teaser.style.opacity = t.toFixed(3);
      teaser.style.transform = `translate3d(0, ${(-18 * (1 - t)).toFixed(1)}px, 0)`;
      if (hintRef.current) {
        hintRef.current.style.opacity = (1 - smooth(0, 0.08, p)).toFixed(3);
      }

      // Words: blur + scale in, hold, blur + scale out
      wordEls.forEach((el, i) => {
        const local = (p - (WORDS_START + i * SEG)) / SEG;
        const enter = smooth(0, 0.28, local);
        const exit = i < wordEls.length - 1 ? smooth(0.72, 1, local) : 0;
        const v = enter * (1 - exit);
        const scale = 0.86 + 0.14 * enter + 0.18 * exit;
        const y = (1 - enter) * 80 - exit * 80;
        const blur = (1 - enter) * 20 + exit * 20;
        el.style.opacity = v.toFixed(3);
        el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
        el.style.filter = blur > 0.2 ? `blur(${blur.toFixed(1)}px)` : "none";
      });

      // Counter
      if (counterRef.current) {
        counterRef.current.style.opacity = smooth(0.18, 0.26, p).toFixed(3);
      }
      if (countNumRef.current) {
        const idx = clamp(
          Math.floor((p - WORDS_START + 0.02) / SEG),
          0,
          PRINCIPLES.length - 1
        );
        countNumRef.current.textContent = PRINCIPLES[idx].num;
      }

      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${p.toFixed(3)})`;
      }
    };

    let raf = 0;
    const schedule = () => {
      if (!raf)
        raf = requestAnimationFrame(() => {
          raf = 0;
          render();
        });
    };

    render();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  /* Reduced motion: no pinning, just the four words */
  if (reduced) {
    return (
      <section id="philosophy" className="relative w-full bg-[#06080d] py-24">
        <div id="about" className="absolute -top-20" />
        <div id="about-me" className="absolute -top-20" />
        <div className="mx-auto max-w-5xl space-y-12 px-6">
          <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-[#E8B04A]">
            Philosophy
          </h2>
          {PRINCIPLES.map((p) => (
            <div key={p.num}>
              <p className="text-6xl font-semibold uppercase tracking-tighter text-[#F1EEE6] sm:text-8xl">
                {p.word}
                <span className="text-[#E8B04A]">.</span>
              </p>
              <p className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-[#C9C6BD]">
                {p.line}
              </p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="philosophy" className="relative w-full bg-[#06080d]">
      <div id="about" className="absolute -top-20" />
      <div id="about-me" className="absolute -top-20" />

      {/* Screen readers get the plain list */}
      <div className="sr-only">
        <h2>Philosophy</h2>
        <ul>
          {PRINCIPLES.map((p) => (
            <li key={p.num}>
              {p.word}. {p.line}
            </li>
          ))}
        </ul>
      </div>

      <div
        ref={trackRef}
        style={{ height: `${(1 + PIN_DISTANCE) * 100}svh` }}
        className="relative"
        aria-hidden="true"
      >
        <div className="sticky top-0 h-svh w-full overflow-hidden">
          {/* Image window that opens to full-bleed */}
          <div
            ref={frameRef}
            className="absolute inset-0 will-change-[clip-path]"
            style={{ clipPath: "inset(18% 27% round 32px)" }}
          >
            <div
              ref={mediaRef}
              className="absolute inset-0 will-change-transform"
              style={{ transform: "scale(1.22)" }}
            >
              <Image
                src="/images/philosophy-bg.png"
                alt=""
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            </div>
            <div
              ref={scrimRef}
              className="absolute inset-0"
              style={{
                opacity: 0.4,
                background:
                  "radial-gradient(ellipse at center, rgba(6,8,13,.7) 0%, rgba(6,8,13,.95) 100%)",
              }}
            />

            {/* Teaser while the window is closed */}
            <div
              ref={teaserRef}
              className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
            >

              <h3 className="mt-4 text-4xl font-semibold tracking-tight text-[#F1EEE6] sm:text-6xl">
                How I build.
              </h3>
            </div>
          </div>

          {/* The words */}
          <div ref={wordsRef} className="pointer-events-none absolute inset-0">
            {PRINCIPLES.map((p) => (
              <div
                key={p.num}
                data-word
                className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center will-change-transform"
                style={{ opacity: 0 }}
              >
                {/* Ghost number */}
                <span
                  className="absolute select-none text-[60vw] font-semibold leading-none tracking-tighter sm:text-[40vw]"
                  style={{
                    color: "transparent",
                    WebkitTextStroke: "1px rgba(241,238,230,0.1)",
                  }}
                >
                  {p.num}
                </span>

                <p className="relative text-[21vw] font-semibold uppercase leading-[0.9] tracking-tighter text-[#F1EEE6] sm:text-[15vw]">
                  {p.word}
                  <span className="text-[#E8B04A]">.</span>
                </p>
                <p className="relative mt-6 font-mono text-[11px] uppercase tracking-[0.25em] text-[#C9C6BD] sm:text-sm">
                  {p.line}
                </p>
              </div>
            ))}
          </div>

          {/* Counter */}
          

          {/* Scroll hint */}
          <div
            ref={hintRef}
            className="pointer-events-none absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-xs text-[#C9C6BD]"
          >
            <span>Scroll</span>
            <span className="h-8 w-px bg-gradient-to-b from-[#C9C6BD] to-transparent motion-safe:animate-pulse" />
          </div>

          {/* Progress */}
          <div className="absolute inset-x-0 bottom-0 h-[2px] bg-white/10">
            <div
              ref={barRef}
              className="h-full origin-left bg-[#E8B04A]"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}