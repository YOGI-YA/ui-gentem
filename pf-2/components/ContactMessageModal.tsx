"use client";

import { FormEvent, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Send, X } from "lucide-react";

interface ContactMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MessageResponse {
  success?: boolean;
  message?: string;
  token?: string;
  devCode?: string;
}

export default function ContactMessageModal({
  isOpen,
  onClose,
}: ContactMessageModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [code, setCode] = useState("");
  const [token, setToken] = useState("");
  const [devCode, setDevCode] = useState("");
  const [awaitingCode, setAwaitingCode] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch("/api/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          awaitingCode
            ? { action: "verify-and-send", name, email, message, code, token }
            : { action: "send-code", name, email }
        ),
      });
      const data = (await response.json()) as MessageResponse;

      if (!response.ok || !data.success) {
        setStatus({
          success: false,
          message: data.message || "Unable to process your request. Please try again.",
        });
        return;
      }

      if (awaitingCode) {
        setSent(true);
        setStatus({ success: true, message: data.message || "Your message was sent." });
      } else if (data.token) {
        setToken(data.token);
        setDevCode(data.devCode || "");
        setAwaitingCode(true);
        setStatus({ success: true, message: data.message || "Verification code sent." });
      } else {
        setStatus({ success: false, message: "The server did not return a verification token." });
      }
    } catch {
      setStatus({
        success: false,
        message: "Could not reach the message service. Please check your connection and try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[130] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-message-title"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0e0f12] p-6 text-white shadow-2xl"
          >
            <div className="mb-5 flex items-start justify-between">
              <div>
                <p className="text-[10px] tracking-[0.25em] text-gray-400 uppercase">
                  Get in touch
                </p>
                <h2 id="contact-message-title" className="mt-2 text-xl font-medium">
                  {sent ? "Message sent" : "Say hello"}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close message dialog"
                className="rounded-full p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {sent ? (
              <div className="rounded-xl border border-grey-500/20 bg-grey-500/10 p-4 text-sm text-emerald-200">
                <div className="mb-2 flex items-center gap-2 font-medium">
                  <Check size={16} />
                  Thanks for reaching out.
                </div>
                {status?.message}
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-5 block w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-85"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                {!awaitingCode ? (
                  <>
                    <input
                      required
                      maxLength={50}
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Your name"
                      autoComplete="name"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition-colors placeholder:text-white/40 focus:border-emerald-500/60"
                    />
                    <input
                      required
                      type="email"
                      maxLength={80}
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="Your email"
                      autoComplete="email"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition-colors placeholder:text-white/40 focus:border-emerald-500/60"
                    />
                    <textarea
                      required
                      maxLength={1000}
                      rows={4}
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      placeholder="What would you like to talk about?"
                      className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition-colors placeholder:text-white/40 focus:border-emerald-500/60"
                    />
                  </>
                ) : (
                  <>
                    <p className="text-sm leading-relaxed text-white/65">
                      Enter the six-digit verification code sent to <strong className="text-white">{email}</strong>.
                    </p>
                    <input
                      required
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      pattern="[0-9]{6}"
                      maxLength={6}
                      value={code}
                      onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="6-digit code"
                      aria-label="Verification code"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm tracking-[0.3em] outline-none transition-colors placeholder:tracking-normal placeholder:text-white/40 focus:border-emerald-500/60"
                    />
                    {devCode && (
                      <p className="text-xs text-amber-300/80">
                        Development code: <strong>{devCode}</strong>
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setAwaitingCode(false);
                        setCode("");
                        setToken("");
                        setDevCode("");
                        setStatus(null);
                      }}
                      className="text-xs text-white/55 underline underline-offset-4 hover:text-white"
                    >
                      Change name or email
                    </button>
                  </>
                )}

                {status && (
                  <p
                    role="status"
                    className={`rounded-lg px-3 py-2 text-xs ${
                      status.success
                        ? "bg-emerald-500/10 text-emerald-300"
                        : "bg-red-500/10 text-red-300"
                    }`}
                  >
                    {status.message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send size={15} />
                  {loading
                    ? "Please wait..."
                    : awaitingCode
                      ? "Verify and send message"
                      : "Continue"}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
