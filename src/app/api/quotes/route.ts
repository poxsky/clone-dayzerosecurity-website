import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { quoteRequests, type QuoteRequest } from "@/db/schema";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export const CONTACT_EMAIL = "anmol@0daysecurity.tech";

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

/**
 * Optional email forwarding of new quote requests via Resend
 * (https://resend.com — free tier available).
 *
 * - If RESEND_API_KEY is not set, this is a no-op: submissions are stored
 *   in the database only.
 * - Set QUOTE_NOTIFY_FROM to a verified sender, e.g.
 *   "0DAY Research Team <no-reply@0daysecurity.tech>" (verify the domain
 *   in Resend first). Defaults to Resend's testing sender.
 * - Failures are logged and never fail the request — the database is the
 *   source of truth.
 */
async function notifyTeamByEmail(quote: QuoteRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const from = process.env.QUOTE_NOTIFY_FROM ?? "0DAY Research Team <onboarding@resend.dev>";
  const to = process.env.QUOTE_NOTIFY_EMAIL ?? CONTACT_EMAIL;

  let services: string[] = [];
  try {
    const parsed = JSON.parse(quote.selectedServices);
    if (Array.isArray(parsed)) services = parsed;
  } catch {
    services = [quote.selectedServices];
  }

  const text = [
    `New scoping request from ${quote.companyName}`,
    ``,
    `Contact:    ${quote.contactName} <${quote.contactEmail}>`,
    `Phone:      ${quote.contactPhone || "—"}`,
    `Engagement: ${quote.selectedTab}`,
    `Timeline:   ${quote.estimatedTimeline || "—"}`,
    `Services:   ${services.length ? services.join(", ") : "—"}`,
    ``,
    `Objectives / environment:`,
    quote.objectives || "—",
    ``,
    `Submitted:  ${quote.createdAt.toISOString()}`,
  ].join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `New scoping request — ${quote.companyName}`,
        text,
      }),
    });
    if (!res.ok) {
      console.error(
        `Quote email notification failed (${res.status}):`,
        await res.text()
      );
    }
  } catch (err) {
    console.error("Quote email notification error:", err);
  }
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

    await notifyTeamByEmail(created);

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
