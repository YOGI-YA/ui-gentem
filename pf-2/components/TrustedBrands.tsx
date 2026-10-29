"use client";

import { Code2 } from "lucide-react";
import { techStack, trustBadge } from "@/lib/data";

export default function TrustedBrands() {
  const doubled = [...techStack, ...techStack];

  return (
    <section className="border-b border-border bg-background-soft py-10">
      <div className="marquee-group relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background-soft to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background-soft to-transparent" />

        <div className="animate-marquee flex w-max items-center gap-14">
          {doubled.map((tech, i) => (
            <div
              key={`${tech}-${i}`}
              className="flex shrink-0 items-center gap-3 text-muted/70 transition-all duration-300 hover:text-foreground"
            >
              <Code2 size={16} strokeWidth={1.75} className="text-foreground/50" />
              <span className="whitespace-nowrap text-sm font-medium tracking-wide uppercase">
                {tech}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-[760px] px-6 text-center">
        <p className="text-[11px] tracking-[0.3em] text-muted uppercase">
          {trustBadge.eyebrow}
        </p>
       
      </div>
    </section>
  );
}
