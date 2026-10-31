"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { personalInfo } from "@/lib/data";

/* -------------------------------------------------------------------------- */
/*  Content                                                                   */
/* -------------------------------------------------------------------------- */

const ROLE = "Full-stack developer";
const STATUS = "Open to work & opportunities";

const PRINCIPLES = [
  {
    title: "Clean architecture",
    body: "Clear boundaries between UI, API and data, so features are easy to add and easy to delete.",
  },
  {
    title: "Performance",
    body: "Fast first load, small bundles and queries that hold up as the data grows.",
  },
  {
    title: "Accessible UI",
    body: "Semantic markup, keyboard support and readable contrast from the first commit.",
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
// Your name starts huge in the middle and travels into its final slot
// between these two scroll points.
const TRAVEL_FROM = 0.06;
const TRAVEL_TO = 0.56;
// Final size of the name once it has landed, in px.
const LANDED_SIZE = 18;

export default function PhilosophySection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLParagraphElement>(null);
  const slotRef = useRef<HTMLParagraphElement>(null);
  const roleRef = useRef<HTMLParagraphElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    const frame = frameRef.current;
    const media = mediaRef.current;
    const scrim = scrimRef.current;
    const overlay = overlayRef.current;
    const name = nameRef.current;
    const slot = slotRef.current;
    if (!track || !stage || !frame || !media || !scrim || !overlay || !name || !slot)
      return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const render = () => {
      // ---- reads (kept together so we don't thrash layout) ----
      const range = track.offsetHeight - window.innerHeight;
      const p = reduceMotion
        ? 1
        : range > 0
        ? clamp(-track.getBoundingClientRect().top / range, 0, 1)
        : 0;
      const vw = window.innerWidth;
      const stageBox = stage.getBoundingClientRect();
      const slotBox = slot.getBoundingClientRect();
      const nameW = name.offsetWidth;
      const nameH = name.offsetHeight;
      const startFont = parseFloat(getComputedStyle(name).fontSize) || 96;

      // ---- writes ----
      // Frame: a window that opens to full-bleed.
      const [insetX, insetY, radius] =
        vw < 640 ? [7, 22, 20] : vw < 1024 ? [14, 20, 28] : [27, 18, 32];
      const open = smooth(0, 0.55, p);
      frame.style.clipPath = `inset(${(insetY * (1 - open)).toFixed(2)}% ${(
        insetX *
        (1 - open)
      ).toFixed(2)}% round ${(radius * (1 - open)).toFixed(1)}px)`;
      media.style.transform = `scale(${(1.22 - 0.22 * open).toFixed(4)})`;
      scrim.style.opacity = (0.3 + 0.62 * open).toFixed(3);

      // The name: one element that shrinks from a giant centred title
      // into the small signature in the identity block. Always scaled
      // down from a large font size, so the text stays crisp.
      const u = smooth(TRAVEL_FROM, TRAVEL_TO, p);
      const x0 = (stageBox.width - nameW) / 2;
      const y0 = (stageBox.height - nameH) / 2 - 8;
      const x1 = slotBox.left - stageBox.left;
      const y1 = slotBox.top - stageBox.top;
      const s1 = LANDED_SIZE / startFont;
      name.style.transform = `translate3d(${(x0 + (x1 - x0) * u).toFixed(
        1
      )}px, ${(y0 + (y1 - y0) * u).toFixed(1)}px, 0) scale(${(
        1 +
        (s1 - 1) * u
      ).toFixed(4)})`;

      if (roleRef.current) {
        roleRef.current.style.opacity = (1 - smooth(0.04, 0.26, p)).toFixed(3);
      }
      if (hintRef.current) {
        hintRef.current.style.opacity = (1 - smooth(0, 0.14, p)).toFixed(3);
      }

      // Content fades up in order, each at its own data-start point.
      overlay.querySelectorAll<HTMLElement>("[data-start]").forEach((el) => {
        const start = parseFloat(el.dataset.start || "0");
        const t = smooth(start, start + 0.12, p);
        el.style.opacity = t.toFixed(3);
        el.style.transform = `translate3d(0, ${(14 * (1 - t)).toFixed(1)}px, 0)`;
      });
      overlay.setAttribute("aria-hidden", p < 0.45 ? "true" : "false");

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
    // Fonts can change the name's width after first paint.
    document.fonts?.ready.then(schedule);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <section id="about" className="relative w-full bg-[#06080d]">
      <div id="about-me" className="absolute -top-20" />
      <div id="philosophy" className="absolute -top-20" />
      <h2 className="sr-only">About me</h2>

      <div
        ref={trackRef}
        style={{ height: `${(1 + PIN_DISTANCE) * 100}svh` }}
        className="relative"
      >
        <div
          ref={stageRef}
          className="sticky top-0 h-svh w-full overflow-hidden"
          style={{ ["--fs" as string]: "clamp(2.6rem, 9vw, 9rem)" }}
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
                opacity: 0.3,
                background:
                  "linear-gradient(100deg, rgba(6,8,13,.96) 0%, rgba(6,8,13,.82) 55%, rgba(6,8,13,.6) 100%)",
              }}
            />

            {/* Revealed content */}
            <div
              ref={overlayRef}
              aria-hidden="true"
              className="absolute inset-0 flex items-center"
            >
              <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 sm:px-10 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
                {/* Left: who */}
                <div className="flex flex-col justify-center gap-5">
                  <h3
                    data-start="0.4"
                    className="max-w-xl text-2xl font-semibold leading-[1.15] tracking-tight text-[#F1EEE6] sm:text-4xl lg:text-5xl"
                    style={{ opacity: 0 }}
                  >
                    I build full-stack web products that stay fast as they grow.
                  </h3>
                  <p
                    data-start="0.46"
                    className="max-w-md text-sm leading-relaxed text-[#C9C6BD] sm:text-base"
                    style={{ opacity: 0 }}
                  >
                    I work across the stack, and I add AI features such as
                    retrieval and workflow automation where they earn their
                    place.
                  </p>

                  <div
                    data-start="0.5"
                    className="mt-2 h-px max-w-md bg-white/15"
                    style={{ opacity: 0 }}
                  />
                  <div className="flex max-w-md flex-wrap items-center justify-between gap-x-6 gap-y-3">
                    <div>
                      {/* Empty slot: the travelling name lands exactly here */}
                      <p
                        ref={slotRef}
                        aria-hidden="true"
                        className="select-none font-semibold tracking-tight opacity-0"
                        style={{ fontSize: LANDED_SIZE, lineHeight: 1.2 }}
                      >
                        {personalInfo.name}
                      </p>
                      <p
                        data-start="0.54"
                        className="mt-0.5 text-sm text-[#8F8D86]"
                        style={{ opacity: 0 }}
                      >
                        {personalInfo.location}
                      </p>
                    </div>
                    <p
                      data-start="0.58"
                      className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-sm text-[#D8F2E4]"
                      style={{ opacity: 0 }}
                    >
                      <span className="relative flex h-2 w-2" aria-hidden="true">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 motion-safe:animate-ping" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                      </span>
                      {STATUS}
                    </p>
                  </div>
                </div>

                {/* Right: how I work (not a sequence, so no numbering) */}
                <ul className="flex flex-col justify-center">
                  {PRINCIPLES.map((item, i) => (
                    <li
                      key={item.title}
                      data-start={(0.6 + i * 0.1).toFixed(2)}
                      className="border-t border-white/15 py-4 first:border-t-0 first:pt-0 sm:py-5"
                      style={{ opacity: 0 }}
                    >
                      <h4 className="text-base font-medium text-[#F1EEE6] sm:text-lg">
                        {item.title}
                      </h4>
                      <p className="mt-1 max-w-sm text-sm leading-relaxed text-[#B9B6AD]">
                        {item.body}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* The name: giant at first, then travels into the identity block */}
          <p
            ref={nameRef}
            className="pointer-events-none absolute left-0 top-0 z-10 origin-top-left whitespace-nowrap font-semibold tracking-tight text-[#F1EEE6]"
            style={{ fontSize: "var(--fs)", lineHeight: 1.2 }}
          >
            {personalInfo.name}
          </p>
          <p
            ref={roleRef}
            className="pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 text-sm tracking-wide text-[#C9C6BD] sm:text-base"
            style={{ top: "calc(50% + var(--fs) * 0.6 + 4px)" }}
          >
            {ROLE}
          </p>

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