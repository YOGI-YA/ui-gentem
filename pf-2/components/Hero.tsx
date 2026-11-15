"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  ArrowUpRight,
  Github,
  Linkedin,
  MapPin,
  Sparkles,
  Clock,
  SlidersHorizontal,
  Sun,
  Moon,
  Zap,
} from "lucide-react";
import { personalInfo } from "@/lib/data";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const LINES = ["I build web products", "and AI tools that", "actually ship."];

type VisualMode = "noir" | "vivid" | "cyber";

const MODES: { id: VisualMode; label: string; icon: typeof Moon }[] = [
  { id: "noir", label: "Studio Noir", icon: Moon },
  { id: "vivid", label: "Mountain Sky", icon: Sun },
  { id: "cyber", label: "AI Cyber", icon: Zap },
];

interface HeroProps {
  onSayHello: () => void;
}

// Gentle Web Audio feedback when toggling visual modes
function playModeClickSound() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === "suspended") ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(720, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1280, ctx.currentTime + 0.045);

    gain.gain.setValueAtTime(0.035, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch {
    // Graceful fallback if audio is not permitted
  }
}

export default function Hero({ onSayHello }: HeroProps) {
  const reduce = !!useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Visual filter state
  const [mode, setMode] = useState<VisualMode>("noir");
  const [timeString, setTimeString] = useState<string>("");

  // Live Himachal Pradesh / Indian Standard Time clock
  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        setTimeString(
          now.toLocaleTimeString("en-US", {
            timeZone: "Asia/Kolkata",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          })
        );
      } catch {
        setTimeString("10:30 PM IST");
      }
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Soft cursor-following ambient background glow
  const x = useSpring(useMotionValue(0), { stiffness: 80, damping: 20 });
  const y = useSpring(useMotionValue(0), { stiffness: 80, damping: 20 });
  const glow = useMotionTemplate`radial-gradient(540px circle at ${x}px ${y}px, rgba(232,176,74,0.12), transparent 65%)`;

  useEffect(() => {
    const el = heroRef.current;
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

  // 3D Magnetic Card Parallax & Glare
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const isHoveringCard = useRef(false);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), {
    stiffness: 180,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), {
    stiffness: 180,
    damping: 22,
  });

  const glareX = useTransform(mouseX, [-0.5, 0.5], ["10%", "90%"]);
  const glareY = useTransform(mouseY, [-0.5, 0.5], ["10%", "90%"]);
  const glareBackground = useMotionTemplate`radial-gradient(340px circle at ${glareX} ${glareY}, rgba(255,255,255,0.18), transparent 68%)`;

  const handleCardPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (reduce || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(relX);
      mouseY.set(relY);
    },
    [reduce, mouseX, mouseY]
  );

  const handleCardPointerLeave = useCallback(() => {
    isHoveringCard.current = false;
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  // Cycle to next visual mode on card tap
  const cycleMode = useCallback(() => {
    playModeClickSound();
    setMode((prev) => {
      if (prev === "noir") return "vivid";
      if (prev === "vivid") return "cyber";
      return "noir";
    });
  }, []);

  const selectMode = useCallback((m: VisualMode, e: React.MouseEvent) => {
    e.stopPropagation();
    playModeClickSound();
    setMode(m);
  }, []);

  const focusRing =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground";

  return (
    <section
      ref={heroRef}
      className="relative flex min-h-svh flex-col justify-center overflow-hidden border-b border-border pt-28 pb-14 sm:pt-36 sm:pb-16"
    >
      {/* Background dot grid pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.11] [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_75%)]"
        style={{
          backgroundImage:
            "radial-gradient(currentColor 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Amber cursor-follow glow */}
      {!reduce && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: glow }}
        />
      )}

      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">
          {/* ================= LEFT COLUMN: KINETIC TYPOGRAPHY & ACTIONS ================= */}
          <div className="flex flex-col justify-center lg:col-span-7">
            {/* Availability Pill */}
            <motion.div
              initial={reduce ? false : { opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="inline-flex w-fit items-center gap-2.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3.5 py-1.5 text-xs text-emerald-400 backdrop-blur-md"
            >
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 motion-safe:animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="font-medium tracking-wide">
                Available for Full-Time Roles & High-Impact Builds
              </span>
            </motion.div>

            {/* Kinetic Big Headline */}
            <h1 className="mt-6 text-4xl font-semibold leading-[1.04] tracking-tight sm:text-6xl lg:text-[4.3vw] xl:text-[4.6vw]">
              {LINES.map((line, i) => (
                <span key={line} className="block overflow-hidden pb-[0.06em]">
                  <motion.span
                    className={`block ${i === 2 ? "text-[#E8B04A]" : ""}`}
                    initial={reduce ? false : { y: "105%" }}
                    animate={{ y: 0 }}
                    transition={{
                      duration: 0.85,
                      delay: 0.1 + i * 0.1,
                      ease: EASE,
                    }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>

            {/* Sub-headline intro */}
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45, ease: EASE }}
              className="mt-6 max-w-xl text-base leading-relaxed text-muted/90 sm:text-lg"
            >
              Hi, I&apos;m <span className="font-medium text-foreground">Yogender Verma</span>. 
              I engineer scalable web platforms, resilient API backends, and autonomous AI agents with Next.js, React, and TypeScript.
            </motion.p>

            {/* Call to Actions */}
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6, ease: EASE }}
              className="mt-8 flex flex-wrap items-center gap-3.5 sm:gap-4"
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

              <div className="flex items-center gap-2 pl-1 sm:pl-2">
                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub profile"
                  className={`flex h-11 w-11 items-center justify-center rounded-full border border-border/80 text-muted transition-colors hover:border-foreground hover:text-foreground ${focusRing}`}
                >
                  <Github size={19} />
                </a>

                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn profile"
                  className={`flex h-11 w-11 items-center justify-center rounded-full border border-border/80 text-muted transition-colors hover:border-foreground hover:text-foreground ${focusRing}`}
                >
                  <Linkedin size={19} />
                </a>
              </div>
            </motion.div>
          </div>

          {/* ================= RIGHT COLUMN: INTERACTIVE 3D PORTRAIT CARD ================= */}
          <div className="flex justify-center lg:col-span-5 lg:justify-end">
            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.35, ease: EASE }}
              className="relative w-full max-w-[360px] sm:max-w-[400px] [perspective:1000px]"
            >
              {/* Ambient atmospheric backlight behind card */}
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute -inset-4 rounded-3xl blur-2xl transition-opacity duration-700 ${
                  mode === "cyber"
                    ? "bg-gradient-to-tr from-cyan-500/25 via-emerald-500/15 to-transparent opacity-80"
                    : mode === "vivid"
                    ? "bg-gradient-to-tr from-sky-500/25 via-amber-500/20 to-transparent opacity-75"
                    : "bg-gradient-to-tr from-[#E8B04A]/20 via-orange-500/10 to-transparent opacity-60"
                }`}
              />

              {/* 3D Tilting Card Container */}
              <motion.div
                ref={cardRef}
                onPointerMove={handleCardPointerMove}
                onPointerLeave={handleCardPointerLeave}
                onClick={cycleMode}
                style={{
                  rotateX: reduce ? 0 : rotateX,
                  rotateY: reduce ? 0 : rotateY,
                  transformStyle: "preserve-3d",
                }}
                className="group relative cursor-pointer select-none rounded-[28px] border border-white/[0.14] bg-neutral-900/60 p-3.5 shadow-2xl backdrop-blur-xl transition-shadow duration-500 hover:border-white/30 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)]"
              >
                {/* Top Control Bar: Mode Switcher Pills */}
                <div className="mb-3 flex items-center justify-between px-1">
                  <div className="flex items-center gap-1.5 text-xs text-muted">
                    <Sparkles size={13} className="text-[#E8B04A]" />
                    <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                      Portrait HUD
                    </span>
                  </div>

                  {/* Mode switcher pills */}
                  <div className="flex items-center gap-1 rounded-full border border-white/10 bg-black/40 p-0.5 backdrop-blur-md">
                    {MODES.map((m) => {
                      const Icon = m.icon;
                      const active = mode === m.id;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={(e) => selectMode(m.id, e)}
                          title={`Switch to ${m.label}`}
                          className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium transition-all ${
                            active
                              ? "bg-white/15 text-foreground shadow-sm"
                              : "text-muted hover:text-foreground"
                          }`}
                        >
                          <Icon size={11} />
                          <span className="hidden xs:inline">{m.label.split(" ")[1] || m.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Portrait Image Frame */}
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[20px] bg-neutral-950">
                  <Image
                    src="/images/yogi.jpg"
                    alt="Yogender Verma - Full-Stack Developer & AI Systems Engineer"
                    fill
                    priority
                    sizes="(max-width: 640px) 340px, (max-width: 1024px) 380px, 420px"
                    className={`object-cover object-[center_28%] transition-all duration-700 ease-out group-hover:scale-[1.03] ${
                      mode === "noir"
                        ? "grayscale contrast-[1.18] brightness-[0.92]"
                        : mode === "vivid"
                        ? "saturate-[1.1] contrast-[1.04]"
                        : "contrast-[1.25] brightness-[0.96] hue-rotate-[190deg]"
                    }`}
                  />

                  {/* Subtle film grain texture */}
                  <div className="grain-overlay pointer-events-none opacity-40" />

                  {/* Mode 1 (Noir): Studio Vignette & Warm Amber Accent Light */}
                  {mode === "noir" && (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"
                    />
                  )}

                  {/* Mode 2 (Vivid): Crisp Daylight Ambient Glow */}
                  {mode === "vivid" && (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent"
                    />
                  )}

                  {/* Mode 3 (Cyber): AI HUD Hologram Reticle, Brackets & Scanlines */}
                  {mode === "cyber" && (
                    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                      {/* Scanline CRT lines */}
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.45)_50%)] bg-[length:100%_4px] opacity-60" />

                      {/* Moving laser scan beam */}
                      <motion.div
                        initial={{ y: "-100%" }}
                        animate={{ y: "200%" }}
                        transition={{
                          repeat: Infinity,
                          duration: 2.8,
                          ease: "linear",
                        }}
                        className="h-16 w-full bg-gradient-to-b from-transparent via-cyan-400/25 to-transparent blur-sm"
                      />

                      {/* Sci-Fi Corner Brackets */}
                      <div className="absolute top-3 left-3 h-4 w-4 border-t-2 border-l-2 border-cyan-400" />
                      <div className="absolute top-3 right-3 h-4 w-4 border-t-2 border-r-2 border-cyan-400" />
                      <div className="absolute bottom-16 left-3 h-4 w-4 border-b-2 border-l-2 border-cyan-400" />
                      <div className="absolute bottom-16 right-3 h-4 w-4 border-b-2 border-r-2 border-cyan-400" />

                      {/* Center targeting reticle */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="h-14 w-14 rounded-full border border-cyan-400/40 motion-safe:animate-ping opacity-30" />
                        <div className="absolute inset-0 m-auto h-2 w-2 rounded-full bg-cyan-400/80" />
                      </div>

                      {/* Telemetry data readouts */}
                      <div className="absolute top-4 left-4 font-mono text-[9px] tracking-wider text-cyan-300/90">
                        SYS: ONLINE [60FPS]
                      </div>
                      <div className="absolute top-4 right-4 font-mono text-[9px] tracking-wider text-cyan-300/90">
                        AI_NODE: 31.1°N
                      </div>
                    </div>
                  )}

                  {/* Top-Left Floating Location & Live Time Chip */}
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/60 px-3 py-1.5 text-[11px] font-medium text-white/90 backdrop-blur-md">
                    <MapPin size={11} className="text-[#E8B04A]" />
                    <span>Himachal, IN</span>
                    {timeString && (
                      <>
                        <span className="text-white/40">·</span>
                        <Clock size={11} className="text-white/70" />
                        <span className="font-mono text-[10px] tracking-tight text-white/90">
                          {timeString}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Bottom Identity Overlay */}
                  <div className="absolute inset-x-0 bottom-0 z-10 p-4">
                    <div className="rounded-xl border border-white/10 bg-black/65 p-3 backdrop-blur-md">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold tracking-tight text-white">
                            {personalInfo.name}
                          </p>
                          <p className="text-[11px] text-white/70">
                            Full-Stack & AI Systems
                          </p>
                        </div>
                        <div className="flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-medium text-white/90">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>Active</span>
                        </div>
                      </div>

                      {/* Micro-hint to toggle */}
                      <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-2 text-[10px] text-white/60">
                        <span className="flex items-center gap-1">
                          <SlidersHorizontal size={10} />
                          Tap card to cycle mode
                        </span>
                        <span className="font-mono uppercase text-[#E8B04A]">
                          {mode}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Specular Mouse Glare Overlay */}
                  {!reduce && (
                    <motion.div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      style={{ background: glareBackground }}
                    />
                  )}
                </div>

                {/* Card Sub-dock: Fast Tech Tags */}
                <div className="mt-3 flex items-center justify-between px-1 text-[11px] text-muted">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    Engineered With
                  </span>
                  <div className="flex items-center gap-1.5 font-medium text-foreground/80">
                    <span>Next.js 15</span>
                    <span className="text-muted/50">·</span>
                    <span>TypeScript</span>
                    <span className="text-muted/50">·</span>
                    <span>AI Agents</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* ================= BOTTOM QUIET FACT ROW ================= */}
        <motion.dl
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.75 }}
          className="mt-14 grid grid-cols-2 gap-6 border-t border-border pt-7 sm:mt-18 sm:grid-cols-4"
        >
          <div>
            <dt className="text-[11px] uppercase tracking-[0.2em] text-muted">
              Role
            </dt>
            <dd className="mt-1.5 text-sm font-medium text-foreground">
              Full-Stack & AI Engineer
            </dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-[0.2em] text-muted">
              Primary Stack
            </dt>
            <dd className="mt-1.5 text-sm font-medium text-foreground">
              MERN · Next.js · TypeScript
            </dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-[0.2em] text-muted">
              Origin / Base
            </dt>
            <dd className="mt-1.5 text-sm font-medium text-foreground">
              Himachal Pradesh, India
            </dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-[0.2em] text-muted">
              Status
            </dt>
            <dd className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Open to Opportunities
            </dd>
          </div>
        </motion.dl>
      </div>
    </section>
  );
}
