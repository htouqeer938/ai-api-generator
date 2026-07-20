import { SignJWT, jwtVerify } from "jose";
import type { AuthUser } from "@/types";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-insecure-secret-change-me"
);

const ACCESS_TTL = Number(process.env.JWT_ACCESS_TTL || 900); // 15m
const REFRESH_TTL = Number(process.env.JWT_REFRESH_TTL || 1209600); // 14d

export interface TokenPayload {
  sub: string;
  email: string;
  name: string;
  type: "access" | "refresh";
}

async function sign(payload: Omit<TokenPayload, "type">, type: "access" | "refresh") {
  const ttl = type === "access" ? ACCESS_TTL : REFRESH_TTL;
  return new SignJWT({ ...payload, type })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + ttl)
    .sign(secret);
}

export async function signTokens(user: AuthUser) {
  const base = { sub: user.id, email: user.email, name: user.name };
  const [accessToken, refreshToken] = await Promise.all([
    sign(base, "access"),
    sign(base, "refresh"),
  ]);
  return { accessToken, refreshToken };
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}

export const cookieMaxAge = { access: ACCESS_TTL, refresh: REFRESH_TTL };
