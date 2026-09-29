import { Sparkles } from "lucide-react";
import { brands, trustBadge } from "@/lib/data";

export default function TrustedBrands() {
  const doubled = [...brands, ...brands];

  return (
    <section className="border-b border-border bg-background-soft py-10">
      <div className="marquee-group relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background-soft to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background-soft to-transparent" />

        <div className="animate-marquee flex w-max items-center gap-16">
          {doubled.map((brand, i) => (
            <div
              key={`${brand}-${i}`}
              className="flex shrink-0 items-center gap-3 opacity-40 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
            >
              <Sparkles size={18} strokeWidth={1.5} />
              <span className="whitespace-nowrap text-lg font-medium">
                {brand}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-[720px] px-6 text-center">
        <p className="text-[11px] tracking-[0.3em] text-muted">
          {trustBadge.eyebrow}
        </p>
        <p className="mt-3 text-xl font-medium sm:text-2xl">
          {trustBadge.heading}
        </p>
        <p className="mt-3 text-sm text-muted">{trustBadge.copy}</p>
      </div>
    </section>
  );
}
