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

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages array" }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (apiKey) {
      // Connect to Groq Cloud API
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages.slice(-8), // Keep context window clean
          ],
          temperature: 0.7,
          max_tokens: 600,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Groq API error:", errorText);
        return NextResponse.json({
          reply: `Groq connection issue (${response.status}). Here is what I can tell you about Yogender: He is a ${personalInfo.role} skilled in ${techStack.slice(0, 5).join(", ")}.`,
          isFallback: true,
        });
      }

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || "I'm here to help you explore Yogender's work!";
      return NextResponse.json({ reply, model: "llama-3.3-70b-versatile", isGroq: true });
    }

    // Intelligent fallback when GROQ_API_KEY is not yet supplied
    const userMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";

    let fallbackReply = "";
    if (userMessage.includes("contact") || userMessage.includes("hire") || userMessage.includes("email")) {
      fallbackReply = `You can reach Yogender directly at **[${personalInfo.email}](mailto:${personalInfo.email})**. You can also connect with him on [LinkedIn](${personalInfo.linkedin}) or view his repositories on [GitHub](${personalInfo.github}).`;
    } else if (userMessage.includes("stack") || userMessage.includes("tech") || userMessage.includes("skill")) {
      fallbackReply = `Yogender specializes in **Full-Stack & AI Systems**. His core technologies include:\n\n* **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion, GSAP\n* **Backend:** Node.js, Python, PostgreSQL, REST & GraphQL\n* **AI & Systems:** Groq API, AI Agents, RAG Pipelines, Docker, LangChain\n\n*(Note: Add your \`GROQ_API_KEY\` in \`.env.local\` to activate real-time Llama 3.3 streaming!)*`;
    } else if (userMessage.includes("project") || userMessage.includes("work")) {
      fallbackReply = `Here are some of Yogender's key projects:\n\n1. **Call Screener AI**: Real-time acoustic & voice AI assistant for screening inquiries with instant transcription.\n2. **Graa AI**: Educational AI intelligence engine analyzing syllabus roadmaps.\n3. **Pixzen & UI-Gentem**: High-taste design systems and interactive Next.js web experiences.\n\n*(Connect your \`GROQ_API_KEY\` to dive into deep technical architecture questions!)*`;
    } else if (userMessage.includes("philosophy")) {
      fallbackReply = `"${manifesto}"\n\nYogender designs systems where engineering precision meets fluid micro-interactions and tactile visual taste.`;
    } else {
      fallbackReply = `Hello! I'm **YogiBot**, Yogender's interactive AI companion. \n\nI can answer questions about Yogender's experience in **${personalInfo.role}**, his projects, technical stack, or how to collaborate.\n\n*(Tip: Once you provide your Groq API key, I will be fully powered by Llama 3.3 70B!)*`;
    }

    return NextResponse.json({
      reply: fallbackReply,
      isFallback: true,
      hint: "Add GROQ_API_KEY to .env.local for live Groq Llama 3.3 completions.",
    });
  } catch (error: unknown) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process chat message", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

