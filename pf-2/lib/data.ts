export const personalInfo = {
  name: "Yogender Verma",
  role: "Full-Stack Developer & AI Systems Engineer",
  email: "yogender.tech@gmail.com",
  github: "https://github.com/Yogi-ya",
  linkedin: "https://www.linkedin.com/in/yogendervermaa/",
  twitter: "https://x.com/yogendervermaa",
  portfolio: "https://yogender.me",
  location: "Himachal, India · Open to Work & Opportunities",
  bio: "Full-Stack Developer building modern web applications and AI-powered experiences with Next.js, React, and scalable product thinking.",
};

export const navLinks = [
  { label: "About Me", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Expertise", href: "#expertise" },
  { label: "Experience", href: "#experience" },
  { label: "Manifesto", href: "#manifesto" },
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

export type ProjectMetric = {
  label: string;
  value: string;
};

export type Project = {
  id: string;
  title: string;
  client: string;
  year: string;
  category: string;
  filterCategory: "all" | "ai" | "security" | "devtools";
  status: string;
  metrics: ProjectMetric[];
  accentColor: string;
  gradient: string;
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
    filterCategory: "ai",
    status: "Live in Production",
    accentColor: "#10b981",
    gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
    metrics: [
      { label: "Query Latency", value: "<100ms" },
      { label: "Pipeline", value: "Multi-Agent" },
      { label: "Vector Search", value: "Hybrid RAG" },
    ],
    stack: ["Next.js 15", "TypeScript", "AI Agents", "Vector DB", "TailwindCSS"],
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1800&auto=format&fit=crop",
    summary:
      "An autonomous multi-agent intelligence platform designed for real-time semantic research, hybrid RAG retrieval, and high-velocity reasoning workflows.",
    details: [
      "Autonomous multi-agent orchestration pipeline with real-time streaming responses",
      "Hybrid search and RAG architecture for context-accurate knowledge synthesis",
      "High-fidelity dark mode interface with sub-100ms interaction latency",
      "Scalable edge-deployed API backend with rate-limiting and token budgeting",
    ],
    liveUrl: "https://pf-27.vercel.app/case-studies/graa-ai",
    githubUrl: "https://github.com/yogi-ya",
  },
  {
    id: "ai-ebook",
    title: "AI E-Book Generator",
    client: "Automated Knowledge Synthesis",
    year: "2025",
    category: "AI Product · Publishing Engine",
    filterCategory: "ai",
    status: "Active Release",
    accentColor: "#8b5cf6",
    gradient: "from-purple-500/20 via-indigo-500/10 to-transparent",
    metrics: [
      { label: "Synthesis Rate", value: "10k+ Pgs" },
      { label: "Context Window", value: "128k Tokens" },
      { label: "Formats", value: "PDF & ePub" },
    ],
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
    githubUrl: "https://github.com/yogi-ya",
  },
  {
    id: "photo-vault",
    title: "Photo Vault",
    client: "Zero-Knowledge Media Security",
    year: "2024 – 2025",
    category: "Security · Web Application",
    filterCategory: "security",
    status: "Enterprise Ready",
    accentColor: "#06b6d4",
    gradient: "from-cyan-500/20 via-blue-500/10 to-transparent",
    metrics: [
      { label: "Encryption", value: "AES-GCM 256" },
      { label: "Bandwidth Cut", value: "-45%" },
      { label: "Server Knowledge", value: "0% Zero-Logs" },
    ],
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
    githubUrl: "https://github.com/yogi-ya",
  },
  {
    id: "nexus-core",
    title: "Nexus Developer Engine",
    client: "Open Source Tooling & Architecture",
    year: "2024",
    category: "Dev Tools · Architecture",
    filterCategory: "devtools",
    status: "Open Source",
    accentColor: "#f59e0b",
    gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
    metrics: [
      { label: "Type Safety", value: "Strict 100%" },
      { label: "Bundle Overhead", value: "0 kB Runtime" },
      { label: "DX Velocity", value: "3x Faster" },
    ],
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
    githubUrl: "https://github.com/yogi-ya",
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
    period: "Aug 2026 — Present",
    role: "Full Stack Developer",
    company: "ICFAI Group",
    location: "Himachal Pradesh, India · On-site",
    type: "Full-time",
    description:
      "Developing full-stack web platforms and institutional systems using Next.js, React, and Node.js. Building type-safe REST APIs and optimizing database workflows for daily academic and administrative operations.",
    highlights: [
      "Engineered full-stack features with Next.js App Router, TypeScript, and React Server Components.",
      "Designed and documented RESTful APIs with secure session handling and role-based access.",
      "Managed PostgreSQL and MongoDB databases, optimizing queries and data integrity across internal portals.",
    ],
    skills: [
      "Next.js",
      "React",
      "TypeScript",
      "Node.js",
      "Express.js",
      "PostgreSQL",
      "MongoDB",
      "Tailwind CSS",
    ],
  },
  {
    id: "exp-2",
    index: "02",
    period: "Jan 2026 — Jun 2026",
    role: "Full Stack Developer",
    company: "Excellence Technology",
    location: "Mohali, Punjab · On-site",
    type: "Full-time",
    description:
      "Designed and developed responsive web apps using React, Node.js, Express, MongoDB, and modern JavaScript. Implemented RESTful APIs and optimized backend performance.",
    highlights: [
      "Built responsive, mobile-first user interfaces using React, JavaScript (ES6+), and modern CSS.",
      "Implemented RESTful backend endpoints in Node.js and Express with robust input validation.",
      "Integrated MongoDB database collections and improved query execution times.",
    ],
    skills: [
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "JavaScript",
      "PostgreSQL",
      "Tailwind CSS",
      "REST APIs",
    ],
  },
  {
    id: "exp-3",
    index: "03",
    period: "Jun 2024 — Aug 2024",
    role: "Backend Developer",
    company: "Solitaire Infosys",
    location: "Chandigarh, India · On-site",
    type: "Internship",
    description:
      "Built a full-featured social media platform backend in Node.js/Express with secure JWT authentication, role-based access control, and RESTful APIs.",
    highlights: [
      "Developed backend architecture for user feeds, post interactions, and media data pipelines.",
      "Configured secure authentication flows using JWT tokens, bcrypt password hashing, and HTTP-only cookies.",
      "Enforced role-based access control (RBAC) across protected endpoints and secured database operations.",
    ],
    skills: [
      "Node.js",
      "Express.js",
      "MongoDB",
      "JWT Auth",
      "REST APIs",
      "API Security",
    ],
  },
  {
    id: "exp-4",
    index: "04",
    period: "Jul 2023 — Oct 2023",
    role: "Full Stack Developer",
    company: "The Website Makers",
    location: "Andhra Pradesh, India · Remote",
    type: "Internship",
    description:
      "Developed end-to-end web features in React and Node.js. Built reusable UI components and created REST APIs for data operations.",
    highlights: [
      "Created reusable frontend component libraries using React and Bootstrap for client deliverables.",
      "Built backend data endpoints in Node.js to handle user inputs, form submissions, and database records.",
      "Ensured cross-browser responsiveness, clean layouts, and accessible UI standards.",
    ],
    skills: [
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Bootstrap",
      "REST APIs",
    ],
  },
];

export type Education = {
  institution: string;
  degree: string;
  period: string;
  cgpa: string;
  coursework: string[];
};

export const education: Education = {
  institution: "The ICFAI University, Himachal Pradesh",
  degree: "B.Tech in Computer Science & Engineering",
  period: "2022 – 2026",
  cgpa: "7.9",
  coursework: [
    "Data Structures & Algorithms",
    "AI & Machine Learning",
    "Database Management Systems",
    "Object Oriented Programming",
    "Operating Systems",
    "Computer Networks",
  ],
};

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
