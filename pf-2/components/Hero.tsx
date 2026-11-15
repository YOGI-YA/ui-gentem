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
import { ArrowUpRight, Github, Linkedin, MapPin, ShieldCheck } from "lucide-react";
import { personalInfo } from "@/lib/data";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const LINES = ["I build web products", "and AI tools that", "actually ship."];

interface HeroProps {
  onSayHello: () => void;
}

interface PixelParticle {
  x: number;
  y: number;
  alpha: number;
  color: string;
  size: number;
}

export default function Hero({ onSayHello }: HeroProps) {
  const reduce = !!useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pixelsRef = useRef<PixelParticle[]>([]);
  const animFrameRef = useRef<number>(0);

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
  const glowX = useSpring(useMotionValue(0), { stiffness: 80, damping: 20 });
  const glowY = useSpring(useMotionValue(0), { stiffness: 80, damping: 20 });
  const glow = useMotionTemplate`radial-gradient(560px circle at ${glowX}px ${glowY}px, rgba(232,176,74,0.11), transparent 65%)`;

  useEffect(() => {
    const el = heroRef.current;
    if (!el || reduce) return;
    const r = el.getBoundingClientRect();
    glowX.set(r.width * 0.7);
    glowY.set(r.height * 0.35);
    const onMove = (e: PointerEvent) => {
      const b = el.getBoundingClientRect();
      glowX.set(e.clientX - b.left);
      glowY.set(e.clientY - b.top);
    };
    el.addEventListener("pointermove", onMove);
    return () => el.removeEventListener("pointermove", onMove);
  }, [reduce, glowX, glowY]);

  // 3D Magnetic Card Parallax & Glare
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), {
    stiffness: 180,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), {
    stiffness: 180,
    damping: 22,
  });

  const glareX = useTransform(mouseX, [-0.5, 0.5], ["15%", "85%"]);
  const glareY = useTransform(mouseY, [-0.5, 0.5], ["15%", "85%"]);
  const glareBackground = useMotionTemplate`radial-gradient(340px circle at ${glareX} ${glareY}, rgba(255,255,255,0.15), transparent 68%)`;

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

  // Interactive Pixel Canvas on ID Photo
  const handlePhotoPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (reduce) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const pxX = e.clientX - rect.left;
      const pxY = e.clientY - rect.top;

      const pixelSize = 14;
      const baseCol = Math.floor(pxX / pixelSize);
      const baseRow = Math.floor(pxY / pixelSize);

      const colorPalette = [
        "rgba(232, 176, 74, ",
        "rgba(245, 243, 239, ",
        "rgba(56, 189, 248, ",
        "rgba(232, 176, 74, ",
      ];

      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (Math.random() > 0.35) {
            const posX = (baseCol + dx) * pixelSize;
            const posY = (baseRow + dy) * pixelSize;

            if (posX >= 0 && posX < canvas.width && posY >= 0 && posY < canvas.height) {
              const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
              pixelsRef.current.push({
                x: posX,
                y: posY,
                alpha: 0.95,
                color,
                size: pixelSize,
              });
            }
          }
        }
      }

      if (pixelsRef.current.length > 80) {
        pixelsRef.current.splice(0, pixelsRef.current.length - 80);
      }
    },
    [reduce]
  );

  // Sync canvas size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const syncCanvasSize = () => {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    syncCanvasSize();
    window.addEventListener("resize", syncCanvasSize);
    return () => window.removeEventListener("resize", syncCanvasSize);
  }, []);

  // Pixel particle render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = pixelsRef.current.length - 1; i >= 0; i--) {
        const p = pixelsRef.current[i];
        p.alpha -= 0.04;

        if (p.alpha <= 0) {
          pixelsRef.current.splice(i, 1);
          continue;
        }

        ctx.fillStyle = `${p.color}${p.alpha.toFixed(2)})`;
        ctx.fillRect(p.x, p.y, p.size - 1, p.size - 1);

        if (p.alpha > 0.6) {
          ctx.strokeStyle = `rgba(232, 176, 74, ${(p.alpha * 0.7).toFixed(2)})`;
          ctx.lineWidth = 1;
          ctx.strokeRect(p.x, p.y, p.size - 1, p.size - 1);
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

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

          {/* ================= RIGHT COLUMN: INTERACTIVE PIXEL ID CARD ================= */}
          <div className="flex justify-center lg:col-span-5 lg:justify-end">
            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.25, ease: EASE }}
              className="relative w-full max-w-[340px] sm:max-w-[370px] [perspective:1000px]"
            >
              {/* Subtle ambient backlight halo */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-tr from-[#E8B04A]/15 via-orange-500/10 to-sky-500/10 blur-2xl opacity-75"
              />

              {/* 3D Tilting Physical ID Card Frame */}
              <motion.div
                ref={cardRef}
                onPointerMove={handleCardPointerMove}
                onPointerLeave={handleCardPointerLeave}
                style={{
                  rotateX: reduce ? 0 : rotateX,
                  rotateY: reduce ? 0 : rotateY,
                  transformStyle: "preserve-3d",
                }}
                className="group relative select-none rounded-[26px] border border-white/[0.14] bg-neutral-900/85 p-3.5 shadow-2xl backdrop-blur-xl transition-shadow duration-500 hover:border-white/30 hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)]"
              >
                {/* ID Badge Punch Slot / Lanyard Hole */}
                <div className="mx-auto mb-2.5 h-1.5 w-12 rounded-full border border-white/10 bg-neutral-950 shadow-inner" />

                {/* ID Card Top Bar: Serial & Smart Chip */}
                <div className="mb-2.5 flex items-center justify-between px-1">
                  <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-widest text-muted uppercase">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span>DEV ID // 2026</span>
                  </div>

                  {/* Metallic Smart Card IC Chip */}
                  <div
                    title="Smart Card Microchip"
                    className="flex h-5 w-7 items-center justify-center rounded border border-amber-500/40 bg-gradient-to-br from-amber-500/25 via-yellow-600/15 to-amber-900/30 p-0.5 shadow-sm"
                  >
                    <div className="grid h-full w-full grid-cols-2 gap-0.5 rounded-[2px] border border-amber-400/30">
                      <div className="border-r border-amber-400/25" />
                      <div />
                    </div>
                  </div>
                </div>

                {/* Portrait Photo Frame with Interactive Pixel Canvas */}
                <div
                  onPointerMove={handlePhotoPointerMove}
                  className="relative aspect-[4/5] w-full overflow-hidden rounded-[18px] border border-white/10 bg-neutral-950 cursor-crosshair"
                >
                  <Image
                    src="/images/yogi.jpg"
                    alt={personalInfo.name}
                    fill
                    priority
                    sizes="(max-width: 640px) 340px, (max-width: 1024px) 370px, 400px"
                    className="object-cover object-[center_28%] transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />

                  {/* Soft natural film grain */}
                  <div className="grain-overlay pointer-events-none opacity-30" />

                  {/* Interactive Pixel Canvas Overlay */}
                  <canvas
                    ref={canvasRef}
                    className="pointer-events-none absolute inset-0 z-20 h-full w-full"
                  />

                  {/* Holographic Pixel Mesh Texture */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-40"
                    style={{
                      backgroundImage:
                        "radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)",
                      backgroundSize: "8px 8px",
                    }}
                  />

                  {/* Security Clearance Tag at top-right */}
                  <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1 rounded-full border border-white/15 bg-black/60 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-white/90 backdrop-blur-md">
                    <ShieldCheck size={10} className="text-[#E8B04A]" />
                    <span>VERIFIED</span>
                  </div>

                  {/* ID Alignment Corner Crosshairs */}
                  <div className="pointer-events-none absolute top-2 left-2 z-10 font-mono text-[9px] text-white/40">
                    +
                  </div>
                  <div className="pointer-events-none absolute bottom-2 left-2 z-10 font-mono text-[9px] text-white/40">
                    +
                  </div>
                  <div className="pointer-events-none absolute bottom-2 right-2 z-10 font-mono text-[9px] text-white/40">
                    +
                  </div>

                  {/* Dynamic Specular Mouse Glare Overlay */}
                  {!reduce && (
                    <motion.div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 z-15 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      style={{ background: glareBackground }}
                    />
                  )}
                </div>

                {/* ID Card Bottom Details & Barcode */}
                <div className="mt-3 px-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
                        NAME // ROLE
                      </p>
                      <p className="text-sm font-semibold tracking-tight text-white">
                        {personalInfo.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
                        ORIGIN
                      </p>
                      <p className="flex items-center justify-end gap-1 text-xs text-white/80">
                        <MapPin size={11} className="text-[#E8B04A]" />
                        <span>Himachal, IN</span>
                      </p>
                    </div>
                  </div>

                  {/* Barcode & Security Strip */}
                  <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2.5">
                    {/* Realistic Barcode */}
                    <div className="flex items-center gap-[2px] opacity-75">
                      {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 3, 1, 4, 2, 1, 3].map(
                        (w, idx) => (
                          <span
                            key={idx}
                            className="h-3 bg-foreground/80 rounded-[0.5px]"
                            style={{ width: `${w}px` }}
                          />
                        )
                      )}
                    </div>

                    {/* Serial & Live Timestamp */}
                    <div className="font-mono text-[9px] uppercase tracking-wider text-muted">
                      № YV-7717 {timeString ? `· ${timeString}` : ""}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
