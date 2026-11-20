"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Share2,
  Check,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Clock,
  Calendar,
  Copy,
  AlertTriangle,
  Lightbulb,
  Info,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Article, articles, getArticleBySlug } from "@/lib/articles";

export default function ArticleReaderModal({
  slug,
  onClose,
  onSelectArticle,
}: {
  slug: string | null;
  onClose: () => void;
  onSelectArticle: (slug: string) => void;
}) {
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const contentContainerRef = useRef<HTMLDivElement>(null);

  const article = slug ? getArticleBySlug(slug) : null;
  const currentIndex = article ? articles.findIndex((a) => a.slug === article.slug) : -1;
  const prevArticle = currentIndex > 0 ? articles[currentIndex - 1] : null;
  const nextArticle = currentIndex >= 0 && currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null;

  // Handle ESC key to close modal
  useEffect(() => {
    if (!article) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [article, onClose]);

  // Lock body scroll and control background Lenis
  useEffect(() => {
    if (!article) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const lenis = (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis;
    lenis?.stop();

    return () => {
      document.body.style.overflow = originalOverflow;
      lenis?.start();
    };
  }, [article]);

  // Track reading progress inside modal container
  const handleScroll = () => {
    const el = contentContainerRef.current;
    if (!el) return;
    const totalScroll = el.scrollHeight - el.clientHeight;
    if (totalScroll <= 0) {
      setScrollProgress(0);
      return;
    }
    const currentProgress = (el.scrollTop / totalScroll) * 100;
    setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
  };

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  const handleShare = () => {
    if (!article) return;
    const url = typeof window !== "undefined"
      ? `${window.location.origin}/articles/${article.slug}`
      : `https://yogender.me/articles/${article.slug}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <AnimatePresence>
      {article && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          data-lenis-prevent
          data-lenis-prevent-wheel
          data-lenis-prevent-touch
          onWheel={(e) => e.stopPropagation()}
          className="fixed inset-0 z-[150] flex items-end justify-center bg-black/85 backdrop-blur-md md:items-center p-0 md:p-6"
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            data-lenis-prevent
            data-lenis-prevent-wheel
            data-lenis-prevent-touch
            initial={{ y: "100%", opacity: 0.8 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            ref={contentContainerRef}
            onScroll={handleScroll}
            className="relative flex flex-col h-[94svh] md:h-[88svh] w-full max-w-[960px] overflow-y-auto overscroll-contain rounded-t-3xl md:rounded-3xl bg-[#0b0d14] border border-white/10 shadow-2xl pb-16 text-foreground"
            style={{ touchAction: "pan-y", WebkitOverflowScrolling: "touch" }}
          >
            {/* Top Reading Progress Bar */}
            <div className="sticky top-0 left-0 right-0 z-40 h-1 bg-white/5 w-full">
              <motion.div
                className="h-full bg-gradient-to-r from-[#E8B04A] via-cyan-400 to-[#E8B04A]"
                style={{ width: `${scrollProgress}%` }}
              />
            </div>

            {/* Sticky Header Action Bar */}
            <header className="sticky top-1 z-30 flex items-center justify-between border-b border-white/10 bg-[#0b0d14]/90 px-5 py-3.5 backdrop-blur-lg md:px-8">
              <div className="flex items-center gap-2.5">
                <span
                  className="h-2 w-2 rounded-full animate-pulse"
                  style={{ backgroundColor: article.accentColor }}
                />
                <span className="font-mono text-xs tracking-[0.2em] uppercase text-white/90">
                  {article.category}
                </span>
                <span className="text-white/20">|</span>
                <span className="hidden items-center gap-1 font-mono text-xs text-muted sm:inline-flex">
                  <Clock size={12} />
                  {article.readTime}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Share Button */}
                <button
                  onClick={handleShare}
                  aria-label="Share article"
                  className="inline-flex h-9 items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 text-xs font-mono text-white/80 transition-colors hover:border-white/30 hover:text-white"
                >
                  {copiedLink ? (
                    <>
                      <Check size={13} className="text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 size={13} />
                      <span className="hidden sm:inline">Share</span>
                    </>
                  )}
                </button>

                {/* Open in Dedicated Page */}
                <Link
                  href={`/articles/${article.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open in full page"
                  className="inline-flex h-9 items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 text-xs font-mono text-white/80 transition-colors hover:border-white/30 hover:text-white"
                >
                  <ExternalLink size={13} />
                  <span className="hidden sm:inline">Full Page</span>
                </Link>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  aria-label="Close article"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition-colors hover:border-white/30 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
            </header>

            {/* Article Content Area */}
            <article className="mx-auto w-full max-w-[800px] px-5 sm:px-8 md:px-10 pt-8 pb-12">
              {/* Meta details */}
              <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar size={13} />
                  {article.date}
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={13} />
                  {article.readTime}
                </span>
                <span>•</span>
                <span className="text-white/60">By Yogender Verma</span>
              </div>

              {/* Title & Subtitle */}
              <h1 className="mt-4 text-2xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white leading-[1.15]">
                {article.title}
              </h1>
              <p className="mt-4 text-base sm:text-lg text-muted/90 leading-relaxed font-normal">
                {article.subtitle}
              </p>

              {/* Tags */}
              <div className="mt-5 flex flex-wrap gap-1.5">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[11px] text-white/70"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Cover Image */}
              <div className="relative mt-8 h-[240px] sm:h-[360px] w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  sizes="(max-width: 960px) 100vw, 960px"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d14] via-transparent to-transparent opacity-60" />
              </div>

              {/* Executive Takeaways / TL;DR Box */}
              <div className="mt-10 rounded-2xl border border-white/15 bg-white/[0.02] p-6 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E8B04A]/20 text-[#E8B04A] text-xs font-mono">
                    ✓
                  </span>
                  <h3 className="font-mono text-xs tracking-[0.2em] text-[#E8B04A] uppercase font-semibold">
                    Key Architectural Takeaways
                  </h3>
                </div>
                <ul className="space-y-2.5">
                  {article.takeaways.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-white/80 leading-relaxed">
                      <span className="text-[#E8B04A] font-mono select-none mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Article Sections */}
              <div className="mt-12 space-y-12">
                {article.sections.map((section, sIdx) => (
                  <section key={sIdx} className="space-y-4">
                    <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-white border-b border-white/10 pb-2.5">
                      {section.heading}
                    </h2>

                    {section.subheading && (
                      <p className="text-sm font-mono text-white/60">
                        {section.subheading}
                      </p>
                    )}

                    <div className="space-y-3.5">
                      {section.paragraphs.map((p, pIdx) => (
                        <p key={pIdx} className="text-[15px] sm:text-base text-white/75 leading-relaxed">
                          {p}
                        </p>
                      ))}
                    </div>

                    {/* Callout Box */}
                    {section.callout && (
                      <div
                        className={`my-5 flex gap-3.5 rounded-xl border p-4.5 ${
                          section.callout.type === "warning"
                            ? "border-amber-500/30 bg-amber-500/[0.06] text-amber-200"
                            : section.callout.type === "tip"
                            ? "border-emerald-500/30 bg-emerald-500/[0.06] text-emerald-200"
                            : "border-blue-500/30 bg-blue-500/[0.06] text-blue-200"
                        }`}
                      >
                        <div className="shrink-0 mt-0.5">
                          {section.callout.type === "warning" && <AlertTriangle size={18} className="text-amber-400" />}
                          {section.callout.type === "tip" && <Lightbulb size={18} className="text-emerald-400" />}
                          {section.callout.type === "note" && <Info size={18} className="text-blue-400" />}
                        </div>
                        <div className="text-xs sm:text-sm leading-relaxed text-white/90">
                          {section.callout.text}
                        </div>
                      </div>
                    )}

                    {/* Code Snippet Box with Copy Button */}
                    {section.codeSnippet && (
                      <div className="my-6 overflow-hidden rounded-xl border border-white/15 bg-[#07080b]">
                        <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-2.5">
                          <span className="font-mono text-xs text-white/60">
                            {section.codeSnippet.filename}
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-[11px] text-white/40 uppercase">
                              {section.codeSnippet.language}
                            </span>
                            <button
                              onClick={() => handleCopyCode(section.codeSnippet!.code, sIdx)}
                              className="flex items-center gap-1 font-mono text-xs text-white/60 hover:text-white transition-colors"
                            >
                              {copiedCodeIndex === sIdx ? (
                                <>
                                  <Check size={12} className="text-emerald-400" />
                                  <span className="text-emerald-400">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy size={12} />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                        <pre className="overflow-x-auto p-4 text-xs font-mono leading-relaxed text-emerald-300/90 selection:bg-white/20">
                          <code>{section.codeSnippet.code}</code>
                        </pre>
                      </div>
                    )}

                    {/* Metrics Grid */}
                    {section.metrics && section.metrics.length > 0 && (
                      <div className="my-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {section.metrics.map((m, mIdx) => (
                          <div
                            key={mIdx}
                            className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-left"
                          >
                            <p className="font-mono text-[10px] tracking-wider text-muted uppercase">
                              {m.label}
                            </p>
                            <div className="mt-2 flex items-baseline justify-between">
                              <span className="text-lg font-semibold text-white">
                                {m.after}
                              </span>
                              <span className="inline-flex items-center gap-0.5 font-mono text-xs font-medium text-emerald-400">
                                {m.change.startsWith("-") ? <TrendingDown size={13} /> : <TrendingUp size={13} />}
                                {m.change}
                              </span>
                            </div>
                            <p className="mt-1 font-mono text-[11px] text-muted/60">
                              Baseline: {m.before}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                ))}
              </div>

              {/* Author Bio Footer */}
              <div className="mt-14 border-t border-white/10 pt-8 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <h4 className="text-sm font-semibold text-white">Yogender Verma</h4>
                  <p className="text-xs text-muted font-mono mt-0.5">
                    Full-Stack Developer &amp; AI Systems Engineer · Himachal, India
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href="https://github.com/Yogi-ya"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-white/60 hover:text-white underline underline-offset-4"
                  >
                    GitHub
                  </a>
                  <span className="text-white/20">•</span>
                  <a
                    href="https://www.linkedin.com/in/yogendervermaa/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-white/60 hover:text-white underline underline-offset-4"
                  >
                    LinkedIn
                  </a>
                  <span className="text-white/20">•</span>
                  <a
                    href="https://x.com/yogendervermaa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-white/60 hover:text-white underline underline-offset-4"
                  >
                    X (Twitter)
                  </a>
                </div>
              </div>

              {/* Previous / Next Article Navigation */}
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/10 pt-6">
                {prevArticle ? (
                  <button
                    onClick={() => onSelectArticle(prevArticle.slug)}
                    className="group text-left rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-all hover:border-white/25 hover:bg-white/[0.04]"
                  >
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] text-muted group-hover:text-white">
                      <ChevronLeft size={13} />
                      PREVIOUS ARTICLE
                    </span>
                    <p className="mt-1 text-sm font-medium text-white/90 line-clamp-2">
                      {prevArticle.title}
                    </p>
                  </button>
                ) : (
                  <div />
                )}

                {nextArticle ? (
                  <button
                    onClick={() => onSelectArticle(nextArticle.slug)}
                    className="group text-right rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-all hover:border-white/25 hover:bg-white/[0.04]"
                  >
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] text-muted group-hover:text-white justify-end">
                      NEXT ARTICLE
                      <ChevronRight size={13} />
                    </span>
                    <p className="mt-1 text-sm font-medium text-white/90 line-clamp-2">
                      {nextArticle.title}
                    </p>
                  </button>
                ) : (
                  <div />
                )}
              </div>
            </article>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
