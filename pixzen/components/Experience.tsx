"use client";

import { Briefcase, Calendar, MapPin } from "lucide-react";
import { experiences } from "@/lib/data";

export default function Experience() {
  return (
    <section id="experience" className="border-b border-border py-28 md:py-36">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <div className="mb-14 flex flex-col gap-3">
          <p className="text-xs tracking-[0.3em] text-muted uppercase">
            EXPERIENCE & CAREER PATH
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight">
            Work Experience
          </h2>
        </div>

        <div className="flex flex-col border-t border-border">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="group border-b border-border py-12 transition-colors duration-300 hover:bg-background-soft/40 px-2 sm:px-6 rounded-2xl"
            >
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
                {/* Left column: Index & Timing */}
                <div className="lg:col-span-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-muted/60 tracking-widest">
                        {exp.index}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background-soft px-3 py-1 text-[11px] text-muted uppercase tracking-wider font-medium">
                        <Calendar size={12} className="text-muted/70" />
                        {exp.period}
                      </span>
                    </div>

                    <h3 className="mt-4 text-2xl sm:text-3xl font-medium tracking-tight text-foreground">
                      {exp.role}
                    </h3>
                    
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted">
                      <span className="flex items-center gap-1.5 font-medium text-foreground/80">
                        <Briefcase size={14} className="text-muted/70" />
                        {exp.company}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5">
                        <MapPin size={13} className="text-muted/70" />
                        {exp.location}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <span className="inline-block rounded border border-border/80 px-2.5 py-1 text-[11px] uppercase tracking-wider text-muted font-mono">
                      {exp.type}
                    </span>
                  </div>
                </div>

                {/* Right column: Description, Highlights, Skills */}
                <div className="lg:col-span-8 flex flex-col justify-between">
                  <div>
                    <p className="text-base sm:text-lg text-foreground/90 leading-relaxed">
                      {exp.description}
                    </p>

                    <ul className="mt-6 space-y-2.5 border-t border-border/60 pt-6">
                      {exp.highlights.map((highlight, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2.5 text-sm text-muted leading-relaxed"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/60 group-hover:bg-foreground transition-colors" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tech stack badges */}
                  <div className="mt-8 flex flex-wrap gap-2 pt-4">
                    {exp.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted/90 transition-colors group-hover:border-foreground/30 group-hover:text-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
