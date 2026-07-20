"use client";

import Link from "next/link";
import { Trash2, Clock, ExternalLink, History as HistoryIcon } from "lucide-react";
import { toast } from "sonner";
import { useHistory } from "@/hooks/use-history";
import { formatDate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function HistoryPage() {
  const { records, remove: removeMut, clear: clearMut } = useHistory();

  const remove = async (id: string) => {
    await removeMut.mutateAsync(id);
    toast.success("Removed from history");
  };

  const clearAll = async () => {
    await clearMut.mutateAsync();
    toast.success("History cleared");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">History</h1>
          <p className="text-muted-foreground">
            Your recent generations, stored locally in this browser.
          </p>
        </div>
        {records.length > 0 && (
          <Button variant="outline" size="sm" onClick={clearAll}>
            <Trash2 className="h-4 w-4" /> Clear all
          </Button>
        )}
      </div>

      {records.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-muted text-muted-foreground">
              <HistoryIcon className="h-7 w-7" />
            </div>
            <div>
              <p className="font-medium">No history yet</p>
              <p className="text-sm text-muted-foreground">
                Your generations will show up here.
              </p>
            </div>
            <Button variant="gradient" asChild>
              <Link href="/dashboard/generate">Generate a backend</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {records.map((r) => (
            <Card key={r.id} className="transition-colors hover:border-primary/30">
              <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium">{r.title}</p>
                    <Badge variant="secondary">{r.database}</Badge>
                    <Badge variant="outline">{r.framework}</Badge>
                  </div>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatDate(r.createdAt)} · {r.result.files.length} files
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/generate?id=${r.id}`}>
                      <ExternalLink className="h-4 w-4" /> Open
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(r.id)}
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
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
