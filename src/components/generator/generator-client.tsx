"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import {
  Sparkles,
  Wand2,
  Trash2,
  Loader2,
  Settings2,
  Braces,
} from "lucide-react";
import { toast } from "sonner";
import type { GenerationOptions, GenerationResult } from "@/types";
import { useGenerate, useImprovePrompt } from "@/hooks/use-generate";
import { useHistory, fetchHistoryRecord } from "@/hooks/use-history";
import { loadSettings } from "@/hooks/use-settings";
import { TEMPLATES } from "@/lib/templates";
import { CodeEditor } from "./code-editor";
import { OptionsPanel } from "./options-panel";
import { ResultView } from "./result-view";
import { ExamplesDialog } from "./examples-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const DEFAULT_OPTIONS: GenerationOptions = {
  database: "postgresql",
  schemaType: "english",
  framework: "express",
  language: "typescript",
  auth: { jwt: true, refreshToken: true },
  validation: { zod: true, joi: false },
  documentation: { swagger: true, openapi: true },
};

const PLACEHOLDER = `Describe your backend, or paste a schema…

e.g. "Build an e-commerce backend with users, products,
categories, carts, orders and payments."

Or switch "Schema type" to SQL / Prisma / Mongoose and
paste your schema directly.`;

function GeneratingSkeleton() {
  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center gap-2 text-sm font-medium">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        Generating your backend…
      </div>
      <div className="space-y-3">
        {["Analyzing schema", "Designing architecture", "Writing files", "Finalizing docs"].map(
          (step, i) => (
            <div key={step} className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3 w-40" style={{ opacity: 1 - i * 0.15 }} />
                <Skeleton className="h-2.5 w-full" />
              </div>
            </div>
          )
        )}
      </div>
    </Card>
  );
}

export function GeneratorClient() {
  const params = useSearchParams();
  const [input, setInput] = React.useState("");
  const [options, setOptions] = React.useState<GenerationOptions>(DEFAULT_OPTIONS);
  const [result, setResult] = React.useState<GenerationResult | null>(null);
  const [notices, setNotices] = React.useState<
    { aiConfigured: boolean; injectionFlagged: boolean; truncated: boolean } | undefined
  >();
  const [title, setTitle] = React.useState("Untitled backend");

  const generate = useGenerate();
  const improve = useImprovePrompt();
  const { add: addHistory } = useHistory();

  // Apply user defaults + hydrate from ?template= or ?id=.
  React.useEffect(() => {
    const settings = loadSettings();
    setOptions((o) => ({
      ...o,
      framework: settings.defaultFramework,
      database: settings.defaultDatabase,
    }));

    const templateId = params.get("template");
    const historyId = params.get("id");

    if (templateId) {
      const tpl = TEMPLATES.find((t) => t.id === templateId);
      if (tpl) {
        setInput(tpl.input);
        setOptions((o) => ({ ...o, schemaType: tpl.schemaType }));
        setTitle(tpl.name);
      }
    } else if (historyId) {
      // Reopen a saved generation from MongoDB.
      fetchHistoryRecord(historyId).then((record) => {
        if (record) {
          setInput(record.input);
          setOptions(record.result.meta.options);
          setResult(record.result);
          setTitle(record.title);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateOptions = (patch: Partial<GenerationOptions>) =>
    setOptions((o) => ({ ...o, ...patch }));

  const deriveTitle = (text: string) => {
    const firstLine = text.trim().split("\n")[0].slice(0, 60);
    return firstLine || "Untitled backend";
  };

  const onGenerate = async () => {
    if (input.trim().length < 3) {
      toast.error("Please provide a schema or description first.");
      return;
    }
    try {
      const res = await generate.mutateAsync({ ...options, input });
      setResult(res.result);
      setNotices(res.notices);
      const newTitle = title === "Untitled backend" ? deriveTitle(input) : title;
      setTitle(newTitle);

      // Persist to MongoDB (best-effort — generation UX is unaffected on failure).
      addHistory
        .mutateAsync({
          title: newTitle,
          database: options.database,
          framework: options.framework,
          input,
          result: res.result,
        })
        .catch(() => void 0);
      toast.success(`Generated ${res.result.files.length} files`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Generation failed");
    }
  };

  const onImprove = async () => {
    if (input.trim().length < 3) {
      toast.error("Add a short description to improve.");
      return;
    }
    try {
      const improved = await improve.mutateAsync(input);
      setInput(improved);
      toast.success("Prompt improved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not improve prompt");
    }
  };

  const onClear = () => {
    setInput("");
    setResult(null);
    setNotices(undefined);
    setTitle("Untitled backend");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Generate</h1>
          <p className="text-muted-foreground">
            Turn a schema or description into a complete backend.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Left — editor + actions */}
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <CardHeader className="flex-row items-center justify-between space-y-0 border-b border-border py-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Braces className="h-4 w-4 text-primary" /> Schema / Description
              </CardTitle>
              <ExamplesDialog onPick={(ex) => setInput(ex)} />
            </CardHeader>
            <div className="h-[320px]">
              <CodeEditor
                value={input}
                language={options.schemaType === "english" ? "markdown" : "typescript"}
                onChange={setInput}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2 border-t border-border p-3">
              <Button variant="gradient" onClick={onGenerate} disabled={generate.isPending}>
                {generate.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                Generate
              </Button>
              <Button variant="outline" onClick={onImprove} disabled={improve.isPending}>
                {improve.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="h-4 w-4" />
                )}
                Improve prompt
              </Button>
              <Button variant="ghost" onClick={onClear}>
                <Trash2 className="h-4 w-4" /> Clear
              </Button>
              {!input && (
                <span className="ml-auto hidden text-xs text-muted-foreground sm:block">
                  Tip: pick an example or a template to get started
                </span>
              )}
            </div>
          </Card>

          {/* Result */}
          {generate.isPending && <GeneratingSkeleton />}
          {!generate.isPending && result && (
            <ResultView result={result} title={title} notices={notices} />
          )}
          {!generate.isPending && !result && (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <Sparkles className="h-7 w-7" />
                </div>
                <div>
                  <p className="font-medium">Your generated project will appear here</p>
                  <p className="text-sm text-muted-foreground">
                    Configure options, add your schema, then hit Generate.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right — options */}
        <div>
          <Card className="lg:sticky lg:top-24">
            <CardHeader className="flex-row items-center gap-2 space-y-0 border-b border-border py-3">
              <Settings2 className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm">Configuration</CardTitle>
            </CardHeader>
            <CardContent className="scrollbar-thin max-h-[70vh] overflow-y-auto p-4">
              <OptionsPanel options={options} onChange={updateOptions} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
