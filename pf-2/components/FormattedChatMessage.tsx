"use client";

import React from "react";

interface FormattedChatMessageProps {
  content: string;
}

export default function FormattedChatMessage({ content }: FormattedChatMessageProps) {
  // Helper to parse inline markdown (bold, links, code) within a line
  const parseInline = (text: string): React.ReactNode[] => {
    // Regex matching bold **...**, inline code `...`, and markdown links [text](url)
    const regex = /(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\))/g;
    const parts = text.split(regex);

    return parts.map((part, i) => {
      if (!part) return null;

      // Bold: **text**
      if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
        return (
          <strong key={i} className="font-semibold text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }

      // Inline code: `text`
      if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
        return (
          <code
            key={i}
            className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-white/10 text-emerald-300 border border-white/10"
          >
            {part.slice(1, -1)}
          </code>
        );
      }

      // Link: [text](url)
      const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
      if (linkMatch) {
        return (
          <a
            key={i}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:text-emerald-300 underline font-medium transition-colors"
          >
            {linkMatch[1]}
          </a>
        );
      }

      return part;
    });
  };

  // Split content by paragraphs or blocks
  const blocks = content.split(/\n\n+/);

  return (
    <div className="space-y-2.5 text-xs sm:text-sm text-zinc-200 leading-relaxed">
      {blocks.map((block, bIdx) => {
        const lines = block.split("\n");

        // Check if block is a bullet list
        const isBulletList = lines.every((line) => /^\s*([*\-•])\s+/.test(line));
        if (isBulletList) {
          return (
            <ul key={bIdx} className="space-y-1.5 my-1.5 pl-1">
              {lines.map((line, lIdx) => {
                const cleanLine = line.replace(/^\s*([*\-•])\s+/, "");
                return (
                  <li key={lIdx} className="flex items-start gap-2">
                    <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5" />
                    <span>{parseInline(cleanLine)}</span>
                  </li>
                );
              })}
            </ul>
          );
        }

        // Check if block is a numbered list
        const isNumberedList = lines.every((line) => /^\s*\d+\.\s+/.test(line));
        if (isNumberedList) {
          return (
            <ol key={bIdx} className="space-y-1.5 my-1.5 pl-1">
              {lines.map((line, lIdx) => {
                const match = line.match(/^\s*(\d+)\.\s+(.*)/);
                const num = match ? match[1] : `${lIdx + 1}`;
                const cleanLine = match ? match[2] : line;
                return (
                  <li key={lIdx} className="flex items-start gap-2">
                    <span className="shrink-0 font-mono text-[10px] text-zinc-400 font-bold mt-0.5">
                      {num}.
                    </span>
                    <span>{parseInline(cleanLine)}</span>
                  </li>
                );
              })}
            </ol>
          );
        }

        // Check if heading: ###
        if (block.startsWith("### ")) {
          return (
            <h5 key={bIdx} className="font-semibold text-white tracking-wide mt-2 mb-1">
              {parseInline(block.replace(/^###\s+/, ""))}
            </h5>
          );
        }

        // Regular paragraph with potential mixed lines
        return (
          <p key={bIdx} className="last:mb-0">
            {lines.map((line, lIdx) => {
              if (/^\s*([*\-•])\s+/.test(line)) {
                const cleanLine = line.replace(/^\s*([*\-•])\s+/, "");
                return (
                  <span key={lIdx} className="flex items-start gap-2 my-1 pl-1">
                    <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5" />
                    <span>{parseInline(cleanLine)}</span>
                  </span>
                );
              }
              return (
                <React.Fragment key={lIdx}>
                  {parseInline(line)}
                  {lIdx < lines.length - 1 && <br />}
                </React.Fragment>
              );
            })}
          </p>
        );
      })}
    </div>
  );
}

