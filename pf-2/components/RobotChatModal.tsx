"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUp,
  Briefcase,
  Code2,
  FolderGit2,
  Mail,
  RotateCcw,
  X,
} from "lucide-react";
import FormattedChatMessage from "@/components/FormattedChatMessage";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface RobotChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ACCENT = "#E8B04A";
const EMAIL = "yogender.tech@gmail.com";

const INITIAL: Message[] = [
  {
    role: "assistant",
    content:
      "Hi, I'm Yogender's AI assistant. Ask me about his experience, tech stack, projects, or how to work with him.",
  },
];

const SUGGESTIONS = [
  { icon: Code2, label: "Tech stack", prompt: "What is Yogender's tech stack?" },
  {
    icon: Briefcase,
    label: "Experience",
    prompt: "Tell me about his work at ICFAI Group",
  },
  {
    icon: FolderGit2,
    label: "Projects",
    prompt: "What projects has he built?",
  },
  { icon: Mail, label: "Hire him", prompt: "How can I contact or hire him?" },
];

export default function RobotChatModal({ isOpen, onClose }: RobotChatModalProps) {
  const reduce = !!useReducedMotion();
  const [messages, setMessages] = useState<Message[]>(INITIAL);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeModel, setActiveModel] = useState("Groq");
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (isOpen) endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, isOpen]);

  // Focus input, lock page scroll, close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => inputRef.current?.focus(), 350);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  const handleSend = useCallback(
    async (textToSend?: string) => {
      const text = (textToSend ?? input).trim();
      if (!text || loading) return;

      const next: Message[] = [...messages, { role: "user", content: text }];
      setMessages(next);
      setInput("");
      setLoading(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: next }),
        });
        const data = await res.json();

        if (data.reply) {
          setMessages((p) => [...p, { role: "assistant", content: data.reply }]);
          if (data.model) {
            setActiveModel(data.isGroq ? `Groq · ${data.model}` : data.model);
          }
        } else {
          setMessages((p) => [
            ...p,
            {
              role: "assistant",
              content: `I couldn't reach the server right now. Please try again, or email **${EMAIL}** directly.`,
            },
          ]);
        }
      } catch {
        setMessages((p) => [
          ...p,
          {
            role: "assistant",
            content: `Network error. Please check your connection, or email **${EMAIL}** directly.`,
          },
        ]);
      } finally {
        setLoading(false);
        inputRef.current?.focus();
      }
    },
    [input, loading, messages]
  );

  const reset = () => {
    if (loading) return;
    setMessages(INITIAL);
    setInput("");
  };

  const showSuggestions = messages.length === 1 && !loading;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[120] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-4"
        >
          <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

          {/* Animated gradient border */}
          <motion.div
            role="dialog"
            data-lenis-prevent
            aria-modal="true"
            aria-label="Chat with Yogender's AI assistant"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="relative z-10 h-[90svh] w-full max-w-[520px] overflow-hidden rounded-t-[28px] p-px shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)] sm:h-[660px] sm:rounded-[28px]"
          >
            <div className="absolute inset-0 bg-white/10" />
            {!reduce && (
              <motion.div
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 aspect-square w-[160%] -translate-x-1/2 -translate-y-1/2"
                style={{
                  background: `conic-gradient(from 0deg, transparent 0 62%, ${ACCENT} 82%, transparent 100%)`,
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 9, ease: "linear", repeat: Infinity }}
              />
            )}

            {/* Panel */}
            <div className="relative flex h-full flex-col overflow-hidden rounded-t-[27px] bg-[#0a0b0f] sm:rounded-[27px]">
              {/* Ambient glow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[120%] -translate-x-1/2 rounded-full blur-3xl"
                style={{ background: `${ACCENT}14` }}
              />

              {/* Header */}
              <header className="relative flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold text-neutral-950"
                      style={{
                        background: `linear-gradient(135deg, ${ACCENT}, #f6d58f)`,
                      }}
                    >
                      YV
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0a0b0f] bg-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold tracking-tight text-white">
                      Yogender Verma
                    </h3>
                    <p className="text-xs text-zinc-400">
                      AI assistant · Open to opportunities
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={reset}
                    disabled={loading || messages.length === 1}
                    aria-label="Clear conversation"
                    title="Clear conversation"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-30"
                  >
                    <RotateCcw size={15} />
                  </button>
                  <button
                    onClick={onClose}
                    aria-label="Close chat"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <X size={18} />
                  </button>
                </div>
              </header>

              {/* Messages */}
              <div
                data-lenis-prevent
                data-lenis-prevent-wheel
                data-lenis-prevent-touch
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                className="no-scrollbar relative min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain px-5 py-6"
                style={{ touchAction: "pan-y", WebkitOverflowScrolling: "touch" }}
              >
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={reduce ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`min-w-0 max-w-[88%] break-words px-4 py-3 text-sm leading-relaxed ${
                        m.role === "user"
                          ? "whitespace-pre-wrap rounded-2xl rounded-br-md font-medium text-neutral-950"
                          : "rounded-2xl rounded-bl-md border border-white/[0.08] bg-white/[0.04] text-zinc-100"
                      }`}
                      style={
                        m.role === "user" ? { background: ACCENT } : undefined
                      }
                    >
                      {m.role === "assistant" ? (
                        <FormattedChatMessage content={m.content} />
                      ) : (
                        m.content
                      )}
                    </div>
                  </motion.div>
                ))}

                {/* Suggestions: only before the first question */}
                {showSuggestions && (
                  <motion.div
                    initial={reduce ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.5 }}
                    className="grid grid-cols-2 gap-2.5 pt-2"
                  >
                    {SUGGESTIONS.map(({ icon: Icon, label, prompt }) => (
                      <button
                        key={label}
                        onClick={() => handleSend(prompt)}
                        className="group flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5 text-left transition-all duration-300 hover:border-[#E8B04A]/50 hover:bg-white/[0.06]"
                      >
                        <Icon
                          size={16}
                          className="shrink-0 text-zinc-400 transition-colors group-hover:text-[#E8B04A]"
                        />
                        <span className="text-[13px] font-medium text-zinc-200">
                          {label}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}

                {loading && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-white/[0.08] bg-white/[0.04] px-4 py-3.5">
                      {[0, 0.15, 0.3].map((d) => (
                        <span
                          key={d}
                          className="h-1.5 w-1.5 animate-bounce rounded-full"
                          style={{ background: ACCENT, animationDelay: `${d}s` }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={endRef} />
              </div>

              {/* Input */}
              <div className="relative border-t border-white/[0.07] px-4 pb-4 pt-3">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-1.5 pl-4 transition-colors focus-within:border-[#E8B04A]/50"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask anything about Yogender..."
                    disabled={loading}
                    aria-label="Your message"
                    className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    aria-label="Send message"
                    className="flex h-9 w-9 items-center justify-center rounded-xl text-neutral-950 transition-all hover:brightness-110 active:scale-95 disabled:opacity-30"
                    style={{ background: ACCENT }}
                  >
                    <ArrowUp size={17} strokeWidth={2.5} />
                  </button>
                </form>
                <p className="mt-2.5 text-center text-[10px] tracking-wide text-zinc-600">
                  AI-generated answers may be inaccurate · {activeModel}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}