import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { quoteRequests } from "@/db/schema";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

// Safety net so a fresh deployment keeps working even before
// `npm run db:migrate` has been run against the production database.
// The Drizzle migrations in ./drizzle are the source of truth — keep
// this statement in sync with them.
async function ensureQuoteRequestsTable(db: ReturnType<typeof getDb>) {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS quote_requests (
      id serial PRIMARY KEY,
      company_name text NOT NULL,
      contact_name text NOT NULL,
      contact_email text NOT NULL,
      contact_phone text,
      selected_tab text NOT NULL,
      selected_services text NOT NULL,
      objectives text,
      estimated_timeline text,
      status text DEFAULT 'SCOPING_REQUESTED' NOT NULL,
      created_at timestamp DEFAULT now() NOT NULL
    )
  `);
}

export async function POST(req: Request) {
  try {
    const db = getDb();
    await ensureQuoteRequestsTable(db);
    const body = await req.json();
    const {
      companyName,
      contactName,
      contactEmail,
      contactPhone,
      selectedTab,
      selectedServices,
      objectives,
      estimatedTimeline,
    } = body;

    if (!companyName || !contactName || !contactEmail) {
      return NextResponse.json(
        { error: "Company name, contact name, and email are required." },
        { status: 400 }
      );
    }

    const [created] = await db
      .insert(quoteRequests)
      .values({
        companyName,
        contactName,
        contactEmail,
        contactPhone: contactPhone || "",
        selectedTab: selectedTab || "VAPT",
        selectedServices: JSON.stringify(
          Array.isArray(selectedServices) ? selectedServices : []
        ),
        objectives: objectives || "",
        estimatedTimeline: estimatedTimeline || "2-4 Weeks",
        status: "SCOPING_REQUESTED",
      })
      .returning();

    return NextResponse.json({
      quote: created,
      message:
        "Request received. We'll review your scope and reply within 24 hours.",
    });
  } catch (error) {
    console.error("POST /api/quotes error:", error);
    return NextResponse.json(
      { error: "Failed to submit quote request." },
      { status: 500 }
    );
  }
}
