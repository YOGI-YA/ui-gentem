"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface IntroAnimationProps {
  onComplete?: () => void;
}

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  // Phase sequence: "ball" -> "exclamation" -> "name" -> "portfolio" -> "complete"
  const [phase, setPhase] = useState<"ball" | "exclamation" | "name" | "portfolio" | "complete">("ball");
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Phase 1: Ball bounce (0ms)
    const t1 = setTimeout(() => {
      setPhase("exclamation");
    }, 900);

    // Phase 2: Exclamation / bat strike into Name (1600ms)
    const t2 = setTimeout(() => {
      setPhase("name");
    }, 1800);

    // Phase 3: Morph to massive PORTFOLIO (3200ms)
    const t3 = setTimeout(() => {
      setPhase("portfolio");
    }, 3300);

    // Phase 4: Settle & complete into main site (4800ms)
    const t4 = setTimeout(() => {
      setPhase("complete");
      setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, 600);
    }, 4900);

    // Escape key skips intro
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        skipIntro();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onComplete]);

  const skipIntro = () => {
    setPhase("complete");
    setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 300);
  };

  if (!visible) return null;

  const nameLetters = "YOGENDER".split("");

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#070708] select-none overflow-hidden"
        >
          {/* Ambient center radial glow */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="h-[450px] w-[650px] rounded-full bg-gradient-to-b from-white/10 via-slate-400/5 to-transparent blur-[130px] opacity-70" />
            <div className="absolute h-72 w-72 rounded-full bg-red-500/5 blur-[120px]" />
          </div>

          {/* Skip button in top right */}
          <button
            onClick={skipIntro}
            className="absolute top-6 right-6 z-20 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-[11px] font-medium tracking-[0.2em] text-white/60 uppercase backdrop-blur-md transition-all hover:bg-white/15 hover:text-white hover:border-white/20"
          >
            <span>Skip</span>
            <span className="text-[9px] text-white/40">ESC</span>
          </button>

          {/* Central animation stage */}
          <div className="relative flex flex-col items-center justify-center w-full px-6 min-h-[220px]">
            {/* Phase 1 & 2: Ball and Exclamation */}
            {(phase === "ball" || phase === "exclamation") && (
              <div className="relative flex flex-col items-center justify-center">
                {/* Exclamation stem appearing when ball hits bottom in phase "exclamation" */}
                {phase === "exclamation" && (
                  <motion.div
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={{ scaleY: 1, opacity: 1 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    style={{ transformOrigin: "bottom center" }}
                    className="w-4 h-16 rounded-full bg-gradient-to-t from-slate-200 via-white to-slate-400 mb-3 shadow-[0_0_20px_rgba(255,255,255,0.7)]"
                  />
                )}

                {/* Bouncing ball */}
                <motion.div
                  initial={{ y: -160, scaleX: 0.8, scaleY: 1.2, opacity: 0 }}
                  animate={
                    phase === "ball"
                      ? {
                          y: [ -160, 0, -50, 0 ],
                          scaleX: [ 0.8, 1.4, 0.9, 1 ],
                          scaleY: [ 1.2, 0.6, 1.1, 1 ],
                          opacity: 1,
                        }
                      : {
                          y: 0,
                          scaleX: 1,
                          scaleY: 1,
                          opacity: 1,
                        }
                  }
                  transition={{
                    duration: 0.9,
                    times: [0, 0.5, 0.75, 1],
                    ease: "easeOut",
                  }}
                  className="w-5 h-5 rounded-full bg-white shadow-[0_0_25px_rgba(255,255,255,0.95)]"
                />

                {/* Paddle / strike line sweeping through */}
                {phase === "exclamation" && (
                  <motion.div
                    initial={{ rotate: -40, opacity: 0, x: 40, y: 10 }}
                    animate={{ rotate: 25, opacity: [0, 1, 1, 0], x: -30, y: -10 }}
                    transition={{ duration: 0.5, delay: 0.2, ease: "easeInOut" }}
                    className="absolute w-20 h-1.5 rounded-full bg-gradient-to-r from-transparent via-white to-slate-300 shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                  />
                )}
              </div>
            )}

            {/* Phase 3: The Name "YOGENDER" with bouncing ball hitting letters */}
            {phase === "name" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.4 }}
                className="relative flex items-center justify-center gap-1 sm:gap-2.5"
              >
                {nameLetters.map((char, index) => (
                  <motion.span
                    key={`${char}-${index}`}
                    initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.06,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="metallic-chrome text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-wider"
                  >
                    {char}
                  </motion.span>
                ))}

                {/* Small playful bouncing ball dancing across the letters */}
                <motion.div
                  initial={{ x: -140, y: -40, opacity: 1 }}
                  animate={{
                    x: [ -140, -70, 0, 70, 140 ],
                    y: [ -40, -10, -45, -10, -60 ],
                  }}
                  transition={{
                    duration: 1.1,
                    ease: "easeInOut",
                  }}
                  className="absolute w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,1)]"
                />
              </motion.div>
            )}

            {/* Phase 4: Big Bold Metallic "PORTFOLIO" */}
            {(phase === "portfolio" || phase === "complete") && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85, filter: "blur(12px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center text-center"
              >
                <h1 className="metallic-chrome text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight leading-none uppercase">
                  PORTFOLIO
                </h1>
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="mt-4 text-xs sm:text-sm md:text-base tracking-[0.35em] text-white/70 uppercase font-medium"
                >
                  Full-Stack Developer & AI Systems Engineer
                </motion.p>
              </motion.div>
            )}
          </div>

          {/* Bottom subtle progress indicator line */}
          <div className="absolute bottom-8 w-44 h-[2px] bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 4.8, ease: "linear" }}
              className="h-full bg-gradient-to-r from-slate-400 via-white to-red-500"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
