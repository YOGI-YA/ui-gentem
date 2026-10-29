import { NextRequest, NextResponse } from "next/server";
import { personalInfo, projects, techStack, services, manifesto } from "@/lib/data";

const SYSTEM_PROMPT = `
You are "YogiBot", the witty, brilliant, and helpful autonomous AI assistant embedded inside Yogender Verma's personal portfolio.
Your role is to showcase Yogender's expertise, architecture decisions, and background to engineering leaders, clients, and recruiters.

Here are the verified facts about Yogender Verma:
- Full Name: ${personalInfo.name}
- Current Title: ${personalInfo.role}
- Email: ${personalInfo.email}
- GitHub: ${personalInfo.github}
- LinkedIn: ${personalInfo.linkedin}
- Twitter/X: ${personalInfo.twitter}
- Location: ${personalInfo.location}
- Philosophy: "${manifesto}"
- Primary Tech Stack: ${techStack.join(", ")}

Services & Capabilities:
${services.map((s) => `- ${s.title}: ${s.description}`).join("\n")}

Featured Projects:
${projects.map((p) => `- ${p.title} (${p.category}): ${p.summary}. Stack: ${p.stack.join(", ")}`).join("\n")}

Guidelines:
1. Be concise, highly professional, technically articulate, and warm.
2. Emphasize full-stack craft, scalable systems, and cutting-edge AI integrations.
3. If asked about hiring or contacting, enthusiastically provide his email (${personalInfo.email}) and GitHub/LinkedIn.
4. Keep responses punchy and formatted in clean markdown.
`;

const CANDIDATE_MODELS = [
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
  "qwen/qwen3.8-27b",
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
];

export async function POST(req: NextRequest) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 });
    }

    const { messages } = body;
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages array" }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (apiKey) {
      // Try candidate models in order until one succeeds
      for (const model of CANDIDATE_MODELS) {
        try {
          const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey.trim()}`,
            },
            body: JSON.stringify({
              model: model,
              messages: [
                { role: "system", content: SYSTEM_PROMPT },
                ...messages.slice(-8),
              ],
              temperature: 0.7,
              max_tokens: 500,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            const reply = data.choices?.[0]?.message?.content;
            if (reply) {
              return NextResponse.json({
                reply,
                model: model.replace("openai/", "").replace("qwen/", ""),
                isGroq: true,
              });
            }
          } else {
            console.warn(`Groq model ${model} failed with status: ${response.status}`);
          }
        } catch (callErr) {
          console.warn(`Error trying Groq model ${model}:`, callErr);
        }
      }
    }

    // Context-aware fallback if Groq call failed or key was unset
    const userMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";

    let fallbackReply = "";
    if (userMessage.includes("contact") || userMessage.includes("hire") || userMessage.includes("email")) {
      fallbackReply = `You can reach Yogender directly at **[${personalInfo.email}](mailto:${personalInfo.email})**. You can also connect with him on [LinkedIn](${personalInfo.linkedin}) or view his repositories on [GitHub](${personalInfo.github}).`;
    } else if (userMessage.includes("stack") || userMessage.includes("tech") || userMessage.includes("skill")) {
      fallbackReply = `Yogender specializes in **Full-Stack & AI Systems**. His core technologies include:\n\n* **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion, GSAP\n* **Backend:** Node.js, Python, PostgreSQL, REST & GraphQL\n* **AI & Systems:** Groq API, AI Agents, RAG Pipelines, Docker, LangChain`;
    } else if (userMessage.includes("project") || userMessage.includes("work")) {
      fallbackReply = `Here are some of Yogender's key projects:\n\n1. **Call Screener AI**: Real-time acoustic & voice AI assistant for screening inquiries with instant transcription.\n2. **Graa AI**: Educational AI intelligence engine analyzing syllabus roadmaps.\n3. **Pixzen & UI-Gentem**: High-taste design systems and interactive Next.js web experiences.`;
    } else if (userMessage.includes("philosophy")) {
      fallbackReply = `"${manifesto}"\n\nYogender designs systems where engineering precision meets fluid micro-interactions and tactile visual taste.`;
    } else {
      fallbackReply = `Hello! I'm **YogiBot**, Yogender's AI companion. \n\nI can answer questions about Yogender's work in **${personalInfo.role}**, his projects, technical stack, or how to collaborate with him.`;
    }

    return NextResponse.json({
      reply: fallbackReply,
      model: "Knowledge Base",
      isFallback: true,
    });
  } catch (error: unknown) {
    console.error("Chat API error:", error);
    // Never crash with unhandled 500 error, return graceful fallback!
    return NextResponse.json({
      reply: `Hello! I'm **YogiBot**. I had a slight connection hiccup, but Yogender is reachable at **[${personalInfo.email}](mailto:${personalInfo.email})** or on [GitHub](${personalInfo.github})!`,
      isFallback: true,
    });
  }
}
