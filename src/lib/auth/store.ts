import fs from "node:fs";
import path from "node:path";
import { nanoid } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────
 * Minimal file-backed user store.
 *
 * For a zero-config demo we persist users to `.data/users.json`.
 * The abstraction (create/find) is deliberately DB-agnostic so it
 * can be swapped for Prisma/Mongoose without touching callers.
 * A demo account is seeded on first use.
 * ───────────────────────────────────────────────────────────── */

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), ".data");
const FILE = path.join(DATA_DIR, "users.json");

function ensureFile(): void {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(FILE)) {
    // Seeded demo account — password "demo1234" (bcrypt hash).
    const demo: StoredUser = {
      id: nanoid(),
      name: "Demo User",
      email: "demo@aigen.dev",
      // bcryptjs hash of "demo1234"
      passwordHash:
        "$2a$10$e8yp77X3SDSmGiX50oDDCuo2HRvhD8qbEwXnDAulQYBk7VmUUUd8e",
      createdAt: new Date().toISOString(),
    };
    fs.writeFileSync(FILE, JSON.stringify([demo], null, 2));
  }
}

function readAll(): StoredUser[] {
  ensureFile();
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf8")) as StoredUser[];
  } catch {
    return [];
  }
}

function writeAll(users: StoredUser[]): void {
  ensureFile();
  fs.writeFileSync(FILE, JSON.stringify(users, null, 2));
}

export const userStore = {
  findByEmail(email: string): StoredUser | undefined {
    return readAll().find((u) => u.email.toLowerCase() === email.toLowerCase());
  },
  findById(id: string): StoredUser | undefined {
    return readAll().find((u) => u.id === id);
  },
  create(user: Omit<StoredUser, "id" | "createdAt">): StoredUser {
    const users = readAll();
    const created: StoredUser = {
      ...user,
      id: nanoid(),
      createdAt: new Date().toISOString(),
    };
    users.push(created);
    writeAll(users);
    return created;
  },
};
