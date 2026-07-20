"use client";

import { Database, GitBranch, ListTree, KeyRound, Boxes } from "lucide-react";
import type { SchemaAnalysis } from "@/types";
import { Badge } from "@/components/ui/badge";

export function AnalysisView({ analysis }: { analysis: SchemaAnalysis }) {
  return (
    <div className="scrollbar-thin space-y-6 overflow-y-auto p-5">
      {/* Entities */}
      <section>
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <Boxes className="h-4 w-4 text-primary" /> Entities ({analysis.entities.length})
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {analysis.entities.map((e) => (
            <div key={e.name} className="rounded-xl border border-border bg-card/50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-semibold">{e.name}</span>
                <Badge variant="secondary" className="gap-1 text-[10px]">
                  <KeyRound className="h-3 w-3" /> {e.primaryKey ?? "id"}
                </Badge>
              </div>
              <ul className="space-y-1 text-xs">
                {e.fields.slice(0, 8).map((f) => (
                  <li key={f.name} className="flex items-center justify-between gap-2">
                    <span className="font-mono">{f.name}</span>
                    <span className="text-muted-foreground">{f.type}</span>
                  </li>
                ))}
                {e.fields.length > 8 && (
                  <li className="text-muted-foreground">
                    +{e.fields.length - 8} more…
                  </li>
                )}
              </ul>
              {e.relations && e.relations.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {e.relations.map((r, i) => (
                    <Badge key={`${r}-${i}`} variant="outline" className="text-[10px]">
                      → {r}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Relationships */}
      {analysis.relationships.length > 0 && (
        <section>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <GitBranch className="h-4 w-4 text-primary" /> Relationships
          </h3>
          <div className="flex flex-wrap gap-2">
            {analysis.relationships.map((r, i) => (
              <Badge key={i} variant="secondary" className="font-mono text-xs">
                {r}
              </Badge>
            ))}
          </div>
        </section>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        {analysis.enums.length > 0 && (
          <section>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <ListTree className="h-4 w-4 text-primary" /> Enums
            </h3>
            <div className="flex flex-wrap gap-2">
              {analysis.enums.map((e, i) => (
                <Badge key={i} variant="outline" className="font-mono text-xs">
                  {e}
                </Badge>
              ))}
            </div>
          </section>
        )}
        {analysis.indexes.length > 0 && (
          <section>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Database className="h-4 w-4 text-primary" /> Indexes
            </h3>
            <div className="flex flex-wrap gap-2">
              {analysis.indexes.map((e, i) => (
                <Badge key={i} variant="outline" className="font-mono text-xs">
                  {e}
                </Badge>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
