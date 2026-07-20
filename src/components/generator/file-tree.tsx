"use client";

import * as React from "react";
import {
  ChevronRight,
  File,
  FileCode,
  FileJson,
  FileText,
  Folder,
  FolderOpen,
} from "lucide-react";
import type { GeneratedFile } from "@/types";
import { cn } from "@/lib/utils";

interface TreeNode {
  name: string;
  path: string;
  children: Map<string, TreeNode>;
  file?: GeneratedFile;
}

function buildTree(files: GeneratedFile[]): TreeNode {
  const root: TreeNode = { name: "", path: "", children: new Map() };
  for (const file of files) {
    const parts = file.path.split("/");
    let node = root;
    parts.forEach((part, i) => {
      const isLeaf = i === parts.length - 1;
      if (!node.children.has(part)) {
        node.children.set(part, {
          name: part,
          path: parts.slice(0, i + 1).join("/"),
          children: new Map(),
          file: isLeaf ? file : undefined,
        });
      }
      node = node.children.get(part)!;
    });
  }
  return root;
}

function fileIcon(name: string) {
  if (name.endsWith(".json")) return FileJson;
  if (name.endsWith(".md")) return FileText;
  if (/\.(ts|tsx|js|jsx|mjs|prisma)$/.test(name)) return FileCode;
  return File;
}

function sortEntries(nodes: TreeNode[]) {
  return [...nodes].sort((a, b) => {
    const aDir = a.children.size > 0 && !a.file;
    const bDir = b.children.size > 0 && !b.file;
    if (aDir !== bDir) return aDir ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

function Node({
  node,
  depth,
  activePath,
  onSelect,
  openByDefault,
}: {
  node: TreeNode;
  depth: number;
  activePath: string;
  onSelect: (file: GeneratedFile) => void;
  openByDefault: boolean;
}) {
  const [open, setOpen] = React.useState(depth < 2 || openByDefault);
  const isFolder = !node.file;

  if (isFolder) {
    return (
      <div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center gap-1.5 rounded-md py-1 pr-2 text-sm text-foreground/90 transition-colors hover:bg-accent"
          style={{ paddingLeft: depth * 12 + 8 }}
        >
          <ChevronRight
            className={cn("h-3.5 w-3.5 shrink-0 transition-transform", open && "rotate-90")}
          />
          {open ? (
            <FolderOpen className="h-4 w-4 shrink-0 text-amber-500" />
          ) : (
            <Folder className="h-4 w-4 shrink-0 text-amber-500" />
          )}
          <span className="truncate">{node.name}</span>
        </button>
        {open && (
          <div>
            {sortEntries([...node.children.values()]).map((child) => (
              <Node
                key={child.path}
                node={child}
                depth={depth + 1}
                activePath={activePath}
                onSelect={onSelect}
                openByDefault={openByDefault}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  const Icon = fileIcon(node.name);
  const active = node.path === activePath;
  return (
    <button
      onClick={() => node.file && onSelect(node.file)}
      className={cn(
        "flex w-full items-center gap-1.5 rounded-md py-1 pr-2 text-sm transition-colors",
        active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground"
      )}
      style={{ paddingLeft: depth * 12 + 8 + 18 }}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="truncate">{node.name}</span>
    </button>
  );
}

export function FileTree({
  files,
  activePath,
  onSelect,
}: {
  files: GeneratedFile[];
  activePath: string;
  onSelect: (file: GeneratedFile) => void;
}) {
  const [query, setQuery] = React.useState("");
  const filtered = React.useMemo(
    () =>
      query
        ? files.filter((f) => f.path.toLowerCase().includes(query.toLowerCase()))
        : files,
    [files, query]
  );
  const tree = React.useMemo(() => buildTree(filtered), [filtered]);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border p-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search files…"
          className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      <div className="scrollbar-thin flex-1 overflow-y-auto p-1.5">
        {sortEntries([...tree.children.values()]).map((child) => (
          <Node
            key={child.path}
            node={child}
            depth={0}
            activePath={activePath}
            onSelect={onSelect}
            openByDefault={Boolean(query)}
          />
        ))}
        {filtered.length === 0 && (
          <p className="p-4 text-center text-xs text-muted-foreground">No files match.</p>
        )}
      </div>
    </div>
  );
}
