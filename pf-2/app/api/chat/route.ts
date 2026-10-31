import { NextRequest, NextResponse } from "next/server";
import { personalInfo, projects, techStack, services, manifesto, experiences, education } from "@/lib/data";

const SYSTEM_PROMPT = `
You are the intelligent portfolio assistant embedded inside Yogender Verma's personal portfolio website.
Your role is to answer questions from recruiters, clients, and visitors about Yogender's background, engineering experience, skills, and projects in a professional, clear, and well-structured manner.

VERIFIED FACTS ABOUT YOGENDER VERMA:
- Full Name: ${personalInfo.name}
- Current Role: Full Stack Developer at ICFAI Group (Aug 2026 – Present)
- Previous Experience:
  * Full Stack Developer at Excellence Technology (Jan 2026 – Jun 2026, Mohali, Punjab)
  * Backend Developer Intern at Solitaire Infosys (Jun 2024 – Aug 2024, Chandigarh)
  * Full Stack Developer Intern at The Website Makers (Jul 2023 – Oct 2023)
- Education: B.Tech in Computer Science & Engineering from The ICFAI University, Himachal Pradesh (2022 – 2026, CGPA: 7.9)
- Location: Himachal, India (Open to Work & Global Opportunities)
- Email: ${personalInfo.email}
- GitHub: ${personalInfo.github}
- LinkedIn: ${personalInfo.linkedin}
- Twitter/X: ${personalInfo.twitter}
- Core Tech Stack: ${techStack.join(", ")}

Services & Capabilities:
${services.map((s) => `- ${s.title}: ${s.description}`).join("\n")}

Featured Projects:
${projects.map((p) => `- ${p.title} (${p.category}): ${p.summary}. Stack: ${p.stack.join(", ")}`).join("\n")}

FORMATTING GUIDELINES:
1. Always format your responses clearly using Markdown:
   - Use **bold** for key technologies, names, and emphasis.
   - Use clean bullet points (* or -) for lists of skills or features.
   - Use numbered lists (1., 2.) for steps or project showcases.
   - Use \`inline code\` for technical terms, frameworks, or commands.
   - Keep paragraphs concise with proper line breaks.
2. Be direct, authentic, and technically articulate. Avoid robotic gimmicks ("beep boop").
3. If asked how to contact or hire him, provide his email (${personalInfo.email}) and links to his LinkedIn and GitHub.
`;

const CANDIDATE_MODELS = [
  "qwen/qwen3.8-27b",
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
  "allam-2-7b",
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

    const apiKey =
      process.env.GROQ_API_KEY ||
      process.env.GROQ_APIKEY ||
      process.env.NEXT_PUBLIC_GROQ_API_KEY;

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
              temperature: 0.65,
              max_tokens: 650,
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
      fallbackReply = `You can reach Yogender directly at **[${personalInfo.email}](mailto:${personalInfo.email})**.\n\nYou can also connect with him on **[LinkedIn](${personalInfo.linkedin})** or view his open-source work on **[GitHub](${personalInfo.github})**.`;
    } else if (userMessage.includes("stack") || userMessage.includes("tech") || userMessage.includes("skill")) {
      fallbackReply = `Yogender specializes in **Full-Stack Web Development & Modern Software Systems**:\n\n* **Frontend:** Next.js, React 19, TypeScript, Tailwind CSS, Framer Motion\n* **Backend:** Node.js, Express.js, PostgreSQL, MongoDB, RESTful APIs, JWT Auth\n* **Architecture:** Scalable API systems, clean micro-interactions, responsive UI`;
    } else if (userMessage.includes("project") || userMessage.includes("work")) {
      fallbackReply = `Here are some of Yogender's key featured projects:\n\n1. **Call Screener AI**: Real-time acoustic & voice AI assistant for screening inquiries with instant transcription.\n2. **Graa AI**: Educational intelligence engine analyzing syllabus roadmaps.\n3. **Pixzen & UI-Gentem**: High-craft design systems and interactive Next.js web applications.`;
    } else if (userMessage.includes("experience") || userMessage.includes("job") || userMessage.includes("education") || userMessage.includes("college") || userMessage.includes("university")) {
      fallbackReply = `Here is Yogender's professional and academic timeline:\n\n* **Full Stack Developer** at **ICFAI Group** *(Aug 2026 – Present)*\n* **Full Stack Developer** at **Excellence Technology** *(Jan 2026 – Jun 2026)*\n* **Backend Developer Intern** at **Solitaire Infosys** *(Jun 2024 – Aug 2024)*\n* **Full Stack Developer Intern** at **The Website Makers** *(Jul 2023 – Oct 2023)*\n* **Education:** ${education.degree} from **${education.institution}** *(2022 – 2026, CGPA: ${education.cgpa})*`;
    } else if (userMessage.includes("about") || userMessage.includes("location") || userMessage.includes("where") || userMessage.includes("himachal") || userMessage.includes("opportunity")) {
      fallbackReply = `Yogender Verma is a **Full-Stack Developer** based in **${personalInfo.location}**.\n\nHe is currently engineering web platforms at **ICFAI Group** and is open to full-stack engineering roles and opportunities worldwide.`;
    } else {
      fallbackReply = `Hello! I'm Yogender's portfolio assistant.\n\nI can answer questions regarding his work at **ICFAI Group**, his experience at **Excellence Technology**, his tech stack (**Next.js, React, Node.js, TypeScript**), or how to get in touch.`;
    }

    return NextResponse.json({
      reply: fallbackReply,
      model: "Knowledge Base",
      isFallback: true,
    });
  } catch (error: unknown) {
    console.error("Chat API error:", error);
    return NextResponse.json({
      reply: `Hello! Yogender is reachable directly via email at **[${personalInfo.email}](mailto:${personalInfo.email})** or on **[GitHub](${personalInfo.github})**!`,
      isFallback: true,
    });
  }
}
