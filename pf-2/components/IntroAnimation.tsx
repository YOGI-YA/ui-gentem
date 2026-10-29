"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface IntroAnimationProps {
  onComplete?: () => void;
}

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  // Sequence:
  // "bounce": dot bounces
  // "stem_fall": YOG appears, stem of 'i' tilts/falls down diagonally
  // "stand_yogi": stem stands back upright to complete YOGI
  // "yogender": YOGI transitions into YOGENDER
  // "complete": fade out into site
  const [phase, setPhase] = useState<"bounce" | "stem_fall" | "stand_yogi" | "yogender" | "complete">("bounce");
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // 0ms -> 800ms: Dot drops & bounces
    const t1 = setTimeout(() => {
      setPhase("stem_fall");
    }, 800);

    // 800ms -> 1700ms: Stem tilts/falls down next to YOG, then stands upright
    const t2 = setTimeout(() => {
      setPhase("stand_yogi");
    }, 1600);

    // 1700ms -> 3000ms: YOGI reveals full YOGENDER
    const t3 = setTimeout(() => {
      setPhase("yogender");
    }, 2800);

    // 3000ms -> 4400ms: Complete and reveal Hero
    const t4 = setTimeout(() => {
      setPhase("complete");
      setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, 500);
    }, 4500);

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
      clearTimeout(t4);
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
          exit={{ opacity: 0, filter: "blur(12px)" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#070708] select-none overflow-hidden"
        >
          {/* Subtle ambient lighting */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="h-[450px] w-[650px] rounded-full bg-gradient-to-b from-white/10 via-slate-400/5 to-transparent blur-[130px] opacity-60" />
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
                  duration: 0.8,
                  times: [0, 0.45, 0.65, 0.82, 0.92, 1],
                  ease: "easeOut",
                }}
                className="w-5 h-5 rounded-full bg-white shadow-[0_0_25px_rgba(255,255,255,0.95)]"
              />
            )}

            {/* Phases: stem_fall & stand_yogi -> forming YOGI */}
            {(phase === "stem_fall" || phase === "stand_yogi") && (
              <div className="flex items-baseline justify-center">
                {/* Y - O - G */}
                <motion.div
                  initial={{ opacity: 0, x: -20, filter: "blur(8px)" }}
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
                  {/* Stem of 'I' that tilts / falls down and then stands up */}
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
              </div>
            )}

            {/* Phase 3: Transition from YOGI into full YOGENDER */}
            {(phase === "yogender" || phase === "complete") && (
              <motion.div
                initial={{ opacity: 0, scale: 0.94, filter: "blur(8px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center text-center"
              >
                <div className="flex items-center justify-center gap-1 sm:gap-2">
                  {"YOGENDER".split("").map((char, i) => (
                    <motion.span
                      key={`char-${char}-${i}`}
                      initial={{ opacity: 0, y: 22 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.35,
                        delay: i * 0.04,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="metallic-chrome text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight uppercase leading-none"
                    >
                      {char}
                    </motion.span>
                  ))}
                </div>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                  className="mt-4 text-xs sm:text-sm tracking-[0.35em] text-white/60 uppercase font-medium"
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
