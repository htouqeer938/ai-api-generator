"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sparkles,
  FolderKanban,
  LayoutTemplate,
  FileCode2,
  ArrowRight,
  Zap,
  Database,
  Clock,
} from "lucide-react";
import { history } from "@/lib/history";
import { TEMPLATES } from "@/lib/templates";
import type { HistoryRecord } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { timeAgo } from "@/lib/utils";

export default function DashboardPage() {
  const [records, setRecords] = React.useState<HistoryRecord[]>([]);

  React.useEffect(() => {
    const load = () => setRecords(history.all());
    load();
    window.addEventListener("aigen:history-changed", load);
    return () => window.removeEventListener("aigen:history-changed", load);
  }, []);

  const totalFiles = records.reduce((sum, r) => sum + r.result.files.length, 0);
  const stats = [
    { label: "Generations", value: records.length, icon: Zap },
    { label: "Files created", value: totalFiles, icon: FileCode2 },
    { label: "Templates", value: TEMPLATES.length, icon: LayoutTemplate },
    {
      label: "Databases",
      value: new Set(records.map((r) => r.database)).size || 4,
      icon: Database,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Generate, preview and export production-ready backends.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-2xl font-bold">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Primary CTA */}
      <Card className="overflow-hidden border-primary/30 bg-gradient-to-br from-violet-600/10 via-transparent to-indigo-600/10">
        <CardContent className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Generate a new backend</h2>
              <p className="text-sm text-muted-foreground">
                Paste a schema or describe your idea — get a full project in seconds.
              </p>
            </div>
          </div>
          <Button variant="gradient" asChild>
            <Link href="/dashboard/generate">
              Start generating <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent */}
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4" /> Recent generations
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/history">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {records.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                No generations yet. Create your first backend!
              </div>
            ) : (
              records.slice(0, 5).map((r) => (
                <Link
                  key={r.id}
                  href={`/dashboard/generate?id=${r.id}`}
                  className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-accent"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{r.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.result.files.length} files · {timeAgo(r.createdAt)}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Badge variant="secondary">{r.database}</Badge>
                    <Badge variant="outline">{r.framework}</Badge>
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        {/* Quick templates */}
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2 text-base">
              <LayoutTemplate className="h-4 w-4" /> Popular templates
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/templates">Browse</Link>
            </Button>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            {TEMPLATES.slice(0, 6).map((t) => (
              <Link
                key={t.id}
                href={`/dashboard/generate?template=${t.id}`}
                className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-accent"
              >
                <span className="text-xl">{t.emoji}</span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{t.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{t.category}</p>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
