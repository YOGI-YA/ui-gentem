"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ArrowUpRight, Github } from "lucide-react";
import { heroPhrases, heroPrefix, personalInfo } from "@/lib/data";

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
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden border-b border-border pt-20">
      <div className="absolute inset-0">
        <video
          className="h-full w-full object-cover opacity-[0.85] mix-blend-luminosity"
          autoPlay
          muted
          loop
          playsInline
          poster="/textures/hero-poster.jpg"
        >
          <source src="/hero_bg_animation_hand.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px]" />
        <div className="halftone absolute inset-0" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-[1200px] flex-col items-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-4 py-1.5 backdrop-blur-md"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs tracking-[0.25em] text-foreground/80 font-medium uppercase">
            Yogender Verma — Full-Stack & AI
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center leading-[0.95] font-medium tracking-tight"
        >
          <span className="text-[6.5vw] sm:text-[4.5vw] lg:text-[3.2vw] text-muted">
            {heroPrefix}
          </span>
          <span className="whitespace-nowrap text-[11vw] sm:text-[8vw] lg:text-[5.5vw] mt-1">
            {text}
            <span className="type-cursor inline-block w-[2px] translate-y-[-0.08em] bg-foreground align-middle h-[0.8em] ml-2" />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 max-w-xl text-base text-muted sm:text-lg leading-relaxed"
        >
          {personalInfo.bio}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#work"
            className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-xs tracking-[0.15em] text-background font-medium transition-transform hover:scale-105"
          >
            EXPLORE WORK
            <ArrowUpRight
              size={14}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
          <a
            href={personalInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-6 py-3 text-xs tracking-[0.15em] text-foreground backdrop-blur-sm transition-colors hover:bg-foreground hover:text-background"
          >
            <Github size={14} />
            GITHUB
          </a>
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-6 py-3 text-xs tracking-[0.15em] text-foreground backdrop-blur-sm transition-colors hover:border-foreground"
          >
            CONTACT
          </a>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-foreground/60"
      >
        <ChevronDown size={22} />
      </motion.div>
    </section>
  );
}
