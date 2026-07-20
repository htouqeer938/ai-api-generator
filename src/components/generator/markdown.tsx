"use client";

import * as React from "react";

/* ─────────────────────────────────────────────────────────────
 * Tiny, dependency-free Markdown renderer. Supports headings,
 * bold, inline code, fenced code blocks, unordered lists and
 * paragraphs — enough for AI explanations and READMEs. Content is
 * escaped before formatting so it is safe to render.
 * ───────────────────────────────────────────────────────────── */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function inline(s: string): string {
  return escapeHtml(s)
    .replace(/`([^`]+)`/g, '<code class="rounded bg-muted px-1.5 py-0.5 text-[0.85em] font-mono">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a class="text-primary underline underline-offset-2" href="$2" target="_blank" rel="noreferrer">$1</a>'
    );
}

function render(md: string): string {
  const lines = md.split("\n");
  const html: string[] = [];
  let inCode = false;
  let codeBuf: string[] = [];
  let listBuf: string[] = [];

  const flushList = () => {
    if (listBuf.length) {
      html.push(
        `<ul class="my-3 list-disc space-y-1 pl-6">${listBuf
          .map((li) => `<li>${inline(li)}</li>`)
          .join("")}</ul>`
      );
      listBuf = [];
    }
  };

  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      if (inCode) {
        html.push(
          `<pre class="scrollbar-thin my-3 overflow-x-auto rounded-lg bg-muted p-4 text-[0.85em]"><code class="font-mono">${escapeHtml(
            codeBuf.join("\n")
          )}</code></pre>`
        );
        codeBuf = [];
        inCode = false;
      } else {
        flushList();
        inCode = true;
      }
      continue;
    }
    if (inCode) {
      codeBuf.push(line);
      continue;
    }
    if (/^#{1,6}\s/.test(line)) {
      flushList();
      const level = line.match(/^#+/)![0].length;
      const text = line.replace(/^#+\s/, "");
      const size =
        level === 1 ? "text-xl" : level === 2 ? "text-lg" : "text-base";
      html.push(
        `<h${level} class="mt-5 mb-2 ${size} font-semibold">${inline(text)}</h${level}>`
      );
      continue;
    }
    if (/^\s*[-*]\s/.test(line)) {
      listBuf.push(line.replace(/^\s*[-*]\s/, ""));
      continue;
    }
    if (line.trim() === "") {
      flushList();
      continue;
    }
    flushList();
    html.push(`<p class="my-2 leading-relaxed">${inline(line)}</p>`);
  }
  flushList();
  return html.join("");
}

export function Markdown({ content, className }: { content: string; className?: string }) {
  const html = React.useMemo(() => render(content || ""), [content]);
  return (
    <div
      className={className}
      // Content is escaped in render(); only our own formatting tags are injected.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
