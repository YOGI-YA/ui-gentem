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
} from "framer-motion";
import { ArrowUpRight, Github, Linkedin, MapPin } from "lucide-react";
import { personalInfo } from "@/lib/data";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const LINES = ["I build web products", "and AI tools that", "actually ship."];

interface HeroProps {
  onSayHello: () => void;
}

export default function Hero({ onSayHello }: HeroProps) {
  const reduce = !!useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Live Himachal Pradesh / Indian Standard Time
  const [timeString, setTimeString] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        setTimeString(
          now.toLocaleTimeString("en-US", {
            timeZone: "Asia/Kolkata",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
        );
      } catch {
        setTimeString("IST");
      }
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Soft cursor-following ambient background glow
  const x = useSpring(useMotionValue(0), { stiffness: 80, damping: 20 });
  const y = useSpring(useMotionValue(0), { stiffness: 80, damping: 20 });
  const glow = useMotionTemplate`radial-gradient(560px circle at ${x}px ${y}px, rgba(232,176,74,0.11), transparent 65%)`;

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

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [9, -9]), {
    stiffness: 180,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-9, 9]), {
    stiffness: 180,
    damping: 22,
  });

  const glareX = useTransform(mouseX, [-0.5, 0.5], ["15%", "85%"]);
  const glareY = useTransform(mouseY, [-0.5, 0.5], ["15%", "85%"]);
  const glareBackground = useMotionTemplate`radial-gradient(340px circle at ${glareX} ${glareY}, rgba(255,255,255,0.16), transparent 68%)`;

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
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  const focusRing =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground";

  return (
    <section
      ref={heroRef}
      className="relative flex min-h-svh flex-col justify-center overflow-hidden border-b border-border pt-28 pb-16 sm:pt-36 sm:pb-20"
    >
      {/* Background dot grid pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.09] [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_75%)]"
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
          {/* ================= LEFT COLUMN: RAW CONFIDENT TYPOGRAPHY ================= */}
          <div className="flex flex-col justify-center lg:col-span-7">
            {/* Minimalist Editorial Kicker */}
            <motion.p
              initial={reduce ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="font-mono text-xs uppercase tracking-[0.25em] text-muted"
            >
              Full-Stack Developer · AI Systems
            </motion.p>

            {/* Kinetic Big Headline */}
            <h1 className="mt-5 text-4xl font-semibold leading-[1.04] tracking-tight sm:text-6xl lg:text-[4.4vw] xl:text-[4.8vw]">
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

            {/* Call to Actions */}
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45, ease: EASE }}
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

              <div className="flex items-center gap-2 pl-2">
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

          {/* ================= RIGHT COLUMN: EDITORIAL 3D PORTRAIT CARD ================= */}
          <div className="flex justify-center lg:col-span-5 lg:justify-end">
            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.25, ease: EASE }}
              className="relative w-full max-w-[340px] sm:max-w-[380px] [perspective:1000px]"
            >
              {/* Subtle ambient backlight halo */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-tr from-[#E8B04A]/15 via-orange-500/10 to-sky-500/10 blur-2xl opacity-70"
              />

              {/* 3D Tilting Card */}
              <motion.div
                ref={cardRef}
                onPointerMove={handleCardPointerMove}
                onPointerLeave={handleCardPointerLeave}
                style={{
                  rotateX: reduce ? 0 : rotateX,
                  rotateY: reduce ? 0 : rotateY,
                  transformStyle: "preserve-3d",
                }}
                className="group relative select-none rounded-[24px] border border-white/[0.12] bg-neutral-900/60 p-3 shadow-2xl backdrop-blur-xl transition-shadow duration-500 hover:border-white/25 hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)]"
              >
                {/* Portrait Image Frame */}
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[18px] bg-neutral-950">
                  <Image
                    src="/images/yogi.jpg"
                    alt={personalInfo.name}
                    fill
                    priority
                    sizes="(max-width: 640px) 340px, (max-width: 1024px) 380px, 400px"
                    className="object-cover object-[center_28%] transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />

                  {/* Soft natural film grain */}
                  <div className="grain-overlay pointer-events-none opacity-30" />

                  {/* Subtle lower gradient for caption readability */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/85 via-black/40 to-transparent"
                  />

                  {/* Understated bottom caption */}
                  <div className="absolute inset-x-0 bottom-0 z-10 p-4">
                    <p className="text-sm font-medium tracking-tight text-white">
                      {personalInfo.name}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-white/70">
                      <MapPin size={11} className="text-[#E8B04A]" />
                      <span>Himachal Pradesh, India</span>
                      {timeString && (
                        <>
                          <span className="text-white/40">·</span>
                          <span className="font-mono text-[11px] text-white/80">
                            {timeString}
                          </span>
                        </>
                      )}
                    </p>
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
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
