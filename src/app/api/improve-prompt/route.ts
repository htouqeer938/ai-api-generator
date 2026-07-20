import { NextResponse } from "next/server";
import { z } from "zod";
import { improvePrompt } from "@/lib/ai/openai";
import { sanitizeInput } from "@/lib/ai/sanitize";
import { rateLimit, clientKey } from "@/lib/rate-limit";
import { getCurrentUser } from "@/lib/auth/session";

const schema = z.object({ input: z.string().min(3).max(20000) });

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Please sign in." }, { status: 401 });
  }

  const limit = rateLimit(clientKey(req, "improve"), 20, 60_000);
  if (!limit.allowed) {
    return NextResponse.json(
      { message: "Rate limit reached. Please wait a moment." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Provide some text to improve." }, { status: 400 });
  }

  const { clean } = sanitizeInput(parsed.data.input);
  const improved = await improvePrompt(clean);
  return NextResponse.json({ improved });
}
