import { Boxes } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  showText = true,
}: {
  className?: string;
  showText?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-primary/30">
        <Boxes className="h-5 w-5" />
      </span>
      {showText && (
        <span className="text-base font-semibold tracking-tight">
          AI API <span className="text-gradient">Generator</span>
        </span>
      )}
    </span>
  );
}
