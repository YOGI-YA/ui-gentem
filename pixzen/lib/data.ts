export const navLinks = [
  { label: "Work", href: "#work" },
  { label: "Expertise", href: "#expertise" },
  { label: "Studio", href: "#about" },
  { label: "Insights", href: "#insights" },
  { label: "Contact", href: "#contact" },
];

export const heroPrefix = "We build at the edge of";

export const heroPhrases = ["the web", "commerce", "intelligent agents"];

export const brands = [
  "Nova Robotics",
  "Halcyon Labs",
  "Meridian Capital",
  "Fathom AI",
  "Substrate",
  "Kinfolk & Co.",
  "Vantage Systems",
  "Northwind",
];

export const trustBadge = {
  eyebrow: "SELECT PARTNER NETWORK",
  heading: "Trusted to ship production, not prototypes",
  copy: "We're a small studio by design — the same senior team scopes, builds, and ships every engagement, across brand, product, and the AI layer underneath it.",
};

export type Service = {
  id: string;
  index: string;
  title: string;
  description: string;
  image: string;
};

export const services: Service[] = [
  {
    id: "engineering",
    index: "01",
    title: "Next.js Engineering",
    description:
      "Fast, scalable applications built on modern React patterns — from server components to edge rendering, tuned to hold up at scale.",
    image:
      "https://images.unsplash.com/photo-1550439062-609e1531270e?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "agents",
    index: "02",
    title: "AI Agent Workflows",
    description:
      "Custom agents and embedded model workflows that do real work inside your product — not a chatbot bolted onto the corner of a page.",
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "commerce",
    index: "03",
    title: "Headless Commerce",
    description:
      "Storefronts built for speed and conversion, decoupled from the CMS so your team can ship content without waiting on engineering.",
    image:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "brand",
    index: "04",
    title: "Brand & Design Systems",
    description:
      "Identity, typography, and component systems built to scale across every surface your company ships — not just the homepage.",
    image:
      "https://images.unsplash.com/photo-1559028006-448665bd7c7f?q=80&w=1600&auto=format&fit=crop",
  },
];

export type Project = {
  id: string;
  title: string;
  client: string;
  year: string;
  category: string;
  stack: string[];
  image: string;
  summary: string;
  details: string[];
};

export const projects: Project[] = [
  {
    id: "fathom",
    title: "Fathom AI",
    client: "Fathom Research",
    year: "2026",
    category: "Product · AI",
    stack: ["Next.js", "AI Agents", "Vercel"],
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1800&auto=format&fit=crop",
    summary:
      "A research-grade reasoning engine repackaged into a product a non-technical team could trust.",
    details: [
      "Full brand identity and product naming",
      "End-to-end interface for the reasoning console",
      "Custom agent orchestration layer",
      "Launched to 40,000 waitlisted users in week one",
    ],
  },
  {
    id: "meridian",
    title: "Meridian Capital",
    client: "Meridian Capital Partners",
    year: "2025",
    category: "Brand · Web",
    stack: ["Next.js", "Brand Design", "Vercel"],
    image:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1800&auto=format&fit=crop",
    summary:
      "Repositioning a 40-year-old investment firm for a generation raised on software.",
    details: [
      "Full visual identity overhaul",
      "Editorial-led marketing site",
      "Investor portal redesign",
      "31% increase in qualified inbound",
    ],
  },
  {
    id: "halcyon",
    title: "Halcyon Labs",
    client: "Halcyon Materials",
    year: "2025",
    category: "Product Design",
    stack: ["Next.js", "Design System", "Vercel"],
    image:
      "https://images.unsplash.com/photo-1559028006-448665bd7c7f?q=80&w=1800&auto=format&fit=crop",
    summary:
      "Turning a dense materials-science platform into an interface researchers actually enjoy using.",
    details: [
      "Design system built for scientific data density",
      "Real-time simulation dashboard",
      "Accessibility audit and remediation",
      "Adopted by 12 university research labs",
    ],
  },
  {
    id: "substrate",
    title: "Substrate",
    client: "Substrate Cloud",
    year: "2024",
    category: "Brand · AI",
    stack: ["Next.js", "AI Agents", "Brand Design"],
    image:
      "https://images.unsplash.com/photo-1550439062-609e1531270e?q=80&w=1800&auto=format&fit=crop",
    summary:
      "Infrastructure is invisible by nature — we gave it a face worth remembering.",
    details: [
      "Naming, identity, and motion system",
      "Developer-facing documentation site",
      "Launch film and product renders",
      "Featured in three design publications",
    ],
  },
];

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
};

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    quote:
      "They scoped the agent work in a week, shipped it in six, and it's held up under real production traffic ever since. No surprises, no rebuilds.",
    name: "Priya Nandan",
    role: "Head of Product, Fathom Research",
  },
  {
    id: "t2",
    quote:
      "Most agencies redesign your homepage. PIXZEN rebuilt how our whole platform thinks about content — the difference showed up in the metrics within a quarter.",
    name: "Marcus Ovid",
    role: "VP Marketing, Meridian Capital",
  },
  {
    id: "t3",
    quote:
      "Our researchers actually enjoy using the dashboard now. That's not a small thing when the previous version was actively driving people away.",
    name: "Dana Whitfield",
    role: "Director of R&D, Halcyon Labs",
  },
  {
    id: "t4",
    quote:
      "Technical depth and design taste rarely come from the same team. Here it did, and it meant zero handoff loss between brand and build.",
    name: "Elias Kwan",
    role: "Founder, Substrate Cloud",
  },
];

export type Insight = {
  id: string;
  category: string;
  title: string;
  date: string;
  image: string;
};

export const insights: Insight[] = [
  {
    id: "insight-1",
    category: "AI",
    title: "Why most AI features feel bolted on — and how to fix it",
    date: "Sep 2026",
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: "insight-2",
    category: "Design",
    title: "The case for slower, quieter interfaces",
    date: "Aug 2026",
    image:
      "https://images.unsplash.com/photo-1559028006-448665bd7c7f?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: "insight-3",
    category: "Strategy",
    title: "Rebranding under pressure: a field guide",
    date: "Jul 2026",
    image:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: "insight-4",
    category: "Engineering",
    title: "Building motion systems that don't cost you performance",
    date: "Jun 2026",
    image:
      "https://images.unsplash.com/photo-1550439062-609e1531270e?q=80&w=1400&auto=format&fit=crop",
  },
];

export const manifesto =
  "We believe the best technology disappears. Our studio exists to strip away the noise between an idea and the person who needs it — building brands, products, and intelligent systems that feel less like software and more like instinct.";

export const marqueeValues = [
  "ARTIFICIAL INTELLIGENCE",
  "BRAND STRATEGY",
  "PRODUCT DESIGN",
  "MOTION SYSTEMS",
  "FULL-STACK ENGINEERING",
];
