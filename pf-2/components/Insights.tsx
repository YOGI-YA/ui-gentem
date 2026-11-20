"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { insights } from "@/lib/data";
import ArticleReaderModal from "@/components/ArticleReaderModal";

export default function Insights() {
  const imageRef = useRef<HTMLDivElement>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [selectedArticleSlug, setSelectedArticleSlug] = useState<string | null>(null);

  // Sync with URL query parameter (?article=slug)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const articleParam = params.get("article");
    if (articleParam) {
      setSelectedArticleSlug(articleParam);
    }
  }, []);

  function handleSelectArticle(slug: string) {
    setSelectedArticleSlug(slug);
    if (typeof window !== "undefined" && window.history?.pushState) {
      const url = new URL(window.location.href);
      url.searchParams.set("article", slug);
      window.history.pushState(null, "", url.toString());
    }
  }

  function handleCloseArticle() {
    setSelectedArticleSlug(null);
    if (typeof window !== "undefined" && window.history?.pushState) {
      const url = new URL(window.location.href);
      url.searchParams.delete("article");
      window.history.pushState(null, "", url.pathname + (url.hash || ""));
    }
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!imageRef.current) return;
    gsap.to(imageRef.current, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.5,
      ease: "power4.out",
    });
  }

  function handleEnter(image: string) {
    setActiveImage(image);
    setVisible(true);
  }

  function handleLeave() {
    setVisible(false);
  }

  return (
    <>
      <section
        id="insights"
        className="relative border-b border-border py-28 md:py-36"
        onMouseMove={handleMouseMove}
      >
        <div className="mx-auto max-w-[1440px] px-6 md:px-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-14">
            <div>
              <p className="text-xs tracking-[0.3em] text-muted uppercase font-mono">
                ARTICLES &amp; TECHNICAL INSIGHTS
              </p>
              <h2 className="mt-2 text-2xl sm:text-4xl font-medium tracking-tight text-white">
                Engineering Notes &amp; System Deep Dives
              </h2>
            </div>
            <p className="text-xs text-muted/70 font-mono sm:text-right max-w-xs">
              Direct retrospectives, benchmarks, and architectural lessons from real production builds.
            </p>
          </div>

          <ul className="border-t border-border">
            {insights.map((insight) => (
              <li key={insight.id} className="border-b border-border">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => handleSelectArticle(insight.slug)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleSelectArticle(insight.slug);
                    }
                  }}
                  onMouseEnter={() => handleEnter(insight.image)}
                  onMouseLeave={handleLeave}
                  className="group grid grid-cols-1 items-center gap-2 py-8 sm:grid-cols-12 sm:gap-4 cursor-pointer transition-colors hover:bg-white/[0.015] px-2 -mx-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-white/20"
                  aria-label={`Read article: ${insight.title}`}
                >
                  <span className="text-xs tracking-[0.2em] text-muted sm:col-span-2 uppercase font-mono">
                    {insight.category}
                  </span>
                  <span className="text-xl sm:col-span-7 sm:text-2xl lg:text-3xl font-medium tracking-tight group-hover:text-foreground transition-colors text-foreground/90">
                    {insight.title}
                  </span>
                  <span className="text-xs text-muted sm:col-span-2 flex flex-col sm:items-end font-mono">
                    <span>{insight.date}</span>
                    <span className="text-[11px] text-muted/60">{insight.readTime}</span>
                  </span>
                  <div className="sm:col-span-1 sm:justify-self-end flex items-center gap-1.5 text-muted group-hover:text-foreground transition-all">
                    <span className="hidden lg:inline-block font-mono text-[11px] opacity-0 group-hover:opacity-100 transition-opacity">
                      Read
                    </span>
                    <ArrowUpRight
                      size={20}
                      className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Floating cursor thumbnail for desktop */}
        <div
          ref={imageRef}
          className="pointer-events-none fixed left-0 top-0 z-30 h-[280px] w-[220px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl transition-opacity duration-300 shadow-2xl border border-white/20 hidden md:block"
          style={{ opacity: visible ? 1 : 0 }}
        >
          {activeImage && (
            <Image
              src={activeImage}
              alt="Article thumbnail preview"
              fill
              sizes="220px"
              className="scale-105 object-cover"
            />
          )}
        </div>
      </section>

      {/* Reader Modal */}
      <ArticleReaderModal
        slug={selectedArticleSlug}
        onClose={handleCloseArticle}
        onSelectArticle={handleSelectArticle}
      />
    </>
  );
}
