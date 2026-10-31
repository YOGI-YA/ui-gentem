"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Terminal, User, Sparkles, Zap } from "lucide-react";
import FormattedChatMessage from "@/components/FormattedChatMessage";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface RobotChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SUGGESTIONS = [
  "What is Yogender's tech stack?",
  "Tell me about his work at ICFAI Group",
  "What projects has he built?",
  "How can I contact or hire him?",
];

export default function RobotChatModal({ isOpen, onClose }: RobotChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hi there! 👋 Welcome to Yogender's portfolio console powered by **Groq**.\n\nFeel free to ask about his full-stack work at **ICFAI Group**, previous roles, **Next.js & TypeScript** projects, or how to collaborate!`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeModel, setActiveModel] = useState<string>("Groq Qwen 27B");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();
      if (data.reply) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
        if (data.model) {
          setActiveModel(data.isGroq ? `Groq (${data.model})` : data.model);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Sorry, I couldn't reach the server right now. Please try again or reach out directly via email at **yogender.tech@gmail.com**.",
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Network error. Please check your internet connection or email **yogender.tech@gmail.com** directly.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md"
        >
          {/* Backdrop click to close */}
          <div className="absolute inset-0" onClick={onClose} />

          {/* Spider Crazy Shape Container */}
          <motion.div
            initial={{ scale: 0.92, y: 35, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, y: 35, opacity: 0 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            style={{
              clipPath:
                "polygon(0 22px, 22px 0, calc(100% - 22px) 0, 100% 22px, 100% calc(100% - 22px), calc(100% - 22px) 100%, 22px 100%, 0 calc(100% - 22px))",
            }}
            className="relative z-10 flex flex-col w-full max-w-lg h-[86vh] sm:h-[620px] bg-[#0c0d12] border border-white/20 shadow-[0_0_60px_rgba(0,0,0,0.9),0_0_30px_rgba(255,255,255,0.06)] overflow-hidden"
          >
            {/* Subtle Spider Web Background Watermark */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.04]">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="spider-web-modal" width="100" height="100" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="100" y2="100" stroke="#ffffff" strokeWidth="1" />
                    <line x1="100" y1="0" x2="0" y2="100" stroke="#ffffff" strokeWidth="1" />
                    <line x1="50" y1="0" x2="50" y2="100" stroke="#ffffff" strokeWidth="0.5" />
                    <line x1="0" y1="50" x2="100" y2="50" stroke="#ffffff" strokeWidth="0.5" />
                    <circle cx="50" cy="50" r="25" fill="none" stroke="#ffffff" strokeWidth="0.8" />
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#ffffff" strokeWidth="0.8" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#spider-web-modal)" />
              </svg>
            </div>

            {/* Header: Clean, standard developer console */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#12131a] relative z-10">
              <div className="flex items-center gap-3">
                <div
                  style={{
                    clipPath:
                      "polygon(0 6px, 6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px))",
                  }}
                  className="relative flex items-center justify-center w-10 h-10 bg-white/10 border border-white/20 text-white"
                >
                  <Terminal size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-white tracking-wide">
                      Yogender Verma
                    </h3>
                    <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 font-mono">
                      <Zap size={10} />
                      {activeModel}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-mono">
                    Himachal, India &bull; Open to Work &amp; Opportunities
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 no-scrollbar relative z-10">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.role === "assistant" && (
                    <div
                      style={{
                        clipPath:
                          "polygon(0 4px, 4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px))",
                      }}
                      className="shrink-0 flex items-center justify-center w-7 h-7 bg-white/10 text-white border border-white/20 mt-1"
                    >
                      <Terminal size={13} />
                    </div>
                  )}

                  <div
                    style={{
                      clipPath:
                        "polygon(0 10px, 10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px))",
                    }}
                    className={`max-w-[85%] px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-white text-zinc-950 font-medium whitespace-pre-wrap"
                        : "bg-[#14151e] text-zinc-100 border border-white/15 shadow-md"
                    }`}
                  >
                    {m.role === "assistant" ? (
                      <FormattedChatMessage content={m.content} />
                    ) : (
                      m.content
                    )}
                  </div>

                  {m.role === "user" && (
                    <div
                      style={{
                        clipPath:
                          "polygon(0 4px, 4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px))",
                      }}
                      className="shrink-0 flex items-center justify-center w-7 h-7 bg-white/20 text-white border border-white/30 mt-1"
                    >
                      <User size={13} />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-3">
                  <div
                    style={{
                      clipPath:
                        "polygon(0 4px, 4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px))",
                    }}
                    className="shrink-0 flex items-center justify-center w-7 h-7 bg-white/10 text-white border border-white/20"
                  >
                    <Terminal size={13} />
                  </div>
                  <div
                    style={{
                      clipPath:
                        "polygon(0 8px, 8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px))",
                    }}
                    className="px-4 py-3 bg-[#14151e] border border-white/15 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
                    <span className="text-[11px] font-mono text-zinc-400 ml-1.5">
                      Querying Groq...
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions Chips */}
            <div className="px-4 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar border-t border-white/10 bg-[#0f1016] relative z-10">
              <Sparkles size={12} className="text-zinc-400 shrink-0 ml-1" />
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(s)}
                  disabled={loading}
                  style={{
                    clipPath:
                      "polygon(0 4px, 4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px))",
                  }}
                  className="shrink-0 text-[11px] px-3 py-1 bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white border border-white/15 transition-colors cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2 p-3 sm:p-4 border-t border-white/10 bg-[#0a0b0e] relative z-10"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Yogender's experience, tech stack, or projects..."
                disabled={loading}
                style={{
                  clipPath:
                    "polygon(0 6px, 6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px))",
                }}
                className="flex-1 bg-white/5 border border-white/15 px-4 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/40 transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                style={{
                  clipPath:
                    "polygon(0 6px, 6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px))",
                }}
                className="flex items-center justify-center w-10 h-10 bg-white text-zinc-950 hover:bg-zinc-200 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 transition-all font-semibold cursor-pointer"
              >
                <Send size={15} />
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
