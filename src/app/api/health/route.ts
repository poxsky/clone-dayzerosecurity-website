import { getDb } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const hasDatabaseUrl = Boolean(
    process.env.DATABASE_URL ?? process.env.POSTGRES_URL
  );

  try {
    const db = getDb();
    await db.execute(sql`select 1`);
    return Response.json({
      ok: true,
      hasDatabaseUrl,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown database error";
    const reason = !hasDatabaseUrl
      ? "missing_database_url"
      : message.toLowerCase().includes("password authentication failed")
        ? "database_auth_failed"
        : "database_connection_failed";

    return Response.json(
      {
        ok: false,
        hasDatabaseUrl,
        reason,
      },
      { status: 500 }
    );
  }
}
