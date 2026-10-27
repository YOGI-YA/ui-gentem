"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ArrowUpRight } from "lucide-react";
import { insights } from "@/lib/data";

export default function Insights() {
  const imageRef = useRef<HTMLDivElement>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

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
    <section
      id="insights"
      className="relative border-b border-border py-28 md:py-36"
      onMouseMove={handleMouseMove}
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <p className="mb-14 text-xs tracking-[0.3em] text-muted uppercase">
          ARTICLES & TECHNICAL INSIGHTS
        </p>

        <ul className="border-t border-border">
          {insights.map((insight) => (
            <li key={insight.id} className="border-b border-border">
              <div
                onMouseEnter={() => handleEnter(insight.image)}
                onMouseLeave={handleLeave}
                className="group grid grid-cols-1 items-center gap-2 py-8 sm:grid-cols-12 sm:gap-4 cursor-pointer"
              >
                <span className="text-xs tracking-[0.2em] text-muted sm:col-span-2 uppercase">
                  {insight.category}
                </span>
                <span className="text-2xl sm:col-span-7 sm:text-3xl font-medium tracking-tight group-hover:text-foreground transition-colors text-foreground/90">
                  {insight.title}
                </span>
                <span className="text-xs text-muted sm:col-span-2 flex flex-col sm:items-end">
                  <span>{insight.date}</span>
                  <span className="text-[11px] text-muted/60">{insight.readTime}</span>
                </span>
                <ArrowUpRight
                  size={20}
                  className="sm:col-span-1 sm:justify-self-end text-muted group-hover:text-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div
        ref={imageRef}
        className="pointer-events-none fixed left-0 top-0 z-30 h-[280px] w-[220px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl transition-opacity duration-300 shadow-2xl border border-white/20"
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
  );
}
