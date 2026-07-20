import { User } from "./models/user";

/* ─────────────────────────────────────────────────────────────
 * Idempotently ensure a demo account exists so the login page's
 * "Use demo account" button works on a fresh database.
 *   email:    demo@aigen.dev
 *   password: demo1234  (pre-hashed with bcryptjs)
 * ───────────────────────────────────────────────────────────── */
const DEMO_EMAIL = "demo@aigen.dev";
const DEMO_HASH = "$2a$10$e8yp77X3SDSmGiX50oDDCuo2HRvhD8qbEwXnDAulQYBk7VmUUUd8e";

export async function ensureDemoUser(): Promise<void> {
  await User.updateOne(
    { email: DEMO_EMAIL },
    {
      $setOnInsert: {
        name: "Demo User",
        email: DEMO_EMAIL,
        passwordHash: DEMO_HASH,
      },
    },
    { upsert: true }
  );
}
