import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { quoteRequests } from "@/db/schema";
import { eq } from "drizzle-orm";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const ALLOWED_STATUSES = [
  "SCOPING_REQUESTED",
  "SCOPING_APPROVED",
  "IN_PROGRESS",
  "REPORT_DELIVERED",
  "CLOSED",
  "REJECTED",
];

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const quoteId = Number(id);
  if (!Number.isInteger(quoteId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    const { status } = await req.json();
    if (!ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const db = getDb();
    const [updated] = await db
      .update(quoteRequests)
      .set({ status })
      .where(eq(quoteRequests.id, quoteId))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ quote: updated });
  } catch (error) {
    console.error("PATCH /api/admin/quotes/[id] error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const quoteId = Number(id);
  if (!Number.isInteger(quoteId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    const db = getDb();
    const [deleted] = await db
      .delete(quoteRequests)
      .where(eq(quoteRequests.id, quoteId))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/admin/quotes/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
