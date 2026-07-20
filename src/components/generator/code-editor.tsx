"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { Skeleton } from "@/components/ui/skeleton";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full rounded-none" />,
});

/** Map a file path to a Monaco language id. */
export function languageFromPath(path: string): string {
  const ext = path.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "ts":
    case "tsx":
      return "typescript";
    case "js":
    case "jsx":
    case "mjs":
      return "javascript";
    case "json":
      return "json";
    case "md":
      return "markdown";
    case "prisma":
      return "graphql"; // closest built-in highlighting
    case "yml":
    case "yaml":
      return "yaml";
    case "env":
      return "ini";
    default:
      return "plaintext";
  }
}

interface CodeEditorProps {
  value: string;
  language?: string;
  path?: string;
  readOnly?: boolean;
  onChange?: (value: string) => void;
  height?: string | number;
}

export function CodeEditor({
  value,
  language,
  path,
  readOnly = false,
  onChange,
  height = "100%",
}: CodeEditorProps) {
  const { resolvedTheme } = useTheme();
  const lang = language ?? (path ? languageFromPath(path) : "typescript");

  return (
    <MonacoEditor
      height={height}
      language={lang}
      path={path}
      theme={resolvedTheme === "dark" ? "vs-dark" : "light"}
      value={value}
      onChange={(v) => onChange?.(v ?? "")}
      options={{
        readOnly,
        fontSize: 13,
        fontFamily: "var(--font-mono, ui-monospace, monospace)",
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        smoothScrolling: true,
        padding: { top: 16, bottom: 16 },
        lineNumbers: "on",
        renderLineHighlight: "line",
        automaticLayout: true,
        tabSize: 2,
        wordWrap: "on",
        scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
      }}
    />
  );
}
