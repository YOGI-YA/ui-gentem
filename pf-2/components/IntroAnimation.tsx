"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface IntroAnimationProps {
  onComplete?: () => void;
}

type AnimationPhase =
  | "sleeping"   // All letters lying down flat (180°), dot drops & bounces
  | "i_wakes"    // Stem of I snaps straight up (180° to 90°), dot settles on top
  | "g_wakes"    // Letter G wakes up (180° to 90°)
  | "o_wakes"    // Letter O wakes up (180° to 90°)
  | "y_wakes"    // Letter Y wakes up (180° to 90°)
  | "all_awake"  // Entire YOGI complete and awake with chrome gleam & subtitle
  | "complete";  // Smooth transition to hero

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [phase, setPhase] = useState<AnimationPhase>("sleeping");
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // 0ms -> 950ms: Dot drops & bounces while all letters sleep flat
    const t1 = setTimeout(() => {
      setPhase("i_wakes");
    }, 950);

    // 950ms -> 1500ms: I gets straight up (180° to 90°)
    const t2 = setTimeout(() => {
      setPhase("g_wakes");
    }, 1500);

    // 1500ms -> 1950ms: G wakes up
    const t3 = setTimeout(() => {
      setPhase("o_wakes");
    }, 1950);

    // 1950ms -> 2400ms: O wakes up
    const t4 = setTimeout(() => {
      setPhase("y_wakes");
    }, 2400);

    // 2400ms -> 2850ms: Y wakes up, all awake
    const t5 = setTimeout(() => {
      setPhase("all_awake");
    }, 2850);

    // 2850ms -> 3750ms: Hold awake proudly, then complete
    const t6 = setTimeout(() => {
      setPhase("complete");
      setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, 550);
    }, 3750);

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
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
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

  const isIAwake = phase !== "sleeping";
  const isGAwake =
    phase === "g_wakes" ||
    phase === "o_wakes" ||
    phase === "y_wakes" ||
    phase === "all_awake" ||
    phase === "complete";
  const isOAwake =
    phase === "o_wakes" ||
    phase === "y_wakes" ||
    phase === "all_awake" ||
    phase === "complete";
  const isYAwake =
    phase === "y_wakes" || phase === "all_awake" || phase === "complete";
  const isAllAwake = phase === "all_awake" || phase === "complete";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(12px)" }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#070708] select-none overflow-hidden"
        >
          {/* Ambient Lighting */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="h-[450px] w-[650px] rounded-full bg-gradient-to-b from-white/10 via-slate-400/5 to-transparent blur-[130px] opacity-50" />
          </div>

          {/* Minimal Skip Pill */}
          <button
            onClick={skip}
            className="absolute top-6 right-6 z-20 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[11px] font-mono tracking-widest text-white/40 hover:text-white hover:border-white/20 transition-all uppercase cursor-pointer"
          >
            Skip [ESC]
          </button>

          {/* Animation Center Stage */}
          <div className="relative flex flex-col items-center justify-center min-h-[220px] px-6">
            {/* Illuminated Baseline Floor */}
            <div className="relative flex items-end justify-center gap-4 sm:gap-6 md:gap-8 pb-4">
              <div className="absolute bottom-4 left-[-40px] right-[-40px] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

              {/* Letter Y */}
              <div className="relative flex items-end justify-center">
                <motion.span
                  initial={{ rotate: -88, y: 18, opacity: 0.4 }}
                  animate={
                    isYAwake
                      ? {
                          rotate: 0,
                          y: 0,
                          opacity: 1,
                          filter: "drop-shadow(0 0 25px rgba(255,255,255,0.75))",
                        }
                      : {
                          rotate: -88,
                          y: 18,
                          opacity: 0.4,
                          filter: "drop-shadow(0 0 0px rgba(255,255,255,0))",
                        }
                  }
                  transition={{
                    type: "spring",
                    stiffness: 240,
                    damping: 15,
                    mass: 0.8,
                  }}
                  style={{ transformOrigin: "20% 95%" }}
                  className="metallic-chrome text-6xl sm:text-8xl md:text-9xl font-black tracking-tight leading-none"
                >
                  Y
                </motion.span>
              </div>

              {/* Letter O */}
              <div className="relative flex items-end justify-center">
                <motion.span
                  initial={{ rotate: -88, y: 18, opacity: 0.4 }}
                  animate={
                    isOAwake
                      ? {
                          rotate: 0,
                          y: 0,
                          opacity: 1,
                          filter: "drop-shadow(0 0 25px rgba(255,255,255,0.75))",
                        }
                      : {
                          rotate: -88,
                          y: 18,
                          opacity: 0.4,
                          filter: "drop-shadow(0 0 0px rgba(255,255,255,0))",
                        }
                  }
                  transition={{
                    type: "spring",
                    stiffness: 240,
                    damping: 15,
                    mass: 0.8,
                  }}
                  style={{ transformOrigin: "20% 95%" }}
                  className="metallic-chrome text-6xl sm:text-8xl md:text-9xl font-black tracking-tight leading-none"
                >
                  O
                </motion.span>
              </div>

              {/* Letter G */}
              <div className="relative flex items-end justify-center">
                <motion.span
                  initial={{ rotate: -88, y: 18, opacity: 0.4 }}
                  animate={
                    isGAwake
                      ? {
                          rotate: 0,
                          y: 0,
                          opacity: 1,
                          filter: "drop-shadow(0 0 25px rgba(255,255,255,0.75))",
                        }
                      : {
                          rotate: -88,
                          y: 18,
                          opacity: 0.4,
                          filter: "drop-shadow(0 0 0px rgba(255,255,255,0))",
                        }
                  }
                  transition={{
                    type: "spring",
                    stiffness: 240,
                    damping: 15,
                    mass: 0.8,
                  }}
                  style={{ transformOrigin: "20% 95%" }}
                  className="metallic-chrome text-6xl sm:text-8xl md:text-9xl font-black tracking-tight leading-none"
                >
                  G
                </motion.span>
              </div>

              {/* Letter I: Animated Dot & Stem */}
              <div className="relative flex flex-col items-center justify-end h-16 sm:h-24 md:h-28">
                {/* Dot of I */}
                <motion.div
                  initial={{ y: -160, opacity: 0 }}
                  animate={
                    phase === "sleeping"
                      ? {
                          y: [-160, 68, 16, 68, 45, 68],
                          scaleX: [0.85, 1.45, 0.95, 1.25, 0.98, 1],
                          scaleY: [1.15, 0.55, 1.05, 0.75, 1.02, 1],
                          opacity: 1,
                        }
                      : {
                          y: 0,
                          scaleX: 1,
                          scaleY: 1,
                          opacity: 1,
                          transition: {
                            type: "spring",
                            stiffness: 280,
                            damping: 14,
                          },
                        }
                  }
                  transition={
                    phase === "sleeping"
                      ? {
                          duration: 0.95,
                          times: [0, 0.42, 0.65, 0.82, 0.92, 1],
                          ease: "easeOut",
                        }
                      : undefined
                  }
                  className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 rounded-full bg-white shadow-[0_0_22px_rgba(255,255,255,0.95)] order-first mb-2"
                />

                {/* Stem of I (starts sleeping flat at -88°, springs upright to 0°) */}
                <motion.div
                  initial={{ rotate: -88, y: 18, opacity: 0.4 }}
                  animate={
                    isIAwake
                      ? {
                          rotate: 0,
                          y: 0,
                          opacity: 1,
                          boxShadow: "0 0 25px rgba(255,255,255,0.75)",
                        }
                      : {
                          rotate: -88,
                          y: 18,
                          opacity: 0.4,
                          boxShadow: "0 0 0px rgba(255,255,255,0)",
                        }
                  }
                  transition={{
                    type: "spring",
                    stiffness: 270,
                    damping: 14,
                    mass: 0.8,
                  }}
                  style={{ transformOrigin: "20% 95%" }}
                  className="w-4 sm:w-6 md:w-7 h-12 sm:h-18 md:h-22 rounded-sm bg-gradient-to-b from-white via-slate-200 to-slate-400"
                />
              </div>
            </div>

            {/* Subtitle Badge revealed when all awake */}
            {/* <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={isAllAwake ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.06] border border-white/10 backdrop-blur-md"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span className="text-[11px] font-mono tracking-[0.25em] text-zinc-300 uppercase">
                Yogender Verma &bull; Full-Stack Developer
              </span>
            </motion.div> */}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
