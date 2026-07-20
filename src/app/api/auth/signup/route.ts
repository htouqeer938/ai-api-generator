import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signupSchema } from "@/lib/validation";
import { userStore } from "@/lib/auth/store";
import { createSession } from "@/lib/auth/session";
import { rateLimit, clientKey } from "@/lib/rate-limit";
import type { AuthUser } from "@/types";

export async function POST(req: Request) {
  const limit = rateLimit(clientKey(req, "signup"), 10, 60_000);
  if (!limit.allowed) {
    return NextResponse.json(
      { message: "Too many attempts. Please try again shortly." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Validation failed", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { name, email, password } = parsed.data;
  if (userStore.findByEmail(email)) {
    return NextResponse.json(
      { message: "An account with this email already exists" },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const created = userStore.create({ name, email, passwordHash });
  const user: AuthUser = {
    id: created.id,
    name: created.name,
    email: created.email,
    createdAt: created.createdAt,
  };
  await createSession(user);
  return NextResponse.json({ user }, { status: 201 });
}
