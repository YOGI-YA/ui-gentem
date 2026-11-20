export type ArticleSection = {
  heading: string;
  subheading?: string;
  paragraphs: string[];
  callout?: {
    type: "note" | "tip" | "warning";
    text: string;
  };
  codeSnippet?: {
    filename: string;
    language: string;
    code: string;
  };
  metrics?: {
    label: string;
    before: string;
    after: string;
    change: string;
  }[];
};

export type Article = {
  id: string;
  slug: string;
  category: string;
  title: string;
  subtitle: string;
  date: string;
  readTime: string;
  image: string;
  accentColor: string;
  tags: string[];
  takeaways: string[];
  sections: ArticleSection[];
};

export const articles: Article[] = [
  {
    id: "insight-1",
    slug: "resilient-ai-agent-workflows",
    category: "AI Systems",
    title: "Engineering Resilient AI Agent Workflows That Don't Fail in Production",
    subtitle:
      "Why naive LLM tool-calling loops explode under real-world ambiguity, and how a deterministic state machine architecture eliminates catastrophic failures.",
    date: "Feb 2026",
    readTime: "6 min read",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1400&auto=format&fit=crop",
    accentColor: "#3b82f6",
    tags: ["AI Agents", "TypeScript", "State Machines", "Zod", "RAG", "Production Systems"],
    takeaways: [
      "Never allow an LLM agent to recursively call tools without a strict finite state machine (FSM) boundary and depth budget.",
      "Validate every tool output through runtime Zod schemas before passing arguments to real APIs or database drivers.",
      "Idempotency keys and dead-letter queues are mandatory: ungrounded model retries will otherwise duplicate destructive side effects."
    ],
    sections: [
      {
        heading: "The 'Happy Path' Illusion in Agentic Workflows",
        paragraphs: [
          "When you demo an autonomous AI agent in a controlled Jupyter notebook or a fast prototype, it feels magical. You feed the model a tool definition, ask it to look up a record, summarize a document, and dispatch an email. In 90% of local tests, the ReAct (Reason + Act) loop executes smoothly.",
          "In production, however, probabilistic language models encounter dirty inputs, ambiguous customer data, rate-limit spikes, and non-deterministic formatting errors. Without explicit architectural guardrails, an agent enters an infinite retry loop, rapidly burning token budgets and executing duplicate side-effects (like charging a credit card twice or dispatching three identical confirmation emails)."
        ],
        callout: {
          type: "warning",
          text: "Standard ReAct loops assume tool execution always succeeds or returns parseable error strings. In reality, models hallucinate parameters that pass syntax checks but corrupt downstream database state."
        }
      },
      {
        heading: "The 3 Inevitable Production Failure Modes",
        paragraphs: [
          "Across dozens of agent deployments, failures consistently cluster into three distinct failure modes:",
          "1. Argument Schema Drift: The LLM invents parameters that do not exist in the tool definition (e.g., passing 'user_id' instead of 'customerId'), or passes strings where ISO-8601 timestamps were required.",
          "2. The Ungrounded Reasoning Spiral: When an API returns a 404 or empty search result, the model assumes it phrased the query poorly and loops 12 times altering minor synonyms instead of recognizing the entity does not exist.",
          "3. Context Window Saturation: Each tool invocation and stack trace gets re-injected into the prompt history. By turn 6, the context window is bloated with JSON error traces, degrading reasoning quality and inflating latency beyond 10 seconds."
        ]
      },
      {
        heading: "Architecture: The Bounded Deterministic State Machine",
        paragraphs: [
          "To eliminate these failure cascades, we abandoned open-ended agent loops in favor of a deterministic Finite State Machine (FSM). The LLM is restricted to deciding transitions between explicitly verified states, rather than freely choosing arbitrary actions.",
          "Every state has an explicit timeout, a maximum transition budget (e.g., max 2 retries for query disambiguation), and a validated fallback path. Here is the TypeScript implementation pattern we run in production:"
        ],
        codeSnippet: {
          filename: "lib/agent/bounded-runner.ts",
          language: "typescript",
          code: `import { z } from "zod";

export interface AgentContext {
  stepCount: number;
  maxSteps: number;
  idempotencyKey: string;
  history: Array<{ role: "system" | "user" | "assistant" | "tool"; content: string }>;
}

export async function executeSafeAgentStep<TSchema extends z.ZodTypeAny>(
  actionName: string,
  rawArgs: unknown,
  schema: TSchema,
  context: AgentContext
): Promise<z.infer<TSchema>> {
  // 1. Enforce strict recursion bounds
  if (context.stepCount >= context.maxSteps) {
    throw new Error(\`Agent exceeded maximum safety step budget of \${context.maxSteps}\`);
  }

  // 2. Validate tool payload BEFORE execution
  const parseResult = schema.safeParse(rawArgs);
  if (!parseResult.success) {
    // Return structured correction instruction without crashing
    const errorDetails = parseResult.error.issues.map(i => \`\${i.path.join(".")}: \${i.message}\`).join("; ");
    throw new Error(\`Contract validation failed for \${actionName}: \${errorDetails}\`);
  }

  context.stepCount += 1;
  return parseResult.data;
}`
        }
      },
      {
        heading: "Real-World Performance & Reliability Metrics",
        paragraphs: [
          "By decoupling probabilistic reasoning from deterministic execution and enforcing Zod runtime schema contracts, we achieved dramatic stability improvements across our agent pipelines:"
        ],
        metrics: [
          {
            label: "Unbounded Loop Failures",
            before: "14.2% of calls",
            after: "0.01% (bounded)",
            change: "-99.9%"
          },
          {
            label: "Average Token Spend / Task",
            before: "4,820 tokens",
            after: "1,640 tokens",
            change: "-66.0%"
          },
          {
            label: "P99 Execution Latency",
            before: "11.4s",
            after: "2.1s",
            change: "-81.5%"
          }
        ]
      },
      {
        heading: "Production Engineering Checklist",
        paragraphs: [
          "Before shipping any agentic workflow to real users, verify these five guardrails:",
          "• Set hard per-session token budgets and recursion caps (e.g. 5 steps maximum).",
          "• Always attach unique client-generated Idempotency-Keys to external mutate operations.",
          "• Truncate or summarize prior tool outputs before appending them to long conversation histories.",
          "• Implement human-in-the-loop escalation paths for destructive actions (deletions, refunds, email broadcasts).",
          "• Log full JSON execution traces to an observability sink (e.g. OpenTelemetry or Langfuse) to diagnose drift."
        ]
      }
    ]
  },
  {
    id: "insight-2",
    slug: "mastering-react-server-components-edge-caching",
    category: "Architecture",
    title: "Mastering React Server Components and Edge Caching for Sub-100ms Apps",
    subtitle:
      "RSCs transform modern full-stack performance, but naive waterfalls and unoptimized server rendering can silently destroy TTFB. Here is how we engineered sub-100ms responses.",
    date: "Jan 2026",
    readTime: "7 min read",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1400&auto=format&fit=crop",
    accentColor: "#10b981",
    tags: ["React 19", "Next.js 15", "RSC", "Edge Runtime", "Web Performance", "Caching"],
    takeaways: [
      "Avoid serial data fetches in React Server Components: always bundle independent queries with Promise.all() or wrap them in granular Suspense boundaries.",
      "Use React's cache() function for request-deduplication to avoid redundant database calls during the same render pass.",
      "Edge caching requires strict cache tagging (`revalidateTag`) rather than arbitrary time-based revalidation to prevent stale content delivery."
    ],
    sections: [
      {
        heading: "The Hidden Waterfall Trap in Next.js App Router",
        paragraphs: [
          "React Server Components (RSCs) were promised as the holy grail: zero-bundle-size server execution, direct database access from components, and instant HTML streaming. Many developers immediately ported their apps over by writing `async function Component()` everywhere.",
          "However, a dangerous anti-pattern quickly emerges: sequential server-side waterfalls. When nested components independently `await` database queries or microservice endpoints, the server blocks rendering until every single call finishes serially. What used to be a fast client-rendered skeleton now manifests as a sluggish 800ms Time-to-First-Byte (TTFB)."
        ],
        callout: {
          type: "note",
          text: "A server component that awaits data before returning its JSX tree blocks the entire HTTP streaming chunk for everything below it. Always decompose heavy data fetches into isolated Suspense children."
        }
      },
      {
        heading: "Parallel Data Streaming with React Suspense Slicing",
        paragraphs: [
          "Instead of fetching user profiles, notification counts, and analytics dashboard stats at the root page level, slice the UI into independent asynchronous streaming chunks.",
          "By streaming the static shell instantly from the edge (header, navigation, layout frames in < 25ms), the user gets immediate visual feedback while the heavy database queries resolve in parallel background streams."
        ],
        codeSnippet: {
          filename: "app/dashboard/page.tsx",
          language: "typescript",
          code: `import { Suspense, cache } from "react";
import { UserMetricsSkeleton, ActivityFeedSkeleton } from "@/components/skeletons";

// 1. Request-scoped memoization to eliminate duplicate DB queries
export const getCachedUserData = cache(async (userId: string) => {
  return await db.users.findUnique({ where: { id: userId } });
});

export default async function DashboardPage({ params }: { params: { id: string } }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Fast, edge-cached layout rendered in sub-40ms */}
      <h1 className="text-2xl font-bold col-span-full">Operational Overview</h1>

      {/* Stream component A independently */}
      <Suspense fallback={<UserMetricsSkeleton />}>
        <UserMetrics userId={params.id} />
      </Suspense>

      {/* Stream component B in parallel without blocking component A */}
      <Suspense fallback={<ActivityFeedSkeleton />}>
        <ActivityFeed userId={params.id} />
      </Suspense>
    </div>
  );
}`
        }
      },
      {
        heading: "Fine-Grained Revalidation with Tagged Edge Caches",
        paragraphs: [
          "Time-to-live (TTL) caching is insufficient for modern dynamic applications. If a user updates their billing plan or posts a new comment, you cannot wait 60 seconds for an arbitrary cache timer to expire.",
          "By combining Next.js `fetch` cache tags (`next: { tags: ['user-profile', \`user-\${id}\`] }`) with on-demand `revalidateTag` inside Server Actions, updates propagate globally in under 120ms without purging unrelated site data."
        ]
      },
      {
        heading: "Benchmarked Production Latencies",
        paragraphs: [
          "After restructuring our data layer from serial server awaits to parallel Suspense streaming with tagged edge caching, here is what our production monitoring reported:"
        ],
        metrics: [
          {
            label: "Time to First Byte (TTFB)",
            before: "640ms",
            after: "72ms",
            change: "-88.7%"
          },
          {
            label: "Largest Contentful Paint (LCP)",
            before: "1,850ms",
            after: "410ms",
            change: "-77.8%"
          },
          {
            label: "Client JS Bundle Sent",
            before: "248 KB",
            after: "64 KB",
            change: "-74.1%"
          }
        ]
      }
    ]
  },
  {
    id: "insight-3",
    slug: "client-side-zero-knowledge-web-crypto",
    category: "Security",
    title: "Client-Side Zero-Knowledge Encryption Using the Modern Web Crypto API",
    subtitle:
      "Pushing AES-GCM 256-bit cryptographic primitives to browser sandboxes so server databases store only unreadable cipher blobs with zero master key access.",
    date: "Dec 2025",
    readTime: "6 min read",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1400&auto=format&fit=crop",
    accentColor: "#f59e0b",
    tags: ["Web Crypto", "Security", "AES-GCM", "Zero-Knowledge", "Cryptography", "TypeScript"],
    takeaways: [
      "Never rely on outdated npm crypto libraries like CryptoJS: the native Web Crypto API (`window.crypto.subtle`) runs directly in hardware-accelerated browser C++ runtimes.",
      "Always generate a cryptographically random 96-bit Initialization Vector (IV) for every single AES-GCM encryption pass. Never reuse an IV under the same key.",
      "Derive symmetric encryption keys using PBKDF2 or Argon2 with high iteration counts (minimum 600,000 iterations for SHA-256) and a unique per-user salt."
    ],
    sections: [
      {
        heading: "The Flaw in Traditional 'Server-Side Encryption'",
        paragraphs: [
          "Most web applications claim to have 'military-grade encryption' simply because their database provider encrypts data at rest using Amazon KMS or Google Cloud KMS. But in that model, whoever controls the server or cloud environment possesses the decryption keys. A single SQL injection, compromised server token, or insider threat exposes every user record in plaintext.",
          "In a true Zero-Knowledge (ZK) architecture, cryptographic encryption and decryption occur exclusively on the user's local device inside the browser sandbox. The server functions purely as an unseeing, encrypted storage vault."
        ],
        callout: {
          type: "warning",
          text: "If your server ever receives the user's raw password or unencrypted plaintext payload over the wire, it is NOT zero-knowledge. Encryption must occur before the payload touches the network interface."
        }
      },
      {
        heading: "Native Web Crypto API vs Legacy JS Libraries",
        paragraphs: [
          "Historically, developers used bulky JavaScript libraries like CryptoJS or Forge for client-side hashing. These packages are prone to timing attacks, run in pure JavaScript (meaning keys remain visible in memory dumps), and significantly bloat bundle sizes.",
          "The modern Web Crypto API (`window.crypto.subtle`) is a standard browser primitive. It executes in native browser engine code, benefits from hardware AES-NI CPU instruction sets, and handles key isolation securely."
        ],
        codeSnippet: {
          filename: "lib/crypto/zero-knowledge.ts",
          language: "typescript",
          code: `// Production client-side AES-GCM 256-bit encryption
export async function encryptClientPayload(
  plaintext: string,
  secretKey: CryptoKey
): Promise<{ ciphertext: string; iv: string }> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plaintext);

  // 1. Generate fresh 96-bit Initialization Vector (IV) - NEVER REUSE
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  // 2. Hardware-accelerated authenticated AES-GCM encryption
  const encryptedBuffer = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    secretKey,
    data
  );

  return {
    ciphertext: Buffer.from(encryptedBuffer).toString("base64"),
    iv: Buffer.from(iv).toString("base64"),
  };
}`
        }
      },
      {
        heading: "Nonce Replay Prevention & Key Derivation",
        paragraphs: [
          "In AES-GCM mode, encrypting two different messages with the same key and the same Initialization Vector (IV) destroys the confidentiality guarantees of the Galois Counter Mode and allows an adversary to recover plaintext XOR streams.",
          "We enforce a strict protocol: every encrypted message bundles a randomly sampled 12-byte IV that is stored alongside the ciphertext. During decryption, the IV is unpacked and verified against the authentication tag before plaintext is returned."
        ]
      },
      {
        heading: "Engineering Checklist for Zero-Knowledge Web Apps",
        paragraphs: [
          "• Store derived crypto keys in browser memory only (`extractable: false`), never in unencrypted LocalStorage.",
          "• Use standard PBKDF2 with at least 600,000 iterations to protect against offline dictionary attacks.",
          "• Always include authentication tags (AES-GCM includes 128-bit authentication by default).",
          "• Implement client-side key-rotation workflows for account password changes."
        ]
      }
    ]
  },
  {
    id: "insight-4",
    slug: "high-performance-60fps-motion-craft",
    category: "Motion & UI",
    title: "Building High-Performance 60fps Micro-Interactions with Framer Motion & GSAP",
    subtitle:
      "Why interactive animations drop frames on mobile devices, and how to combine GPU compositor layers, spring physics, and FLIP layouts for silky 60fps responsiveness.",
    date: "Nov 2025",
    readTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1400&auto=format&fit=crop",
    accentColor: "#ec4899",
    tags: ["Framer Motion", "GSAP", "Micro-interactions", "CSS Performance", "60fps", "Animation"],
    takeaways: [
      "Never animate CSS geometric properties like `top`, `left`, `width`, `height`, or `margin`: they trigger expensive synchronous layout reflows and paint cycles.",
      "Confine all real-time animations to the CSS compositor thread using `transform` (`translate3d`, `scale`) and `opacity`.",
      "Combine GSAP for high-frequency physics math (e.g., magnetic cursor followers) with Framer Motion for declarative layout transitions."
    ],
    sections: [
      {
        heading: "The Reflow Tax: Why Web Animations Stutter",
        paragraphs: [
          "When you inspect a janky web app on an iPhone or budget Android device, the culprit is almost always layout thrashing. When a JavaScript animation mutates a property like `height: auto` or `top: 120px` inside a `requestAnimationFrame` loop, the browser must recalculate geometry for every DOM node in the parent tree.",
          "This forces the browser CPU into a continuous cycle of: JavaScript Execution → Style Recalculation → Layout (Reflow) → Paint → Composite. On a 120Hz display, a single frame must complete in 8.3 milliseconds. A reflow calculation easily takes 16ms to 35ms, instantly causing noticeable stutter."
        ],
        callout: {
          type: "tip",
          text: "Animations should live strictly on the GPU compositor thread. By animating exclusively with 'transform' and 'opacity', the browser bypasses both Layout and Paint completely."
        }
      },
      {
        heading: "Hybrid Orchestration: GSAP for Math, Framer Motion for React",
        paragraphs: [
          "React component state updates are inherently batched and asynchronous. For high-frequency interactions like a magnetic button or a cursor light follower that responds to mouse moves at 120Hz, React state updates are too slow.",
          "The solution is a hybrid architecture: we use GSAP with direct DOM element references (`useRef`) for raw mathematical transforms, while utilizing Framer Motion's `layoutId` and `AnimatePresence` for declarative mount/unmount and route transitions."
        ],
        codeSnippet: {
          filename: "components/MagneticInteraction.tsx",
          language: "typescript",
          code: `import { useRef, useEffect } from "react";
import gsap from "gsap";

export function useMagneticInteraction(strength = 0.35) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    // Check prefers-reduced-motion to respect accessibility
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      gsap.to(el, {
        x: deltaX,
        y: deltaY,
        duration: 0.4,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: "elastic.out(1, 0.4)",
      });
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [strength]);

  return elementRef;
}`
        }
      },
      {
        heading: "Accessibility: First-Class `prefers-reduced-motion`",
        paragraphs: [
          "Tactile physics and micro-interactions make a digital experience feel premium, but for users with vestibular disorders, aggressive parallax and spring physics can cause nausea and disorientation.",
          "A production-ready animation architecture always listens for the `(prefers-reduced-motion: reduce)` media query. When active, physics springs should gracefully fall back to instantaneous transitions or gentle opacity fades."
        ]
      }
    ]
  }
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug || a.id === slug);
}

export function getAllArticles(): Article[] {
  return articles;
}
