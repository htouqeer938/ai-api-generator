import { Suspense } from "react";
import { GeneratorClient } from "@/components/generator/generator-client";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = { title: "Generate" };

export default function GeneratePage() {
  return (
    <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
      <GeneratorClient />
    </Suspense>
  );
}
