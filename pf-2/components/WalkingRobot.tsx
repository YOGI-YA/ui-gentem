"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Play, Pause, Sparkles } from "lucide-react";
import RobotChatModal from "@/components/RobotChatModal";

export default function WalkingRobot() {
  const [isPatrolling, setIsPatrolling] = useState(true);
  const [direction, setDirection] = useState<1 | -1>(1); // 1 = right, -1 = left
  const [posX, setPosX] = useState(60);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [speechIndex, setSpeechIndex] = useState(0);
  const [showSpeech, setShowSpeech] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const SPEECHES = [
    "Hey! Click me to chat about Yogender's work!",
    "Groq Llama 3.3 integration ready!",
    "Ask me about his AI Agents & Next.js apps!",
    "Watch me walk! Toggle patrol anytime.",
  ];

  // Rotate speech every 6 seconds
  useEffect(() => {
    const speechInterval = setInterval(() => {
      setShowSpeech(false);
      setTimeout(() => {
        setSpeechIndex((prev) => (prev + 1) % SPEECHES.length);
        setShowSpeech(true);
      }, 400);
    }, 7000);
    return () => clearInterval(speechInterval);
  }, [SPEECHES.length]);

  // Track mouse for eye pupil tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Patrol walking loop
  useEffect(() => {
    if (!isPatrolling) return;

    const interval = setInterval(() => {
      setPosX((curr) => {
        const screenW = typeof window !== "undefined" ? window.innerWidth : 1200;
        const maxW = Math.max(260, screenW - 140);
        const minW = 40;

        if (direction === 1 && curr >= maxW) {
          setDirection(-1);
          return maxW;
        } else if (direction === -1 && curr <= minW) {
          setDirection(1);
          return minW;
        }
        return curr + direction * 2.2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [isPatrolling, direction]);

  return (
    <>
      <RobotChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* Walking Robot Container */}
      <div
        className="fixed bottom-3 z-[90] pointer-events-none select-none"
        style={{
          left: isPatrolling ? `${posX}px` : "auto",
          right: isPatrolling ? "auto" : "28px",
          transition: isPatrolling ? "none" : "all 0.5s ease-out",
        }}
      >
        <div className="relative pointer-events-auto flex flex-col items-center">
          {/* Floating Speech Bubble */}
          <AnimatePresence>
            {showSpeech && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.9 }}
                onClick={() => setIsChatOpen(true)}
                className="absolute -top-14 mb-2 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-[#0e1117]/95 text-white backdrop-blur-md shadow-[0_4px_20px_rgba(16,185,129,0.2)] cursor-pointer whitespace-nowrap text-xs hover:border-emerald-500/60 transition-colors"
              >
                <Sparkles size={11} className="text-emerald-400 shrink-0" />
                <span className="font-medium tracking-wide">{SPEECHES[speechIndex]}</span>
                {/* Speech tail */}
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[#0e1117] border-b border-r border-emerald-500/30 rotate-45" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Robot Figure */}
          <motion.div
            onClick={() => setIsChatOpen(true)}
            className="group relative flex flex-col items-center cursor-pointer"
            style={{ transform: `scaleX(${direction})` }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Antenna with pulsing indicator */}
            <div className="flex flex-col items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-ping" />
              <div className="w-[2px] h-3 bg-gradient-to-t from-slate-400 to-emerald-400" />
            </div>

            {/* Robot Head */}
            <div className="relative w-12 h-9 rounded-lg bg-gradient-to-b from-[#2a303c] via-[#1a202c] to-[#0f141c] border border-slate-600/80 shadow-md flex items-center justify-center p-1">
              {/* Ears / Side Bolts */}
              <div className="absolute -left-1.5 w-1 h-3 rounded-l bg-slate-500" />
              <div className="absolute -right-1.5 w-1 h-3 rounded-r bg-slate-500" />

              {/* Visor / Eye Screen */}
              <div className="w-full h-4 rounded bg-[#05070a] border border-cyan-500/40 shadow-inner flex items-center justify-center overflow-hidden">
                {/* Animated Eye Glow Pupils */}
                <motion.div
                  animate={{
                    x: direction === 1 ? 3 : -3,
                    scaleX: [1, 1, 0.2, 1], // Blink cycle
                  }}
                  transition={{
                    scaleX: { duration: 3.5, repeat: Infinity, times: [0, 0.94, 0.96, 1] },
                    x: { duration: 0.3 },
                  }}
                  className="flex gap-2"
                >
                  <div className="w-2.5 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                  <div className="w-2.5 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                </motion.div>
              </div>
            </div>

            {/* Neck Joint */}
            <div className="w-3 h-1 bg-slate-600 rounded-sm" />

            {/* Robot Torso with Cyber Arc Reactor */}
            <div className="relative w-11 h-10 rounded-md bg-gradient-to-b from-[#222834] via-[#151a24] to-[#0d1017] border border-slate-600/80 shadow-lg flex flex-col items-center justify-center">
              {/* Glowing Arc Core */}
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] border border-emerald-300 animate-pulse flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>

              {/* Arm Left (swinging) */}
              <motion.div
                animate={
                  isPatrolling
                    ? { rotate: [-24, 24, -24] }
                    : { rotate: [-5, 5, -5] }
                }
                transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "top center" }}
                className="absolute -left-2 top-1.5 w-1.5 h-6 rounded-full bg-slate-500 border border-slate-700 shadow-sm"
              />

              {/* Arm Right (swinging opposite) */}
              <motion.div
                animate={
                  isPatrolling
                    ? { rotate: [24, -24, 24] }
                    : { rotate: [5, -5, 5] }
                }
                transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "top center" }}
                className="absolute -right-2 top-1.5 w-1.5 h-6 rounded-full bg-slate-500 border border-slate-700 shadow-sm"
              />
            </div>

            {/* Robot Bipedal Walking Legs */}
            <div className="flex gap-2.5 -mt-0.5">
              {/* Left Leg */}
              <motion.div
                animate={
                  isPatrolling
                    ? {
                        rotate: [28, -28, 28],
                        y: [0, -3, 0],
                      }
                    : { rotate: [0, 0, 0] }
                }
                transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "top center" }}
                className="flex flex-col items-center"
              >
                <div className="w-2 h-4 bg-slate-600 rounded-sm" />
                <div className="w-3.5 h-1.5 bg-slate-400 rounded-sm shadow-sm" />
              </motion.div>

              {/* Right Leg */}
              <motion.div
                animate={
                  isPatrolling
                    ? {
                        rotate: [-28, 28, -28],
                        y: [-3, 0, -3],
                      }
                    : { rotate: [0, 0, 0] }
                }
                transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "top center" }}
                className="flex flex-col items-center"
              >
                <div className="w-2 h-4 bg-slate-600 rounded-sm" />
                <div className="w-3.5 h-1.5 bg-slate-400 rounded-sm shadow-sm" />
              </motion.div>
            </div>
          </motion.div>

          {/* Quick Patrol Controls Pill */}
          <div className="mt-1 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/70 border border-white/10 text-[9px] text-white/70 backdrop-blur-sm">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsPatrolling(!isPatrolling);
              }}
              title={isPatrolling ? "Pause Walking" : "Resume Walking"}
              className="hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              {isPatrolling ? <Pause size={9} /> : <Play size={9} />}
              <span>{isPatrolling ? "Patrol" : "Station"}</span>
            </button>
            <span className="text-white/20">&bull;</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsChatOpen(true);
              }}
              className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-0.5"
            >
              <MessageSquare size={9} />
              <span>AI Chat</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
