import { Quote } from "lucide-react";
import { testimonials } from "@/lib/data";

export default function Testimonials() {
  return (
    <section className="border-b border-border py-28 md:py-36">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <p className="mb-14 text-xs tracking-[0.3em] text-muted uppercase">
          ENDORSEMENTS & COLLABORATIONS
        </p>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="flex flex-col justify-between bg-background p-8 md:p-10"
            >
              <Quote size={22} className="mb-6 text-muted" strokeWidth={1.5} />
              <p className="text-lg leading-relaxed sm:text-xl">
                {testimonial.quote}
              </p>
              <div className="mt-8">
                <p className="font-medium">{testimonial.name}</p>
                <p className="text-sm text-muted">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
