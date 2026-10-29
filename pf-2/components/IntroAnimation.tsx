"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface IntroAnimationProps {
  onComplete?: () => void;
}

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  // Sequence:
  // "bounce": solo dot drops and bounces
  // "stem_fall": YOG appears, stem of 'I' falls tilted down
  // "stand_yogi": stem springs upright to complete YOGI
  // "complete": smooth fade out into hero
  const [phase, setPhase] = useState<"bounce" | "stem_fall" | "stand_yogi" | "complete">("bounce");
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // 0ms -> 750ms: Dot drops & bounces
    const t1 = setTimeout(() => {
      setPhase("stem_fall");
    }, 750);

    // 750ms -> 1500ms: Stem tilts/falls down next to YOG, then stands upright
    const t2 = setTimeout(() => {
      setPhase("stand_yogi");
    }, 1450);

    // 1450ms -> 2900ms: YOGI stands complete, holds, then smooth transition to Hero
    const t3 = setTimeout(() => {
      setPhase("complete");
      setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, 500);
    }, 2900);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPhase("complete");
        setTimeout(() => {
          setVisible(false);
          onComplete?.();
        }, 150);
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
    }, 150);
  };

  if (!visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(10px)" }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#070708] select-none overflow-hidden"
        >
          {/* Subtle ambient lighting */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="h-[450px] w-[650px] rounded-full bg-gradient-to-b from-white/10 via-slate-400/5 to-transparent blur-[130px] opacity-50" />
          </div>

          {/* Minimal Skip Pill */}
          <button
            onClick={skip}
            className="absolute top-6 right-6 z-20 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[11px] font-mono tracking-widest text-white/40 hover:text-white hover:border-white/20 transition-all uppercase"
          >
            Skip [ESC]
          </button>

          {/* Animation Center Stage */}
          <div className="relative flex items-center justify-center min-h-[180px] px-6">
            {/* Solo Dot bouncing in phase "bounce" */}
            {phase === "bounce" && (
              <motion.div
                initial={{ y: -160, opacity: 0 }}
                animate={{
                  y: [-160, 0, -50, 0, -18, 0],
                  scaleX: [0.85, 1.4, 0.95, 1.25, 0.98, 1],
                  scaleY: [1.15, 0.6, 1.05, 0.75, 1.02, 1],
                  opacity: 1,
                }}
                transition={{
                  duration: 0.75,
                  times: [0, 0.45, 0.65, 0.82, 0.92, 1],
                  ease: "easeOut",
                }}
                className="w-5 h-5 rounded-full bg-white shadow-[0_0_25px_rgba(255,255,255,0.95)]"
              />
            )}

            {/* Phases: stem_fall & stand_yogi -> forming just YOGI */}
            {(phase === "stem_fall" || phase === "stand_yogi" || phase === "complete") && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.03, filter: "blur(10px)" }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-baseline justify-center"
              >
                {/* Y - O - G */}
                <motion.div
                  initial={{ opacity: 0, x: -22, filter: "blur(8px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-baseline gap-2 sm:gap-4 mr-2 sm:mr-3"
                >
                  {"YOG".split("").map((char, idx) => (
                    <span
                      key={idx}
                      className="metallic-chrome text-6xl sm:text-8xl md:text-9xl font-black tracking-tight leading-none"
                    >
                      {char}
                    </span>
                  ))}
                </motion.div>

                {/* Animated 'I' of YOGI: Dot and Stem that falls down and then stands upright */}
                <div className="relative flex flex-col items-center">
                  {/* Stem of 'I' that tilts / falls down and then springs upright */}
                  <motion.div
                    initial={{ rotate: -55, y: 15, x: -10, originX: 0.5, originY: 1 }}
                    animate={
                      phase === "stem_fall"
                        ? { rotate: -55, y: 15, x: -10 }
                        : {
                            rotate: 0,
                            y: 0,
                            x: 0,
                            transition: {
                              type: "spring",
                              damping: 12,
                              stiffness: 220,
                            },
                          }
                    }
                    className="w-4 sm:w-6 md:w-7 h-14 sm:h-20 md:h-24 rounded-sm bg-gradient-to-b from-white via-slate-200 to-slate-400 shadow-[0_0_20px_rgba(255,255,255,0.6)]"
                  />

                  {/* Dot of 'I' */}
                  <motion.div
                    animate={
                      phase === "stem_fall"
                        ? { y: 8, scale: 1.1 }
                        : {
                            y: -8,
                            scale: 1,
                            transition: {
                              type: "spring",
                              damping: 14,
                              stiffness: 240,
                            },
                          }
                    }
                    className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.9)] order-first mb-2"
                  />
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
