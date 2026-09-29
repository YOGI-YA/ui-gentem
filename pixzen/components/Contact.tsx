"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ArrowUpRight } from "lucide-react";

function MagneticButton() {
  const buttonRef = useRef<HTMLAnchorElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = buttonRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(el, {
      x: x * 0.4,
      y: y * 0.4,
      duration: 0.4,
      ease: "power3.out",
    });
  }

  function handleMouseLeave() {
    const el = buttonRef.current;
    if (!el) return;
    gsap.to(el, {
      x: 0,
      y: 0,
      duration: 1,
      ease: "elastic.out(1, 0.3)",
    });
  }

  return (
    <a
      ref={buttonRef}
      href="mailto:hello@pixzen.ai"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group inline-flex items-center gap-3 rounded-full bg-foreground px-8 py-4 text-background transition-transform"
    >
      <span className="text-sm tracking-[0.1em]">Start a Project</span>
      <ArrowUpRight
        size={18}
        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </a>
  );
}

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden border-b border-border py-32 md:py-48"
    >
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 animate-pulse rounded-full bg-foreground/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 animate-pulse rounded-full bg-foreground/10 blur-3xl [animation-delay:1.2s]" />

      <div className="relative mx-auto flex max-w-[1100px] flex-col items-center px-6 text-center">
        <h2 className="text-5xl leading-[1.05] font-medium tracking-tight sm:text-7xl md:text-8xl">
          Let&apos;s Build
          <br />
          The Future.
        </h2>
        <p className="mt-8 max-w-md text-muted">
          Tell us where you&apos;re headed. We&apos;ll tell you how to get
          there faster.
        </p>
        <div className="mt-12">
          <MagneticButton />
        </div>
      </div>
    </section>
  );
}
