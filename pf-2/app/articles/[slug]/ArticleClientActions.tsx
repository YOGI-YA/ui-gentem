"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Share2 } from "lucide-react";

export default function ArticleClientActions({
  title,
  slug,
}: {
  title: string;
  slug: string;
}) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [scrolledPastHero, setScrolledPastHero] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
      setScrolledPastHero(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleShare = () => {
    const url = typeof window !== "undefined"
      ? `${window.location.origin}/articles/${slug}`
      : `https://yogender.me/articles/${slug}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <>
      {/* Top 2px Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-white/5">
        <div
          className="h-full bg-gradient-to-r from-[#E8B04A] via-cyan-400 to-[#E8B04A] transition-all duration-75"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating Header */}
      <header className="fixed top-3 inset-x-0 z-40 px-4 md:px-8">
        <nav className="mx-auto flex max-w-4xl items-center justify-between rounded-full border border-white/10 bg-[#07080b]/80 px-4 py-2.5 backdrop-blur-xl shadow-lg">
          <Link
            href="/#insights"
            className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-white/90 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">YOGENDER VERMA</span>
            <span className="sm:hidden">BACK</span>
          </Link>

          {scrolledPastHero && (
            <p className="hidden md:block max-w-md truncate text-xs font-mono text-muted/80">
              {title}
            </p>
          )}

          <button
            onClick={handleShare}
            aria-label="Share article link"
            className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-mono text-white/80 transition-colors hover:border-white/30 hover:text-white"
          >
            {copied ? (
              <>
                <Check size={12} className="text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Share2 size={12} />
                <span>Share</span>
              </>
            )}
          </button>
        </nav>
      </header>
    </>
  );
}
