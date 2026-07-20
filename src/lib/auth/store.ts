import { connectDB } from "@/lib/db/mongoose";
import { User } from "@/lib/db/models/user";

/* ─────────────────────────────────────────────────────────────
 * MongoDB-backed user store (via Mongoose).
 *
 * The interface stays DB-agnostic so callers only deal with a
 * plain StoredUser. All persistence lives in MongoDB — nothing is
 * written to disk.
 * ───────────────────────────────────────────────────────────── */

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toStored(doc: any): StoredUser {
  return {
    id: String(doc._id),
    name: doc.name,
    email: doc.email,
    passwordHash: doc.passwordHash,
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : "",
  };
}

export const userStore = {
  async findByEmail(email: string): Promise<StoredUser | null> {
    await connectDB();
    const doc = await User.findOne({ email: email.toLowerCase().trim() }).lean();
    return doc ? toStored(doc) : null;
  },

  async findById(id: string): Promise<StoredUser | null> {
    await connectDB();
    try {
      const doc = await User.findById(id).lean();
      return doc ? toStored(doc) : null;
    } catch {
      return null; // invalid ObjectId
    }
  },

  async create(user: Omit<StoredUser, "id" | "createdAt">): Promise<StoredUser> {
    await connectDB();
    const doc = await User.create({
      name: user.name,
      email: user.email.toLowerCase().trim(),
      passwordHash: user.passwordHash,
    });
    return toStored(doc);
  },
};
