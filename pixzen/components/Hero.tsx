"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { heroPhrases, heroPrefix } from "@/lib/data";

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
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden border-b border-border">
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
        <div className="absolute inset-0 bg-background/40" />
        <div className="halftone absolute inset-0" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-[1200px] flex-col items-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 text-xs tracking-[0.3em] text-muted"
        >
          AN AI-NATIVE DIGITAL AGENCY
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center leading-[0.95] font-medium tracking-tight"
        >
          <span className="text-[7vw] sm:text-[5vw] lg:text-[3.4vw] text-muted">
            {heroPrefix}
          </span>
          <span className="whitespace-nowrap text-[13vw] sm:text-[9vw] lg:text-[6.2vw]">
            {text}
            <span className="type-cursor inline-block w-[2px] translate-y-[-0.08em] bg-foreground align-middle h-[0.8em] ml-2" />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 max-w-md text-base text-muted"
        >
          Brand, product, and the AI layer underneath — built by one senior
          team, end to end.
        </motion.p>
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2 text-foreground/60"
      >
        <ChevronDown size={22} />
      </motion.div>
    </section>
  );
}
