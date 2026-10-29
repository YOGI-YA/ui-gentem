"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ArrowUpRight, Mail, Github, Linkedin, Twitter, MessageCircle, MapPin } from "lucide-react";
import { personalInfo } from "@/lib/data";

function MagneticButton({
  href,
  children,
  primary = false,
}: {
  href: string;
  children: React.ReactNode;
  primary?: boolean;
}) {
  const buttonRef = useRef<HTMLAnchorElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = buttonRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(el, {
      x: x * 0.35,
      y: y * 0.35,
      duration: 0.4,
      ease: "power3.out",
    });
  }

  function handleMouseLeave() {
    const el = buttonRef.current;
    if (!el) return;
    gsap.to(el, {
      x: 0,
      y: 0,
      duration: 0.9,
      ease: "elastic.out(1, 0.3)",
    });
  }

  return (
    <a
      ref={buttonRef}
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-xs sm:text-sm font-semibold tracking-[0.1em] uppercase transition-all shadow-md ${
        primary
          ? "bg-foreground text-background hover:scale-105"
          : "border border-white/20 bg-white/5 text-foreground hover:bg-white/15 backdrop-blur-md"
      }`}
    >
      {children}
    </a>
  );
}

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden border-b border-border py-28 md:py-40 bg-[#07080a]"
    >
      {/* Background ambient lighting from video 00:38 */}
      <div className="pointer-events-none absolute -left-32 top-10 h-[450px] w-[450px] rounded-full bg-white/5 blur-[140px]" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-[450px] w-[450px] rounded-full bg-emerald-500/5 blur-[140px]" />

      <div className="relative mx-auto flex max-w-[1100px] flex-col items-center px-6 text-center">
        {/* Availability Badge directly matching video */}
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-[11px] font-medium tracking-[0.2em] text-emerald-400 uppercase backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Available for work</span>
        </div>

        {/* Big Metallic Title from video 00:38 */}
        <h2 className="metallic-chrome text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-none uppercase select-none">
          Get in touch
        </h2>

        <p className="mt-6 max-w-xl text-muted text-sm sm:text-base leading-relaxed">
          Open for full-stack engineering, AI agent systems, contract roles, and ambitious collaborations. Let&apos;s build software that moves people.
        </p>

        {/* Primary CTA Buttons (WhatsApp & Email from video) */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <MagneticButton href={`https://wa.me/919999999999`} primary={true}>
            <MessageCircle size={16} />
            <span>Message on WhatsApp</span>
          </MagneticButton>

          <MagneticButton href={`mailto:${personalInfo.email}`} primary={false}>
            <Mail size={16} />
            <span>Send an email</span>
            <ArrowUpRight
              size={15}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </MagneticButton>
        </div>

        {/* Glassmorphic Contact Details Card from video 00:38 */}
        <div className="mt-14 w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 text-left shadow-2xl">
          <div className="space-y-4 text-xs sm:text-sm">
            <div>
              <span className="text-[10px] font-mono tracking-[0.25em] text-white/40 uppercase block mb-1">
                EMAIL
              </span>
              <a
                href={`mailto:${personalInfo.email}`}
                className="text-white hover:text-emerald-400 transition-colors font-medium"
              >
                {personalInfo.email}
              </a>
            </div>

            <div className="border-t border-white/5 pt-3">
              <span className="text-[10px] font-mono tracking-[0.25em] text-white/40 uppercase block mb-1">
                LOCATION
              </span>
              <div className="flex items-center gap-1.5 text-white/80">
                <MapPin size={13} className="text-emerald-400" />
                <span>{personalInfo.location}</span>
              </div>
            </div>

            <div className="border-t border-white/5 pt-3">
              <span className="text-[10px] font-mono tracking-[0.25em] text-white/40 uppercase block mb-2">
                ELSEWHERE
              </span>
              <div className="flex items-center gap-3">
                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-9 h-9 rounded-xl border border-white/10 bg-white/5 text-white/80 hover:text-white hover:bg-white/15 transition-all"
                  title="GitHub"
                >
                  <Github size={16} />
                </a>

                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-9 h-9 rounded-xl border border-white/10 bg-white/5 text-white/80 hover:text-white hover:bg-white/15 transition-all"
                  title="LinkedIn"
                >
                  <Linkedin size={16} />
                </a>

                <a
                  href={personalInfo.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-9 h-9 rounded-xl border border-white/10 bg-white/5 text-white/80 hover:text-white hover:bg-white/15 transition-all"
                  title="Twitter / X"
                >
                  <Twitter size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
