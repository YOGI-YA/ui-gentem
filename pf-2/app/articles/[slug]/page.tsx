import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Info,
} from "lucide-react";
import { articles, getArticleBySlug } from "@/lib/articles";
import ArticleClientActions from "./ArticleClientActions";

export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article Not Found — Yogender Verma",
    };
  }

  return {
    title: `${article.title} — Yogender Verma`,
    description: article.subtitle,
    keywords: [...article.tags, "Yogender Verma", "Software Engineering", "Technical Deep Dive"],
    authors: [{ name: "Yogender Verma", url: "https://yogender.me" }],
    openGraph: {
      title: article.title,
      description: article.subtitle,
      url: `https://yogender.me/articles/${article.slug}`,
      siteName: "Yogender Verma — Technical Insights",
      images: [
        {
          url: article.image,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      type: "article",
      publishedTime: article.date,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.subtitle,
      creator: "@yogendervermaa",
      images: [article.image],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const currentIndex = articles.findIndex((a) => a.slug === article.slug);
  const prevArticle = currentIndex > 0 ? articles[currentIndex - 1] : null;
  const nextArticle = currentIndex >= 0 && currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-[#07080b] text-foreground selection:bg-white/20">
      {/* Top Client Bar (Reading Progress + Share Button + Back Link) */}
      <ArticleClientActions title={article.title} slug={article.slug} />

      {/* Main Reading Container */}
      <main className="mx-auto max-w-[820px] px-5 sm:px-8 pt-28 pb-24">
        {/* Breadcrumb / Back Link */}
        <div className="mb-8">
          <Link
            href="/#insights"
            className="inline-flex items-center gap-2 text-xs font-mono text-muted hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            <span>BACK TO PORTFOLIO</span>
          </Link>
        </div>

        {/* Category Pill & Meta */}
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-muted">
          <div className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full animate-pulse"
              style={{ backgroundColor: article.accentColor }}
            />
            <span className="text-white uppercase tracking-[0.2em] font-semibold">
              {article.category}
            </span>
          </div>
          <span>•</span>
          <span className="inline-flex items-center gap-1.5">
            <Calendar size={13} />
            {article.date}
          </span>
          <span>•</span>
          <span className="inline-flex items-center gap-1.5">
            <Clock size={13} />
            {article.readTime}
          </span>
        </div>

        {/* Main Title */}
        <h1 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white leading-[1.18]">
          {article.title}
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-lg sm:text-xl text-muted/90 leading-relaxed font-normal">
          {article.subtitle}
        </p>

        {/* Tags */}
        <div className="mt-6 flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-xs text-white/70"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Cover Image */}
        <div className="relative mt-10 h-[260px] sm:h-[400px] w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
          <Image
            src={article.image}
            alt={article.title}
            fill
            sizes="(max-width: 820px) 100vw, 820px"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07080b] via-transparent to-transparent opacity-60" />
        </div>

        {/* Executive Takeaways */}
        <div className="mt-12 rounded-2xl border border-white/15 bg-white/[0.02] p-6 sm:p-8 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E8B04A]/20 text-[#E8B04A] text-xs font-mono">
              ✓
            </span>
            <h3 className="font-mono text-xs tracking-[0.2em] text-[#E8B04A] uppercase font-semibold">
              Key Architectural Takeaways
            </h3>
          </div>
          <ul className="space-y-3">
            {article.takeaways.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm sm:text-[15px] text-white/85 leading-relaxed">
                <span className="text-[#E8B04A] font-mono select-none mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Sections */}
        <div className="mt-14 space-y-14">
          {article.sections.map((section, sIdx) => (
            <section key={sIdx} className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white border-b border-white/10 pb-3">
                {section.heading}
              </h2>

              {section.subheading && (
                <p className="text-sm font-mono text-white/60">
                  {section.subheading}
                </p>
              )}

              <div className="space-y-4 text-base sm:text-[17px] text-white/80 leading-relaxed font-normal">
                {section.paragraphs.map((p, pIdx) => (
                  <p key={pIdx}>{p}</p>
                ))}
              </div>

              {/* Callout */}
              {section.callout && (
                <div
                  className={`my-6 flex gap-3.5 rounded-xl border p-5 ${
                    section.callout.type === "warning"
                      ? "border-amber-500/30 bg-amber-500/[0.06] text-amber-200"
                      : section.callout.type === "tip"
                      ? "border-emerald-500/30 bg-emerald-500/[0.06] text-emerald-200"
                      : "border-blue-500/30 bg-blue-500/[0.06] text-blue-200"
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    {section.callout.type === "warning" && <AlertTriangle size={20} className="text-amber-400" />}
                    {section.callout.type === "tip" && <Lightbulb size={20} className="text-emerald-400" />}
                    {section.callout.type === "note" && <Info size={20} className="text-blue-400" />}
                  </div>
                  <div className="text-sm leading-relaxed text-white/90">
                    {section.callout.text}
                  </div>
                </div>
              )}

              {/* Code Snippet */}
              {section.codeSnippet && (
                <div className="my-6 overflow-hidden rounded-xl border border-white/15 bg-[#030407]">
                  <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-2.5">
                    <span className="font-mono text-xs text-white/60">
                      {section.codeSnippet.filename}
                    </span>
                    <span className="font-mono text-[11px] text-white/40 uppercase">
                      {section.codeSnippet.language}
                    </span>
                  </div>
                  <pre className="overflow-x-auto p-4 text-xs sm:text-[13px] font-mono leading-relaxed text-emerald-300/90 selection:bg-white/20">
                    <code>{section.codeSnippet.code}</code>
                  </pre>
                </div>
              )}

              {/* Metrics Grid */}
              {section.metrics && section.metrics.length > 0 && (
                <div className="my-6 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {section.metrics.map((m, mIdx) => (
                    <div
                      key={mIdx}
                      className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-left"
                    >
                      <p className="font-mono text-[10px] tracking-wider text-muted uppercase">
                        {m.label}
                      </p>
                      <div className="mt-2 flex items-baseline justify-between">
                        <span className="text-xl font-semibold text-white">
                          {m.after}
                        </span>
                        <span className="inline-flex items-center gap-0.5 font-mono text-xs font-medium text-emerald-400">
                          {m.change.startsWith("-") ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
                          {m.change}
                        </span>
                      </div>
                      <p className="mt-1 font-mono text-xs text-muted/60">
                        Baseline: {m.before}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Author Box */}
        <div className="mt-16 rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h3 className="text-base font-semibold text-white">Written by Yogender Verma</h3>
            <p className="text-xs sm:text-sm text-muted font-mono mt-1">
              Full-Stack Developer &amp; AI Systems Engineer building scalable web apps and agentic workflows.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <a
              href="https://github.com/Yogi-ya"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white underline underline-offset-4"
            >
              GitHub
            </a>
            <span className="text-white/20">•</span>
            <a
              href="https://www.linkedin.com/in/yogendervermaa/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white underline underline-offset-4"
            >
              LinkedIn
            </a>
            <span className="text-white/20">•</span>
            <a
              href="https://x.com/yogendervermaa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white underline underline-offset-4"
            >
              X / Twitter
            </a>
          </div>
        </div>

        {/* Prev / Next */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/10 pt-8">
          {prevArticle ? (
            <Link
              href={`/articles/${prevArticle.slug}`}
              className="group rounded-xl border border-white/10 bg-white/[0.02] p-5 transition-all hover:border-white/25 hover:bg-white/[0.04]"
            >
              <span className="inline-flex items-center gap-1 font-mono text-xs text-muted group-hover:text-white">
                <ChevronLeft size={14} />
                PREVIOUS ARTICLE
              </span>
              <p className="mt-1 text-sm font-medium text-white/90 line-clamp-2">
                {prevArticle.title}
              </p>
            </Link>
          ) : (
            <div />
          )}

          {nextArticle ? (
            <Link
              href={`/articles/${nextArticle.slug}`}
              className="group text-right rounded-xl border border-white/10 bg-white/[0.02] p-5 transition-all hover:border-white/25 hover:bg-white/[0.04]"
            >
              <span className="inline-flex items-center gap-1 font-mono text-xs text-muted group-hover:text-white justify-end">
                NEXT ARTICLE
                <ChevronRight size={14} />
              </span>
              <p className="mt-1 text-sm font-medium text-white/90 line-clamp-2">
                {nextArticle.title}
              </p>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </main>
    </div>
  );
}
