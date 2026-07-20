import { NextResponse } from "next/server";
import { generateRequestSchema } from "@/lib/validation";
import { generateProject, isAiConfigured } from "@/lib/ai/openai";
import { sanitizeInput } from "@/lib/ai/sanitize";
import { rateLimit, clientKey } from "@/lib/rate-limit";
import { getCurrentUser } from "@/lib/auth/session";
import type { GenerateRequest } from "@/types";

// Generation can take a while with a real model.
export const maxDuration = 120;

export async function POST(req: Request) {
  // 1. Authentication — generation is a protected action.
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Please sign in to generate." }, { status: 401 });
  }

  // 2. Rate limiting per client.
  const limit = rateLimit(clientKey(req, "generate"), 15, 60_000);
  if (!limit.allowed) {
    return NextResponse.json(
      { message: "Rate limit reached. Please wait a moment before generating again." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  // 3. Validate shape.
  const body = await req.json().catch(() => null);
  const parsed = generateRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid request", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  // 4. Sanitize untrusted input (prompt-injection hardening).
  const { clean, flagged, truncated } = sanitizeInput(parsed.data.input);
  const request: GenerateRequest = { ...parsed.data, input: clean };

  // 5. Generate (real model or mock fallback).
  try {
    const result = await generateProject(request);
    return NextResponse.json({
      result,
      notices: {
        aiConfigured: isAiConfigured(),
        injectionFlagged: flagged,
        truncated,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Generation failed" },
      { status: 500 }
    );
  }
}
