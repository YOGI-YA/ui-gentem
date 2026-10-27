export const personalInfo = {
  name: "Yogender Verma",
  role: "Full-Stack Developer & AI Systems Engineer",
  email: "yogender.tech@gmail.com",
  github: "https://github.com/YogenderVermaa",
  linkedin: "https://www.linkedin.com/in/yogendervermaa/",
  twitter: "https://x.com/yogendervermaa",
  portfolio: "https://yogender.me",
  location: "India · Open to Remote & Global Work",
  bio: "Full-Stack Developer building modern web applications and AI-powered experiences with Next.js, React, and scalable product thinking.",
};

export const navLinks = [
  { label: "Work", href: "#work" },
  { label: "Expertise", href: "#expertise" },
  { label: "Experience", href: "#experience" },
  { label: "About", href: "#about" },
  { label: "Insights", href: "#insights" },
  { label: "Contact", href: "#contact" },
];

export const heroPrefix = "Building at the edge of";

export const heroPhrases = [
  "intelligent AI agents",
  "scalable web apps",
  "modern user experiences",
];

export const techStack = [
  "Next.js",
  "React 19",
  "TypeScript",
  "Tailwind CSS",
  "Node.js",
  "PostgreSQL",
  "MongoDB",
  "AI Agents & RAG",
  "Framer Motion",
  "Python",
  "Docker",
  "GraphQL",
];

export const trustBadge = {
  eyebrow: "PRODUCTION-READY ENGINEERING",
  heading: "Crafting scalable software from architecture to interface",
  copy: "I combine deep full-stack engineering foundations with modern product intuition — building systems that are fast, resilient, and crafted with obsessively high visual taste.",
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
    id: "fullstack",
    index: "01",
    title: "Next.js & React Architecture",
    description:
      "High-velocity web applications engineered with Next.js App Router, React Server Components, TypeScript, and streaming edge runtimes for sub-second page loads and seamless UX.",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "agents",
    index: "02",
    title: "AI Agents & RAG Workflows",
    description:
      "Custom multi-agent reasoning systems, vector search pipelines, and embedded model workflows that execute real business logic — not just superficial chat widgets.",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "backend",
    index: "03",
    title: "Scalable APIs & Cloud Systems",
    description:
      "Type-safe REST and GraphQL APIs, robust PostgreSQL/MongoDB schemas, Redis caching layers, secure authentication, and resilient cloud deployments.",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "motion",
    index: "04",
    title: "Design Systems & Motion UI",
    description:
      "Fluid, responsive interfaces powered by Framer Motion and GSAP, cohesive typography, sleek dark mode aesthetics, and WCAG accessibility standards.",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1600&auto=format&fit=crop",
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
  liveUrl?: string;
  githubUrl?: string;
};

export const projects: Project[] = [
  {
    id: "graa-ai",
    title: "Graa AI",
    client: "Autonomous Multi-Agent Intelligence",
    year: "2025 – 2026",
    category: "AI Systems · Full-Stack",
    stack: ["Next.js 15", "TypeScript", "AI Agents", "Vector DB", "TailwindCSS"],
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1800&auto=format&fit=crop",
    summary:
      "An intelligent multi-agent platform and reasoning system designed for real-time semantic retrieval, autonomous research, and high-velocity workflows.",
    details: [
      "Autonomous multi-agent orchestration pipeline with real-time streaming responses",
      "Hybrid search and RAG architecture for context-accurate knowledge synthesis",
      "High-fidelity dark mode interface with sub-100ms interaction latency",
      "Scalable edge-deployed API backend with rate-limiting and token budgeting",
    ],
    liveUrl: "https://pf-27.vercel.app/case-studies/graa-ai",
    githubUrl: "https://github.com/YogenderVermaa",
  },
  {
    id: "ai-ebook",
    title: "AI E-Book Generator",
    client: "Automated Knowledge Synthesis",
    year: "2025",
    category: "AI Product · Publishing Engine",
    stack: ["Next.js", "React", "TypeScript", "LLM Workflows", "Node.js"],
    image:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1800&auto=format&fit=crop",
    summary:
      "End-to-end publishing engine that transforms unstructured topic outlines into structured, publication-ready e-books with automated chapter drafting and styling.",
    details: [
      "Chapter-by-chapter coherent generation with long-context memory management",
      "Automated typography layout styling, table of contents, and PDF/ePub export",
      "Interactive editor with live prompt-assisted rewrites and precision refining",
      "Engineered prompt chains ensuring tone consistency and factual integrity",
    ],
    liveUrl: "https://pf-27.vercel.app/case-studies/ai-ebook",
    githubUrl: "https://github.com/YogenderVermaa",
  },
  {
    id: "photo-vault",
    title: "Photo Vault",
    client: "Zero-Knowledge Media Security",
    year: "2024 – 2025",
    category: "Security · Web Application",
    stack: ["React", "TypeScript", "Web Crypto API", "Cloud Storage", "PostgreSQL"],
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1800&auto=format&fit=crop",
    summary:
      "Privacy-first encrypted media vault engineered with client-side zero-knowledge encryption and seamless asset management.",
    details: [
      "Client-side AES-GCM 256-bit encryption before upload for absolute user privacy",
      "Dynamic thumbnail generation and encrypted streaming media pipeline",
      "Granular access control, biometric passkey support, and zero server logging",
      "Optimized client-side image compression reducing bandwidth overhead by 45%",
    ],
    liveUrl: "https://pf-27.vercel.app/case-studies/photo-vault",
    githubUrl: "https://github.com/YogenderVermaa",
  },
  {
    id: "nexus-core",
    title: "Nexus Developer Engine",
    client: "Open Source Tooling & Architecture",
    year: "2024",
    category: "Dev Tools · Architecture",
    stack: ["Next.js", "TypeScript", "TailwindCSS", "PostgreSQL", "Prisma"],
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1800&auto=format&fit=crop",
    summary:
      "A modular, type-safe developer toolkit and component ecosystem for rapidly scaffolding modern, high-speed applications.",
    details: [
      "Unified design token architecture with automated accessibility audits",
      "Type-safe API integrations and automated schema generation",
      "Built-in telemetry, error tracking, and performance monitoring",
      "Adopted by developer teams for accelerated MVP delivery",
    ],
    githubUrl: "https://github.com/YogenderVermaa",
  },
];

export type Experience = {
  id: string;
  index: string;
  period: string;
  role: string;
  company: string;
  location: string;
  type: string;
  description: string;
  highlights: string[];
  skills: string[];
};

export const experiences: Experience[] = [
  {
    id: "exp-1",
    index: "01",
    period: "2024 — Present",
    role: "Full-Stack & AI Systems Engineer",
    company: "Independent / Stealth Startups",
    location: "Remote",
    type: "Contract & Products",
    description:
      "Architecting AI-native platforms, autonomous multi-agent pipelines, and high-velocity web applications with Next.js 15, TypeScript, and modern vector databases.",
    highlights: [
      "Engineered end-to-end RAG retrieval pipelines and multi-agent systems with streaming LLM responses and sub-100ms UI latency.",
      "Architected type-safe API backends with PostgreSQL, Prisma, Redis caching, and edge cloud deployments.",
      "Built production-ready web products from high-fidelity UI design systems to cloud deployment.",
    ],
    skills: ["Next.js 15", "React 19", "TypeScript", "AI Agents", "RAG", "PostgreSQL", "Tailwind CSS"],
  },
  {
    id: "exp-2",
    index: "02",
    period: "2023 — 2024",
    role: "Senior Frontend & Web Developer",
    company: "Client Collaborations & Digital Products",
    location: "Remote",
    type: "Full-Time / Freelance",
    description:
      "Led frontend development for high-conversion web applications, interactive SaaS dashboards, and responsive design systems.",
    highlights: [
      "Built fluid, tactile web applications utilizing React Server Components, GSAP, and Framer Motion for 60fps animations.",
      "Refactored complex state management and asset delivery pipelines, reducing first contentful paint (FCP) by 40%.",
      "Created modular, accessible design system component libraries adopted across multi-repository codebases.",
    ],
    skills: ["React", "Next.js", "TypeScript", "GSAP", "Framer Motion", "REST / GraphQL"],
  },
  {
    id: "exp-3",
    index: "03",
    period: "2022 — 2023",
    role: "Full-Stack Software Developer",
    company: "Web & SaaS Solutions",
    location: "Remote",
    type: "Engineering",
    description:
      "Engineered scalable web architectures, database schemas, secure authentication pipelines, and automated cloud workflows.",
    highlights: [
      "Designed secure database architectures and RESTful microservices with Node.js, Express, MongoDB, and PostgreSQL.",
      "Implemented client-side encryption and secure credential management using modern Web Crypto APIs.",
      "Collaborated with cross-functional teams to ship feature releases in high-velocity agile sprints.",
    ],
    skills: ["Node.js", "Express", "PostgreSQL", "MongoDB", "Web Crypto API", "Docker"],
  },
  {
    id: "exp-4",
    index: "04",
    period: "2021 — 2022",
    role: "Frontend Developer & UI Engineer",
    company: "Creative Tech & Web Studio",
    location: "Remote",
    type: "Frontend",
    description:
      "Crafted interactive digital experiences, responsive client portfolios, and modern web applications.",
    highlights: [
      "Built responsive, mobile-first web experiences with modern CSS, semantic HTML, and fluid micro-interactions.",
      "Optimized SEO, core web vitals, and accessibility (WCAG AA compliance) across client deliverables.",
    ],
    skills: ["JavaScript", "React", "CSS3 / Sass", "Tailwind CSS", "Responsive Design"],
  },
];

export type Insight = {
  id: string;
  category: string;
  title: string;
  date: string;
  image: string;
  readTime: string;
};

export const insights: Insight[] = [
  {
    id: "insight-1",
    category: "AI Systems",
    title: "Engineering resilient AI agent workflows that don't fail in production",
    date: "Feb 2026",
    readTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: "insight-2",
    category: "Architecture",
    title: "Mastering React Server Components and edge caching for sub-100ms apps",
    date: "Jan 2026",
    readTime: "7 min read",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: "insight-3",
    category: "Security",
    title: "Client-side zero-knowledge encryption using the modern Web Crypto API",
    date: "Dec 2025",
    readTime: "6 min read",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: "insight-4",
    category: "Motion & UI",
    title: "Building high-performance 60fps micro-interactions with Framer Motion & GSAP",
    date: "Nov 2025",
    readTime: "4 min read",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1400&auto=format&fit=crop",
  },
];

export const manifesto =
  "I believe the best technology disappears into intuitive utility. My work sits at the intersection of robust full-stack architecture, tactile user experiences, and the emerging intelligence layer — building software that solves hard problems with speed, precision, and craftsmanship.";

export const marqueeValues = [
  "FULL-STACK ENGINEERING",
  "AI AGENT WORKFLOWS",
  "MODERN REACT ARCHITECTURE",
  "HIGH-PERFORMANCE SYSTEMS",
  "PRODUCT-LED DESIGN",
  "RAG & VECTOR SEARCH",
];
