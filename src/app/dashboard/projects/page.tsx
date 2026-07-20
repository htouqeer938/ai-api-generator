"use client";

import Link from "next/link";
import { FolderKanban, Download, ExternalLink, FileCode2 } from "lucide-react";
import { toast } from "sonner";
import { useHistory } from "@/hooks/use-history";
import { downloadZip } from "@/lib/download";
import type { HistoryRecord } from "@/types";
import { timeAgo } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ProjectsPage() {
  const { records } = useHistory();

  const download = async (r: HistoryRecord) => {
    const slug = r.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    await downloadZip(r.result.files, slug || "backend");
    toast.success("Download started");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
        <p className="text-muted-foreground">
          Every backend you&apos;ve generated, ready to reopen or export.
        </p>
      </div>

      {records.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-muted text-muted-foreground">
              <FolderKanban className="h-7 w-7" />
            </div>
            <div>
              <p className="font-medium">No projects yet</p>
              <p className="text-sm text-muted-foreground">
                Generate your first backend to see it here.
              </p>
            </div>
            <Button variant="gradient" asChild>
              <Link href="/dashboard/generate">Create a project</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {records.map((r) => (
            <Card key={r.id} className="flex flex-col transition-all hover:-translate-y-1 hover:shadow-lg">
              <CardContent className="flex flex-1 flex-col p-5">
                <div className="mb-3 flex items-center justify-between">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                    <FileCode2 className="h-5 w-5" />
                  </div>
                  <div className="flex gap-1">
                    <Badge variant="secondary">{r.database}</Badge>
                    <Badge variant="outline">{r.framework}</Badge>
                  </div>
                </div>
                <h3 className="truncate font-semibold">{r.title}</h3>
                <p className="mb-4 flex-1 text-xs text-muted-foreground">
                  {r.result.files.length} files · {r.result.endpoints.length} endpoints ·{" "}
                  {timeAgo(r.createdAt)}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link href={`/dashboard/generate?id=${r.id}`}>
                      <ExternalLink className="h-4 w-4" /> Open
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => download(r)} aria-label="Download">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
