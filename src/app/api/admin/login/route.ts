import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  createSessionToken,
  validateCredentials,
} from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { id, password } = await req.json();

    if (typeof id !== "string" || typeof password !== "string") {
      return NextResponse.json(
        { error: "ID and password are required." },
        { status: 400 }
      );
    }

    if (!validateCredentials(id, password)) {
      return NextResponse.json(
        { error: "ACCESS DENIED — invalid operator credentials." },
        { status: 401 }
      );
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set(ADMIN_COOKIE, createSessionToken(), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12,
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }
}
