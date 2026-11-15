"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

/* -------------------------------------------------------------------------- */
/*  Content: Core Engineering Beliefs                                         */
/* -------------------------------------------------------------------------- */

const PRINCIPLES = [
  {
    num: "01",
    title: "Simplicity over cleverness",
    body: "Clear boundaries between UI, API, and database. Code should be straightforward to read, easy to modify, and easy to delete when it's no longer needed.",
  },
  {
    num: "02",
    title: "Speed is respect",
    body: "Fast page loads and instant interactions aren't an afterthought. Sub-second loads, zero layout shifts, and light bundles respect the user's attention.",
  },
  {
    num: "03",
    title: "Useful AI over gimmick AI",
    body: "Integrating language models and automated pipelines where they solve genuine friction — semantic search, parsing, and background workflows — not as a superficial marketing sticker.",
  },
  {
    num: "04",
    title: "Craft in the small things",
    body: "Accessible contrast, natural spring motion, graceful empty states, and keyboard navigation. The difference between good and great lives in the margins.",
  },
];

/* -------------------------------------------------------------------------- */
/*  Scroll maths                                                              */
/* -------------------------------------------------------------------------- */

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a || 1e-6), 0, 1);
  return t * t * (3 - 2 * t);
};

// Extra scroll distance (in viewport heights) the section stays pinned for.
const PIN_DISTANCE = 2;

export default function PhilosophySection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const teaserRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    const frame = frameRef.current;
    const media = mediaRef.current;
    const scrim = scrimRef.current;
    const teaser = teaserRef.current;
    const overlay = overlayRef.current;
    if (!track || !stage || !frame || !media || !scrim || !overlay || !teaser)
      return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const render = () => {
      const range = track.offsetHeight - window.innerHeight;
      const p = reduceMotion
        ? 1
        : range > 0
        ? clamp(-track.getBoundingClientRect().top / range, 0, 1)
        : 0;
      const vw = window.innerWidth;

      // Frame: aperture window that opens to full-bleed.
      const [insetX, insetY, radius] =
        vw < 640 ? [7, 22, 20] : vw < 1024 ? [14, 20, 28] : [27, 18, 32];
      const open = smooth(0, 0.52, p);
      frame.style.clipPath = `inset(${(insetY * (1 - open)).toFixed(2)}% ${(
        insetX *
        (1 - open)
      ).toFixed(2)}% round ${(radius * (1 - open)).toFixed(1)}px)`;
      media.style.transform = `scale(${(1.22 - 0.22 * open).toFixed(4)})`;
      scrim.style.opacity = (0.35 + 0.55 * open).toFixed(3);

      // Teaser card fades out smoothly as aperture opens
      const t = 1 - smooth(0.04, 0.32, p);
      teaser.style.opacity = t.toFixed(3);
      teaser.style.transform = `translate3d(0, ${(-18 * (1 - t)).toFixed(1)}px, 0)`;

      if (hintRef.current) {
        hintRef.current.style.opacity = (1 - smooth(0, 0.16, p)).toFixed(3);
      }

      // Content fades up in order, each at its own data-start point.
      overlay.querySelectorAll<HTMLElement>("[data-start]").forEach((el) => {
        const start = parseFloat(el.dataset.start || "0");
        const val = smooth(start, start + 0.12, p);
        el.style.opacity = val.toFixed(3);
        el.style.transform = `translate3d(0, ${(16 * (1 - val)).toFixed(1)}px, 0)`;
      });
      overlay.setAttribute("aria-hidden", p < 0.4 ? "true" : "false");

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

  return (
    <section id="philosophy" className="relative w-full bg-[#06080d]">
      <div id="about" className="absolute -top-20" />
      <div id="about-me" className="absolute -top-20" />
      <h2 className="sr-only">Philosophy &amp; Principles</h2>

      <div
        ref={trackRef}
        style={{ height: `${(1 + PIN_DISTANCE) * 100}svh` }}
        className="relative"
      >
        <div
          ref={stageRef}
          className="sticky top-0 h-svh w-full overflow-hidden"
        >
          {/* The aperture: starts as a framed window, opens to full-bleed */}
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
                opacity: 0.35,
                background:
                  "linear-gradient(100deg, rgba(6,8,13,.96) 0%, rgba(6,8,13,.88) 55%, rgba(6,8,13,.75) 100%)",
              }}
            />

            {/* Initial Teaser: Centered in the aperture frame before it opens */}
            <div
              ref={teaserRef}
              className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
            >
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#E8B04A]">
                01 // Approach &amp; Craft
              </p>
              <h3 className="mt-4 text-3xl font-semibold tracking-tight text-[#F1EEE6] sm:text-5xl md:text-6xl">
                Philosophy
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-[#C9C6BD] sm:text-base">
                How I think about building software that stays fast, simple, and reliable.
              </p>
            </div>

            {/* Revealed content: Appears as the aperture opens full-bleed */}
            <div
              ref={overlayRef}
              aria-hidden="true"
              className="absolute inset-0 flex items-center"
            >
              <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 sm:px-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
                {/* Left: Core Manifesto */}
                <div className="flex flex-col justify-center space-y-5">
                  <p
                    data-start="0.38"
                    className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#E8B04A]"
                    style={{ opacity: 0 }}
                  >
                    01 // Philosophy
                  </p>

                  <h3
                    data-start="0.42"
                    className="max-w-xl text-2xl font-semibold leading-[1.18] tracking-tight text-[#F1EEE6] sm:text-4xl lg:text-5xl"
                    style={{ opacity: 0 }}
                  >
                    Simplicity is the hardest thing to build.
                  </h3>

                  <p
                    data-start="0.48"
                    className="max-w-lg text-sm leading-relaxed text-[#C9C6BD] sm:text-base"
                    style={{ opacity: 0 }}
                  >
                    I build full-stack web products from the database to the interface. I believe the best software is quiet, fast, and does what it promises without friction. No unnecessary abstractions, no bloated dependencies, and no AI for the sake of hype.
                  </p>

                  <div
                    data-start="0.54"
                    className="mt-2 h-px max-w-lg bg-white/15"
                    style={{ opacity: 0 }}
                  />

                  {/* Grounded focus points */}
                  <div
                    data-start="0.58"
                    className="grid grid-cols-2 gap-4 pt-1 sm:grid-cols-3 max-w-lg"
                    style={{ opacity: 0 }}
                  >
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
                        Focus
                      </p>
                      <p className="mt-1 text-xs font-medium text-[#F1EEE6]">
                        Web Apps &amp; AI
                      </p>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
                        Architecture
                      </p>
                      <p className="mt-1 text-xs font-medium text-[#F1EEE6]">
                        Vertical Slices
                      </p>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
                        Standard
                      </p>
                      <p className="mt-1 text-xs font-medium text-[#E8B04A]">
                        Sub-second TTFB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right: The 4 Principles */}
                <ul className="flex flex-col justify-center divide-y divide-white/10">
                  {PRINCIPLES.map((item, i) => (
                    <li
                      key={item.num}
                      data-start={(0.52 + i * 0.08).toFixed(2)}
                      className="group py-4 first:pt-0 last:pb-0 sm:py-5"
                      style={{ opacity: 0 }}
                    >
                      <div className="flex items-baseline gap-3">
                        <span className="font-mono text-xs text-[#E8B04A]">
                          {item.num}
                        </span>
                        <h4 className="text-base font-medium text-[#F1EEE6] sm:text-lg">
                          {item.title}
                        </h4>
                      </div>
                      <p className="mt-1.5 pl-7 text-xs leading-relaxed text-[#B9B6AD] sm:text-sm">
                        {item.body}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Scroll hint (visible at start) */}
          <div
            ref={hintRef}
            className="pointer-events-none absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-xs text-[#C9C6BD]"
          >
            <span>Scroll to open</span>
            <span className="h-8 w-px bg-gradient-to-b from-[#C9C6BD] to-transparent motion-safe:animate-pulse" />
          </div>

          {/* Progress along the bottom edge */}
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
