import { cookies } from "next/headers";
import type { AuthUser } from "@/types";
import { signTokens, verifyToken, cookieMaxAge } from "./jwt";

/* ─────────────────────────────────────────────────────────────
 * HttpOnly cookie-based session helpers (server side).
 * ───────────────────────────────────────────────────────────── */

const ACCESS_COOKIE = "aigen_access";
const REFRESH_COOKIE = "aigen_refresh";

const baseCookie = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

export async function createSession(user: AuthUser): Promise<void> {
  const { accessToken, refreshToken } = await signTokens(user);
  const store = await cookies();
  store.set(ACCESS_COOKIE, accessToken, { ...baseCookie, maxAge: cookieMaxAge.access });
  store.set(REFRESH_COOKIE, refreshToken, { ...baseCookie, maxAge: cookieMaxAge.refresh });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(ACCESS_COOKIE);
  store.delete(REFRESH_COOKIE);
}

/**
 * Resolve the current user from cookies. Transparently rotates the
 * access token from a valid refresh token when it has expired.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const store = await cookies();
  const access = store.get(ACCESS_COOKIE)?.value;
  if (access) {
    const payload = await verifyToken(access);
    if (payload && payload.type === "access") {
      return { id: payload.sub, email: payload.email, name: payload.name, createdAt: "" };
    }
  }

  const refresh = store.get(REFRESH_COOKIE)?.value;
  if (refresh) {
    const payload = await verifyToken(refresh);
    if (payload && payload.type === "refresh") {
      const user: AuthUser = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        createdAt: "",
      };
      await createSession(user); // rotate access token
      return user;
    }
  }
  return null;
}
