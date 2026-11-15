"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { manifesto, marqueeValues } from "@/lib/data";

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
    <section id="manifesto" className="border-b border-border py-24 md:py-32">
      <div className="mx-auto max-w-[900px] px-6 md:px-10">
        <p
          ref={textRef}
          className="text-2xl leading-[1.4] tracking-tight sm:text-3xl md:text-4xl"
        >
          {manifesto}
        </p>
      </div>

      <div className="mt-20 overflow-hidden border-y border-border py-5">
        <div className="animate-marquee flex w-max items-center gap-8">
          {doubledValues.map((value, i) => (
            <span
              key={`${value}-${i}`}
              className="flex items-center gap-8 whitespace-nowrap text-xl font-medium uppercase tracking-[0.15em] text-foreground/70 sm:text-2xl"
            >
              {value}
              <span className="text-muted">/</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}