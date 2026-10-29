"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ArrowUpRight, Github } from "lucide-react";
import { heroPhrases, heroPrefix, personalInfo } from "@/lib/data";
import ParticleField from "@/components/ParticleField";

const TYPING_SPEED = 65;
const DELETING_SPEED = 35;
const HOLD_MS = 1400;

export default function Hero() {
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

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden border-b border-border pt-24 pb-16">
      {/* Subtle particle background */}
      <ParticleField />

      {/* Ambient background lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[550px] w-[800px] rounded-full bg-gradient-to-b from-white/10 via-slate-400/5 to-transparent blur-[140px]" />
        <div className="absolute top-1/3 -left-20 h-72 w-72 rounded-full bg-foreground/5 blur-[100px]" />
        <div className="absolute bottom-20 -right-20 h-80 w-80 rounded-full bg-red-500/5 blur-[120px]" />
        <div className="halftone absolute inset-0 opacity-40" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-[1100px] flex-col items-center px-6 text-center">
        {/* Availability Pill */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-border bg-background/80 px-4 py-1.5 backdrop-blur-md shadow-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-xs tracking-[0.25em] text-foreground/80 font-medium uppercase">
            {personalInfo.name} &mdash; Full-Stack &amp; AI
          </span>
        </motion.div>

        {/* Dynamic Typing Title */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center leading-[1.08] font-medium tracking-tight max-w-5xl"
        >
          <span className="text-[5vw] sm:text-[3.5vw] lg:text-[2.2vw] text-muted font-normal">
            {heroPrefix}
          </span>
          <span className="min-h-[1.3em] inline-block text-[8vw] sm:text-[6vw] lg:text-[4.8vw] mt-2 font-medium text-foreground">
            {text}
            <span className="type-cursor inline-block w-[2px] translate-y-[-0.08em] bg-foreground align-middle h-[0.8em] ml-1.5" />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-8 max-w-xl text-base text-muted sm:text-lg leading-relaxed"
        >
          {personalInfo.bio}
        </motion.p>

        {/* Clean, Elegant Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#work"
            className="group inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-xs tracking-[0.15em] text-background font-semibold transition-transform hover:scale-105"
          >
            EXPLORE WORK
            <ArrowUpRight
              size={14}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>

          <a
            href="#philosophy"
            className="group inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-6 py-3.5 text-xs tracking-[0.15em] text-foreground backdrop-blur-sm transition-colors hover:border-foreground font-medium"
          >
            THE PHILOSOPHY
          </a>

          <a
            href={personalInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-6 py-3.5 text-xs tracking-[0.15em] text-foreground backdrop-blur-sm transition-colors hover:bg-foreground hover:text-background font-medium"
          >
            <Github size={14} />
            GITHUB
          </a>

          <a
            href="#contact"
            className="group inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-6 py-3.5 text-xs tracking-[0.15em] text-foreground backdrop-blur-sm transition-colors hover:border-foreground font-medium"
          >
            SAY HELLO
          </a>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-foreground/50"
      >
        <ChevronDown size={22} />
      </motion.div>
    </section>
  );
}
