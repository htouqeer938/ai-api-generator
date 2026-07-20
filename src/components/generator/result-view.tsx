"use client";

import * as React from "react";
import {
  Copy,
  Check,
  Download,
  FileArchive,
  FileText,
  Code2,
  Boxes,
  BookOpen,
  Network,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import type { GeneratedFile, GenerationResult } from "@/types";
import { CodeEditor } from "./code-editor";
import { FileTree } from "./file-tree";
import { AnalysisView } from "./analysis-view";
import { SwaggerPreview } from "./swagger-preview";
import { Markdown } from "./markdown";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { downloadZip, downloadFile, copyToClipboard, concatFiles } from "@/lib/download";

interface ResultViewProps {
  result: GenerationResult;
  title: string;
  notices?: { aiConfigured: boolean; injectionFlagged: boolean; truncated: boolean };
}

export function ResultView({ result, title, notices }: ResultViewProps) {
  const [files, setFiles] = React.useState<GeneratedFile[]>(result.files);
  const [activePath, setActivePath] = React.useState(result.files[0]?.path ?? "");
  const [copied, setCopied] = React.useState(false);
  const [editing, setEditing] = React.useState(false);

  React.useEffect(() => {
    setFiles(result.files);
    setActivePath(result.files[0]?.path ?? "");
  }, [result]);

  const activeFile = files.find((f) => f.path === activePath) ?? files[0];

  const updateActive = (code: string) => {
    setFiles((prev) => prev.map((f) => (f.path === activePath ? { ...f, code } : f)));
  };

  const copyActive = async () => {
    if (!activeFile) return;
    const ok = await copyToClipboard(activeFile.code);
    if (ok) {
      setCopied(true);
      toast.success("File copied");
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const copyAll = async () => {
    const ok = await copyToClipboard(concatFiles(files));
    if (ok) toast.success(`Copied ${files.length} files`);
  };

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "backend";

  return (
    <div className="space-y-4">
      {/* Header / summary */}
      <Card className="p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              <Badge className="gap-1">
                <Sparkles className="h-3 w-3" />
                {result.meta.mock ? "Mock generation" : `Model: ${result.meta.model}`}
              </Badge>
              <Badge variant="secondary">{result.meta.options.framework}</Badge>
              <Badge variant="secondary">{result.meta.options.database}</Badge>
              <Badge variant="outline">{files.length} files</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{result.summary}</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={copyAll}>
              <Copy className="h-4 w-4" /> Copy all
            </Button>
            <Button variant="gradient" size="sm" onClick={() => downloadZip(files, slug)}>
              <FileArchive className="h-4 w-4" /> Download ZIP
            </Button>
          </div>
        </div>

        {notices && (notices.injectionFlagged || notices.truncated || !notices.aiConfigured) && (
          <div className="mt-3 flex flex-col gap-1.5 text-xs">
            {!notices.aiConfigured && (
              <p className="flex items-center gap-1.5 text-muted-foreground">
                <AlertTriangle className="h-3.5 w-3.5" />
                Running in mock mode — add an OPENAI_API_KEY for full AI generation.
              </p>
            )}
            {notices.injectionFlagged && (
              <p className="flex items-center gap-1.5 text-amber-500">
                <AlertTriangle className="h-3.5 w-3.5" />
                Potential prompt-injection markers detected — input was treated strictly as data.
              </p>
            )}
            {notices.truncated && (
              <p className="flex items-center gap-1.5 text-amber-500">
                <AlertTriangle className="h-3.5 w-3.5" /> Input was truncated to 20,000 characters.
              </p>
            )}
          </div>
        )}
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="files">
        <TabsList className="flex-wrap">
          <TabsTrigger value="files">
            <Code2 className="h-4 w-4" /> Files
          </TabsTrigger>
          <TabsTrigger value="analysis">
            <Boxes className="h-4 w-4" /> Analysis
          </TabsTrigger>
          <TabsTrigger value="api">
            <Network className="h-4 w-4" /> API
          </TabsTrigger>
          <TabsTrigger value="explanation">
            <FileText className="h-4 w-4" /> Explanation
          </TabsTrigger>
          <TabsTrigger value="readme">
            <BookOpen className="h-4 w-4" /> README
          </TabsTrigger>
        </TabsList>

        {/* Files */}
        <TabsContent value="files">
          <Card className="overflow-hidden">
            <div className="grid h-[600px] grid-cols-1 md:grid-cols-[260px_1fr]">
              <div className="hidden border-r border-border md:block">
                <FileTree files={files} activePath={activePath} onSelect={(f) => setActivePath(f.path)} />
              </div>
              <div className="flex min-w-0 flex-col">
                <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-2">
                  <code className="truncate text-xs text-muted-foreground">
                    {activeFile?.path}
                  </code>
                  <div className="flex shrink-0 gap-1">
                    <Button
                      variant={editing ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setEditing((v) => !v)}
                    >
                      {editing ? "Done" : "Edit"}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={copyActive} aria-label="Copy file">
                      {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => activeFile && downloadFile(activeFile)}
                      aria-label="Download file"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {/* Mobile file selector */}
                <div className="border-b border-border p-2 md:hidden">
                  <select
                    value={activePath}
                    onChange={(e) => setActivePath(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-xs"
                  >
                    {files.map((f) => (
                      <option key={f.path} value={f.path}>
                        {f.path}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="min-h-0 flex-1">
                  {activeFile && (
                    <CodeEditor
                      value={activeFile.code}
                      path={activeFile.path}
                      readOnly={!editing}
                      onChange={updateActive}
                    />
                  )}
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="analysis">
          <Card className="h-[600px] overflow-hidden">
            <AnalysisView analysis={result.analysis} />
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card className="h-[600px] overflow-hidden">
            <SwaggerPreview endpoints={result.endpoints} />
          </Card>
        </TabsContent>

        <TabsContent value="explanation">
          <Card className="h-[600px] overflow-hidden">
            <div className="scrollbar-thin h-full overflow-y-auto p-6">
              <Markdown content={result.explanation} className="text-sm" />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="readme">
          <Card className="h-[600px] overflow-hidden">
            <div className="scrollbar-thin h-full overflow-y-auto p-6">
              <Markdown content={result.readme} className="text-sm" />
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
