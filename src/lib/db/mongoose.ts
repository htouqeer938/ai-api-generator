import mongoose from "mongoose";

/* ─────────────────────────────────────────────────────────────
 * Cached Mongoose connection.
 *
 * Next.js hot-reloads modules in development, which would otherwise
 * open a new connection on every request. We cache the connection
 * (and the in-flight promise) on `globalThis` so it is reused across
 * reloads and serverless invocations.
 * ───────────────────────────────────────────────────────────── */

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  seeded: boolean;
}

const globalForMongoose = globalThis as unknown as {
  _mongoose?: MongooseCache;
};

const cache: MongooseCache =
  globalForMongoose._mongoose ?? { conn: null, promise: null, seeded: false };

globalForMongoose._mongoose = cache;

export async function connectDB(): Promise<typeof mongoose> {
  if (!MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is not set. Add it to your .env.local (e.g. mongodb://localhost:27017/ai-api-generator)."
    );
  }

  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    mongoose.set("strictQuery", true);
    cache.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cache.conn = await cache.promise;

  // One-time demo seed so the "Use demo account" button works out of the box.
  if (!cache.seeded) {
    cache.seeded = true;
    try {
      const { ensureDemoUser } = await import("./seed");
      await ensureDemoUser();
    } catch {
      // Non-fatal: seeding failure should not block requests.
    }
  }

  return cache.conn;
}
