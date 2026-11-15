import { Fragment, type ReactNode } from "react";

const ACCENT = "#E8B04A";

const INLINE =
  /(\*\*[^*\n]+\*\*|`[^`\n]+`|\[[^\]\n]+\]\([^)\s]+\)|https?:\/\/[^\s)]+|[\w.+-]+@[\w-]+\.[\w.-]+)/g;

const linkClass =
  "underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-[#E8B04A] hover:text-[#E8B04A]";

function isSafeUrl(url: string) {
  return /^(https?:\/\/|mailto:)/i.test(url);
}

function renderInline(text: string): ReactNode[] {
  return text.split(INLINE).map((part, i) => {
    if (!part) return null;

    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={i} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code
          key={i}
          className="rounded-md border border-white/10 bg-white/[0.07] px-1.5 py-0.5 font-mono text-[0.85em] text-[#f6d58f]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    const md = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (md) {
      return isSafeUrl(md[2]) ? (
        <a
          key={i}
          href={md[2]}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          {md[1]}
        </a>
      ) : (
        <Fragment key={i}>{md[1]}</Fragment>
      );
    }
    if (/^https?:\/\//.test(part)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          {part}
        </a>
      );
    }
    if (/^[\w.+-]+@[\w-]+\.[\w.-]+$/.test(part)) {
      return (
        <a key={i} href={`mailto:${part}`} className={linkClass}>
          {part}
        </a>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

type Block =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "code"; text: string };

function parse(content: string): Block[] {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i++;
      continue;
    }

    // Fenced code block
    if (line.trim().startsWith("```")) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        buf.push(lines[i]);
        i++;
      }
      i++;
      blocks.push({ type: "code", text: buf.join("\n") });
      continue;
    }

    // Heading
    const h = line.match(/^#{1,4}\s+(.*)$/);
    if (h) {
      blocks.push({ type: "h", text: h[1] });
      i++;
      continue;
    }

    // Bullet list
    if (/^\s*[-*•]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*•]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*•]\s+/, ""));
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    // Numbered list
    if (/^\s*\d+[.)]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+[.)]\s+/, ""));
        i++;
      }
      blocks.push({ type: "ol", items });
      continue;
    }

    // Paragraph: gather until blank line or another block starts
    const buf: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith("```") &&
      !/^#{1,4}\s+/.test(lines[i]) &&
      !/^\s*[-*•]\s+/.test(lines[i]) &&
      !/^\s*\d+[.)]\s+/.test(lines[i])
    ) {
      buf.push(lines[i]);
      i++;
    }
    blocks.push({ type: "p", text: buf.join("\n") });
  }

  return blocks;
}

export default function FormattedChatMessage({ content }: { content: string }) {
  const blocks = parse(content);

  return (
    <div className="space-y-3 break-words">
      {blocks.map((b, idx) => {
        switch (b.type) {
          case "h":
            return (
              <p
                key={idx}
                className="pt-1 text-[13px] font-semibold uppercase tracking-[0.12em] text-white"
              >
                {renderInline(b.text)}
              </p>
            );
          case "ul":
            return (
              <ul key={idx} className="space-y-1.5">
                {b.items.map((item, j) => (
                  <li key={j} className="flex gap-2.5">
                    <span
                      className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: ACCENT }}
                    />
                    <span className="min-w-0">{renderInline(item)}</span>
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={idx} className="space-y-1.5">
                {b.items.map((item, j) => (
                  <li key={j} className="flex gap-2.5">
                    <span
                      className="w-4 shrink-0 text-right font-mono text-xs leading-[1.7]"
                      style={{ color: ACCENT }}
                    >
                      {j + 1}.
                    </span>
                    <span className="min-w-0">{renderInline(item)}</span>
                  </li>
                ))}
              </ol>
            );
          case "code":
            return (
              <pre
                key={idx}
                className="overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-3 font-mono text-xs leading-relaxed text-zinc-200"
              >
                <code>{b.text}</code>
              </pre>
            );
          default:
            return (
              <p key={idx} className="whitespace-pre-line">
                {renderInline(b.text)}
              </p>
            );
        }
      })}
    </div>
  );
}