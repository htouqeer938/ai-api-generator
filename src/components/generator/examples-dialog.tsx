"use client";

import { Lightbulb } from "lucide-react";
import { PROMPT_EXAMPLES } from "@/lib/templates";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function ExamplesDialog({ onPick }: { onPick: (example: string) => void }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Lightbulb className="h-4 w-4" /> Examples
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Prompt examples</DialogTitle>
          <DialogDescription>
            Pick a starting point — you can refine it after inserting.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          {PROMPT_EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => onPick(ex)}
              className="flex items-center gap-3 rounded-lg border border-border p-3 text-left text-sm transition-colors hover:border-primary/40 hover:bg-accent"
            >
              <Lightbulb className="h-4 w-4 shrink-0 text-primary" />
              {ex}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
