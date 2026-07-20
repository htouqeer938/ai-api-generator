import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Generation } from "@/lib/db/models/generation";
import { getCurrentUser } from "@/lib/auth/session";
import type { HistoryRecord } from "@/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toRecord(doc: any): HistoryRecord {
  return {
    id: String(doc._id),
    title: doc.title,
    createdAt: new Date(doc.createdAt).toISOString(),
    database: doc.database,
    framework: doc.framework,
    input: doc.input,
    result: doc.result,
  };
}

type Params = { params: Promise<{ id: string }> };

/** Fetch a single generation (scoped to the current user). */
export async function GET(_req: Request, { params }: Params) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  const { id } = await params;
  try {
    await connectDB();
    const doc = await Generation.findOne({ _id: id, userId: user.id }).lean();
    if (!doc) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json({ record: toRecord(doc) });
  } catch {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
}

/** Delete a single generation (scoped to the current user). */
export async function DELETE(_req: Request, { params }: Params) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  const { id } = await params;
  try {
    await connectDB();
    await Generation.deleteOne({ _id: id, userId: user.id });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Failed to delete" },
      { status: 500 }
    );
  }
}
