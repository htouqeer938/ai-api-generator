"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";
import { TEMPLATES } from "@/lib/templates";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function TemplatesPage() {
  const router = useRouter();
  const [query, setQuery] = React.useState("");

  const filtered = TEMPLATES.filter(
    (t) =>
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.category.toLowerCase().includes(query.toLowerCase()) ||
      t.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Templates</h1>
          <p className="text-muted-foreground">
            Start from a proven backend blueprint and customize it.
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search templates…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((t) => (
          <Card
            key={t.id}
            className="group flex flex-col transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
          >
            <CardContent className="flex flex-1 flex-col p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-muted text-2xl">
                  {t.emoji}
                </span>
                <Badge variant="secondary">{t.category}</Badge>
              </div>
              <h3 className="mb-1 font-semibold">{t.name}</h3>
              <p className="mb-4 flex-1 text-sm text-muted-foreground">{t.description}</p>
              <div className="mb-4 flex flex-wrap gap-1">
                {t.entities.slice(0, 4).map((e) => (
                  <Badge key={e} variant="outline" className="text-[10px]">
                    {e}
                  </Badge>
                ))}
                {t.entities.length > 4 && (
                  <Badge variant="outline" className="text-[10px]">
                    +{t.entities.length - 4}
                  </Badge>
                )}
              </div>
              <Button
                variant="outline"
                className="w-full group-hover:border-primary/40"
                onClick={() => router.push(`/dashboard/generate?template=${t.id}`)}
              >
                Use template <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-xl border border-dashed border-border p-16 text-center text-muted-foreground">
          No templates match “{query}”.
        </div>
      )}
    </div>
  );
}
