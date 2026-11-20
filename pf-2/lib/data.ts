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
    "id": "graa-ai",
    "title": "Graa AI",
    "client": "Autonomous AI Learning Platform",
    "year": "2025 – 2026",
    "category": "AI Systems · Full-Stack",
    "filterCategory": "ai",
    "status": "Live in Production",
    "accentColor": "#10b981",
    "gradient": "from-emerald-500/20 via-teal-500/10 to-transparent",
    "metrics": [
      {
        "label": "Engine",
        "value": "Multi-Tier AI"
      },
      {
        "label": "Tutoring",
        "value": "Context RAG"
      },
      {
        "label": "Stack",
        "value": "Next.js + Prisma"
      }
    ],
    "stack": [
      "Next.js",
      "TypeScript",
      "PostgreSQL",
      "Prisma",
      "RAG",
      "TailwindCSS"
    ],
    "image": "/project/graaai.png",
    "summary": "An open-source, full-stack autonomous learning platform that converts learning goals, syllabi, or academic textbooks into structured, day-by-day mastery roadmaps with active-recall quizzes, an interactive code sandbox, and RAG tutoring.",
    "details": [
      "Autonomous multi-tier AI inference engine generating personalized daily mastery roadmaps",
      "Context-grounded RAG tutoring engine with milestone progression and automated active-recall quizzes",
      "Integrated interactive code sandbox with live in-browser execution and feedback",
      "Full-stack Next.js, TypeScript, PostgreSQL, and Prisma architecture deployed on Vercel"
    ],
    "liveUrl": "https://graaai.vercel.app/",
    "githubUrl": "https://github.com/YOGI-YA/graa-ai"
  },
  {
    "id": "web3-image-storage",
    "title": "Web3 Image Storage",
    "client": "Decentralized IPFS Media Architecture",
    "year": "2025",
    "category": "Web3 · Decentralized Media",
    "filterCategory": "security",
    "status": "Live in Production",
    "accentColor": "#06b6d4",
    "gradient": "from-cyan-500/20 via-blue-500/10 to-transparent",
    "metrics": [
      {
        "label": "Storage",
        "value": "IPFS via Pinata"
      },
      {
        "label": "Database",
        "value": "MongoDB Index"
      },
      {
        "label": "Integrity",
        "value": "Tamper-Proof"
      }
    ],
    "stack": [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "IPFS",
      "Pinata"
    ],
    "image": "/project/photovault.png",
    "summary": "A decentralized image upload and retrieval application built with React, Node.js, Express, MongoDB, and Pinata. Allows users to upload images securely using IPFS with immutable cryptographic hashes and clean metadata retrieval.",
    "details": [
      "Decentralized file upload pipeline committing immutable media to IPFS via Pinata API",
      "Scalable Node.js & Express REST backend managing metadata indexing and fast lookup in MongoDB",
      "Modern React + Vite frontend with real-time file preview, status feedback, and responsive gallery",
      "Zero server-side image retention guaranteeing decentralized ownership and tamper-proof storage"
    ],
    "liveUrl": "https://web3-image-storage.vercel.app/",
    "githubUrl": "https://github.com/YogenderVermaa/Web3-Image-storage"
  },
  {
    "id": "ebook-studio",
    "title": "E-Book Studio",
    "client": "AI-Assisted Publishing & Outline Engine",
    "year": "2025",
    "category": "AI Product · Publishing Engine",
    "filterCategory": "ai",
    "status": "Live in Production",
    "accentColor": "#8b5cf6",
    "gradient": "from-purple-500/20 via-indigo-500/10 to-transparent",
    "metrics": [
      {
        "label": "Architecture",
        "value": "pnpm Workspaces"
      },
      {
        "label": "Output",
        "value": "Digital E-Books"
      },
      {
        "label": "Runtime",
        "value": "React + Node.js"
      }
    ],
    "stack": [
      "React",
      "Node.js",
      "Express",
      "TailwindCSS",
      "pnpm",
      "JavaScript"
    ],
    "image": "/project/lifelog.png",
    "summary": "A platform where creators shape thoughts and brainstormed outlines into structured, publication-ready digital e-books. Features chapter drafting, interactive outline structuring, and streamlined publishing workflows.",
    "details": [
      "End-to-end authoring platform turning brainstormed outlines into structured, publication-ready chapters",
      "Decoupled monorepo architecture engineered with pnpm workspaces for frontend and backend",
      "Interactive rich-text chapter editor with real-time styling, table of contents, and drafting tools",
      "Designed for rapid digital book generation with responsive preview across desktop and tablet"
    ],
    "liveUrl": "https://e-book-drab.vercel.app/",
    "githubUrl": "https://github.com/YogenderVermaa/E-Book"
  },
  {
    "id": "ehr-blockchain",
    "title": "EHR Blockchain",
    "client": "Verifiable Health Record Architecture",
    "year": "2025 – 2026",
    "category": "Blockchain · Healthcare Security",
    "filterCategory": "security",
    "status": "Under Development",
    "accentColor": "#3b82f6",
    "gradient": "from-blue-500/20 via-indigo-500/10 to-transparent",
    "metrics": [
      {
        "label": "Ledger",
        "value": "Smart Contracts"
      },
      {
        "label": "Architecture",
        "value": "TypeScript Monorepo"
      },
      {
        "label": "Privacy",
        "value": "Granular Consent"
      }
    ],
    "stack": [
      "TypeScript",
      "Blockchain",
      "Smart Contracts",
      "Node.js",
      "Cryptography",
      "pnpm"
    ],
    "image": "/project/ehr-blockchain.jpg",
    "summary": "A blockchain-based architectural blueprint and practical implementation for verifiable, auditable, and controlled electronic health record (EHR) sharing across medical providers using distributed ledger technology.",
    "details": [
      "Decentralized smart contract architecture enforcing granular, patient-consented record access control",
      "Tamper-proof cryptographic audit logs tracking all provider read and update transactions",
      "Full-stack TypeScript monorepo with dedicated provider node APIs and patient access portals",
      "Designed around healthcare interoperability standards to ensure privacy, integrity, and compliance"
    ],
    "githubUrl": "https://github.com/YOGI-YA/EHR-Blockchain"
  },
  {
    "id": "quickshot-ai",
    "title": "Quickshot.ai",
    "client": "Anonymous Ephemeral Communication",
    "year": "2025 – 2026",
    "category": "Security · Real-Time Systems",
    "filterCategory": "security",
    "status": "Under Development",
    "accentColor": "#f59e0b",
    "gradient": "from-amber-500/20 via-orange-500/10 to-transparent",
    "metrics": [
      {
        "label": "Privacy",
        "value": "No Account Needed"
      },
      {
        "label": "Access",
        "value": "100% Peer Isolated"
      },
      {
        "label": "Channel",
        "value": "Encrypted Ephemeral"
      }
    ],
    "stack": [
      "Next.js",
      "TypeScript",
      "Mongoose",
      "NextAuth",
      "Zod",
      "Resend",
      "Web Crypto"
    ],
    "image": "/project/quickshot.jpg",
    "summary": "A high-privacy ephemeral communication platform where users send encrypted messages, videos, images, and text without sharing official accounts — accessible strictly by the two intended participants with zero external exposure.",
    "details": [
      "Zero-account footprint messaging allowing secure identity-shielded communication links",
      "End-to-end isolated data channels ensuring only the two participants can view text, images, or video",
      "Self-destructing ephemeral message life-cycles with zero persistent third-party logging",
      "Engineered with Next.js App Router, Mongoose schemas, Zod validation, and automated Resend notification hooks"
    ],
    "githubUrl": "https://github.com/YOGI-YA/Quickshot.ai"
  }
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
  slug: string;
  category: string;
  title: string;
  date: string;
  image: string;
  readTime: string;
};

export const insights: Insight[] = [
  {
    id: "insight-1",
    slug: "resilient-ai-agent-workflows",
    category: "AI Systems",
    title: "Engineering resilient AI agent workflows that don't fail in production",
    date: "Feb 2026",
    readTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: "insight-2",
    slug: "mastering-react-server-components-edge-caching",
    category: "Architecture",
    title: "Mastering React Server Components and edge caching for sub-100ms apps",
    date: "Jan 2026",
    readTime: "7 min read",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: "insight-3",
    slug: "client-side-zero-knowledge-web-crypto",
    category: "Security",
    title: "Client-side zero-knowledge encryption using the modern Web Crypto API",
    date: "Dec 2025",
    readTime: "6 min read",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: "insight-4",
    slug: "high-performance-60fps-motion-craft",
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
