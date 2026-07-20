import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db/mongoose";
import { Generation } from "@/lib/db/models/generation";
import { getCurrentUser } from "@/lib/auth/session";
import type { HistoryRecord } from "@/types";

const LIMIT = 50;

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

const createSchema = z.object({
  title: z.string().min(1).max(200),
  database: z.string(),
  framework: z.string(),
  input: z.string(),
  result: z.any(),
});

/** List the current user's generations (most recent first). */
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  try {
    await connectDB();
    const docs = await Generation.find({ userId: user.id })
      .sort({ createdAt: -1 })
      .limit(LIMIT)
      .lean();
    return NextResponse.json({ records: docs.map(toRecord) });
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Failed to load history" },
      { status: 500 }
    );
  }
}

/** Persist a new generation for the current user. */
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid record" }, { status: 400 });
  }

  try {
    await connectDB();
    const doc = await Generation.create({
      userId: user.id,
      title: parsed.data.title,
      database: parsed.data.database,
      framework: parsed.data.framework,
      input: parsed.data.input,
      result: parsed.data.result,
    });

    // Trim history to the most recent LIMIT records for this user.
    const stale = await Generation.find({ userId: user.id })
      .sort({ createdAt: -1 })
      .skip(LIMIT)
      .select("_id")
      .lean();
    if (stale.length) {
      await Generation.deleteMany({ _id: { $in: stale.map((s) => s._id) } });
    }

    return NextResponse.json({ record: toRecord(doc) }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Failed to save" },
      { status: 500 }
    );
  }
}

/** Clear all of the current user's history. */
export async function DELETE() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  try {
    await connectDB();
    await Generation.deleteMany({ userId: user.id });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Failed to clear" },
      { status: 500 }
    );
  }
}
