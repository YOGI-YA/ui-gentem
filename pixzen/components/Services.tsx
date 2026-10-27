"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/lib/data";

export default function Services() {
  const [active, setActive] = useState(services[0].id);
  const activeService = services.find((s) => s.id === active) ?? services[0];

  return (
    <section id="expertise" className="border-b border-border py-28 md:py-36">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <p className="mb-14 text-xs tracking-[0.3em] text-muted uppercase">
          CORE EXPERTISE & TECHNICAL SKILLS
        </p>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <ul className="border-t border-border">
              {services.map((service) => (
                <li
                  key={service.id}
                  onMouseEnter={() => setActive(service.id)}
                  className="group border-b border-border"
                >
                  <button
                    onClick={() => setActive(service.id)}
                    className="flex w-full items-center justify-between py-8 text-left"
                  >
                    <span className="flex items-baseline gap-6">
                      <span className="text-sm text-muted">
                        {service.index}
                      </span>
                      <span
                        className={`text-3xl transition-colors duration-300 sm:text-4xl ${
                          active === service.id
                            ? "text-foreground"
                            : "text-foreground/40 group-hover:text-foreground/70"
                        }`}
                      >
                        {service.title}
                      </span>
                    </span>
                    <ArrowUpRight
                      size={22}
                      className={`shrink-0 transition-opacity duration-300 ${
                        active === service.id ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-7">
            <div className="sticky top-28 aspect-[4/3] w-full overflow-hidden rounded-2xl bg-background-soft">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeService.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <Image
                    src={activeService.image}
                    alt={activeService.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 55vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/10 to-transparent p-8">
                    <p className="max-w-sm text-sm text-white/90">
                      {activeService.description}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
