import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { loginSchema } from "@/lib/validation";
import { userStore } from "@/lib/auth/store";
import { createSession } from "@/lib/auth/session";
import { rateLimit, clientKey } from "@/lib/rate-limit";
import type { AuthUser } from "@/types";

export async function POST(req: Request) {
  const limit = rateLimit(clientKey(req, "login"), 10, 60_000);
  if (!limit.allowed) {
    return NextResponse.json(
      { message: "Too many attempts. Please try again shortly." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Validation failed", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { email, password } = parsed.data;
  const found = userStore.findByEmail(email);
  if (!found || !(await bcrypt.compare(password, found.passwordHash))) {
    return NextResponse.json(
      { message: "Invalid email or password" },
      { status: 401 }
    );
  }

  const user: AuthUser = {
    id: found.id,
    name: found.name,
    email: found.email,
    createdAt: found.createdAt,
  };
  await createSession(user);
  return NextResponse.json({ user });
}
