import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const ADMIN_ID = process.env.ADMIN_ID ?? "poxsky";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "coldbypox0911";
const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET ??
  "0day-admin-portal-secret-" + ADMIN_ID + "-" + ADMIN_PASSWORD;

export const ADMIN_COOKIE = "admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

function sign(payload: string) {
  return createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
}

function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function validateCredentials(id: string, password: string) {
  return safeEqual(id, ADMIN_ID) && safeEqual(password, ADMIN_PASSWORD);
}

export function createSessionToken() {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload = `${ADMIN_ID}.${expiresAt}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined | null) {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [id, expiresAt, signature] = parts;
  const payload = `${id}.${expiresAt}`;
  if (!safeEqual(sign(payload), signature)) return false;
  if (Number(expiresAt) < Date.now()) return false;
  return true;
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(ADMIN_COOKIE)?.value);
}
