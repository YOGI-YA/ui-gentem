"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { manifesto, marqueeValues, personalInfo } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!textRef.current) return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const split = new SplitType(textRef.current, { types: "words" });

    let ctx: gsap.Context | undefined;

    if (prefersReduced) {
      gsap.set(split.words, { opacity: 1 });
    } else {
      ctx = gsap.context(() => {
        gsap.set(split.words, { opacity: 0.15 });
        gsap.to(split.words, {
          opacity: 1,
          stagger: 0.05,
          ease: "none",
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 80%",
            end: "bottom 40%",
            scrub: 1,
          },
        });
      });
    }

    return () => {
      ctx?.revert();
      split.revert();
    };
  }, []);

  const doubledValues = [...marqueeValues, ...marqueeValues];

  return (
    <section id="about" className="border-b border-border py-28 md:py-36">
      <div className="mx-auto max-w-[1100px] px-6 md:px-10">
        <div className="flex flex-col gap-2 mb-10">
          <p className="text-xs tracking-[0.3em] text-muted uppercase">
            ABOUT & PHILOSOPHY
          </p>
          <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-foreground/80">
            {personalInfo.name} — {personalInfo.role}
          </h2>
        </div>

        <p
          ref={textRef}
          className="text-3xl leading-[1.3] tracking-tight sm:text-4xl md:text-5xl"
        >
          {manifesto}
        </p>

        <div className="mt-14 grid grid-cols-1 gap-8 border-t border-border pt-10 sm:grid-cols-3">
          <div>
            <p className="text-xs tracking-[0.2em] text-muted uppercase">LOCATION</p>
            <p className="mt-2 text-base font-medium">{personalInfo.location}</p>
          </div>
          <div>
            <p className="text-xs tracking-[0.2em] text-muted uppercase">SPECIALTY</p>
            <p className="mt-2 text-base font-medium">Next.js, TypeScript & AI Systems</p>
          </div>
          <div>
            <p className="text-xs tracking-[0.2em] text-muted uppercase">AVAILABILITY</p>
            <p className="mt-2 text-base font-medium text-emerald-400">Available for Opportunities</p>
          </div>
        </div>
      </div>

      <div className="mt-24 overflow-hidden border-y border-border py-8">
        <div className="animate-marquee flex w-max items-center gap-10">
          {doubledValues.map((value, i) => (
            <span
              key={`${value}-${i}`}
              className="flex items-center gap-10 whitespace-nowrap text-4xl font-medium uppercase tracking-tight text-foreground/90 sm:text-5xl md:text-6xl"
            >
              {value}
              <span className="text-3xl text-muted">—</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
