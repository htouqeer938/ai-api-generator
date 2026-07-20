"use client";

import * as React from "react";
import { Lock } from "lucide-react";
import type { SwaggerEndpoint } from "@/types";
import { cn } from "@/lib/utils";

const METHOD_STYLES: Record<string, string> = {
  GET: "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30",
  POST: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  PUT: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  PATCH: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  DELETE: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30",
};

export function SwaggerPreview({ endpoints }: { endpoints: SwaggerEndpoint[] }) {
  const grouped = React.useMemo(() => {
    const map = new Map<string, SwaggerEndpoint[]>();
    for (const ep of endpoints) {
      if (!map.has(ep.tag)) map.set(ep.tag, []);
      map.get(ep.tag)!.push(ep);
    }
    return map;
  }, [endpoints]);

  if (endpoints.length === 0) {
    return (
      <p className="p-8 text-center text-sm text-muted-foreground">
        No endpoints available.
      </p>
    );
  }

  return (
    <div className="scrollbar-thin space-y-6 overflow-y-auto p-4">
      {[...grouped.entries()].map(([tag, eps]) => (
        <div key={tag}>
          <h3 className="mb-2 border-b border-border pb-1 text-sm font-semibold">
            {tag}
          </h3>
          <div className="space-y-1.5">
            {eps.map((ep, i) => (
              <div
                key={`${ep.method}-${ep.path}-${i}`}
                className="flex items-center gap-3 rounded-lg border border-border bg-card/50 px-3 py-2"
              >
                <span
                  className={cn(
                    "w-16 rounded border px-2 py-0.5 text-center text-xs font-bold",
                    METHOD_STYLES[ep.method]
                  )}
                >
                  {ep.method}
                </span>
                <code className="flex-1 truncate font-mono text-sm">{ep.path}</code>
                <span className="hidden text-xs text-muted-foreground sm:inline">
                  {ep.summary}
                </span>
                {ep.auth && (
                  <Lock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
