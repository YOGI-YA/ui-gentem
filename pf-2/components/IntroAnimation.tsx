"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface IntroAnimationProps {
  onComplete?: () => void;
}

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  // Sequence: "ball" -> "yogi" -> "yogender" -> "complete"
  const [phase, setPhase] = useState<"ball" | "yogi" | "yogender" | "complete">("ball");
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Phase 1: Ball bounce (0ms -> 1100ms)
    const t1 = setTimeout(() => {
      setPhase("yogi");
    }, 1100);

    // Phase 2: Transition from YOGI to YOGENDER (2400ms)
    const t2 = setTimeout(() => {
      setPhase("yogender");
    }, 2500);

    // Phase 3: Smooth dissolve into Hero (4200ms)
    const t3 = setTimeout(() => {
      setPhase("complete");
      setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, 500);
    }, 4200);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPhase("complete");
        setTimeout(() => {
          setVisible(false);
          onComplete?.();
        }, 200);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onComplete]);

  const skip = () => {
    setPhase("complete");
    setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 200);
  };

  if (!visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(10px)" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#070708] select-none overflow-hidden"
        >
          {/* Subtle ambient lighting */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="h-[400px] w-[600px] rounded-full bg-gradient-to-b from-white/10 via-slate-400/5 to-transparent blur-[120px] opacity-60" />
          </div>

          {/* Minimal Skip Pill */}
          <button
            onClick={skip}
            className="absolute top-6 right-6 z-20 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[11px] font-mono tracking-widest text-white/40 hover:text-white hover:border-white/20 transition-all uppercase"
          >
            Skip [ESC]
          </button>

          {/* Center Stage */}
          <div className="relative flex flex-col items-center justify-center min-h-[160px] px-6">
            {/* Phase 1: Ball Bounce */}
            {phase === "ball" && (
              <div className="relative flex flex-col items-center justify-center">
                <motion.div
                  initial={{ y: -150, opacity: 0 }}
                  animate={{
                    y: [-150, 0, -45, 0, -15, 0],
                    scaleX: [0.85, 1.35, 0.95, 1.2, 0.98, 1],
                    scaleY: [1.15, 0.65, 1.05, 0.8, 1.02, 1],
                    opacity: 1,
                  }}
                  transition={{
                    duration: 1.05,
                    times: [0, 0.45, 0.65, 0.82, 0.92, 1],
                    ease: "easeOut",
                  }}
                  className="w-5 h-5 rounded-full bg-white shadow-[0_0_24px_rgba(255,255,255,0.95)]"
                />
              </div>
            )}

            {/* Phase 2: YOGI Reveal */}
            {phase === "yogi" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05, filter: "blur(6px)" }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center justify-center gap-2 sm:gap-4"
              >
                {"YOGI".split("").map((char, i) => (
                  <motion.span
                    key={`yogi-${char}-${i}`}
                    initial={{ opacity: 0, y: 25, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{
                      duration: 0.35,
                      delay: i * 0.08,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="metallic-chrome text-6xl sm:text-8xl md:text-9xl font-black tracking-tight"
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.div>
            )}

            {/* Phase 3: YOGENDER Reveal (instead of portfolio) */}
            {(phase === "yogender" || phase === "complete") && (
              <motion.div
                initial={{ opacity: 0, scale: 0.94, filter: "blur(8px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center text-center"
              >
                <div className="flex items-center justify-center gap-1 sm:gap-2">
                  {"YOGENDER".split("").map((char, i) => (
                    <motion.span
                      key={`yogender-${char}-${i}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: i * 0.04,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="metallic-chrome text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight uppercase"
                    >
                      {char}
                    </motion.span>
                  ))}
                </div>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                  className="mt-3 text-xs sm:text-sm tracking-[0.35em] text-white/60 uppercase font-medium"
                >
                  Full-Stack &amp; AI Systems Engineer
                </motion.p>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
