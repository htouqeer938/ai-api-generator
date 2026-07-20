import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { userStore } from "@/lib/auth/store";

export async function GET() {
  const current = await getCurrentUser();
  if (!current) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }
  // Enrich with persisted profile data (e.g. createdAt).
  const stored = userStore.findById(current.id);
  return NextResponse.json({
    user: {
      id: current.id,
      name: current.name,
      email: current.email,
      createdAt: stored?.createdAt ?? "",
    },
  });
}
